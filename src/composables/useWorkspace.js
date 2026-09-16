import { computed, ref, watch } from 'vue'
import {
  createDemoApplications,
  createDemoCareers,
  createDemoExperiences,
  createEmptyProfile,
  PROFILE_LABELS,
} from '../data/demoData.js'

const STORAGE_KEY = 'ssulap-workspace-v2'
const SAVE_DELAY = 2000
const MAX_DRAFT_VERSIONS = 20
const MAX_COMPLETED_WORKING_VERSIONS = 5
const validPages = new Set(['profile', 'careers', 'experiences', 'essays', 'editor'])

function loadWorkspace() {
  if (typeof window === 'undefined') return null

  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY))
    return stored?.version === 2 ? stored : null
  } catch {
    return null
  }
}

function normalizeApplications(items) {
  return items.map((application) => ({
    ...application,
    updatedAt: application.updatedAt ?? null,
    questions: (application.questions ?? []).map((question, questionIndex) => ({
      ...question,
      id: question.id ?? `${application.id}-${questionIndex + 1}`,
      position: questionIndex + 1,
      experienceIds: question.experienceIds ?? [],
      completionStatus: question.completionStatus ?? 'DRAFT',
      completedAt: question.completedAt ?? null,
      versions: question.versions ?? [],
    })),
  }))
}

const restoredWorkspace = loadWorkspace()
const experiences = ref(restoredWorkspace?.experiences ?? createDemoExperiences())
const careers = ref(restoredWorkspace?.careers ?? createDemoCareers())
const applications = ref(
  normalizeApplications(restoredWorkspace?.applications ?? createDemoApplications()),
)
const profile = ref(restoredWorkspace?.profile ?? createEmptyProfile())
const certifications = ref(
  restoredWorkspace?.certifications ?? [
    { id: 1, name: '', issuer: '', acquiredOn: '', number: '' },
  ],
)
const languageScores = ref(
  restoredWorkspace?.languageScores ?? [
    { id: 2, name: '', score: '', testedOn: '', expiresOn: '' },
  ],
)
const courses = ref(restoredWorkspace?.courses ?? [])

const restoredActiveApplication = applications.value.find(
  (application) => application.id === restoredWorkspace?.ui?.activeApplicationId,
)
const initialPage = validPages.has(restoredWorkspace?.ui?.page)
  ? restoredWorkspace.ui.page
  : 'experiences'
const page = ref(initialPage === 'editor' && !restoredActiveApplication ? 'essays' : initialPage)
const query = ref('')
const selectedTag = ref('전체')
const toast = ref('')
const modal = ref(null)
const draft = ref({})
const detail = ref(null)
const referenceDetail = ref(null)

const allProfileItemIds = [
  ...certifications.value,
  ...languageScores.value,
  ...courses.value,
].map((item) => Number(item.id) || 0)
let profileItemId = Math.max(2, ...allProfileItemIds) + 1

const activeApplication = ref(restoredActiveApplication ?? null)
const questionIndex = ref(
  restoredActiveApplication
    ? Math.min(
        restoredWorkspace?.ui?.questionIndex ?? 0,
        Math.max(restoredActiveApplication.questions.length - 1, 0),
      )
    : 0,
)
const recommendationVisible = ref(false)
const tags = ['전체', '협업', '문제 해결', '주도성', '소통', '책임감']
const saveState = ref('saved')
const lastSavedAt = ref(restoredWorkspace?.savedAt ?? null)

const currentQuestion = computed(
  () => activeApplication.value?.questions[questionIndex.value],
)

const saveStatusLabel = computed(() => {
  if (saveState.value === 'unsaved') return '자동 저장 대기 중'
  if (saveState.value === 'saving') return '자동 저장 중'
  if (saveState.value === 'error') return '임시 저장 실패'
  return '자동 저장됨'
})

const filteredExperiences = computed(() =>
  experiences.value.filter((experience) => {
    const matchesTag =
      selectedTag.value === '전체' || experience.tags.includes(selectedTag.value)
    const searchText = `${experience.title}${experience.tags.join('')}${experience.situation}${experience.overview ?? ''}`
    return matchesTag && searchText.includes(query.value)
  }),
)

const filteredApplications = computed(() =>
  applications.value.filter((application) =>
    `${application.company}${application.role}`.includes(query.value),
  ),
)

const recommendedExperiences = computed(() => {
  const prompt = currentQuestion.value?.text ?? ''

  return experiences.value
    .map((experience) => ({
      experience,
      score: experience.tags.filter((tag) => prompt.includes(tag)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score)
    .map(({ experience }) => experience)
})

let toastTimer
let saveTimer
let versionIdSequence = 0

function workspaceSnapshot() {
  return {
    version: 2,
    savedAt: lastSavedAt.value,
    experiences: experiences.value,
    careers: careers.value,
    applications: applications.value,
    profile: profile.value,
    certifications: certifications.value,
    languageScores: languageScores.value,
    courses: courses.value,
    ui: {
      page: page.value,
      activeApplicationId: activeApplication.value?.id ?? null,
      questionIndex: questionIndex.value,
    },
  }
}

function saveWorkspace(options = {}) {
  clearTimeout(saveTimer)
  saveTimer = null
  saveState.value = 'saving'

  try {
    lastSavedAt.value = new Date().toISOString()
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaceSnapshot()))
    saveState.value = 'saved'
    if (options.announce) notify('현재 기기에 작성 내용을 저장했습니다.')
    return true
  } catch {
    saveState.value = 'error'
    if (options.announce) notify('브라우저 임시 저장에 실패했습니다.')
    return false
  }
}

function scheduleWorkspaceSave() {
  saveState.value = 'unsaved'
  clearTimeout(saveTimer)
  saveTimer = setTimeout(() => saveWorkspace(), SAVE_DELAY)
}

function markApplicationChanged() {
  if (activeApplication.value) {
    activeApplication.value.updatedAt = new Date().toISOString()
  }
  scheduleWorkspaceSave()
}

function markCurrentQuestionChanged() {
  if (!currentQuestion.value) return
  currentQuestion.value.completionStatus = 'DRAFT'
  currentQuestion.value.completedAt = null
  markApplicationChanged()
}

watch(
  [experiences, careers, applications, profile, certifications, languageScores, courses],
  scheduleWorkspaceSave,
  { deep: true, flush: 'sync' },
)

if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', (event) => {
    if (saveState.value !== 'unsaved') return
    if (saveWorkspace()) return
    event.preventDefault()
    event.returnValue = ''
  })
}

function notify(message) {
  toast.value = message
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toast.value = ''
  }, 3000)
}

function go(targetPage) {
  if (page.value === 'editor' && targetPage !== 'editor' && saveState.value === 'unsaved') {
    if (!saveWorkspace({ announce: true })) return false
  }

  page.value = targetPage
  query.value = ''
  recommendationVisible.value = false
  saveWorkspace()
  return true
}

function closeModal() {
  modal.value = null
}

function openExperienceDetail(experience) {
  detail.value = experience
}

function closeExperienceDetail() {
  detail.value = null
}

function openReferenceDetail(type, item) {
  if (!item) return
  referenceDetail.value = { type, item }
}

function closeReferenceDetail() {
  referenceDetail.value = null
}

function questionVersionContent(question) {
  return {
    text: question.text ?? '',
    answer: question.answer ?? '',
    limit: Number(question.limit || 0),
    experienceIds: [...(question.experienceIds ?? [])],
  }
}

function hasSameVersionContent(version, question) {
  const content = questionVersionContent(question)
  return (
    version?.text === content.text &&
    version?.answer === content.answer &&
    Number(version?.limit || 0) === content.limit &&
    JSON.stringify(version?.experienceIds ?? []) === JSON.stringify(content.experienceIds)
  )
}

function addQuestionVersion(question, kind, options = {}) {
  question.versions ??= []
  const latestVersion = question.versions.at(-1)

  if (!options.force && hasSameVersionContent(latestVersion, question)) return null

  const versionNumber = question.versions.reduce(
    (highest, version) => Math.max(highest, Number(version.versionNumber) || 0),
    0,
  ) + 1
  const version = {
    id: `${question.id}-${Date.now()}-${versionIdSequence++}`,
    versionNumber,
    kind,
    savedAt: new Date().toISOString(),
    ...questionVersionContent(question),
  }
  question.versions.push(version)
  return version
}

function pruneDraftVersions(question) {
  const submittedVersions = question.versions.filter((version) => version.kind === 'SUBMITTED')
  const workingVersions = question.versions
    .filter((version) => version.kind !== 'SUBMITTED')
    .slice(-MAX_DRAFT_VERSIONS)
  question.versions = [...submittedVersions.slice(-1), ...workingVersions].sort(
    (left, right) => left.versionNumber - right.versionNumber,
  )
}

function pruneCompletedVersions(question, completedVersion) {
  const recentWorkingVersions = question.versions
    .filter((version) => !['COMPLETED', 'SUBMITTED'].includes(version.kind))
    .slice(-MAX_COMPLETED_WORKING_VERSIONS)
  const previousSubmitted = question.versions
    .filter((version) => version.kind === 'SUBMITTED')
    .slice(-1)
  question.versions = [...previousSubmitted, ...recentWorkingVersions, completedVersion].sort(
    (left, right) => left.versionNumber - right.versionNumber,
  )
}

function openVersionHistory() {
  if (!currentQuestion.value) {
    notify('버전을 확인할 문항을 먼저 선택해주세요.')
    return
  }
  const latestVersion = currentQuestion.value.versions?.at(-1)
  referenceDetail.value = {
    type: 'versions',
    questionId: currentQuestion.value.id,
    selectedVersionId: latestVersion?.id ?? null,
  }
}

function selectQuestionVersion(versionId) {
  if (referenceDetail.value?.type !== 'versions') return
  referenceDetail.value.selectedVersionId = versionId
}

function saveQuestionVersion() {
  if (!currentQuestion.value) {
    notify('버전으로 저장할 문항을 먼저 선택해주세요.')
    return
  }
  if (!currentQuestion.value.answer.trim()) {
    notify('답변을 작성한 뒤 버전으로 저장해주세요.')
    return
  }

  const version = addQuestionVersion(currentQuestion.value, 'MANUAL')
  if (!version) {
    notify('마지막 버전과 내용이 같습니다.')
    return
  }

  pruneDraftVersions(currentQuestion.value)
  markApplicationChanged()
  saveWorkspace()
  openVersionHistory()
  referenceDetail.value.selectedVersionId = version.id
  notify(`버전 ${version.versionNumber}을 저장했습니다.`)
}

function restoreQuestionVersion(versionId) {
  if (activeApplication.value?.status !== '작성 중') {
    notify('작성 중 상태에서만 과거 버전을 복원할 수 있습니다.')
    return
  }

  const question = activeApplication.value?.questions.find(
    (item) => item.id === referenceDetail.value?.questionId,
  )
  const version = question?.versions.find((item) => item.id === versionId)
  if (!question || !version) return

  question.text = version.text
  question.answer = version.answer
  question.limit = version.limit
  question.experienceIds = [...version.experienceIds]
  question.completionStatus = 'DRAFT'
  question.completedAt = null
  pruneDraftVersions(question)
  markApplicationChanged()
  saveWorkspace()
  notify(`버전 ${version.versionNumber}의 내용을 복원했습니다.`)
}

function deleteQuestionVersion(versionId) {
  const question = activeApplication.value?.questions.find(
    (item) => item.id === referenceDetail.value?.questionId,
  )
  const version = question?.versions.find((item) => item.id === versionId)
  if (!question || !version) return

  if (version.kind !== 'MANUAL') {
    notify('작성 완료본과 제출 완료본은 삭제할 수 없습니다.')
    return
  }
  if (
    typeof window !== 'undefined' &&
    !window.confirm(`버전 ${version.versionNumber}을 삭제할까요? 삭제한 버전은 복구할 수 없습니다.`)
  ) {
    return
  }

  question.versions = question.versions.filter((item) => item.id !== versionId)
  if (referenceDetail.value?.type === 'versions') {
    referenceDetail.value.selectedVersionId = question.versions.at(-1)?.id ?? null
  }
  markApplicationChanged()
  saveWorkspace()
  notify(`버전 ${version.versionNumber}을 삭제했습니다.`)
}

function editExperience(experience) {
  draft.value = experience
    ? JSON.parse(JSON.stringify(experience))
    : {
        title: '',
        type: '프로젝트',
        period: '',
        tags: [],
        situation: '',
        action: '',
        result: '',
        lesson: '',
        memo: '',
        overview: '',
        career: '',
      }
  draft.value.tagText = draft.value.tags.join(', ')
  modal.value = 'experience'
}

function saveExperience() {
  if (!draft.value.title.trim()) {
    notify('경험 제목을 입력해주세요.')
    return
  }

  const savedExperience = {
    ...draft.value,
    tags: draft.value.tagText
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean),
  }
  delete savedExperience.tagText

  if (savedExperience.id) {
    experiences.value = experiences.value.map((experience) =>
      experience.id === savedExperience.id ? savedExperience : experience,
    )
  } else {
    experiences.value.push({ ...savedExperience, id: Date.now() })
  }

  closeModal()
  notify('경험을 저장했습니다.')
}

function requestExperienceDelete() {
  modal.value = 'delete'
}

function removeExperience() {
  const experienceId = detail.value.id
  experiences.value = experiences.value.filter(
    (experience) => experience.id !== experienceId,
  )
  applications.value.forEach((application) => {
    application.questions.forEach((question) => {
      question.experienceIds = question.experienceIds.filter(
        (id) => id !== experienceId,
      )
    })
  })
  closeExperienceDetail()
  closeModal()
  notify('경험을 삭제했습니다. 작성한 답변은 유지됩니다.')
}

function editCareer(career) {
  draft.value = career
    ? JSON.parse(JSON.stringify(career))
    : {
        company: '',
        employment: '인턴',
        role: '',
        start: '',
        end: '',
        current: false,
        duties: '',
      }
  modal.value = 'career'
}

function saveCareer() {
  if (!draft.value.company.trim()) {
    notify('회사명을 입력해주세요.')
    return
  }

  const savedCareer = { ...draft.value }
  if (savedCareer.current) savedCareer.end = ''

  if (savedCareer.end && savedCareer.start > savedCareer.end) {
    notify('종료일을 확인해주세요.')
    return
  }

  if (savedCareer.id) {
    careers.value = careers.value.map((career) =>
      career.id === savedCareer.id ? savedCareer : career,
    )
  } else {
    careers.value.push({ ...savedCareer, id: Date.now() })
  }

  closeModal()
  notify('경력을 저장했습니다.')
}

function newApplication() {
  draft.value = { company: '', role: '', season: '2026 하반기' }
  modal.value = 'application'
}

function createApplication() {
  if (!draft.value.company.trim() || !draft.value.role.trim()) {
    notify('회사와 지원 직무를 입력해주세요.')
    return
  }

  const application = {
    ...draft.value,
    id: Date.now(),
    status: '작성 중',
    updatedAt: new Date().toISOString(),
    questions: [
      {
        id: `${Date.now()}-1`,
        position: 1,
        text: '',
        limit: 700,
        answer: '',
        experienceIds: [],
        completionStatus: 'DRAFT',
        completedAt: null,
        versions: [],
      },
    ],
  }
  applications.value.unshift(application)
  closeModal()
  openApplication(application)
}

function openApplication(application) {
  activeApplication.value = application
  questionIndex.value = 0
  go('editor')
}

function addQuestion() {
  if (activeApplication.value?.status !== '작성 중') {
    notify('작성 중 상태에서만 문항을 추가할 수 있습니다.')
    return
  }
  activeApplication.value.questions.push({
    id: `${Date.now()}-${activeApplication.value.questions.length + 1}`,
    position: activeApplication.value.questions.length + 1,
    text: '',
    limit: 700,
    answer: '',
    experienceIds: [],
    completionStatus: 'DRAFT',
    completedAt: null,
    versions: [],
  })
  questionIndex.value = activeApplication.value.questions.length - 1
  recommendationVisible.value = false
  markApplicationChanged()
}

function selectQuestion(index) {
  questionIndex.value = index
  recommendationVisible.value = false
  if (referenceDetail.value?.type === 'versions') closeReferenceDetail()
  saveWorkspace()
}

function updateQuestionPositions() {
  activeApplication.value?.questions.forEach((question, index) => {
    question.position = index + 1
  })
}

function removeQuestion(index = questionIndex.value) {
  if (!activeApplication.value?.questions[index]) return
  if (activeApplication.value.status !== '작성 중') {
    notify('작성 중 상태에서만 문항을 삭제할 수 있습니다.')
    return
  }
  if (
    typeof window !== 'undefined' &&
    !window.confirm(`문항 ${index + 1}을 삭제할까요? 작성한 답변과 경험 연결도 함께 삭제됩니다.`)
  ) {
    return
  }

  activeApplication.value.questions.splice(index, 1)
  updateQuestionPositions()
  questionIndex.value = Math.min(index, Math.max(activeApplication.value.questions.length - 1, 0))
  recommendationVisible.value = false
  markApplicationChanged()
  notify('문항을 삭제했습니다.')
}

function moveQuestion(direction) {
  if (activeApplication.value?.status !== '작성 중') {
    notify('작성 중 상태에서만 문항 순서를 변경할 수 있습니다.')
    return
  }
  const questions = activeApplication.value?.questions
  const targetIndex = questionIndex.value + direction
  if (!questions || targetIndex < 0 || targetIndex >= questions.length) return

  const [question] = questions.splice(questionIndex.value, 1)
  questions.splice(targetIndex, 0, question)
  questionIndex.value = targetIndex
  updateQuestionPositions()
  markApplicationChanged()
}

function previousQuestion() {
  if (questionIndex.value > 0) selectQuestion(questionIndex.value - 1)
}

function nextQuestion() {
  const questionCount = activeApplication.value?.questions.length ?? 0
  if (questionIndex.value < questionCount - 1) selectQuestion(questionIndex.value + 1)
}

function recommendExperiences() {
  if (!currentQuestion.value?.text.trim()) {
    notify('문항을 먼저 입력해주세요.')
    return
  }
  recommendationVisible.value = true
}

function showAllExperiences() {
  recommendationVisible.value = false
}

function connectExperience(experience) {
  if (!currentQuestion.value) {
    notify('연결할 문항을 먼저 추가해주세요.')
    return
  }
  if (activeApplication.value?.status !== '작성 중') {
    notify('작성 중 상태에서만 참고 경험을 변경할 수 있습니다.')
    return
  }
  const connectedIds = currentQuestion.value.experienceIds
  if (!connectedIds.includes(experience.id)) connectedIds.push(experience.id)
  markApplicationChanged()
  notify('참고 경험으로 연결했습니다.')
}

function unlinkExperience(experienceId) {
  if (activeApplication.value?.status !== '작성 중') {
    notify('작성 중 상태에서만 참고 경험을 변경할 수 있습니다.')
    return
  }
  currentQuestion.value.experienceIds = currentQuestion.value.experienceIds.filter(
    (id) => id !== experienceId,
  )
  markApplicationChanged()
}

function toggleQuestionCompletion() {
  const question = currentQuestion.value
  if (!question || activeApplication.value?.status !== '작성 중') return

  if (question.completionStatus === 'COMPLETED') {
    question.completionStatus = 'DRAFT'
    question.completedAt = null
    markApplicationChanged()
    saveWorkspace()
    notify('문항을 작성 중으로 변경했습니다.')
    return
  }

  if (!question.text.trim() || !question.answer.trim()) {
    notify('문항과 답변을 모두 작성해주세요.')
    return
  }
  if (Array.from(question.answer).length > Number(question.limit || 0)) {
    notify('글자 수 제한을 초과한 답변은 완료할 수 없습니다.')
    return
  }

  question.completionStatus = 'COMPLETED'
  question.completedAt = new Date().toISOString()
  markApplicationChanged()
  saveWorkspace()
  notify('문항을 작성 완료로 변경했습니다.')
}

function changeApplicationStatus(targetStatus) {
  const application = activeApplication.value
  if (!application || application.status === targetStatus) return

  const allowedTransitions = {
    '작성 중': ['작성 완료'],
    '작성 완료': ['작성 중', '제출 완료'],
    '제출 완료': ['작성 완료'],
  }
  if (!allowedTransitions[application.status]?.includes(targetStatus)) {
    notify('현재 상태에서는 해당 단계로 변경할 수 없습니다.')
    return
  }

  if (targetStatus === '작성 완료') {
    const ready =
      application.questions.length > 0 &&
      application.questions.every(
        (question) =>
          question.completionStatus === 'COMPLETED' &&
          question.text.trim() &&
          question.answer.trim() &&
          Array.from(question.answer).length <= Number(question.limit || 0),
      )
    if (!ready) {
      notify('모든 문항을 제한 글자 수 안에서 작성 완료로 변경해주세요.')
      return
    }

    application.questions.forEach((question) => {
      const completedVersion = addQuestionVersion(question, 'COMPLETED', { force: true })
      pruneCompletedVersions(question, completedVersion)
    })
  }

  if (targetStatus === '제출 완료') {
    if (
      typeof window !== 'undefined' &&
      !window.confirm('제출 완료로 변경하면 문항별 제출 버전 1개만 남고 이전 버전은 정리됩니다. 계속할까요?')
    ) {
      return
    }
    application.questions.forEach((question) => {
      const submittedVersion = addQuestionVersion(question, 'SUBMITTED', { force: true })
      question.versions = [submittedVersion]
    })
  }

  application.status = targetStatus
  application.updatedAt = new Date().toISOString()
  closeReferenceDetail()
  saveWorkspace()
  notify(`자소서를 ${targetStatus} 상태로 변경했습니다.`)
}

function submitModal() {
  if (modal.value === 'experience') return saveExperience()
  if (modal.value === 'career') return saveCareer()
  if (modal.value === 'application') return createApplication()
}

function addCertification() {
  certifications.value.push({
    id: profileItemId++,
    name: '',
    issuer: '',
    acquiredOn: '',
    number: '',
  })
}

function addLanguageScore() {
  languageScores.value.push({
    id: profileItemId++,
    name: '',
    score: '',
    testedOn: '',
    expiresOn: '',
  })
}

function addCourse() {
  courses.value.push({
    id: profileItemId++,
    majorName: profile.value.major,
    year: '',
    semester: '',
    subject: '',
    subjectType: '전공',
    credits: '',
    grade: '',
    retaken: 'N',
  })
}

function removeCertification(id) {
  certifications.value = certifications.value.filter((item) => item.id !== id)
}

function removeLanguageScore(id) {
  languageScores.value = languageScores.value.filter((item) => item.id !== id)
}

function removeCourse(id) {
  courses.value = courses.value.filter((item) => item.id !== id)
}

function saveProfileSection(section) {
  saveWorkspace()
  notify(`${section} 정보를 현재 기기에 저장했습니다.`)
}

function formatRows(title, rows, fields) {
  return rows
    .filter((row) => fields.some(([key]) => row[key]))
    .map((row, index) =>
      [
        `${title} ${index + 1}`,
        ...fields
          .filter(([key]) => row[key])
          .map(([key, label]) => `${label}: ${row[key]}`),
      ].join('\n'),
    )
    .join('\n\n')
}

async function copyProfile() {
  try {
    const base = Object.entries(profile.value)
      .filter(([, value]) => value)
      .map(([key, value]) => `${PROFILE_LABELS[key] ?? key}: ${value}`)
      .join('\n')
    const certificationText = formatRows('자격증', certifications.value, [
      ['name', '자격증명'],
      ['issuer', '발급기관'],
      ['acquiredOn', '취득일'],
      ['number', '자격번호'],
    ])
    const languageText = formatRows('어학 성적', languageScores.value, [
      ['name', '시험명'],
      ['score', '점수·등급'],
      ['testedOn', '응시일'],
      ['expiresOn', '유효기간'],
    ])
    const courseText = formatRows('수강 과목', courses.value, [
      ['majorName', '전공명'],
      ['year', '수강연도'],
      ['semester', '학기'],
      ['subject', '과목명'],
      ['subjectType', '과목유형'],
      ['credits', '취득학점'],
      ['grade', '성적'],
      ['retaken', '재수강여부'],
    ])

    await navigator.clipboard.writeText(
      [base, certificationText, languageText, courseText].filter(Boolean).join('\n\n'),
    )
    notify('기본 이력을 복사했습니다.')
  } catch {
    notify('브라우저에서 클립보드 접근을 허용해주세요.')
  }
}

export function useWorkspace() {
  return {
    page,
    query,
    selectedTag,
    toast,
    modal,
    draft,
    detail,
    referenceDetail,
    experiences,
    careers,
    applications,
    profile,
    certifications,
    languageScores,
    courses,
    activeApplication,
    questionIndex,
    recommendationVisible,
    saveState,
    saveStatusLabel,
    lastSavedAt,
    currentQuestion,
    filteredExperiences,
    filteredApplications,
    recommendedExperiences,
    tags,
    profileLabels: PROFILE_LABELS,
    notify,
    go,
    closeModal,
    openExperienceDetail,
    closeExperienceDetail,
    openReferenceDetail,
    closeReferenceDetail,
    openVersionHistory,
    selectQuestionVersion,
    saveQuestionVersion,
    restoreQuestionVersion,
    deleteQuestionVersion,
    editExperience,
    requestExperienceDelete,
    removeExperience,
    editCareer,
    newApplication,
    openApplication,
    addQuestion,
    selectQuestion,
    removeQuestion,
    moveQuestion,
    previousQuestion,
    nextQuestion,
    recommendExperiences,
    showAllExperiences,
    connectExperience,
    unlinkExperience,
    markApplicationChanged,
    markCurrentQuestionChanged,
    toggleQuestionCompletion,
    changeApplicationStatus,
    saveWorkspace,
    submitModal,
    addCertification,
    addLanguageScore,
    addCourse,
    removeCertification,
    removeLanguageScore,
    removeCourse,
    saveProfileSection,
    copyProfile,
  }
}

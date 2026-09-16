import { computed, ref, watch } from 'vue'
import {
  createDemoApplications,
  createDemoCareers,
  createDemoExperiences,
  createEmptyProfile,
  PROFILE_LABELS,
} from '../data/demoData.js'

const STORAGE_KEY = 'ssulap-workspace-v3'
const LEGACY_STORAGE_KEY = 'ssulap-workspace-v2'
const SAVE_DELAY = 2000
const MAX_DRAFT_VERSIONS = 20
const MAX_COMPLETED_WORKING_VERSIONS = 5
const validPages = new Set([
  'profile',
  'careers',
  'experiences',
  'essays',
  'editor',
  'reviews',
  'review',
])

const DEFAULT_USERS = [
  { id: 1, name: '테스터1' },
  { id: 2, name: '테스터2' },
]

function loadWorkspace() {
  if (typeof window === 'undefined') return null

  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY))
    if (stored?.version === 3) return stored

    const legacy = JSON.parse(window.localStorage.getItem(LEGACY_STORAGE_KEY))
    return legacy?.version === 2 ? legacy : null
  } catch {
    return null
  }
}

function normalizeApplications(items) {
  return items.map((application) => ({
    ...application,
    userId: application.userId ?? 1,
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
const users = ref(restoredWorkspace?.users ?? DEFAULT_USERS)

function createUserData(userId, withDemoData = false) {
  return {
    experiences: withDemoData
      ? createDemoExperiences().map((item) => ({ ...item, userId }))
      : [],
    careers: withDemoData
      ? createDemoCareers().map((item) => ({ ...item, userId }))
      : [],
    applications: withDemoData
      ? normalizeApplications(
          createDemoApplications().map((item) => ({ ...item, userId })),
        )
      : [],
    profile: createEmptyProfile(),
    profileSectionLocks: {
      education: false,
      certifications: false,
      languageScores: false,
      military: false,
      support: false,
    },
    certifications: [{ id: userId * 1000 + 1, name: '', issuer: '', acquiredOn: '', number: '' }],
    languageScores: [{ id: userId * 1000 + 2, name: '', score: '', testedOn: '', expiresOn: '' }],
    courses: [],
  }
}

function migrateUserData(workspace) {
  if (workspace?.userData) {
    return Object.fromEntries(
      users.value.map((user) => {
        const data = workspace.userData[user.id] ?? createUserData(user.id)
        return [
          user.id,
          {
            ...createUserData(user.id),
            ...data,
            applications: normalizeApplications(data.applications ?? []),
            profileSectionLocks: {
              ...createUserData(user.id).profileSectionLocks,
              ...(data.profileSectionLocks ?? {}),
            },
          },
        ]
      }),
    )
  }

  const testerOne = createUserData(1, true)
  if (workspace?.version === 2) {
    testerOne.experiences = (workspace.experiences ?? createDemoExperiences()).map((item) => ({
      ...item,
      userId: 1,
    }))
    testerOne.careers = (workspace.careers ?? createDemoCareers()).map((item) => ({
      ...item,
      userId: 1,
    }))
    testerOne.applications = normalizeApplications(
      (workspace.applications ?? createDemoApplications()).map((item) => ({
        ...item,
        userId: 1,
      })),
    )
    testerOne.profile = workspace.profile ?? createEmptyProfile()
    testerOne.certifications = workspace.certifications ?? testerOne.certifications
    testerOne.languageScores = workspace.languageScores ?? testerOne.languageScores
    testerOne.courses = workspace.courses ?? []
  }

  return {
    1: testerOne,
    2: createUserData(2),
  }
}

const userData = ref(migrateUserData(restoredWorkspace))
const currentUserId = ref(
  restoredWorkspace?.version === 3 ? restoredWorkspace?.ui?.currentUserId ?? null : null,
)
const currentUser = computed(
  () => users.value.find((user) => user.id === currentUserId.value) ?? null,
)
const guestData = createUserData(0)
const activeUserData = computed(() => userData.value[currentUserId.value] ?? guestData)
const experiences = computed(() => activeUserData.value.experiences)
const careers = computed(() => activeUserData.value.careers)
const applications = computed(() => activeUserData.value.applications)
const profile = computed(() => activeUserData.value.profile)
const profileSectionLocks = computed(() => activeUserData.value.profileSectionLocks)
const certifications = computed(() => activeUserData.value.certifications)
const languageScores = computed(() => activeUserData.value.languageScores)
const courses = computed(() => activeUserData.value.courses)

const restoredActiveApplication = applications.value.find(
  (application) => application.id === restoredWorkspace?.ui?.activeApplicationId,
)
const initialPage = validPages.has(restoredWorkspace?.ui?.page)
  ? restoredWorkspace.ui.page
  : 'experiences'
const page = ref(
  initialPage === 'editor' && !restoredActiveApplication
    ? 'essays'
    : initialPage === 'review' &&
        !restoredWorkspace?.reviewRequests?.some(
          (request) => request.id === restoredWorkspace?.ui?.activeReviewId,
        )
      ? 'reviews'
      : initialPage,
)
const query = ref('')
const selectedTag = ref('전체')
const toast = ref('')
const modal = ref(null)
const draft = ref({})
const detail = ref(null)
const referenceDetail = ref(null)

const allProfileItemIds = Object.values(userData.value)
  .flatMap((data) => [...data.certifications, ...data.languageScores, ...data.courses])
  .map((item) => Number(item.id) || 0)
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
const reviewRequests = ref(restoredWorkspace?.reviewRequests ?? [])
const reviewComments = ref(restoredWorkspace?.reviewComments ?? [])
const activeReviewId = ref(restoredWorkspace?.ui?.activeReviewId ?? null)

const currentQuestion = computed(
  () => activeApplication.value?.questions[questionIndex.value],
)

function getApplicationById(applicationId) {
  return Object.values(userData.value)
    .flatMap((data) => data.applications)
    .find((application) => application.id === applicationId)
}

const receivedReviewRequests = computed(() =>
  reviewRequests.value
    .filter((request) => request.reviewerId === currentUserId.value)
    .sort((left, right) => new Date(right.requestedAt) - new Date(left.requestedAt)),
)
const sentReviewRequests = computed(() =>
  reviewRequests.value
    .filter((request) => request.requesterId === currentUserId.value)
    .sort((left, right) => new Date(right.requestedAt) - new Date(left.requestedAt)),
)
const pendingReviewCount = computed(
  () => receivedReviewRequests.value.filter((request) => request.status === 'REQUESTED').length,
)
const activeReview = computed(
  () => reviewRequests.value.find((request) => request.id === activeReviewId.value) ?? null,
)
const reviewApplication = computed(() =>
  activeReview.value ? getApplicationById(activeReview.value.applicationId) : null,
)

if (page.value === 'review' && !activeReview.value) page.value = 'reviews'

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
    version: 3,
    savedAt: lastSavedAt.value,
    users: users.value,
    userData: userData.value,
    reviewRequests: reviewRequests.value,
    reviewComments: reviewComments.value,
    ui: {
      page: page.value,
      currentUserId: currentUserId.value,
      activeApplicationId: activeApplication.value?.id ?? null,
      activeReviewId: activeReviewId.value,
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

watch([userData, reviewRequests, reviewComments], scheduleWorkspaceSave, {
  deep: true,
  flush: 'sync',
})

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

function login(userId) {
  const normalizedUserId = Number(userId)
  const user = users.value.find((item) => item.id === normalizedUserId)
  if (!user) return false

  if (!userData.value[normalizedUserId]) {
    userData.value[normalizedUserId] = createUserData(normalizedUserId)
  }
  currentUserId.value = normalizedUserId
  activeApplication.value = null
  activeReviewId.value = null
  questionIndex.value = 0
  page.value = 'experiences'
  query.value = ''
  saveWorkspace()
  notify(`${user.name} 계정으로 로그인했습니다.`)
  return true
}

function logout() {
  activeApplication.value = null
  activeReviewId.value = null
  referenceDetail.value = null
  detail.value = null
  modal.value = null
  currentUserId.value = null
  page.value = 'experiences'
  query.value = ''
  saveWorkspace()
}

function go(targetPage) {
  if (!currentUser.value) return false
  if (page.value === 'editor' && targetPage !== 'editor' && saveState.value === 'unsaved') {
    if (!saveWorkspace({ announce: true })) return false
  }

  page.value = targetPage
  query.value = ''
  recommendationVisible.value = false
  saveWorkspace()
  return true
}

function requestApplicationReview(reviewerId) {
  const application = activeApplication.value
  const normalizedReviewerId = Number(reviewerId)
  const reviewer = users.value.find((user) => user.id === normalizedReviewerId)

  if (!application || application.userId !== currentUserId.value) return false
  if (application.status !== '작성 완료') {
    notify('작성 완료 상태의 자소서만 검토를 요청할 수 있습니다.')
    return false
  }
  if (!reviewer || reviewer.id === currentUserId.value) {
    notify('다른 사용자를 검토자로 선택해주세요.')
    return false
  }
  const duplicatedRequest = reviewRequests.value.some(
    (request) =>
      request.applicationId === application.id &&
      request.reviewerId === reviewer.id &&
      request.status === 'REQUESTED',
  )
  if (duplicatedRequest) {
    notify('이미 해당 검토자에게 진행 중인 요청이 있습니다.')
    return false
  }

  reviewRequests.value.push({
    id: `review-${Date.now()}`,
    applicationId: application.id,
    requesterId: currentUserId.value,
    reviewerId: reviewer.id,
    status: 'REQUESTED',
    requestedAt: new Date().toISOString(),
    completedAt: null,
  })
  saveWorkspace()
  notify(`${reviewer.name}님에게 검토를 요청했습니다.`)
  return true
}

function openReviewRequest(request) {
  if (
    !request ||
    ![request.requesterId, request.reviewerId].includes(currentUserId.value)
  ) {
    notify('이 검토 요청을 볼 수 없습니다.')
    return false
  }
  activeReviewId.value = request.id
  return go('review')
}

function commentsForReview(reviewId) {
  return reviewComments.value.filter((comment) => comment.reviewRequestId === reviewId)
}

function saveReviewComment(questionId, content) {
  const request = activeReview.value
  if (
    !request ||
    request.reviewerId !== currentUserId.value ||
    request.status !== 'REQUESTED'
  ) {
    notify('진행 중인 검토 요청에서만 메모를 작성할 수 있습니다.')
    return false
  }

  const trimmedContent = content.trim()
  const existingComment = reviewComments.value.find(
    (comment) =>
      comment.reviewRequestId === request.id &&
      comment.questionId === questionId &&
      comment.authorId === currentUserId.value,
  )

  if (!trimmedContent) {
    if (existingComment) {
      reviewComments.value = reviewComments.value.filter(
        (comment) => comment.id !== existingComment.id,
      )
      saveWorkspace()
      notify('검토 메모를 삭제했습니다.')
    }
    return true
  }

  const now = new Date().toISOString()
  if (existingComment) {
    existingComment.content = trimmedContent
    existingComment.updatedAt = now
  } else {
    reviewComments.value.push({
      id: `comment-${Date.now()}-${questionId}`,
      reviewRequestId: request.id,
      questionId,
      authorId: currentUserId.value,
      content: trimmedContent,
      createdAt: now,
      updatedAt: now,
    })
  }
  saveWorkspace()
  notify('검토 메모를 저장했습니다.')
  return true
}

function completeReview() {
  const request = activeReview.value
  if (
    !request ||
    request.reviewerId !== currentUserId.value ||
    request.status !== 'REQUESTED'
  ) {
    return false
  }
  if (!commentsForReview(request.id).length) {
    notify('문항에 메모를 하나 이상 남긴 뒤 검토를 완료해주세요.')
    return false
  }

  request.status = 'COMPLETED'
  request.completedAt = new Date().toISOString()
  saveWorkspace()
  notify('검토를 완료했습니다. 작성자에게 메모가 공유됩니다.')
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
    activeUserData.value.experiences = experiences.value.map((experience) =>
      experience.id === savedExperience.id ? savedExperience : experience,
    )
  } else {
    experiences.value.push({ ...savedExperience, id: Date.now(), userId: currentUserId.value })
  }

  closeModal()
  notify('경험을 저장했습니다.')
}

function requestExperienceDelete() {
  modal.value = 'delete'
}

function removeExperience() {
  const experienceId = detail.value.id
  activeUserData.value.experiences = experiences.value.filter(
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
    activeUserData.value.careers = careers.value.map((career) =>
      career.id === savedCareer.id ? savedCareer : career,
    )
  } else {
    careers.value.push({ ...savedCareer, id: Date.now(), userId: currentUserId.value })
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
    userId: currentUserId.value,
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

  const hasPendingReview = reviewRequests.value.some(
    (request) =>
      request.applicationId === application.id && request.status === 'REQUESTED',
  )
  if (hasPendingReview && application.status === '작성 완료') {
    notify('진행 중인 검토가 완료된 뒤 자소서 상태를 변경할 수 있습니다.')
    return
  }

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
  activeUserData.value.certifications = certifications.value.filter((item) => item.id !== id)
}

function removeLanguageScore(id) {
  activeUserData.value.languageScores = languageScores.value.filter((item) => item.id !== id)
}

function removeCourse(id) {
  activeUserData.value.courses = courses.value.filter((item) => item.id !== id)
}

function saveProfileSection(sectionKey, sectionLabel) {
  profileSectionLocks.value[sectionKey] = true
  saveWorkspace()
  notify(`${sectionLabel} 정보를 저장했습니다.`)
}

function editProfileSection(sectionKey) {
  profileSectionLocks.value[sectionKey] = false
  saveWorkspace()
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
    users,
    currentUserId,
    currentUser,
    experiences,
    careers,
    applications,
    profile,
    profileSectionLocks,
    certifications,
    languageScores,
    courses,
    activeApplication,
    questionIndex,
    recommendationVisible,
    saveState,
    saveStatusLabel,
    lastSavedAt,
    reviewRequests,
    reviewComments,
    activeReviewId,
    activeReview,
    reviewApplication,
    receivedReviewRequests,
    sentReviewRequests,
    pendingReviewCount,
    currentQuestion,
    filteredExperiences,
    filteredApplications,
    recommendedExperiences,
    tags,
    profileLabels: PROFILE_LABELS,
    notify,
    login,
    logout,
    go,
    getApplicationById,
    requestApplicationReview,
    openReviewRequest,
    commentsForReview,
    saveReviewComment,
    completeReview,
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
    editProfileSection,
  }
}

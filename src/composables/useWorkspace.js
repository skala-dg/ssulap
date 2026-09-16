import { computed, ref } from 'vue'
import {
  createDemoApplications,
  createDemoCareers,
  createDemoExperiences,
  createEmptyProfile,
  PROFILE_LABELS,
} from '../data/demoData.js'

const page = ref('experiences')
const query = ref('')
const selectedTag = ref('전체')
const toast = ref('')
const modal = ref(null)
const draft = ref({})
const detail = ref(null)

const experiences = ref(createDemoExperiences())
const careers = ref(createDemoCareers())
const applications = ref(createDemoApplications())
const profile = ref(createEmptyProfile())

let profileItemId = 1
const certifications = ref([
  { id: profileItemId++, name: '', issuer: '', acquiredOn: '', number: '' },
])
const languageScores = ref([
  { id: profileItemId++, name: '', score: '', testedOn: '', expiresOn: '' },
])
const courses = ref([])

const activeApplication = ref(null)
const questionIndex = ref(0)
const recommendationVisible = ref(false)
const tags = ['전체', '협업', '문제 해결', '주도성', '소통', '책임감']

const currentQuestion = computed(
  () => activeApplication.value?.questions[questionIndex.value],
)

const filteredExperiences = computed(() =>
  experiences.value.filter((experience) => {
    const matchesTag =
      selectedTag.value === '전체' || experience.tags.includes(selectedTag.value)
    const searchText = `${experience.title}${experience.tags.join('')}${experience.situation}`
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

function notify(message) {
  toast.value = message
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toast.value = ''
  }, 3000)
}

function go(targetPage) {
  page.value = targetPage
  query.value = ''
  recommendationVisible.value = false
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
  notify('경험을 저장했습니다. 이번 미리보기 동안 유지됩니다.')
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
    questions: [{ text: '', limit: 700, answer: '', experienceIds: [] }],
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
  activeApplication.value.questions.push({
    text: '',
    limit: 700,
    answer: '',
    experienceIds: [],
  })
  questionIndex.value = activeApplication.value.questions.length - 1
  recommendationVisible.value = false
}

function selectQuestion(index) {
  questionIndex.value = index
  recommendationVisible.value = false
}

function recommendExperiences() {
  if (!currentQuestion.value.text.trim()) {
    notify('문항을 먼저 입력해주세요.')
    return
  }
  recommendationVisible.value = true
}

function connectExperience(experience) {
  const connectedIds = currentQuestion.value.experienceIds
  if (!connectedIds.includes(experience.id)) connectedIds.push(experience.id)
  notify('참고 경험으로 연결했습니다.')
}

function unlinkExperience(experienceId) {
  currentQuestion.value.experienceIds = currentQuestion.value.experienceIds.filter(
    (id) => id !== experienceId,
  )
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
  notify(`${section} 정보를 저장했습니다. 새로고침하면 초기화됩니다.`)
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
    editExperience,
    requestExperienceDelete,
    removeExperience,
    editCareer,
    newApplication,
    openApplication,
    addQuestion,
    selectQuestion,
    recommendExperiences,
    connectExperience,
    unlinkExperience,
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

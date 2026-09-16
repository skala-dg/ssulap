export function countCharacters(value = '') {
  return Array.from(value).length
}

export function getQuestionState(question) {
  if (!question) return 'empty'

  const answerLength = countCharacters(question.answer)
  if (answerLength > Number(question.limit || 0)) return 'over-limit'
  if (question.completionStatus === 'COMPLETED') return 'completed'
  if (question.answer?.trim()) return 'draft'
  if (question.text?.trim()) return 'draft'
  return 'empty'
}

export function getApplicationProgress(application) {
  const questions = application?.questions ?? []
  const completed = questions.filter(
    (question) => question.completionStatus === 'COMPLETED',
  ).length
  const overLimit = questions.filter(
    (question) => getQuestionState(question) === 'over-limit',
  ).length
  const empty = questions.filter(
    (question) => getQuestionState(question) === 'empty',
  ).length
  const totalCharacters = questions.reduce(
    (sum, question) => sum + countCharacters(question.answer),
    0,
  )
  const connectedExperiences = new Set(
    questions.flatMap((question) => question.experienceIds ?? []),
  ).size

  return {
    total: questions.length,
    completed,
    overLimit,
    empty,
    totalCharacters,
    connectedExperiences,
    percent: questions.length ? Math.round((completed / questions.length) * 100) : 0,
  }
}

export function formatSavedAt(value) {
  if (!value) return '저장 기록 없음'

  return new Intl.DateTimeFormat('ko-KR', {
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

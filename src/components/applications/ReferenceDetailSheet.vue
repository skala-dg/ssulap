<script setup>
import { computed } from 'vue'
import { Copy, RotateCcw, Trash2, X } from 'lucide-vue-next'
import { useWorkspace } from '../../composables/useWorkspace.js'
import { countCharacters, formatSavedAt } from '../../utils/applicationMetrics.js'

const {
  referenceDetail,
  activeApplication,
  notify,
  closeReferenceDetail,
  selectQuestionVersion,
  restoreQuestionVersion,
  deleteQuestionVersion,
} = useWorkspace()

const experienceFields = [
  ['situation', '상황·과제'],
  ['action', '내 역할·행동'],
  ['result', '결과'],
  ['lesson', '배운 점'],
  ['memo', '협업 회고'],
  ['overview', '경험 개요'],
]

const versionQuestion = computed(() =>
  activeApplication.value?.questions.find(
    (question) => question.id === referenceDetail.value?.questionId,
  ),
)
const versions = computed(() => [...(versionQuestion.value?.versions ?? [])].reverse())
const selectedVersion = computed(() =>
  versionQuestion.value?.versions.find(
    (version) => version.id === referenceDetail.value?.selectedVersionId,
  ),
)

const versionKindLabels = {
  COMPLETED: '작성 완료본',
  SUBMITTED: '제출 완료본',
}

const panelLabel = computed(() => {
  if (referenceDetail.value?.type === 'experience') return '참고 경험 상세'
  if (referenceDetail.value?.type === 'versions') return '답변 버전 기록'
  return '참고 경력 상세'
})

async function copyVersionAnswer() {
  if (!selectedVersion.value) return
  try {
    await navigator.clipboard.writeText(selectedVersion.value.answer)
    notify('선택한 버전의 답변을 복사했습니다.')
  } catch {
    notify('브라우저에서 클립보드 접근을 허용해주세요.')
  }
}
</script>

<template>
  <div v-if="referenceDetail" class="reference-sheet-layer">
    <aside
      class="reference-detail-sheet"
      role="complementary"
      :aria-label="panelLabel"
    >
      <button class="close" type="button" aria-label="상세 창 닫기" @click="closeReferenceDetail">
        <X />
      </button>

      <template v-if="referenceDetail.type === 'experience'">
        <span class="eyebrow">참고 경험 · {{ referenceDetail.item.type }}</span>
        <h2>{{ referenceDetail.item.title }}</h2>
        <p class="reference-period">{{ referenceDetail.item.period }}</p>
        <div class="card-tags">
          <span v-for="tag in referenceDetail.item.tags" :key="tag">#{{ tag }}</span>
        </div>

        <div
          v-for="[key, label] in experienceFields"
          :key="key"
          class="reference-detail-block"
        >
          <h3>{{ label }}</h3>
          <p>{{ referenceDetail.item[key] || '아직 기록하지 않았습니다.' }}</p>
        </div>
      </template>

      <template v-else-if="referenceDetail.type === 'versions'">
        <span class="eyebrow">ANSWER HISTORY</span>
        <h2>버전 기록</h2>
        <p class="reference-period">자동 저장과 별도로 직접 남긴 답변 기록입니다.</p>

        <p v-if="!versions.length" class="version-empty">
          아직 저장한 버전이 없습니다. 작성 화면에서 버전 저장을 눌러보세요.
        </p>

        <div v-else class="version-history-list" aria-label="저장된 버전 목록">
          <div
            v-for="version in versions"
            :key="version.id"
            class="version-history-item"
            :class="{ active: selectedVersion?.id === version.id }"
          >
            <button
              class="version-select"
              type="button"
              @click="selectQuestionVersion(version.id)"
            >
              <b>버전 {{ version.versionNumber }}</b>
              <small>{{ formatSavedAt(version.savedAt) }} · {{ countCharacters(version.answer).toLocaleString() }}자</small>
            </button>
            <button
              v-if="version.kind === 'MANUAL'"
              class="version-delete"
              type="button"
              :aria-label="`버전 ${version.versionNumber} 삭제`"
              title="버전 삭제"
              @click="deleteQuestionVersion(version.id)"
            >
              <Trash2 :size="15" />
            </button>
            <span v-else class="version-kind">{{ versionKindLabels[version.kind] ?? version.kind }}</span>
          </div>
        </div>

        <template v-if="selectedVersion">
          <div class="reference-detail-block version-answer">
            <h3>저장된 답변</h3>
            <p>{{ selectedVersion.answer || '저장된 답변이 없습니다.' }}</p>
          </div>
          <div class="version-actions">
            <button class="secondary compact" type="button" @click="copyVersionAnswer">
              <Copy :size="14" />내용 복사
            </button>
            <button
              class="primary compact"
              type="button"
              :disabled="activeApplication?.status !== '작성 중'"
              @click="restoreQuestionVersion(selectedVersion.id)"
            >
              <RotateCcw :size="14" />이 버전으로 복원
            </button>
          </div>
        </template>
      </template>

      <template v-else>
        <span class="eyebrow">참고 경력 · {{ referenceDetail.item.employment }}</span>
        <h2>{{ referenceDetail.item.company }}</h2>
        <p class="reference-period">
          {{ referenceDetail.item.start }} —
          {{ referenceDetail.item.current ? '재직 중' : referenceDetail.item.end }}
        </p>

        <div class="reference-detail-block">
          <h3>부서·직무</h3>
          <p>{{ referenceDetail.item.role || '아직 기록하지 않았습니다.' }}</p>
        </div>
        <div class="reference-detail-block">
          <h3>담당 업무</h3>
          <p>{{ referenceDetail.item.duties || '아직 기록하지 않았습니다.' }}</p>
        </div>
      </template>
    </aside>
  </div>
</template>

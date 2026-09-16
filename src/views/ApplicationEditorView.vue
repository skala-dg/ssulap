<script setup>
import { computed } from 'vue'
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  History,
  Plus,
  RotateCcw,
  Save,
  Send,
  Trash2,
} from 'lucide-vue-next'
import ResourceDrawer from '../components/applications/ResourceDrawer.vue'
import ReferenceDetailSheet from '../components/applications/ReferenceDetailSheet.vue'
import { useWorkspace } from '../composables/useWorkspace.js'
import {
  countCharacters,
  formatSavedAt,
  getApplicationProgress,
  getQuestionState,
} from '../utils/applicationMetrics.js'

const {
  activeApplication,
  questionIndex,
  currentQuestion,
  experiences,
  saveState,
  saveStatusLabel,
  lastSavedAt,
  go,
  addQuestion,
  selectQuestion,
  removeQuestion,
  moveQuestion,
  previousQuestion,
  nextQuestion,
  unlinkExperience,
  markCurrentQuestionChanged,
  toggleQuestionCompletion,
  changeApplicationStatus,
  saveQuestionVersion,
  openVersionHistory,
  openReferenceDetail,
} = useWorkspace()

const progress = computed(() => getApplicationProgress(activeApplication.value))
const lastSavedLabel = computed(() => formatSavedAt(lastSavedAt.value))
const editorLocked = computed(() => activeApplication.value?.status !== '작성 중')
const versionCount = computed(() => currentQuestion.value?.versions?.length ?? 0)

const questionStateLabels = {
  empty: '빈 문항',
  draft: '작성 중',
  completed: '작성 완료',
  'over-limit': '글자 수 초과',
}
</script>

<template>
  <template v-if="activeApplication">
    <button class="text-button" type="button" @click="go('essays')">
      <ArrowLeft :size="16" />보관함으로
    </button>

    <div class="page-heading editor-heading">
      <div>
        <div class="eyebrow">{{ activeApplication.season }} · {{ activeApplication.role }}</div>
        <h1>{{ activeApplication.company }}</h1>
        <div class="editor-progress-summary">
          <span>{{ progress.completed }} / {{ progress.total }}문항 작성</span>
          <span>{{ progress.totalCharacters.toLocaleString() }}자</span>
          <span>연결 경험 {{ progress.connectedExperiences }}개</span>
          <span v-if="progress.overLimit" class="meta-error">초과 {{ progress.overLimit }}개</span>
        </div>
      </div>
      <div class="editor-save-area">
        <div class="save-state" :class="`is-${saveState}`" role="status">
          <span aria-hidden="true"></span>
          <div>
            <b>{{ saveStatusLabel }}</b>
            <small>{{ lastSavedLabel }}</small>
          </div>
        </div>
        <div class="actions">
          <span class="pill application-status">{{ activeApplication.status }}</span>
          <button class="secondary" type="button" @click="openVersionHistory">
            <History :size="16" />버전 기록 {{ versionCount }}
          </button>
          <button
            v-if="activeApplication.status === '작성 중'"
            class="primary"
            type="button"
            @click="saveQuestionVersion"
          >
            <Save :size="16" />버전 저장
          </button>
          <button
            v-if="activeApplication.status === '작성 중'"
            class="secondary"
            type="button"
            @click="changeApplicationStatus('작성 완료')"
          >
            <CheckCircle2 :size="16" />자소서 작성 완료
          </button>
          <template v-else-if="activeApplication.status === '작성 완료'">
            <button class="secondary" type="button" @click="changeApplicationStatus('작성 중')">
              <RotateCcw :size="16" />작성 다시 시작
            </button>
            <button class="primary" type="button" @click="changeApplicationStatus('제출 완료')">
              <Send :size="16" />제출 완료
            </button>
          </template>
          <button
            v-else
            class="secondary"
            type="button"
            @click="changeApplicationStatus('작성 완료')"
          >
            <RotateCcw :size="16" />제출 완료 취소
          </button>
        </div>
      </div>
    </div>

    <div class="editor-layout">
      <section class="editor-panel">
        <div class="question-tabs" role="tablist" aria-label="자소서 문항">
          <button
            v-for="(question, index) in activeApplication.questions"
            :key="question.id"
            type="button"
            role="tab"
            :aria-selected="index === questionIndex"
            :class="{ active: index === questionIndex }"
            :title="questionStateLabels[getQuestionState(question)]"
            @click="selectQuestion(index)"
          >
            <span
              class="question-state-dot"
              :class="`is-${getQuestionState(question)}`"
            ></span>
            문항 {{ index + 1 }}
          </button>
          <button type="button" aria-label="문항 추가" :disabled="editorLocked" @click="addQuestion">
            <Plus :size="16" />문항 추가
          </button>
        </div>

        <template v-if="currentQuestion">
          <div class="question-toolbar">
            <div class="question-navigation">
              <button
                class="secondary compact"
                type="button"
                :disabled="questionIndex === 0"
                @click="previousQuestion"
              >
                <ChevronLeft :size="15" />이전
              </button>
              <span>{{ questionIndex + 1 }} / {{ activeApplication.questions.length }}</span>
              <button
                class="secondary compact"
                type="button"
                :disabled="questionIndex === activeApplication.questions.length - 1"
                @click="nextQuestion"
              >
                다음<ChevronRight :size="15" />
              </button>
            </div>
            <div class="question-management">
              <button
                class="icon-action"
                type="button"
                :disabled="editorLocked || questionIndex === 0"
                aria-label="문항을 앞으로 이동"
                title="문항을 앞으로 이동"
                @click="moveQuestion(-1)"
              >
                <ChevronUp :size="16" />앞으로
              </button>
              <button
                class="icon-action"
                type="button"
                :disabled="editorLocked || questionIndex === activeApplication.questions.length - 1"
                aria-label="문항을 뒤로 이동"
                title="문항을 뒤로 이동"
                @click="moveQuestion(1)"
              >
                <ChevronDown :size="16" />뒤로
              </button>
              <button
                class="icon-action danger"
                type="button"
                :disabled="editorLocked"
                aria-label="현재 문항 삭제"
                @click="removeQuestion()"
              >
                <Trash2 :size="15" />삭제
              </button>
            </div>
          </div>

          <div class="question-state-row">
            <div
              class="question-state-banner"
              :class="`is-${getQuestionState(currentQuestion)}`"
            >
              <span
                class="question-state-dot"
                :class="`is-${getQuestionState(currentQuestion)}`"
              ></span>
              {{ questionStateLabels[getQuestionState(currentQuestion)] }}
            </div>
            <button
              v-if="!editorLocked"
              class="secondary compact"
              type="button"
              @click="toggleQuestionCompletion"
            >
              <CheckCircle2 :size="15" />
              {{ currentQuestion.completionStatus === 'COMPLETED' ? '문항 완료 취소' : '문항 작성 완료' }}
            </button>
          </div>

          <label>
            자소서 문항
            <textarea
              v-model="currentQuestion.text"
              class="question-input"
              :readonly="editorLocked"
              placeholder="지원할 회사의 문항을 입력해주세요."
              @input="markCurrentQuestionChanged"
            ></textarea>
          </label>
          <label class="limit">
            글자 수 제한
            <input
              v-model="currentQuestion.limit"
              type="number"
              min="1"
              max="20000"
              :disabled="editorLocked"
              @input="markCurrentQuestionChanged"
            />
          </label>
          <label>
            나의 답변
            <textarea
              v-model="currentQuestion.answer"
              class="answer-input"
              :readonly="editorLocked"
              placeholder="오른쪽 자료 서랍에서 경험과 경력을 참고하며 작성해보세요."
              @input="markCurrentQuestionChanged"
            ></textarea>
          </label>
          <div
            class="char-count"
            :class="{ error: countCharacters(currentQuestion.answer) > currentQuestion.limit }"
          >
            공백 포함 {{ countCharacters(currentQuestion.answer).toLocaleString() }} /
            {{ Number(currentQuestion.limit).toLocaleString() }}자
          </div>

          <div class="linked">
            참고한 경험
            <span v-for="id in currentQuestion.experienceIds" :key="id" class="linked-resource">
              <button
                class="linked-resource-open"
                type="button"
                @click="openReferenceDetail('experience', experiences.find((experience) => experience.id === id))"
              >
                {{ experiences.find((experience) => experience.id === id)?.title }}
              </button>
              <button
                type="button"
                aria-label="경험 연결 해제"
                :disabled="editorLocked"
                @click="unlinkExperience(id)"
              >×</button>
            </span>
            <small v-if="!currentQuestion.experienceIds.length">
              오른쪽 자료 서랍에서 참고할 경험을 연결할 수 있습니다.
            </small>
          </div>
        </template>

        <div v-else class="question-empty-state">
          <span><Plus :size="22" /></span>
          <h2>아직 등록된 문항이 없습니다.</h2>
          <p>지원할 회사의 문항을 추가하고 답변 작성을 시작하세요.</p>
          <button class="primary" type="button" :disabled="editorLocked" @click="addQuestion">
            <Plus :size="17" />첫 문항 추가
          </button>
        </div>
      </section>

      <ResourceDrawer />
    </div>
    <ReferenceDetailSheet />
  </template>

  <div v-else class="empty">선택된 자소서가 없습니다. 보관함에서 자소서를 선택해주세요.</div>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { ArrowLeft, CheckCircle2, MessageSquareText, Save } from 'lucide-vue-next'
import { useWorkspace } from '../composables/useWorkspace.js'

const {
  users,
  currentUserId,
  activeReview,
  reviewApplication,
  commentsForReview,
  saveReviewComment,
  completeReview,
  go,
} = useWorkspace()

const drafts = reactive({})
const comments = computed(() =>
  activeReview.value ? commentsForReview(activeReview.value.id) : [],
)
const isReviewer = computed(
  () => activeReview.value?.reviewerId === currentUserId.value,
)
const canComment = computed(
  () => isReviewer.value && activeReview.value?.status === 'REQUESTED',
)
const requesterName = computed(
  () => users.value.find((user) => user.id === activeReview.value?.requesterId)?.name ?? '작성자',
)

function savedComment(questionId) {
  return comments.value.find((comment) => comment.questionId === questionId)
}

function commentValue(questionId) {
  if (Object.prototype.hasOwnProperty.call(drafts, questionId)) return drafts[questionId]
  return savedComment(questionId)?.content ?? ''
}

function updateDraft(questionId, event) {
  drafts[questionId] = event.target.value
}

function saveComment(questionId) {
  if (saveReviewComment(questionId, commentValue(questionId))) {
    drafts[questionId] = savedComment(questionId)?.content ?? ''
  }
}
</script>

<template>
  <template v-if="activeReview && reviewApplication">
    <button class="text-button" type="button" @click="go('reviews')">
      <ArrowLeft :size="16" />검토 요청함으로
    </button>

    <div class="page-heading review-detail-heading">
      <div>
        <div class="review-context">읽기 전용 · {{ reviewApplication.season }}</div>
        <h1>{{ reviewApplication.company }}</h1>
        <p>{{ reviewApplication.role }} · {{ requesterName }}님의 자소서</p>
      </div>
      <div class="actions">
        <span
          class="pill"
          :class="activeReview.status === 'COMPLETED' ? 'is-completed' : 'is-pending'"
        >
          {{ activeReview.status === 'COMPLETED' ? '검토 완료' : '검토 대기' }}
        </span>
        <button
          v-if="canComment"
          class="primary"
          type="button"
          @click="completeReview"
        >
          <CheckCircle2 :size="17" />검토 완료
        </button>
      </div>
    </div>

    <div class="review-readonly-note">
      <MessageSquareText :size="20" />
      <p v-if="isReviewer">자소서는 수정할 수 없습니다. 각 문항 오른쪽에 검토 메모를 남겨주세요.</p>
      <p v-else>검토자가 남긴 문항별 메모입니다. 내용을 참고해 자소서를 수정할 수 있습니다.</p>
    </div>

    <div class="review-question-list">
      <article
        v-for="(question, index) in reviewApplication.questions"
        :key="question.id"
        class="review-question-card"
      >
        <section>
          <span class="overline">문항 {{ index + 1 }}</span>
          <h2>{{ question.text || '문항이 입력되지 않았습니다.' }}</h2>
          <div class="review-answer">{{ question.answer || '작성된 답변이 없습니다.' }}</div>
        </section>

        <aside class="review-memo">
          <label :for="`review-comment-${question.id}`">검토 메모</label>
          <textarea
            v-if="canComment"
            :id="`review-comment-${question.id}`"
            :value="commentValue(question.id)"
            placeholder="좋았던 점이나 보완할 내용을 문항 단위로 남겨주세요."
            @input="updateDraft(question.id, $event)"
          ></textarea>
          <p v-else>{{ savedComment(question.id)?.content || '이 문항에 남긴 메모가 없습니다.' }}</p>
          <button
            v-if="canComment"
            class="secondary compact"
            type="button"
            @click="saveComment(question.id)"
          >
            <Save :size="15" />메모 저장
          </button>
        </aside>
      </article>
    </div>
  </template>

  <div v-else class="empty">선택된 검토 요청이 없습니다. 검토 요청함에서 항목을 선택해주세요.</div>
</template>

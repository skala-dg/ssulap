<script setup>
import { ChevronRight, Inbox, Send } from 'lucide-vue-next'
import { useWorkspace } from '../composables/useWorkspace.js'
import { formatSavedAt } from '../utils/applicationMetrics.js'

const {
  users,
  receivedReviewRequests,
  sentReviewRequests,
  getApplicationById,
  openReviewRequest,
} = useWorkspace()

const statusLabels = {
  REQUESTED: '검토 대기',
  COMPLETED: '검토 완료',
}

function userName(userId) {
  return users.value.find((user) => user.id === userId)?.name ?? '알 수 없는 사용자'
}
</script>

<template>
  <div class="page-heading">
    <div>
      <h1>검토 요청</h1>
      <p>받은 요청과 보낸 요청의 진행 상태를 확인합니다.</p>
    </div>
  </div>

  <section class="review-list-section">
    <div class="review-section-heading">
      <span class="folder-icon"><Inbox :size="21" /></span>
      <div><h2>받은 검토 요청</h2><p>내가 읽고 의견을 남길 자소서입니다.</p></div>
    </div>

    <div class="review-request-list">
      <button
        v-for="request in receivedReviewRequests"
        :key="request.id"
        class="review-request-card"
        type="button"
        @click="openReviewRequest(request)"
      >
        <div>
          <small>{{ userName(request.requesterId) }}님의 요청 · {{ formatSavedAt(request.requestedAt) }}</small>
          <h3>{{ getApplicationById(request.applicationId)?.company ?? '삭제된 자소서' }}</h3>
          <p>{{ getApplicationById(request.applicationId)?.role }}</p>
        </div>
        <span
          class="pill"
          :class="{
            'is-completed': request.status === 'COMPLETED',
            'is-pending': request.status === 'REQUESTED',
          }"
        >
          {{ statusLabels[request.status] }}
        </span>
        <ChevronRight :size="19" />
      </button>
      <p v-if="!receivedReviewRequests.length" class="inline-empty">받은 검토 요청이 없습니다.</p>
    </div>
  </section>

  <section class="review-list-section">
    <div class="review-section-heading">
      <span class="folder-icon"><Send :size="21" /></span>
      <div><h2>보낸 검토 요청</h2><p>검토자에게 전달한 자소서와 메모를 확인합니다.</p></div>
    </div>

    <div class="review-request-list">
      <button
        v-for="request in sentReviewRequests"
        :key="request.id"
        class="review-request-card"
        type="button"
        @click="openReviewRequest(request)"
      >
        <div>
          <small>{{ userName(request.reviewerId) }}님에게 요청 · {{ formatSavedAt(request.requestedAt) }}</small>
          <h3>{{ getApplicationById(request.applicationId)?.company ?? '삭제된 자소서' }}</h3>
          <p>{{ getApplicationById(request.applicationId)?.role }}</p>
        </div>
        <span
          class="pill"
          :class="{
            'is-completed': request.status === 'COMPLETED',
            'is-pending': request.status === 'REQUESTED',
          }"
        >
          {{ statusLabels[request.status] }}
        </span>
        <ChevronRight :size="19" />
      </button>
      <p v-if="!sentReviewRequests.length" class="inline-empty">보낸 검토 요청이 없습니다.</p>
    </div>
  </section>
</template>

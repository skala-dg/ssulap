<script setup>
import { ChevronRight, FilePenLine, Plus, Search } from 'lucide-vue-next'
import { useWorkspace } from '../composables/useWorkspace.js'
import { formatSavedAt, getApplicationProgress } from '../utils/applicationMetrics.js'

const { query, filteredApplications, newApplication, openApplication } = useWorkspace()
</script>

<template>
  <div class="page-heading">
    <div>
      <h1>자소서</h1>
      <p>회사별 문항과 답변을 작성하고 관리합니다.</p>
    </div>
    <button class="primary" @click="newApplication">
      <Plus :size="18" />새 자소서
    </button>
  </div>

  <label class="search">
    <Search :size="17" />
    <input v-model="query" placeholder="회사 또는 지원 직무 검색" aria-label="자소서 검색" />
  </label>

  <div class="essay-list">
    <button
      v-for="application in filteredApplications"
      :key="application.id"
      class="essay-row"
      @click="openApplication(application)"
    >
      <span class="folder-icon"><FilePenLine /></span>
      <div>
        <small>{{ application.season }}</small>
        <h2>{{ application.company }}</h2>
        <p>{{ application.role }}</p>
        <div class="application-progress">
          <div class="progress-label">
            <span>
              {{ getApplicationProgress(application).completed }} /
              {{ getApplicationProgress(application).total }}문항 작성
            </span>
            <span>{{ getApplicationProgress(application).percent }}%</span>
          </div>
          <div class="progress-track" aria-hidden="true">
            <span :style="{ width: `${getApplicationProgress(application).percent}%` }"></span>
          </div>
          <div class="application-meta">
            <span>경험 {{ getApplicationProgress(application).connectedExperiences }}개</span>
            <span v-if="getApplicationProgress(application).empty">
              빈 문항 {{ getApplicationProgress(application).empty }}개
            </span>
            <span v-if="getApplicationProgress(application).overLimit" class="meta-error">
              초과 {{ getApplicationProgress(application).overLimit }}개
            </span>
            <span>최근 수정 {{ formatSavedAt(application.updatedAt) }}</span>
          </div>
        </div>
      </div>
      <span
        class="pill"
        :class="{
          'is-draft': application.status === '작성 중',
          'is-completed': application.status === '작성 완료',
          'is-submitted': application.status === '제출 완료',
        }"
      >
        {{ application.status }}
      </span>
      <ChevronRight />
    </button>

    <p v-if="!filteredApplications.length" class="empty">
      자소서가 없습니다. 새 자소서를 만들어보세요.
    </p>
  </div>
</template>

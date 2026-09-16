<script setup>
import { ChevronRight, FilePenLine, Plus, Search } from 'lucide-vue-next'
import { useWorkspace } from '../composables/useWorkspace.js'

const { query, filteredApplications, newApplication, openApplication } = useWorkspace()
</script>

<template>
  <div class="page-heading">
    <div>
      <div class="eyebrow">MY APPLICATIONS</div>
      <h1>다음 기회를 준비하는 서랍<span>.</span></h1>
      <p>회사마다 다른 질문에, 나의 경험으로 답해보세요.</p>
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
      </div>
      <span class="pill">{{ application.status }}</span>
      <ChevronRight />
    </button>

    <p v-if="!filteredApplications.length" class="empty">
      자소서가 없습니다. 새 자소서를 만들어보세요.
    </p>
  </div>
</template>

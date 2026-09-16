<script setup>
import {
  Archive,
  BookOpen,
  BriefcaseBusiness,
  LogOut,
  MessageSquareText,
  UserRound,
} from 'lucide-vue-next'
import { useWorkspace } from '../../composables/useWorkspace.js'

const { page, experiences, currentUser, pendingReviewCount, go, logout } = useWorkspace()

const navigation = [
  { key: 'profile', label: '내 기본 이력', icon: UserRound },
  { key: 'careers', label: '내 경력', icon: BriefcaseBusiness },
  { key: 'experiences', label: '내 경험', icon: BookOpen },
  { key: 'essays', label: '자소서 보관함', icon: Archive },
  { key: 'reviews', label: '검토 요청함', icon: MessageSquareText },
]

function isSelected(key) {
  return (
    page.value === key ||
    (page.value === 'editor' && key === 'essays') ||
    (page.value === 'review' && key === 'reviews')
  )
}
</script>

<template>
  <aside class="sidebar">
    <a class="brand" href="#" @click.prevent="go('experiences')">
      <span class="brand-icon"><Archive :size="23" /></span>
      써랍<span class="brand-dot">.</span>
    </a>

    <div class="workspace-label">MY WORKSPACE</div>

    <nav>
      <button
        v-for="item in navigation"
        :key="item.key"
        :class="{ selected: isSelected(item.key) }"
        @click="go(item.key)"
      >
        <component :is="item.icon" :size="19" />
        {{ item.label }}
        <span v-if="item.key === 'experiences'" class="count">
          {{ experiences.length }}
        </span>
        <span v-if="item.key === 'reviews' && pendingReviewCount" class="count review-count">
          {{ pendingReviewCount }}
        </span>
      </button>
    </nav>

    <div class="side-note">
      <span class="note-line"></span>
      <p>해온 일을 정리하고,<br />필요할 때 꺼내 쓰세요.</p>
    </div>

    <div class="user">
      <span class="avatar">{{ currentUser?.name.at(-1) }}</span>
      <div>
        <b>{{ currentUser?.name }}</b>
        <small>로그인 계정</small>
      </div>
      <button class="logout-button" type="button" aria-label="로그아웃" title="로그아웃" @click="logout">
        <LogOut :size="17" />
      </button>
    </div>
  </aside>
</template>

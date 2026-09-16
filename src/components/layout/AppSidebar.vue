<script setup>
import {
  Archive,
  BookOpen,
  BriefcaseBusiness,
  UserRound,
} from 'lucide-vue-next'
import { useWorkspace } from '../../composables/useWorkspace.js'

const { page, experiences, go } = useWorkspace()

const navigation = [
  { key: 'profile', label: '내 기본 이력', icon: UserRound },
  { key: 'careers', label: '내 경력', icon: BriefcaseBusiness },
  { key: 'experiences', label: '내 경험', icon: BookOpen },
  { key: 'essays', label: '자소서 보관함', icon: Archive },
]

function isSelected(key) {
  return page.value === key || (page.value === 'editor' && key === 'essays')
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
      </button>
    </nav>

    <div class="side-note">
      <span class="note-line"></span>
      <p>해온 일을 차곡차곡.<br />쓸 때는 나답게.</p>
      <small>나의 다음 이야기를 위한 서랍</small>
    </div>

    <div class="user">
      <span class="avatar">나</span>
      <div>
        <b>나의 작업 공간</b>
        <small>개인 전용</small>
      </div>
    </div>
  </aside>
</template>

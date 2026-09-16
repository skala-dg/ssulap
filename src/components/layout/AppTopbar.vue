<script setup>
import { computed } from 'vue'
import { ChevronRight } from 'lucide-vue-next'
import { useWorkspace } from '../../composables/useWorkspace.js'

const { page } = useWorkspace()

const pageLabels = {
  profile: '내 기본 이력',
  careers: '내 경력',
  experiences: '내 경험',
  essays: '자소서 보관함',
  editor: '자소서 작성',
  reviews: '검토 요청함',
  review: '자소서 검토',
}

const currentLabel = computed(() => pageLabels[page.value])
</script>

<template>
  <header class="topbar">
    <span>나의 써랍 <ChevronRight :size="14" /> {{ currentLabel }}</span>
  </header>
</template>

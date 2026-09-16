<script setup>
import { Trash2, X } from 'lucide-vue-next'
import { useWorkspace } from '../../composables/useWorkspace.js'

const {
  detail,
  closeExperienceDetail,
  editExperience,
  requestExperienceDelete,
} = useWorkspace()

const detailFields = [
  ['situation', '상황·과제'],
  ['action', '내 역할·행동'],
  ['result', '결과'],
  ['lesson', '배운 점'],
  ['memo', '협업 회고'],
]

function handleEdit() {
  editExperience(detail.value)
  closeExperienceDetail()
}
</script>

<template>
  <div v-if="detail" class="overlay" @click.self="closeExperienceDetail">
    <section class="dialog detail-dialog" role="dialog" aria-modal="true" aria-label="경험 상세">
      <button class="close" aria-label="닫기" @click="closeExperienceDetail"><X /></button>

      <span class="eyebrow">{{ detail.type }} · {{ detail.period }}</span>
      <h2>{{ detail.title }}</h2>
      <div class="card-tags">
        <span v-for="tag in detail.tags" :key="tag">#{{ tag }}</span>
      </div>

      <div v-for="[key, label] in detailFields" :key="key" class="detail-block">
        <h3>{{ label }}</h3>
        <p>{{ detail[key] || '아직 기록하지 않았습니다.' }}</p>
      </div>

      <div class="actions">
        <button class="danger text-button" @click="requestExperienceDelete">
          <Trash2 :size="16" />삭제
        </button>
        <button class="primary" @click="handleEdit">수정하기</button>
      </div>
    </section>
  </div>
</template>

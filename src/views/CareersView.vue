<script setup>
import { BriefcaseBusiness, Plus } from 'lucide-vue-next'
import { useWorkspace } from '../composables/useWorkspace.js'

const { careers, editCareer } = useWorkspace()
</script>

<template>
  <div class="page-heading">
    <div>
      <div class="eyebrow">MY CAREER</div>
      <h1>일하며 쌓아온 시간<span>.</span></h1>
      <p>인턴부터 첫 직장까지, 나의 경력을 정리해보세요.</p>
    </div>
    <button class="primary" @click="editCareer()">
      <Plus :size="18" />경력 추가
    </button>
  </div>

  <div v-for="career in careers" :key="career.id" class="career-card">
    <span class="folder-icon"><BriefcaseBusiness /></span>
    <div>
      <span class="pill">{{ career.employment }}</span>
      <h2>{{ career.company }}</h2>
      <p>
        {{ career.role }} · {{ career.start }} — {{ career.current ? '재직 중' : career.end }}
      </p>
      <p>{{ career.duties }}</p>
    </div>
    <button class="secondary" @click="editCareer(career)">수정</button>
  </div>

  <p v-if="!careers.length" class="empty">첫 경력을 등록해보세요.</p>
</template>

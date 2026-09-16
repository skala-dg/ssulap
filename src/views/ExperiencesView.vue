<script setup>
import {
  ArrowUpRight,
  ChevronRight,
  FolderOpen,
  Plus,
  Search,
} from 'lucide-vue-next'
import { useWorkspace } from '../composables/useWorkspace.js'

const {
  experiences,
  filteredExperiences,
  query,
  selectedTag,
  tags,
  editExperience,
  openExperienceDetail,
} = useWorkspace()
</script>

<template>
  <div class="page-heading">
    <div>
      <h1>경험</h1>
      <p>프로젝트와 활동에서 맡은 일과 결과를 기록합니다.</p>
    </div>
    <button class="primary" @click="editExperience()">
      <Plus :size="18" />경험 기록하기
    </button>
  </div>

  <section class="overview">
    <div>
      <span class="overline">등록한 경험</span>
      <strong>{{ String(experiences.length).padStart(2, '0') }}<small>개의 이야기</small></strong>
    </div>
    <div>
      <span class="overline">주요 태그</span>
      <div class="keywords">
        <span
          v-for="keyword in [...new Set(experiences.flatMap((item) => item.tags))].slice(0, 5)"
          :key="keyword"
        >
          {{ keyword }}
        </span>
      </div>
    </div>
  </section>

  <div class="section-heading">
    <h2>나의 경험 <span>{{ experiences.length }}</span></h2>
    <label class="search">
      <Search :size="17" />
      <input v-model="query" placeholder="경험이나 키워드 검색" aria-label="경험 검색" />
    </label>
  </div>

  <div class="filters">
    <button
      v-for="item in tags"
      :key="item"
      :class="{ active: selectedTag === item }"
      @click="selectedTag = item"
    >
      {{ item }}
    </button>
  </div>

  <div class="experience-grid">
    <button
      v-for="experience in filteredExperiences"
      :key="experience.id"
      class="experience-card"
      @click="openExperienceDetail(experience)"
    >
      <div class="card-top">
        <span class="folder-icon"><FolderOpen :size="24" /></span>
        <span>{{ experience.type }}</span>
        <ArrowUpRight :size="19" />
      </div>
      <small>{{ experience.period }}</small>
      <h3>{{ experience.title }}</h3>
      <p>{{ experience.overview || experience.situation }}</p>
      <div class="card-tags">
        <span v-for="tag in experience.tags" :key="tag"># {{ tag }}</span>
      </div>
      <footer>경험 펼쳐보기 <ChevronRight :size="16" /></footer>
    </button>

    <button class="add-card" @click="editExperience()">
      <span><Plus :size="24" /></span>
      <b>경험 추가</b>
      <p>프로젝트, 인턴, 동아리 활동 등을 기록합니다.</p>
    </button>
  </div>

  <p v-if="!filteredExperiences.length" class="empty">
    조건에 맞는 경험이 없습니다. 검색어나 태그를 바꿔보세요.
  </p>
</template>

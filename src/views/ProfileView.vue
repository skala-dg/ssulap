<script setup>
import { Check, Copy } from 'lucide-vue-next'
import CertificationsSection from '../components/profile/CertificationsSection.vue'
import CourseList from '../components/profile/CourseList.vue'
import LanguageScoresSection from '../components/profile/LanguageScoresSection.vue'
import { useWorkspace } from '../composables/useWorkspace.js'

const { profile, profileLabels, copyProfile, saveProfileSection } = useWorkspace()

const educationFields = ['school', 'major', 'education', 'start', 'end', 'gpa', 'scale']
const militaryFields = ['military', 'branch', 'rank', 'militaryStart', 'militaryEnd']
const supportFields = ['veteran', 'disability', 'details']
</script>

<template>
  <div class="page-heading">
    <div>
      <div class="eyebrow">MY PROFILE</div>
      <h1>한 번 정리하고, 필요할 때 꺼내요<span>.</span></h1>
      <p>지원할 때마다 찾던 기본 이력을 한곳에서 관리하세요.</p>
    </div>
    <button class="secondary" @click="copyProfile"><Copy :size="17" />이력 복사</button>
  </div>

  <form class="profile-form" @submit.prevent>
    <section class="form-section">
      <div class="form-section-title">
        <div>
          <h2>학력</h2>
          <p class="muted">학교 정보와 지원서에 활용할 수강 과목을 함께 관리하세요.</p>
        </div>
      </div>

      <div class="form-grid">
        <label v-for="field in educationFields" :key="field">
          {{ profileLabels[field] }}
          <select v-if="field === 'education'" v-model="profile[field]">
            <option v-for="value in ['재학', '휴학', '졸업 예정', '졸업']" :key="value">
              {{ value }}
            </option>
          </select>
          <input
            v-else
            v-model="profile[field]"
            :type="['start', 'end'].includes(field) ? 'month' : 'text'"
            :placeholder="`${profileLabels[field]} 입력`"
          />
        </label>
      </div>

      <CourseList />

      <div class="section-actions">
        <button class="primary" type="button" @click="saveProfileSection('학력')">
          <Check :size="17" />학력 저장
        </button>
      </div>
    </section>

    <CertificationsSection />
    <LanguageScoresSection />

    <section class="form-section">
      <h2>병역사항</h2>
      <div class="form-grid">
        <label v-for="field in militaryFields" :key="field">
          {{ profileLabels[field] }}
          <select v-if="field === 'military'" v-model="profile[field]">
            <option
              v-for="value in ['미입력', '해당 없음', '미필', '복무 중', '군필', '면제']"
              :key="value"
            >
              {{ value }}
            </option>
          </select>
          <input
            v-else
            v-model="profile[field]"
            :type="['militaryStart', 'militaryEnd'].includes(field) ? 'month' : 'text'"
            :placeholder="`${profileLabels[field]} 입력`"
          />
        </label>
      </div>
      <div class="section-actions">
        <button class="primary" type="button" @click="saveProfileSection('병역사항')">
          <Check :size="17" />병역사항 저장
        </button>
      </div>
    </section>

    <section class="form-section">
      <h2>보훈·장애사항</h2>
      <p class="muted">선택 입력 항목입니다. AI 경험 추천에 사용되지 않습니다.</p>
      <div class="form-grid">
        <label v-for="field in supportFields" :key="field">
          {{ profileLabels[field] }}
          <select v-if="['veteran', 'disability'].includes(field)" v-model="profile[field]">
            <option v-for="value in ['미입력', '대상', '비대상']" :key="value">
              {{ value }}
            </option>
          </select>
          <textarea
            v-else
            v-model="profile[field]"
            :placeholder="`${profileLabels[field]} 입력`"
          ></textarea>
        </label>
      </div>
      <div class="section-actions">
        <button class="primary" type="button" @click="saveProfileSection('보훈·장애사항')">
          <Check :size="17" />보훈·장애사항 저장
        </button>
      </div>
    </section>
  </form>
</template>

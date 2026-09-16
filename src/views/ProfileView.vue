<script setup>
import { Check, Pencil } from 'lucide-vue-next'
import CertificationsSection from '../components/profile/CertificationsSection.vue'
import CourseList from '../components/profile/CourseList.vue'
import LanguageScoresSection from '../components/profile/LanguageScoresSection.vue'
import { useWorkspace } from '../composables/useWorkspace.js'

const {
  profile,
  profileLabels,
  profileSectionLocks,
  saveProfileSection,
  editProfileSection,
} = useWorkspace()

const educationFields = ['school', 'major', 'education', 'start', 'end', 'gpa', 'scale']
const militaryFields = ['military', 'branch', 'rank', 'militaryStart', 'militaryEnd']
const supportFields = ['veteran', 'disability', 'details']

function handleMilitaryChange() {
  if (profile.value.military !== '해당 없음') return
  profile.value.branch = ''
  profile.value.rank = ''
  profile.value.militaryStart = ''
  profile.value.militaryEnd = ''
}
</script>

<template>
  <div class="page-heading">
    <div>
      <h1>기본 이력</h1>
      <p>지원서에 자주 사용하는 정보를 구역별로 저장하고 관리합니다.</p>
    </div>
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
          <div v-if="profileSectionLocks.education" class="readonly-field">
            {{ profile[field] || '미입력' }}
          </div>
          <select v-else-if="field === 'education'" v-model="profile[field]">
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
        <button
          v-if="!profileSectionLocks.education"
          class="primary"
          type="button"
          @click="saveProfileSection('education', '학력')"
        >
          <Check :size="17" />학력 저장
        </button>
        <button v-else class="secondary" type="button" @click="editProfileSection('education')">
          <Pencil :size="16" />학력 수정
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
          <div v-if="profileSectionLocks.military" class="readonly-field">
            {{ profile[field] || '미입력' }}
          </div>
          <select
            v-else-if="field === 'military'"
            v-model="profile[field]"
            @change="handleMilitaryChange"
          >
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
            :disabled="profile.military === '해당 없음'"
            :placeholder="`${profileLabels[field]} 입력`"
          />
        </label>
      </div>
      <div class="section-actions">
        <button
          v-if="!profileSectionLocks.military"
          class="primary"
          type="button"
          @click="saveProfileSection('military', '병역사항')"
        >
          <Check :size="17" />병역사항 저장
        </button>
        <button v-else class="secondary" type="button" @click="editProfileSection('military')">
          <Pencil :size="16" />병역사항 수정
        </button>
      </div>
    </section>

    <section class="form-section">
      <h2>보훈·장애사항</h2>
      <p class="muted">선택 입력 항목입니다. AI 경험 추천에 사용되지 않습니다.</p>
      <div class="form-grid">
        <label v-for="field in supportFields" :key="field">
          {{ profileLabels[field] }}
          <div v-if="profileSectionLocks.support" class="readonly-field">
            {{ profile[field] || '미입력' }}
          </div>
          <select v-else-if="['veteran', 'disability'].includes(field)" v-model="profile[field]">
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
        <button
          v-if="!profileSectionLocks.support"
          class="primary"
          type="button"
          @click="saveProfileSection('support', '보훈·장애사항')"
        >
          <Check :size="17" />보훈·장애사항 저장
        </button>
        <button v-else class="secondary" type="button" @click="editProfileSection('support')">
          <Pencil :size="16" />보훈·장애사항 수정
        </button>
      </div>
    </section>
  </form>
</template>

<script setup>
import { Check, Pencil, Plus, Trash2 } from 'lucide-vue-next'
import { useWorkspace } from '../../composables/useWorkspace.js'

const {
  languageScores,
  profileSectionLocks,
  addLanguageScore,
  removeLanguageScore,
  saveProfileSection,
  editProfileSection,
} = useWorkspace()
</script>

<template>
  <section class="form-section">
    <div class="form-section-title">
      <div>
        <h2>어학 성적</h2>
        <p class="muted">시험별 점수와 유효기간을 관리하세요.</p>
      </div>
      <button
        v-if="!profileSectionLocks.languageScores"
        class="secondary compact"
        type="button"
        @click="addLanguageScore"
      >
        <Plus :size="16" />어학 성적 추가
      </button>
    </div>

    <div class="repeat-list">
      <div v-for="(language, index) in languageScores" :key="language.id" class="repeat-card">
        <div class="repeat-card-title">
          <b>어학 성적 {{ index + 1 }}</b>
          <button
            v-if="!profileSectionLocks.languageScores"
            class="icon-button danger"
            type="button"
            :aria-label="`${index + 1}번 어학 성적 삭제`"
            @click="removeLanguageScore(language.id)"
          >
            <Trash2 :size="17" />
          </button>
        </div>
        <div class="form-grid">
          <label>
            어학 시험명
            <div v-if="profileSectionLocks.languageScores" class="readonly-field">{{ language.name || '미입력' }}</div>
            <input v-else v-model="language.name" placeholder="어학 시험명 입력" />
          </label>
          <label>
            점수·등급
            <div v-if="profileSectionLocks.languageScores" class="readonly-field">{{ language.score || '미입력' }}</div>
            <input v-else v-model="language.score" placeholder="점수 또는 등급 입력" />
          </label>
          <label>
            응시일
            <div v-if="profileSectionLocks.languageScores" class="readonly-field">{{ language.testedOn || '미입력' }}</div>
            <input v-else v-model="language.testedOn" type="date" />
          </label>
          <label>
            유효기간
            <div v-if="profileSectionLocks.languageScores" class="readonly-field">{{ language.expiresOn || '미입력' }}</div>
            <input v-else v-model="language.expiresOn" type="date" />
          </label>
        </div>
      </div>

      <p v-if="!languageScores.length" class="inline-empty">
        등록된 어학 성적이 없습니다. 어학 성적 추가 버튼을 눌러 입력하세요.
      </p>
    </div>

    <div class="section-actions">
      <button
        v-if="!profileSectionLocks.languageScores"
        class="primary"
        type="button"
        @click="saveProfileSection('languageScores', '어학 성적')"
      >
        <Check :size="17" />어학 성적 저장
      </button>
      <button v-else class="secondary" type="button" @click="editProfileSection('languageScores')">
        <Pencil :size="16" />어학 성적 수정
      </button>
    </div>
  </section>
</template>

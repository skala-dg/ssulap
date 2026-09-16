<script setup>
import { Check, Plus, Trash2 } from 'lucide-vue-next'
import { useWorkspace } from '../../composables/useWorkspace.js'

const {
  certifications,
  addCertification,
  removeCertification,
  saveProfileSection,
} = useWorkspace()
</script>

<template>
  <section class="form-section">
    <div class="form-section-title">
      <div>
        <h2>자격증</h2>
        <p class="muted">보유한 자격증을 여러 개 등록할 수 있습니다.</p>
      </div>
      <button class="secondary compact" type="button" @click="addCertification">
        <Plus :size="16" />자격증 추가
      </button>
    </div>

    <div class="repeat-list">
      <div
        v-for="(certificate, index) in certifications"
        :key="certificate.id"
        class="repeat-card"
      >
        <div class="repeat-card-title">
          <b>자격증 {{ index + 1 }}</b>
          <button
            class="icon-button danger"
            type="button"
            :aria-label="`${index + 1}번 자격증 삭제`"
            @click="removeCertification(certificate.id)"
          >
            <Trash2 :size="17" />
          </button>
        </div>
        <div class="form-grid">
          <label>자격증명<input v-model="certificate.name" placeholder="자격증명 입력" /></label>
          <label>발급기관<input v-model="certificate.issuer" placeholder="발급기관 입력" /></label>
          <label>취득일<input v-model="certificate.acquiredOn" type="date" /></label>
          <label>자격번호<input v-model="certificate.number" placeholder="자격번호 입력" /></label>
        </div>
      </div>

      <p v-if="!certifications.length" class="inline-empty">
        등록된 자격증이 없습니다. 자격증 추가 버튼을 눌러 입력하세요.
      </p>
    </div>

    <div class="section-actions">
      <button class="primary" type="button" @click="saveProfileSection('자격증')">
        <Check :size="17" />자격증 저장
      </button>
    </div>
  </section>
</template>

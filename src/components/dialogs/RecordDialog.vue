<script setup>
import { computed } from 'vue'
import { X } from 'lucide-vue-next'
import { useWorkspace } from '../../composables/useWorkspace.js'

const {
  modal,
  draft,
  careers,
  closeModal,
  removeExperience,
  submitModal,
} = useWorkspace()

const modalTitle = computed(() => {
  if (modal.value === 'experience') return '경험 기록하기'
  if (modal.value === 'career') return '경력 기록하기'
  return '새 자소서 만들기'
})

const submitLabel = computed(() => (modal.value === 'application' ? '작성 시작' : '저장'))

const experienceFields = [
  ['situation', '상황·과제'],
  ['action', '내 역할·행동'],
  ['result', '결과'],
  ['lesson', '배운 점'],
  ['memo', '협업 회고 메모 (선택)'],
]
</script>

<template>
  <div v-if="modal" class="overlay modal-layer" @click.self="closeModal">
    <section class="dialog" role="dialog" aria-modal="true" aria-label="정보 입력">
      <button class="close" aria-label="닫기" @click="closeModal"><X /></button>

      <template v-if="modal === 'delete'">
        <h2>경험을 삭제할까요?</h2>
        <p>자소서와의 연결도 해제됩니다. 작성한 답변은 유지됩니다.</p>
        <div class="actions">
          <button class="secondary" @click="closeModal">취소</button>
          <button class="primary" @click="removeExperience">삭제</button>
        </div>
      </template>

      <form v-else @submit.prevent="submitModal">
        <div class="eyebrow">YOUR NEXT STORY</div>
        <h2>{{ modalTitle }}</h2>

        <template v-if="modal === 'experience'">
          <label>
            경험 제목 *
            <input v-model="draft.title" required placeholder="어떤 경험을 하셨나요?" />
          </label>
          <div class="form-grid">
            <label>
              활동 유형
              <input v-model="draft.type" placeholder="프로젝트, 인턴, 동아리 등" />
            </label>
            <label>
              기간
              <input v-model="draft.period" placeholder="2025.03 — 2025.06" />
            </label>
          </div>
          <label>
            관련 경력
            <select v-model="draft.career">
              <option value="">연결하지 않음</option>
              <option v-for="career in careers" :key="career.id">{{ career.company }}</option>
            </select>
          </label>
          <label v-for="[key, label] in experienceFields" :key="key">
            {{ label }}
            <textarea
              v-model="draft[key]"
              :placeholder="
                key === 'memo'
                  ? '함께 일한 사람의 역할, 의견 차이, 도움받은 점 등을 기록해보세요.'
                  : ''
              "
            ></textarea>
          </label>
          <label>
            경험 개요
            <small class="field-help">경험의 전체 맥락, 사용 기술, 진행 방식을 자유롭게 정리하세요.</small>
            <textarea
              v-model="draft.overview"
              class="experience-overview-input"
              placeholder="예: 교내 급식 서비스를 개발한 프로젝트입니다. C#과 JavaScript로 클라이언트와 서버를 구현했습니다."
            ></textarea>
          </label>
          <label>
            태그
            <input v-model="draft.tagText" placeholder="협업, 소통 (쉼표로 구분)" />
          </label>
        </template>

        <template v-if="modal === 'career'">
          <label>회사명 *<input v-model="draft.company" required /></label>
          <div class="form-grid">
            <label>
              근무 형태
              <select v-model="draft.employment">
                <option>인턴</option>
                <option>정규직</option>
                <option>계약직</option>
                <option>아르바이트</option>
                <option>기타</option>
              </select>
            </label>
            <label>부서·직무<input v-model="draft.role" /></label>
            <label>시작일<input v-model="draft.start" type="month" /></label>
            <label>
              종료일
              <input v-model="draft.end" type="month" :disabled="draft.current" />
            </label>
          </div>
          <label class="checkbox">
            <input v-model="draft.current" type="checkbox" />재직 중
          </label>
          <label>담당 업무<textarea v-model="draft.duties"></textarea></label>
        </template>

        <template v-if="modal === 'application'">
          <label>회사명 *<input v-model="draft.company" required /></label>
          <label>지원 직무 *<input v-model="draft.role" required /></label>
          <label>지원 시기<input v-model="draft.season" /></label>
        </template>

        <div class="dialog-actions">
          <button type="button" class="secondary" @click="closeModal">취소</button>
          <button class="primary" type="submit">{{ submitLabel }}</button>
        </div>
      </form>
    </section>
  </div>
</template>

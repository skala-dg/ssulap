<script setup>
import { ArrowLeft, BookOpen, Plus, Sparkles } from 'lucide-vue-next'
import { useWorkspace } from '../composables/useWorkspace.js'

const {
  activeApplication,
  questionIndex,
  currentQuestion,
  experiences,
  recommendationVisible,
  recommendedExperiences,
  notify,
  go,
  addQuestion,
  selectQuestion,
  recommendExperiences,
  connectExperience,
  unlinkExperience,
  openExperienceDetail,
} = useWorkspace()
</script>

<template>
  <template v-if="activeApplication && currentQuestion">
    <button class="text-button" @click="go('essays')">
      <ArrowLeft :size="16" />보관함으로
    </button>

    <div class="page-heading editor-heading">
      <div>
        <div class="eyebrow">{{ activeApplication.season }} · {{ activeApplication.role }}</div>
        <h1>{{ activeApplication.company }}</h1>
      </div>
      <div class="actions">
        <select v-model="activeApplication.status">
          <option>작성 중</option>
          <option>작성 완료</option>
          <option>제출 완료</option>
        </select>
        <button
          class="primary"
          @click="notify('작성 내용을 반영했습니다. 새로고침하면 초기화됩니다.')"
        >
          저장
        </button>
      </div>
    </div>

    <div class="editor-layout">
      <section class="editor-panel">
        <div class="question-tabs">
          <button
            v-for="(_, index) in activeApplication.questions"
            :key="index"
            :class="{ active: index === questionIndex }"
            @click="selectQuestion(index)"
          >
            문항 {{ index + 1 }}
          </button>
          <button aria-label="문항 추가" @click="addQuestion"><Plus :size="16" /></button>
        </div>

        <label>
          자소서 문항
          <textarea
            v-model="currentQuestion.text"
            class="question-input"
            placeholder="지원할 회사의 문항을 입력해주세요."
          ></textarea>
        </label>
        <label class="limit">
          글자 수 제한
          <input v-model="currentQuestion.limit" type="number" min="1" max="20000" />
        </label>
        <label>
          나의 답변
          <textarea
            v-model="currentQuestion.answer"
            class="answer-input"
            placeholder="경험을 참고하며 나의 언어로 작성해보세요."
          ></textarea>
        </label>
        <div
          class="char-count"
          :class="{ error: currentQuestion.answer.length > currentQuestion.limit }"
        >
          공백 포함 {{ currentQuestion.answer.length }} / {{ currentQuestion.limit }}자
        </div>

        <div class="linked">
          참고한 경험
          <span v-for="id in currentQuestion.experienceIds" :key="id">
            {{ experiences.find((experience) => experience.id === id)?.title }}
            <button aria-label="경험 연결 해제" @click="unlinkExperience(id)">×</button>
          </span>
        </div>
      </section>

      <aside class="recommend-panel">
        <div class="section-heading">
          <h2>경험 꺼내보기</h2>
          <BookOpen :size="19" />
        </div>
        <p>문항에 어울리는 내 경험을 찾아보세요.</p>
        <button class="primary full" @click="recommendExperiences">
          <Sparkles :size="17" />경험 추천받기
        </button>
        <small class="simulation">
          시연용 추천 · 문항과 태그를 비교합니다.<br />실제 AI는 연결되지 않았습니다.
        </small>
        <button
          v-if="recommendationVisible"
          class="text-button"
          @click="recommendationVisible = false"
        >
          모든 경험 보기
        </button>
        <p v-if="recommendationVisible && !recommendedExperiences.length" class="empty">
          일치하는 키워드가 없습니다. 모든 경험에서 직접 선택해보세요.
        </p>

        <article
          v-for="experience in recommendationVisible ? recommendedExperiences : experiences"
          :key="experience.id"
          class="recommend-card"
        >
          <small>{{ experience.type }}</small>
          <h3>{{ experience.title }}</h3>
          <p v-if="recommendationVisible">
            문항에 포함된 ‘{{
              experience.tags.filter((tag) => currentQuestion.text.includes(tag)).join(', ')
            }}’ 키워드와 연결된 경험입니다.
          </p>
          <div class="card-tags">
            <span v-for="tag in experience.tags" :key="tag">#{{ tag }}</span>
          </div>
          <div class="actions">
            <button class="text-button" @click="openExperienceDetail(experience)">상세 보기</button>
            <button class="secondary" @click="connectExperience(experience)">
              {{ currentQuestion.experienceIds.includes(experience.id) ? '연결됨' : '참고로 선택' }}
            </button>
          </div>
        </article>

        <div v-if="recommendationVisible && recommendedExperiences.length" class="prompt-note">
          <b>한 번 더 떠올려보세요</b>
          <p>그 상황에서 본인이 직접 한 행동은 무엇인가요? 그 행동으로 무엇이 달라졌나요?</p>
        </div>
      </aside>
    </div>
  </template>
</template>

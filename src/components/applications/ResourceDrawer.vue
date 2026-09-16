<script setup>
import { computed, ref } from 'vue'
import {
  BookOpen,
  BriefcaseBusiness,
  Check,
  Copy,
  MessageSquareText,
  Search,
  Sparkles,
} from 'lucide-vue-next'
import { useWorkspace } from '../../composables/useWorkspace.js'

const {
  experiences,
  careers,
  users,
  activeApplication,
  currentQuestion,
  reviewRequests,
  reviewComments,
  recommendationVisible,
  recommendedExperiences,
  notify,
  go,
  recommendExperiences,
  showAllExperiences,
  connectExperience,
  openReferenceDetail,
} = useWorkspace()

const activeTab = ref('experiences')
const resourceQuery = ref('')

const tabs = [
  { key: 'experiences', label: '경험', icon: BookOpen },
  { key: 'careers', label: '경력', icon: BriefcaseBusiness },
  { key: 'feedback', label: '검토 메모', icon: MessageSquareText },
]

const visibleExperiences = computed(() => {
  const source = recommendationVisible.value
    ? recommendedExperiences.value
    : experiences.value
  const keyword = resourceQuery.value.trim().toLowerCase()

  if (!keyword) return source
  return source.filter((experience) =>
    [
      experience.title,
      experience.type,
      experience.period,
      experience.situation,
      experience.overview,
      ...(experience.tags ?? []),
    ]
      .join(' ')
      .toLowerCase()
      .includes(keyword),
  )
})

const visibleCareers = computed(() => {
  const keyword = resourceQuery.value.trim().toLowerCase()
  if (!keyword) return careers.value

  return careers.value.filter((career) =>
    [career.company, career.employment, career.role, career.duties]
      .join(' ')
      .toLowerCase()
      .includes(keyword),
  )
})

const currentQuestionFeedback = computed(() => {
  if (!activeApplication.value || !currentQuestion.value) return []

  return reviewRequests.value
    .filter(
      (request) =>
        request.applicationId === activeApplication.value.id &&
        request.status === 'COMPLETED',
    )
    .flatMap((request) =>
      reviewComments.value
        .filter(
          (comment) =>
            comment.reviewRequestId === request.id &&
            comment.questionId === currentQuestion.value.id,
        )
        .map((comment) => ({
          ...comment,
          reviewerName:
            users.value.find((user) => user.id === request.reviewerId)?.name ?? '검토자',
          completedAt: request.completedAt,
        })),
    )
    .sort((left, right) => new Date(right.completedAt) - new Date(left.completedAt))
})

function selectTab(tab) {
  activeTab.value = tab
  resourceQuery.value = ''
}

async function copyResource(label, lines) {
  const text = lines.filter(Boolean).join('\n')
  if (!text) {
    notify('복사할 내용이 없습니다.')
    return
  }

  try {
    await navigator.clipboard.writeText(text)
    notify(`${label} 내용을 복사했습니다.`)
  } catch {
    notify('브라우저에서 클립보드 접근을 허용해주세요.')
  }
}

function copyExperience(experience) {
  copyResource('경험', [
    experience.title,
    `${experience.type} · ${experience.period}`,
    experience.situation && `상황·과제: ${experience.situation}`,
    experience.action && `내 역할·행동: ${experience.action}`,
    experience.result && `결과: ${experience.result}`,
    experience.lesson && `배운 점: ${experience.lesson}`,
    experience.overview && `경험 개요: ${experience.overview}`,
  ])
}

function copyCareer(career) {
  copyResource('경력', [
    career.company,
    `${career.employment} · ${career.role}`,
    `${career.start} — ${career.current ? '재직 중' : career.end}`,
    career.duties && `담당 업무: ${career.duties}`,
  ])
}

</script>

<template>
  <aside class="resource-drawer" aria-label="자소서 참고 자료 서랍">
    <div class="resource-heading">
      <div>
        <h2>참고 자료</h2>
      </div>
      <BookOpen :size="20" />
    </div>

    <div class="resource-tabs" role="tablist" aria-label="참고 자료 종류">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        type="button"
        role="tab"
        :aria-selected="activeTab === tab.key"
        :class="{ active: activeTab === tab.key }"
        @click="selectTab(tab.key)"
      >
        <component :is="tab.icon" :size="15" />{{ tab.label }}
      </button>
    </div>

    <label v-if="activeTab !== 'feedback'" class="resource-search">
      <Search :size="15" />
      <input
        v-model="resourceQuery"
        :placeholder="activeTab === 'experiences' ? '경험·태그 검색' : '회사·업무 검색'"
        :aria-label="activeTab === 'experiences' ? '경험 검색' : '경력 검색'"
      />
    </label>

    <template v-if="activeTab === 'experiences'">
      <div class="recommend-actions">
        <button class="primary full" type="button" @click="recommendExperiences">
          <Sparkles :size="16" />문항에 맞는 경험 찾기
        </button>
        <button
          v-if="recommendationVisible"
          class="text-button"
          type="button"
          @click="showAllExperiences"
        >
          모든 경험 보기
        </button>
      </div>
      <small class="simulation">문항과 경험 태그를 기준으로 관련 경험을 추천합니다.</small>

      <p v-if="!visibleExperiences.length" class="resource-empty">
        {{ recommendationVisible ? '문항과 일치하는 경험이 없습니다.' : '조건에 맞는 경험이 없습니다.' }}
      </p>

      <article
        v-for="experience in visibleExperiences"
        :key="experience.id"
        class="resource-card"
      >
        <div class="resource-card-title">
          <div>
            <small>{{ experience.type }} · {{ experience.period }}</small>
            <h3>{{ experience.title }}</h3>
          </div>
          <Check
            v-if="currentQuestion?.experienceIds.includes(experience.id)"
            :size="17"
            aria-label="연결된 경험"
          />
        </div>
        <p>{{ experience.overview || experience.situation }}</p>
        <div class="card-tags compact-tags">
          <span v-for="tag in experience.tags" :key="tag">#{{ tag }}</span>
        </div>
        <div class="resource-card-actions">
          <button
            class="text-button"
            type="button"
            @click="openReferenceDetail('experience', experience)"
          >
            상세 보기
          </button>
          <button class="icon-action" type="button" @click="copyExperience(experience)">
            <Copy :size="14" />복사
          </button>
          <button
            class="secondary compact"
            type="button"
            :disabled="
              !currentQuestion ||
              activeApplication?.status !== '작성 중' ||
              currentQuestion.experienceIds.includes(experience.id)
            "
            @click="connectExperience(experience)"
          >
            {{ currentQuestion?.experienceIds.includes(experience.id) ? '연결됨' : '참고로 연결' }}
          </button>
        </div>
      </article>
    </template>

    <template v-else-if="activeTab === 'careers'">
      <p class="resource-guide">경력은 현재 문항을 벗어나지 않고 조회하고 복사할 수 있습니다.</p>
      <p v-if="!visibleCareers.length" class="resource-empty">조건에 맞는 경력이 없습니다.</p>

      <article v-for="career in visibleCareers" :key="career.id" class="resource-card">
        <small>{{ career.employment }} · {{ career.start }} — {{ career.current ? '재직 중' : career.end }}</small>
        <h3>{{ career.company }}</h3>
        <b>{{ career.role }}</b>
        <p>{{ career.duties || '담당 업무를 아직 입력하지 않았습니다.' }}</p>
        <div class="resource-card-actions">
          <button class="text-button" type="button" @click="openReferenceDetail('career', career)">
            상세 보기
          </button>
          <button class="icon-action" type="button" @click="copyCareer(career)">
            <Copy :size="14" />경력 내용 복사
          </button>
        </div>
      </article>
    </template>

    <template v-else>
      <p class="resource-guide">
        현재 문항에 대해 검토 완료된 메모만 표시합니다. 메모를 참고하면서 답변을 수정할 수 있습니다.
      </p>

      <p v-if="!currentQuestionFeedback.length" class="resource-empty">
        현재 문항에 받은 검토 메모가 없습니다.
      </p>

      <article
        v-for="feedback in currentQuestionFeedback"
        :key="feedback.id"
        class="resource-card feedback-card"
      >
        <small>{{ feedback.reviewerName }}님의 검토</small>
        <p>{{ feedback.content }}</p>
      </article>

      <button class="text-button feedback-history-link" type="button" @click="go('reviews')">
        전체 검토 요청과 메모 보기
      </button>
    </template>
  </aside>
</template>

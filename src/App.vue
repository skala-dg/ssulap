<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { Check } from 'lucide-vue-next'
import ExperienceDetailDialog from './components/dialogs/ExperienceDetailDialog.vue'
import RecordDialog from './components/dialogs/RecordDialog.vue'
import AppFooter from './components/layout/AppFooter.vue'
import AppSidebar from './components/layout/AppSidebar.vue'
import AppTopbar from './components/layout/AppTopbar.vue'
import { useWorkspace } from './composables/useWorkspace.js'
import ApplicationEditorView from './views/ApplicationEditorView.vue'
import ApplicationsView from './views/ApplicationsView.vue'
import CareersView from './views/CareersView.vue'
import ExperiencesView from './views/ExperiencesView.vue'
import LoginView from './views/LoginView.vue'
import ProfileView from './views/ProfileView.vue'
import ReviewDetailView from './views/ReviewDetailView.vue'
import ReviewsView from './views/ReviewsView.vue'

const { page, toast, currentUser, go } = useWorkspace()

const views = {
  profile: ProfileView,
  careers: CareersView,
  experiences: ExperiencesView,
  essays: ApplicationsView,
  editor: ApplicationEditorView,
  reviews: ReviewsView,
  review: ReviewDetailView,
}

const currentView = computed(() => views[page.value] ?? ExperiencesView)
const toolLifecycle = new AbortController()
const navigableSections = new Set(['profile', 'careers', 'experiences', 'essays'])

onMounted(() => {
  const context = document.modelContext
  if (!context?.registerTool) return

  try {
    Promise.resolve(
      context.registerTool(
        {
          name: 'navigate_ssulap',
          description: 'Navigate to a ssulap workspace section.',
          inputSchema: {
            type: 'object',
            properties: {
              section: {
                type: 'string',
                enum: ['profile', 'careers', 'experiences', 'essays'],
              },
            },
            required: ['section'],
            additionalProperties: false,
          },
          annotations: { readOnlyHint: false },
          execute(input) {
            if (!input || !navigableSections.has(input.section)) {
              throw new Error('Invalid section')
            }
            go(input.section)
            return { section: page.value }
          },
        },
        { signal: toolLifecycle.signal },
      ),
    ).catch(() => {})
  } catch {
    // WebMCP를 지원하지 않는 브라우저에서는 일반 UI만 사용합니다.
  }
})

onUnmounted(() => toolLifecycle.abort())
</script>

<template>
  <LoginView v-if="!currentUser" />

  <div v-else class="app-shell">
    <AppSidebar />

    <div class="main-shell">
      <AppTopbar />
      <main>
        <component :is="currentView" />
        <AppFooter />
      </main>
    </div>

    <div v-if="toast" class="toast" role="status">
      <Check :size="17" />{{ toast }}
    </div>

    <ExperienceDetailDialog />
    <RecordDialog />
  </div>
</template>

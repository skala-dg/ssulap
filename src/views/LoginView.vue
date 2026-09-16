<script setup>
import { Archive, LogIn } from 'lucide-vue-next'
import { useWorkspace } from '../composables/useWorkspace.js'

const { users, login } = useWorkspace()
</script>

<template>
  <main class="login-page">
    <section class="login-card" aria-labelledby="login-title">
      <span class="login-brand"><Archive :size="28" />써랍<span>.</span></span>
      <h1 id="login-title">계정 선택</h1>
      <p>
        사용할 계정을 선택하세요.
        비밀번호는 사용하지 않습니다.
      </p>

      <div class="login-users">
        <button
          v-for="user in users"
          :key="user.id"
          class="login-user"
          type="button"
          @click="login(user.id)"
        >
          <span class="avatar">{{ user.name.at(-1) }}</span>
          <span><b>{{ user.name }}</b><small>이 계정으로 시작하기</small></span>
          <LogIn :size="19" />
        </button>
      </div>
    </section>
  </main>
</template>

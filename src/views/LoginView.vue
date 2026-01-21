/* file: src/views/LoginView.vue */
<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="text-center">{{ $t("auth.login") }}</h1>

      <form class="login-form" @submit.prevent="submitLogin">
        <input
          v-model="username"
          type="text"
          :placeholder="$t('auth.username')"
          required
          autocomplete="username"
        />
        <input
          v-model="password"
          type="password"
          :placeholder="$t('auth.password')"
          required
          autocomplete="current-password"
        />
        <button type="submit" class="login-btn" :disabled="loading">
          {{ loading ? $t("auth.loading") : $t("auth.login") }}
        </button>
      </form>

      <p v-if="error" class="error">{{ error }}</p>
      <p class="demo-hint text-center">Demo: admin / demo123</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "../store/auth.store";

const username = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");
const router = useRouter();
const auth = useAuthStore();
const { t } = useI18n();

const submitLogin = async () => {
  loading.value = true;
  error.value = "";
  try {
    await auth.login(username.value, password.value);
    await router.push("/app");
  } catch (err: any) {
    error.value = t("auth.loginError");
    console.error(err);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--bg);
  color: var(--text);
  padding: 0 5vw;
}

.login-card {
  width: 100%;
  max-width: 380px;
  background-color: var(--surface);
  color: var(--text);
  border-radius: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login-form input {
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid var(--border);
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
  background-color: var(--bg);
  color: var(--text);
}

.login-btn {
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  background-color: var(--primary);
  color: var(--primary-text);
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.2s;
}

.login-btn:hover {
  opacity: 0.9;
}

.error {
  color: var(--danger);
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;
}

.demo-hint {
  font-size: 0.85rem;
  margin-top: 1rem;
  opacity: 0.6;
}

@media (max-width: 600px) {
  .login-card {
    padding: 1.5rem;
    border-radius: 0.75rem;
    box-shadow: none;
  }

  .login-form input,
  .login-btn {
    font-size: 0.95rem;
  }
}
</style>
/* file: src/views/LoginView.vue */

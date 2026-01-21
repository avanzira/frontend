/* file: src/views/SettingsView.vue */
<template>
  <div class="settings container column">
    <h1 class="text-center">{{ $t("settings.title") }}</h1>

    <section class="card">
      <h2>{{ $t("settings.account.title") }}</h2>
      <form class="column" @submit.prevent="updateProfile">
        <label>
          {{ $t("settings.account.username") }}
          <input v-model="form.username" type="text" required />
        </label>

        <label>
          {{ $t("settings.account.email") }}
          <input v-model="form.email" type="email" required />
        </label>

        <label>
          {{ $t("settings.account.language") }}
          <select v-model="form.user_language">
            <option value="es">{{ $t("options.language.es") }}</option>
            <option value="en">{{ $t("options.language.en") }}</option>
            <option value="fr">{{ $t("options.language.fr") }}</option>
          </select>
        </label>

        <label>
          {{ $t("settings.account.theme") }}
          <select v-model="form.user_theme">
            <option value="light">{{ $t("options.theme.light") }}</option>
            <option value="dark">{{ $t("options.theme.dark") }}</option>
            <option value="earth">{{ $t("options.theme.earth") }}</option>
          </select>
        </label>

        <button type="submit" class="btn-primary" :disabled="saving">
          {{ saving ? $t("settings.saving") : $t("settings.save") }}
        </button>
      </form>
    </section>

    <section class="card">
      <h2>{{ $t("settings.password.title") }}</h2>
      <form class="column" @submit.prevent="changePassword">
        <label>
          {{ $t("settings.password.current") }}
          <input v-model="oldPassword" type="password" required />
        </label>
        <label>
          {{ $t("settings.password.new") }}
          <input v-model="newPassword" type="password" required />
        </label>
        <button type="submit" class="btn-secondary" :disabled="changing">
          {{
            changing
              ? $t("settings.password.updating")
              : $t("settings.password.update")
          }}
        </button>
      </form>
    </section>

    <p v-if="message" class="message">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "../store/auth.store";
import { useSettingsStore } from "../store/settings.store";
import api from "../services/api";

const auth = useAuthStore();
const settings = useSettingsStore();
const { t } = useI18n();

const form = reactive({
  username: auth.user?.username || "",
  email: auth.user?.email || "",
  user_language: auth.user?.user_language || settings.language,
  user_theme: auth.user?.user_theme || settings.theme,
});

const oldPassword = ref("");
const newPassword = ref("");
const message = ref("");
const saving = ref(false);
const changing = ref(false);

const updateProfile = async () => {
  if (!auth.user?.id) {
    message.value = t("settings.message.userMissing");
    return;
  }
  saving.value = true;
  message.value = "";
  try {
    const { data } = await api.put(`/users/${auth.user.id}`, {
      username: form.username,
      email: form.email,
      user_language: form.user_language,
      user_theme: form.user_theme,
    });

    settings.setLanguage(form.user_language);
    settings.setTheme(form.user_theme);

    auth.user = { ...auth.user, ...data };

    message.value = t("settings.message.profileUpdated");
  } catch (err) {
    console.error(err);
    message.value = t("settings.message.profileError");
  } finally {
    saving.value = false;
  }
};

const changePassword = async () => {
  changing.value = true;
  message.value = "";
  try {
    await api.post("/users/change-password", {
      old_password: oldPassword.value,
      new_password: newPassword.value,
    });
    message.value = t("settings.message.passwordUpdated");
    oldPassword.value = "";
    newPassword.value = "";
  } catch (err) {
    console.error(err);
    message.value = t("settings.message.passwordError");
  } finally {
    changing.value = false;
  }
};
</script>

<style scoped>
.settings {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem 0;
}

.card {
  background-color: var(--surface);
  color: var(--text);
  border-radius: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.card h2 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

form label {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  font-weight: 500;
}

input,
select {
  padding: 0.6rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  margin-top: 0.3rem;
  background-color: var(--bg);
  color: var(--text);
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

.btn-primary {
  background-color: var(--primary);
  color: var(--primary-text);
}

.btn-secondary {
  background-color: var(--muted);
  color: var(--primary-text);
}

.message {
  text-align: center;
  color: var(--primary);
  font-weight: 500;
}

@media (max-width: 600px) {
  .settings {
    padding-left: 5vw;
    padding-right: 5vw;
  }

  .card {
    padding: 1rem;
    border-radius: 0.75rem;
  }
}
</style>
/* file: src/views/SettingsView.vue */

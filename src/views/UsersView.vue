<template>
  <div class="page container column">
    <SectionTitle :level="1" align="center">
      {{ $t("users.title") }}
    </SectionTitle>
    <p class="lead">{{ $t("users.subtitle") }}</p>

    <p v-if="!isAdmin" class="warning">{{ $t("users.noAccess") }}</p>

    <section v-else class="panel">
      <SectionTitle :level="2">{{ $t("users.filters.title") }}</SectionTitle>
      <div class="filters">
        <label class="field">
          {{ $t("users.filters.role") }}
          <select v-model="filters.role">
            <option value="all">{{ $t("users.filters.all") }}</option>
            <option value="ADMIN">ADMIN</option>
            <option value="USER">USER</option>
          </select>
        </label>
        <label class="field">
          {{ $t("users.filters.status") }}
          <select v-model="filters.active">
            <option value="all">{{ $t("users.filters.all") }}</option>
            <option value="active">{{ $t("users.filters.active") }}</option>
            <option value="inactive">{{ $t("users.filters.inactive") }}</option>
          </select>
        </label>
      </div>
    </section>

    <section v-if="isAdmin" class="panel">
      <SectionTitle :level="2">
        {{ isEditing ? $t("users.edit.title") : $t("users.create.title") }}
      </SectionTitle>
      <form class="form" @submit.prevent="handleSubmit">
        <label class="field">
          {{ $t("users.fields.username") }}
          <input v-model="form.username" type="text" required />
        </label>

        <label class="field">
          {{ $t("users.fields.email") }}
          <input v-model="form.email" type="email" />
        </label>

        <label class="field">
          {{ $t("users.fields.role") }}
          <select v-model="form.rol" required>
            <option value="ADMIN">ADMIN</option>
            <option value="USER">USER</option>
          </select>
        </label>

        <label class="field">
          {{ $t("users.fields.language") }}
          <select v-model="form.user_language">
            <option value="">{{ $t("users.fields.none") }}</option>
            <option value="es">{{ $t("options.language.es") }}</option>
            <option value="en">{{ $t("options.language.en") }}</option>
            <option value="fr">{{ $t("options.language.fr") }}</option>
          </select>
        </label>

        <label class="field">
          {{ $t("users.fields.theme") }}
          <select v-model="form.user_theme">
            <option value="">{{ $t("users.fields.none") }}</option>
            <option value="light">{{ $t("options.theme.light") }}</option>
            <option value="dark">{{ $t("options.theme.dark") }}</option>
            <option value="earth">{{ $t("options.theme.earth") }}</option>
          </select>
        </label>

        <label v-if="!isEditing" class="field">
          {{ $t("users.fields.password") }}
          <input v-model="form.password" type="password" required />
        </label>

        <div class="actions">
          <button type="submit" class="btn-primary" :disabled="saving">
            {{ saving ? $t("users.saving") : $t("users.save") }}
          </button>
          <button
            v-if="isEditing"
            type="button"
            class="btn-secondary"
            @click="resetForm"
          >
            {{ $t("users.cancel") }}
          </button>
        </div>
      </form>
    </section>

    <section v-if="isAdmin" class="panel">
      <SectionTitle :level="2">{{ $t("users.list.title") }}</SectionTitle>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>{{ $t("users.fields.username") }}</th>
              <th>{{ $t("users.fields.email") }}</th>
              <th>{{ $t("users.fields.role") }}</th>
              <th>{{ $t("users.fields.active") }}</th>
              <th>{{ $t("users.actions") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredUsers.length === 0">
              <td :colspan="5" class="empty">
                {{ $t("users.empty") }}
              </td>
            </tr>
            <tr v-for="user in filteredUsers" :key="user.id">
              <td>{{ user.username }}</td>
              <td>{{ user.email || "-" }}</td>
              <td>{{ user.rol }}</td>
              <td>{{ user.is_active ? $t("users.active") : $t("users.inactive") }}</td>
              <td class="row-actions">
                <button class="link" @click="startEdit(user)">
                  {{ $t("users.edit.action") }}
                </button>
                <button
                  v-if="user.is_active"
                  class="link danger"
                  @click="toggleActive(user)"
                >
                  {{ $t("users.delete") }}
                </button>
                <button
                  v-else
                  class="link"
                  @click="restoreUser(user)"
                >
                  {{ $t("users.restore") }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section v-if="isAdmin" class="panel">
      <SectionTitle :level="2">{{ $t("users.password.title") }}</SectionTitle>
      <form class="form" @submit.prevent="changePassword">
        <label class="field">
          {{ $t("users.password.current") }}
          <input v-model="passwordForm.old_password" type="password" required />
        </label>
        <label class="field">
          {{ $t("users.password.new") }}
          <input v-model="passwordForm.new_password" type="password" required />
        </label>
        <div class="actions">
          <button type="submit" class="btn-secondary" :disabled="changingPassword">
            {{
              changingPassword
                ? $t("users.password.saving")
                : $t("users.password.save")
            }}
          </button>
        </div>
      </form>
    </section>

    <p v-if="message" class="message">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import SectionTitle from "../components/SectionTitle.vue";
import api from "../services/api";
import { useAuthStore } from "../store/auth.store";

type UserRole = "ADMIN" | "USER";

interface User {
  id: number;
  username: string;
  email: string | null;
  rol: UserRole;
  is_active: boolean;
  user_language?: string | null;
  user_theme?: string | null;
}

const { t } = useI18n();
const auth = useAuthStore();

const users = ref<User[]>([]);
const message = ref("");
const saving = ref(false);
const changingPassword = ref(false);
const isEditing = ref(false);
const editingId = ref<number | null>(null);

const filters = reactive({
  role: "all",
  active: "all",
});

const form = reactive({
  username: "",
  email: "",
  rol: "USER" as UserRole,
  user_language: "",
  user_theme: "",
  password: "",
});

const passwordForm = reactive({
  old_password: "",
  new_password: "",
});

const isAdmin = computed(() => auth.user?.rol === "ADMIN");

const filteredUsers = computed(() => {
  return users.value.filter((user) => {
    const roleMatch =
      filters.role === "all" ? true : user.rol === filters.role;
    const activeMatch =
      filters.active === "all"
        ? true
        : filters.active === "active"
        ? user.is_active
        : !user.is_active;
    return roleMatch && activeMatch;
  });
});

const fetchUsers = async () => {
  if (!isAdmin.value) return;
  try {
    const { data } = await api.get<User[]>("/users/");
    users.value = data;
  } catch (err) {
    console.error(err);
    message.value = t("users.error");
  }
};

const resetForm = () => {
  isEditing.value = false;
  editingId.value = null;
  form.username = "";
  form.email = "";
  form.rol = "USER";
  form.user_language = "";
  form.user_theme = "";
  form.password = "";
};

const startEdit = (user: User) => {
  isEditing.value = true;
  editingId.value = user.id;
  form.username = user.username;
  form.email = user.email || "";
  form.rol = user.rol;
  form.user_language = user.user_language || "";
  form.user_theme = user.user_theme || "";
  form.password = "";
};

const handleSubmit = async () => {
  if (!isAdmin.value) return;
  saving.value = true;
  message.value = "";
  try {
    if (isEditing.value && editingId.value) {
      await api.put(`/users/${editingId.value}`, {
        username: form.username,
        email: form.email || null,
        rol: form.rol,
        user_language: form.user_language || null,
        user_theme: form.user_theme || null,
      });
      message.value = t("users.updated");
    } else {
      await api.post("/users/", {
        username: form.username,
        email: form.email || null,
        rol: form.rol,
        user_language: form.user_language || null,
        user_theme: form.user_theme || null,
        password: form.password,
      });
      message.value = t("users.created");
    }
    await fetchUsers();
    resetForm();
  } catch (err) {
    console.error(err);
    message.value = t("users.saveError");
  } finally {
    saving.value = false;
  }
};

const toggleActive = async (user: User) => {
  if (!isAdmin.value) return;
  try {
    await api.delete(`/users/${user.id}`);
    message.value = t("users.deleted");
    await fetchUsers();
  } catch (err) {
    console.error(err);
    message.value = t("users.saveError");
  }
};

const restoreUser = async (user: User) => {
  if (!isAdmin.value) return;
  try {
    await api.post(`/users/${user.id}/restore`);
    message.value = t("users.restored");
    await fetchUsers();
  } catch (err) {
    console.error(err);
    message.value = t("users.saveError");
  }
};

const changePassword = async () => {
  if (!isAdmin.value) return;
  changingPassword.value = true;
  message.value = "";
  try {
    await api.post("/users/change-password", {
      old_password: passwordForm.old_password,
      new_password: passwordForm.new_password,
    });
    message.value = t("users.password.updated");
    passwordForm.old_password = "";
    passwordForm.new_password = "";
  } catch (err) {
    console.error(err);
    message.value = t("users.password.error");
  } finally {
    changingPassword.value = false;
  }
};

onMounted(fetchUsers);
</script>

<style scoped>
.page {
  gap: 1.2vh;
  align-items: center;
}

.lead {
  text-align: center;
  color: var(--muted);
  margin: 0 0 1vh;
}

.panel {
  width: 100%;
  max-width: 80vw;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 2.2vh 3vw;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}

.filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.2vh 2vw;
}

.form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.2vh 2vw;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.6vh;
  font-weight: 600;
}

.field input,
.field select {
  padding: 0.6rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg);
  color: var(--text);
}

.actions {
  display: flex;
  gap: 2vw;
  align-items: center;
}

.btn-primary,
.btn-secondary {
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary {
  background: var(--primary);
  color: var(--primary-text);
}

.btn-secondary {
  background: var(--muted);
  color: var(--primary-text);
}

.table-wrapper {
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow-x: auto;
  background: var(--surface);
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 520px;
}

th,
td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid var(--border);
}

.row-actions {
  display: flex;
  gap: 1vw;
  align-items: center;
}

.link {
  background: none;
  border: none;
  color: var(--primary);
  cursor: pointer;
  padding: 0;
  font-weight: 600;
}

.link.danger {
  color: var(--danger);
}

.empty {
  text-align: center;
  color: var(--muted);
  padding: 1.2vh 0;
}

.warning {
  color: var(--danger);
  font-weight: 600;
}

.message {
  text-align: center;
  color: var(--primary);
  font-weight: 600;
}
</style>

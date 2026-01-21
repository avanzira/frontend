<template>
  <div class="page container column">
    <SectionTitle :level="1" align="center">
      {{ title }}
    </SectionTitle>
    <p class="lead">{{ $t("entityCrud.subtitle") }}</p>

    <section class="panel">
      <SectionTitle :level="2">{{ $t("entityCrud.filters.title") }}</SectionTitle>
      <div class="filters">
        <label class="field">
          {{ $t("entityCrud.filters.name") }}
          <input v-model="filters.name" type="text" />
        </label>
        <label class="field">
          {{ $t("entityCrud.filters.status") }}
          <select v-model="filters.active">
            <option value="all">{{ $t("entityCrud.filters.all") }}</option>
            <option value="active">{{ $t("entityCrud.filters.active") }}</option>
            <option value="inactive">{{ $t("entityCrud.filters.inactive") }}</option>
          </select>
        </label>
      </div>
    </section>

    <section class="panel">
      <SectionTitle :level="2">
        {{ isEditing ? $t("entityCrud.edit.title") : $t("entityCrud.create.title") }}
      </SectionTitle>
      <form class="form" @submit.prevent="handleSubmit">
        <label class="field">
          {{ $t("entityCrud.fields.name") }}
          <input v-model="form.name" type="text" required />
        </label>

        <label class="field">
          {{ $t("entityCrud.fields.phone") }}
          <input v-model="form.phone" type="text" />
        </label>

        <label class="field">
          {{ $t("entityCrud.fields.email") }}
          <input v-model="form.email" type="email" />
        </label>

        <label class="field">
          {{ $t("entityCrud.fields.address") }}
          <input v-model="form.address" type="text" />
        </label>

        <div class="actions">
          <button type="submit" class="btn-primary" :disabled="saving">
            {{ saving ? $t("entityCrud.saving") : $t("entityCrud.save") }}
          </button>
          <button
            v-if="isEditing"
            type="button"
            class="btn-secondary"
            @click="resetForm"
          >
            {{ $t("entityCrud.cancel") }}
          </button>
        </div>
      </form>
    </section>

    <section class="panel">
      <SectionTitle :level="2">{{ $t("entityCrud.list.title") }}</SectionTitle>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>{{ $t("entityCrud.fields.name") }}</th>
              <th>{{ $t("entityCrud.fields.phone") }}</th>
              <th>{{ $t("entityCrud.fields.email") }}</th>
              <th>{{ $t("entityCrud.fields.address") }}</th>
              <th>{{ $t("entityCrud.fields.active") }}</th>
              <th>{{ $t("entityCrud.actions") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredItems.length === 0">
              <td :colspan="6" class="empty">
                {{ $t("entityCrud.empty") }}
              </td>
            </tr>
            <tr v-for="item in filteredItems" :key="item.id">
              <td>{{ item.name }}</td>
              <td>{{ item.phone || "-" }}</td>
              <td>{{ item.email || "-" }}</td>
              <td>{{ item.address || "-" }}</td>
              <td>{{ item.is_active ? $t("entityCrud.active") : $t("entityCrud.inactive") }}</td>
              <td class="row-actions">
                <button class="link" @click="startEdit(item)">
                  {{ $t("entityCrud.edit.action") }}
                </button>
                <button
                  v-if="item.is_active"
                  class="link danger"
                  @click="toggleActive(item)"
                >
                  {{ $t("entityCrud.delete") }}
                </button>
                <button v-else class="link" @click="restoreItem(item)">
                  {{ $t("entityCrud.restore") }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <p v-if="message" class="message">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import SectionTitle from "./SectionTitle.vue";
import api from "../services/api";

interface Entity {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  is_active: boolean;
}

const props = defineProps<{
  resource: "customers" | "suppliers";
  title: string;
}>();

const { t } = useI18n();

const items = ref<Entity[]>([]);
const message = ref("");
const saving = ref(false);
const isEditing = ref(false);
const editingId = ref<number | null>(null);

const filters = reactive({
  name: "",
  active: "all",
});

const form = reactive({
  name: "",
  phone: "",
  email: "",
  address: "",
});

const filteredItems = computed(() => {
  return items.value.filter((item) => {
    const nameMatch = item.name
      .toLowerCase()
      .includes(filters.name.toLowerCase());
    const activeMatch =
      filters.active === "all"
        ? true
        : filters.active === "active"
        ? item.is_active
        : !item.is_active;
    return nameMatch && activeMatch;
  });
});

const fetchItems = async () => {
  try {
    const { data } = await api.get<Entity[]>(`/${props.resource}/`);
    items.value = data;
  } catch (err) {
    console.error(err);
    message.value = t("entityCrud.error");
  }
};

const resetForm = () => {
  isEditing.value = false;
  editingId.value = null;
  form.name = "";
  form.phone = "";
  form.email = "";
  form.address = "";
};

const startEdit = (item: Entity) => {
  isEditing.value = true;
  editingId.value = item.id;
  form.name = item.name;
  form.phone = item.phone || "";
  form.email = item.email || "";
  form.address = item.address || "";
};

const handleSubmit = async () => {
  saving.value = true;
  message.value = "";
  try {
    if (isEditing.value && editingId.value) {
      await api.put(`/${props.resource}/${editingId.value}`, {
        name: form.name,
        phone: form.phone || null,
        email: form.email || null,
        address: form.address || null,
      });
      message.value = t("entityCrud.updated");
    } else {
      await api.post(`/${props.resource}/`, {
        name: form.name,
        phone: form.phone || null,
        email: form.email || null,
        address: form.address || null,
      });
      message.value = t("entityCrud.created");
    }
    await fetchItems();
    resetForm();
  } catch (err) {
    console.error(err);
    message.value = t("entityCrud.saveError");
  } finally {
    saving.value = false;
  }
};

const toggleActive = async (item: Entity) => {
  try {
    await api.delete(`/${props.resource}/${item.id}`);
    message.value = t("entityCrud.deleted");
    await fetchItems();
  } catch (err) {
    console.error(err);
    message.value = t("entityCrud.saveError");
  }
};

const restoreItem = async (item: Entity) => {
  try {
    await api.post(`/${props.resource}/${item.id}/restore`);
    message.value = t("entityCrud.restored");
    await fetchItems();
  } catch (err) {
    console.error(err);
    message.value = t("entityCrud.saveError");
  }
};

onMounted(fetchItems);
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

.message {
  text-align: center;
  color: var(--primary);
  font-weight: 600;
}
</style>

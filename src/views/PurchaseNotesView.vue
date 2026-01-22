<template>
  <div class="page container column">
    <SectionTitle :level="1" align="center">
      {{ $t("purchaseNotes.title") }}
    </SectionTitle>
    <p class="lead">{{ $t("purchaseNotes.subtitle") }}</p>

    <section class="panel">
      <SectionTitle :level="2">{{ $t("purchaseNotes.filters.title") }}</SectionTitle>
      <div class="filters">
        <label class="field">
          {{ $t("purchaseNotes.filters.search") }}
          <input v-model="filters.search" type="text" />
        </label>
        <label class="field">
          {{ $t("purchaseNotes.filters.supplier") }}
          <select v-model="filters.supplier_id">
            <option value="all">{{ $t("purchaseNotes.filters.all") }}</option>
            <option
              v-for="supplier in suppliers"
              :key="supplier.id"
              :value="supplier.id"
            >
              {{ supplier.name }}
            </option>
          </select>
        </label>
        <label class="field">
          {{ $t("purchaseNotes.filters.status") }}
          <select v-model="filters.status">
            <option value="all">{{ $t("purchaseNotes.filters.all") }}</option>
            <option value="DRAFT">{{ $t("purchaseNotes.status.draft") }}</option>
            <option value="CONFIRMED">
              {{ $t("purchaseNotes.status.confirmed") }}
            </option>
            <option value="CANCELLED">
              {{ $t("purchaseNotes.status.cancelled") }}
            </option>
          </select>
        </label>
        <label class="field">
          {{ $t("purchaseNotes.filters.dateFrom") }}
          <input v-model="filters.date_from" type="date" />
        </label>
        <label class="field">
          {{ $t("purchaseNotes.filters.dateTo") }}
          <input v-model="filters.date_to" type="date" />
        </label>
      </div>
      <div class="actions">
        <button type="button" class="btn-secondary" @click="resetFilters">
          {{ $t("purchaseNotes.filters.clear") }}
        </button>
      </div>
    </section>

    <section class="panel">
      <SectionTitle :level="2">
        {{
          isEditing
            ? $t("purchaseNotes.form.editTitle")
            : $t("purchaseNotes.form.createTitle")
        }}
      </SectionTitle>
      <form class="form" @submit.prevent="handleSubmit">
        <label class="field">
          {{ $t("purchaseNotes.form.supplier") }}
          <select v-model="form.supplier_id" :disabled="isReadOnly">
            <option value="">--</option>
            <option
              v-for="supplier in suppliers"
              :key="supplier.id"
              :value="supplier.id"
            >
              {{ supplier.name }}
            </option>
          </select>
        </label>

        <label class="field">
          {{ $t("purchaseNotes.form.date") }}
          <input v-model="form.date" type="date" :disabled="isReadOnly" />
        </label>

        <label class="field">
          {{ $t("purchaseNotes.form.paid") }}
          <input
            v-model.number="form.paid_amount"
            type="number"
            step="0.01"
            min="0"
            :disabled="isReadOnly"
          />
        </label>

        <div class="summary">
          <div class="summary-item">
            <span class="summary-label">{{ $t("purchaseNotes.form.total") }}</span>
            <span class="summary-value">{{ displayTotal }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">{{ $t("purchaseNotes.form.pending") }}</span>
            <span class="summary-value">{{ pendingTotal }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">{{ $t("purchaseNotes.form.status") }}</span>
            <span class="summary-value">{{ statusLabel(currentStatus) }}</span>
          </div>
        </div>

        <div class="actions">
          <button type="submit" class="btn-primary" :disabled="saving || isReadOnly">
            {{ saving ? $t("purchaseNotes.form.saving") : $t("purchaseNotes.form.save") }}
          </button>
          <button
            v-if="isEditing"
            type="button"
            class="btn-secondary"
            @click="resetForm"
          >
            {{ $t("purchaseNotes.form.cancel") }}
          </button>
          <button
            v-if="canConfirm"
            type="button"
            class="btn-secondary"
            :disabled="confirming"
            @click="confirmNote"
          >
            {{
              confirming
                ? $t("purchaseNotes.form.confirming")
                : $t("purchaseNotes.form.confirm")
            }}
          </button>
        </div>
      </form>
    </section>

    <section class="panel">
      <SectionTitle :level="2">{{ $t("purchaseNotes.lines.title") }}</SectionTitle>
      <p v-if="!canEditLines" class="hint">
        {{ $t("purchaseNotes.lines.helper") }}
      </p>
      <form class="form" @submit.prevent="handleLineSubmit">
        <label class="field">
          {{ $t("purchaseNotes.lines.product") }}
          <select
            v-model="lineForm.product_id"
            :disabled="!canEditLines || isReadOnly"
          >
            <option value="">--</option>
            <option v-for="product in products" :key="product.id" :value="product.id">
              {{ product.name }}
            </option>
          </select>
        </label>

        <label class="field">
          {{ $t("purchaseNotes.lines.quantity") }}
          <input
            v-model.number="lineForm.quantity"
            type="number"
            step="0.01"
            min="0"
            :disabled="!canEditLines || isReadOnly"
            @input="updateTotalFromUnit"
          />
        </label>

        <label class="field">
          {{ $t("purchaseNotes.lines.unitPrice") }}
          <input
            v-model.number="lineForm.unit_price"
            type="number"
            step="0.01"
            min="0"
            :disabled="!canEditLines || isReadOnly"
            @input="updateTotalFromUnit"
          />
        </label>

        <label class="field">
          {{ $t("purchaseNotes.lines.totalPrice") }}
          <input
            v-model.number="lineForm.total_price"
            type="number"
            step="0.01"
            min="0"
            :disabled="!canEditLines || isReadOnly"
            @input="updateUnitFromTotal"
          />
        </label>

        <div class="actions">
          <button
            type="submit"
            class="btn-primary"
            :disabled="lineSaving || !canEditLines || isReadOnly"
          >
            {{
              lineSaving
                ? $t("purchaseNotes.lines.saving")
                : isEditingLine
                ? $t("purchaseNotes.lines.update")
                : $t("purchaseNotes.lines.add")
            }}
          </button>
          <button
            v-if="isEditingLine"
            type="button"
            class="btn-secondary"
            :disabled="lineSaving"
            @click="resetLineForm"
          >
            {{ $t("purchaseNotes.lines.cancel") }}
          </button>
        </div>
      </form>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>{{ $t("purchaseNotes.lines.product") }}</th>
              <th>{{ $t("purchaseNotes.lines.quantity") }}</th>
              <th>{{ $t("purchaseNotes.lines.unitPrice") }}</th>
              <th>{{ $t("purchaseNotes.lines.totalPrice") }}</th>
              <th>{{ $t("purchaseNotes.list.actions") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="currentLines.length === 0">
              <td :colspan="5" class="empty">
                {{ $t("purchaseNotes.lines.empty") }}
              </td>
            </tr>
            <tr v-for="line in currentLines" :key="line.id">
              <td>{{ productName(line.product_id) }}</td>
              <td>{{ line.quantity }}</td>
              <td>{{ line.unit_price }}</td>
              <td>{{ line.total_price }}</td>
              <td class="row-actions">
                <button
                  class="link"
                  :disabled="isReadOnly"
                  @click="startEditLine(line)"
                >
                  {{ $t("purchaseNotes.lines.edit") }}
                </button>
                <button
                  class="link danger"
                  :disabled="isReadOnly"
                  @click="deleteLine(line)"
                >
                  {{ $t("purchaseNotes.lines.delete") }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="panel">
      <SectionTitle :level="2">{{ $t("purchaseNotes.list.title") }}</SectionTitle>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>{{ $t("purchaseNotes.list.id") }}</th>
              <th>{{ $t("purchaseNotes.list.date") }}</th>
              <th>{{ $t("purchaseNotes.list.supplier") }}</th>
              <th>{{ $t("purchaseNotes.list.total") }}</th>
              <th>{{ $t("purchaseNotes.list.paid") }}</th>
              <th>{{ $t("purchaseNotes.list.status") }}</th>
              <th>{{ $t("purchaseNotes.list.actions") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredNotes.length === 0">
              <td :colspan="7" class="empty">
                {{ $t("purchaseNotes.list.empty") }}
              </td>
            </tr>
            <tr v-for="note in filteredNotes" :key="note.id">
              <td>{{ note.id }}</td>
              <td>{{ note.date }}</td>
              <td>{{ supplierName(note.supplier_id) }}</td>
              <td>{{ note.total_amount ?? 0 }}</td>
              <td>{{ note.paid_amount }}</td>
              <td>{{ statusLabel(note.status) }}</td>
              <td class="row-actions">
                <button class="link" @click="startEdit(note)">
                  {{ $t("purchaseNotes.list.view") }}
                </button>
                <button
                  v-if="note.status === 'DRAFT'"
                  class="link"
                  @click="confirmNoteById(note.id)"
                >
                  {{ $t("purchaseNotes.list.confirm") }}
                </button>
                <button
                  v-if="note.status === 'DRAFT'"
                  class="link danger"
                  @click="requestDelete(note)"
                >
                  {{ $t("purchaseNotes.list.delete") }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div v-if="deleteTargetId" class="toast-backdrop">
      <div class="dialog">
        <p class="toast-text">{{ $t("purchaseNotes.messages.deleteConfirmTitle") }}</p>
        <p class="dialog-text">{{ $t("purchaseNotes.messages.deleteConfirmBody") }}</p>
        <div class="actions">
          <button
            type="button"
            class="btn-secondary"
            @click="clearDeleteTarget"
          >
            {{ $t("purchaseNotes.messages.cancel") }}
          </button>
          <button
            type="button"
            class="btn-primary"
            :disabled="deleting"
            @click="confirmDelete"
          >
            {{
              deleting
                ? $t("purchaseNotes.messages.deleting")
                : $t("purchaseNotes.messages.confirmDelete")
            }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="message" class="toast-backdrop">
      <div class="toast" :class="message.type">
        <p class="toast-text">{{ message.text }}</p>
        <button
          v-if="message.type === 'error'"
          type="button"
          class="btn-secondary"
          @click="clearMessage"
        >
          {{ $t("purchaseNotes.messages.acknowledge") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import SectionTitle from "../components/SectionTitle.vue";
import api from "../services/api";

type NoteStatus = "DRAFT" | "CONFIRMED" | "CANCELLED";

interface Supplier {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
}

interface PurchaseNote {
  id: number;
  supplier_id: number;
  date: string;
  status: NoteStatus;
  total_amount?: number;
  paid_amount: number;
}

interface PurchaseLine {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
}

const { t } = useI18n();

const suppliers = ref<Supplier[]>([]);
const products = ref<Product[]>([]);
const notes = ref<PurchaseNote[]>([]);
const currentLines = ref<PurchaseLine[]>([]);
const linesEndpointFailed = ref(false);

const message = ref<{ text: string; type: "info" | "error" } | null>(null);
const messageTimeout = ref<number | null>(null);
const saving = ref(false);
const confirming = ref(false);
const lineSaving = ref(false);
const deleting = ref(false);

const isEditing = ref(false);
const editingId = ref<number | null>(null);
const isEditingLine = ref(false);
const editingLineId = ref<number | null>(null);
const deleteTargetId = ref<number | null>(null);

const filters = reactive({
  search: "",
  supplier_id: "all" as "all" | number,
  status: "all" as "all" | NoteStatus,
  date_from: "",
  date_to: "",
});

const form = reactive({
  supplier_id: "" as "" | number,
  date: new Date().toISOString().slice(0, 10),
  paid_amount: 0,
});

const lineForm = reactive({
  product_id: "" as "" | number,
  quantity: 0,
  unit_price: 0,
  total_price: 0,
});

const normalizeDate = (value?: string) => {
  if (!value) return "";
  return value.includes("T") ? value.slice(0, 10) : value;
};

const toDateOnly = (value: string) => normalizeDate(value);

const selectedNote = computed(() =>
  notes.value.find((note) => note.id === editingId.value)
);

const currentStatus = computed<NoteStatus>(() =>
  selectedNote.value?.status || "DRAFT"
);

const isReadOnly = computed(() =>
  selectedNote.value ? selectedNote.value.status !== "DRAFT" : false
);

const canEditLines = computed(() => Boolean(editingId.value));

const canConfirm = computed(() =>
  Boolean(editingId.value) &&
  !isReadOnly.value &&
  currentLines.value.length > 0
);

const displayTotal = computed(() =>
  Number(
    (selectedNote.value?.total_amount ?? sumLines(currentLines.value)).toFixed(2)
  )
);

const pendingTotal = computed(() =>
  Number((displayTotal.value - Number(form.paid_amount || 0)).toFixed(2))
);

const filteredNotes = computed(() => {
  return notes.value.filter((note) => {
    const search = filters.search.trim().toLowerCase();
    const supplierMatch =
      filters.supplier_id === "all" || note.supplier_id === filters.supplier_id;
    const statusMatch =
      filters.status === "all" || note.status === filters.status;

    const dateValue = note.date ? new Date(note.date) : null;
    const fromMatch = filters.date_from
      ? dateValue && dateValue >= new Date(filters.date_from)
      : true;
    const toMatch = filters.date_to
      ? dateValue && dateValue <= new Date(filters.date_to)
      : true;

    const supplierLabel = supplierName(note.supplier_id).toLowerCase();
    const searchMatch =
      !search ||
      supplierLabel.includes(search) ||
      String(note.id).includes(search);

    return supplierMatch && statusMatch && fromMatch && toMatch && searchMatch;
  });
});

const supplierName = (supplierId: number) => {
  const supplier = suppliers.value.find((item) => item.id === supplierId);
  return supplier?.name || `#${supplierId}`;
};

const productName = (productId: number) => {
  const product = products.value.find((item) => item.id === productId);
  return product?.name || `#${productId}`;
};

const statusLabel = (status?: NoteStatus) => {
  switch (status) {
    case "CONFIRMED":
      return t("purchaseNotes.status.confirmed");
    case "CANCELLED":
      return t("purchaseNotes.status.cancelled");
    default:
      return t("purchaseNotes.status.draft");
  }
};

const sumLines = (lines: PurchaseLine[]) =>
  lines.reduce((acc, line) => acc + Number(line.total_price || 0), 0);

const extractErrorMessage = (err: unknown) => {
  const response = (err as { response?: { data?: { message?: string } } })
    .response;
  const messageText = response?.data?.message;
  return typeof messageText === "string" ? messageText : "";
};

const clearMessage = () => {
  if (messageTimeout.value) {
    window.clearTimeout(messageTimeout.value);
    messageTimeout.value = null;
  }
  message.value = null;
};

const showMessage = (text: string, type: "info" | "error" = "info") => {
  if (!text) return;
  if (message.value?.type === "error" && type !== "error") return;
  if (messageTimeout.value) {
    window.clearTimeout(messageTimeout.value);
    messageTimeout.value = null;
  }
  message.value = { text, type };
  if (type !== "error") {
    messageTimeout.value = window.setTimeout(() => {
      message.value = null;
      messageTimeout.value = null;
    }, 5000);
  }
};

const showError = (text: string) => showMessage(text, "error");

const syncPaidAmountWarning = () => {
  const warningText = t("purchaseNotes.messages.paidAmountWarning");
  if (Number(form.paid_amount || 0) > displayTotal.value) {
    showMessage(warningText, "info");
  } else if (message.value?.text === warningText) {
    clearMessage();
  }
};

const requestDelete = (note: PurchaseNote) => {
  if (note.status !== "DRAFT") return;
  deleteTargetId.value = note.id;
};

const clearDeleteTarget = () => {
  deleteTargetId.value = null;
};

const resetFilters = () => {
  filters.search = "";
  filters.supplier_id = "all";
  filters.status = "all";
  filters.date_from = "";
  filters.date_to = "";
};

const resetForm = () => {
  isEditing.value = false;
  editingId.value = null;
  form.supplier_id = "";
  form.date = new Date().toISOString().slice(0, 10);
  form.paid_amount = 0;
  currentLines.value = [];
  resetLineForm();
};

const resetLineForm = () => {
  isEditingLine.value = false;
  editingLineId.value = null;
  lineForm.product_id = "";
  lineForm.quantity = 0;
  lineForm.unit_price = 0;
  lineForm.total_price = 0;
};

const updateTotalFromUnit = () => {
  lineForm.total_price = Number(
    (Number(lineForm.quantity || 0) * Number(lineForm.unit_price || 0)).toFixed(2)
  );
};

const updateUnitFromTotal = () => {
  const qty = Number(lineForm.quantity || 0);
  if (qty <= 0) return;
  lineForm.unit_price = Number(
    (Number(lineForm.total_price || 0) / qty).toFixed(2)
  );
};

const fetchSuppliers = async () => {
  try {
    const { data } = await api.get<Supplier[]>("/suppliers/");
    suppliers.value = data;
  } catch (err) {
    console.error(err);
  }
};

const fetchProducts = async () => {
  try {
    const { data } = await api.get<Product[]>("/products/");
    products.value = data;
  } catch (err) {
    console.error(err);
  }
};

const fetchNotes = async () => {
  try {
    const { data } = await api.get<PurchaseNote[]>("/purchase_notes/");
    notes.value = data;
  } catch (err) {
    console.error(err);
    showError(t("purchaseNotes.messages.loadError"));
  }
};

const fetchLines = async (noteId: number) => {
  const lineEndpoints = [
    `/purchase_notes/${noteId}/lines`,
    `/purchase_notes/purchase_lines/?purchase_note_id=${noteId}`,
  ];

  if (!linesEndpointFailed.value) {
    for (const endpoint of lineEndpoints) {
      try {
        const { data } = await api.get<PurchaseLine[]>(endpoint);
        currentLines.value = data;
        return;
      } catch (err) {
        console.error(err);
      }
    }
    linesEndpointFailed.value = true;
  }

  try {
    const { data } = await api.get<{ lines?: PurchaseLine[] }>(
      `/purchase_notes/${noteId}`
    );
    if (Array.isArray(data.lines)) {
      currentLines.value = data.lines;
      syncPaidAmountWarning();
      return;
    }
  } catch (err) {
    console.error(err);
  }

  currentLines.value = [];
  showError(t("purchaseNotes.messages.linesError"));
};

const startEdit = async (note: PurchaseNote) => {
  isEditing.value = true;
  editingId.value = note.id;
  form.supplier_id = note.supplier_id;
  form.date = normalizeDate(note.date);
  form.paid_amount = note.paid_amount;
  clearMessage();
  await fetchLines(note.id);
  syncPaidAmountWarning();
};

const handleSubmit = async () => {
  if (!form.supplier_id) return;
  if (!isEditing.value && Number(form.paid_amount) !== 0) {
    showError(t("purchaseNotes.messages.paidAmountDraftError"));
    return;
  }
  if (Number(form.paid_amount) > displayTotal.value) {
    showError(t("purchaseNotes.messages.paidAmountError"));
    return;
  }
  saving.value = true;
  clearMessage();
  try {
    if (isEditing.value && editingId.value) {
      await api.put(`/purchase_notes/${editingId.value}`, {
        supplier_id: form.supplier_id,
        date: toDateOnly(form.date),
        paid_amount: form.paid_amount,
      });
      showMessage(t("purchaseNotes.messages.updated"));
    } else {
      const { data } = await api.post<PurchaseNote>("/purchase_notes/", {
        supplier_id: form.supplier_id,
        date: toDateOnly(form.date),
        paid_amount: form.paid_amount,
      });
      showMessage(t("purchaseNotes.messages.created"));
      isEditing.value = true;
      editingId.value = data.id;
    }
    await fetchNotes();
    if (editingId.value) {
      await fetchLines(editingId.value);
    }
    syncPaidAmountWarning();
  } catch (err) {
    console.error(err);
    showError(t("purchaseNotes.messages.saveError"));
  } finally {
    saving.value = false;
  }
};

const handleLineSubmit = async () => {
  if (!editingId.value || !lineForm.product_id) return;
  if (Number(lineForm.quantity) <= 0) {
    showError(t("purchaseNotes.messages.lineQuantityError"));
    return;
  }
  lineSaving.value = true;
  clearMessage();
  try {
    if (isEditingLine.value && editingLineId.value) {
      await api.put(`/purchase_notes/${editingId.value}/lines/${editingLineId.value}`, {
        product_id: lineForm.product_id,
        quantity: lineForm.quantity,
        unit_price: lineForm.unit_price,
        total_price: lineForm.total_price,
      });
      showMessage(t("purchaseNotes.messages.lineUpdated"));
    } else {
      await api.post(`/purchase_notes/${editingId.value}/lines`, {
        product_id: lineForm.product_id,
        quantity: lineForm.quantity,
        unit_price: lineForm.unit_price,
        total_price: lineForm.total_price,
      });
      showMessage(t("purchaseNotes.messages.lineCreated"));
    }
    await fetchLines(editingId.value);
    await fetchNotes();
    resetLineForm();
    syncPaidAmountWarning();
  } catch (err) {
    console.error(err);
    showError(t("purchaseNotes.messages.lineSaveError"));
  } finally {
    lineSaving.value = false;
  }
};

const startEditLine = (line: PurchaseLine) => {
  if (isReadOnly.value) return;
  isEditingLine.value = true;
  editingLineId.value = line.id;
  lineForm.product_id = line.product_id;
  lineForm.quantity = line.quantity;
  lineForm.unit_price = line.unit_price;
  lineForm.total_price = line.total_price;
};

const deleteLine = async (line: PurchaseLine) => {
  if (!editingId.value || isReadOnly.value) return;
  try {
    await api.delete(`/purchase_notes/${editingId.value}/lines/${line.id}`);
    showMessage(t("purchaseNotes.messages.lineDeleted"));
    await fetchLines(editingId.value);
    await fetchNotes();
    syncPaidAmountWarning();
  } catch (err) {
    console.error(err);
    try {
      await api.delete(`/purchase_notes/lines/${line.id}`);
      showMessage(t("purchaseNotes.messages.lineDeleted"));
      await fetchLines(editingId.value);
      await fetchNotes();
      syncPaidAmountWarning();
    } catch (fallbackErr) {
      console.error(fallbackErr);
      showError(t("purchaseNotes.messages.lineDeleteError"));
    }
  }
};

const confirmNote = async () => {
  if (!editingId.value) return;
  await confirmNoteById(editingId.value);
};

const confirmNoteById = async (noteId: number) => {
  if (pendingTotal.value < 0) {
    showError(t("purchaseNotes.messages.paidAmountError"));
    return;
  }
  confirming.value = true;
  clearMessage();
  try {
    await api.post(`/purchase_notes/${noteId}/confirm`);
    showMessage(t("purchaseNotes.messages.confirmed"));
    await fetchNotes();
    if (editingId.value === noteId) {
      await fetchLines(noteId);
    }
  } catch (err) {
    console.error(err);
    showError(
      extractErrorMessage(err) || t("purchaseNotes.messages.confirmError")
    );
  } finally {
    confirming.value = false;
  }
};

const confirmDelete = async () => {
  if (!deleteTargetId.value) return;
  deleting.value = true;
  clearMessage();
  try {
    await api.delete(`/purchase_notes/${deleteTargetId.value}`);
    showMessage(t("purchaseNotes.messages.deleted"));
    if (editingId.value === deleteTargetId.value) {
      resetForm();
    }
    await fetchNotes();
    clearDeleteTarget();
  } catch (err) {
    console.error(err);
    showError(extractErrorMessage(err) || t("purchaseNotes.messages.deleteError"));
  } finally {
    deleting.value = false;
  }
};

onMounted(async () => {
  await Promise.all([fetchSuppliers(), fetchProducts(), fetchNotes()]);
});
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
  flex-wrap: wrap;
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

.summary {
  display: flex;
  gap: 2vw;
  flex-wrap: wrap;
  align-items: center;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 0.3vh;
  min-width: 140px;
}

.summary-label {
  color: var(--muted);
  font-size: 0.9rem;
}

.summary-value {
  font-weight: 700;
  font-size: 1rem;
}

.hint {
  color: var(--muted);
  margin-bottom: 1vh;
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
  min-width: 640px;
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

.toast-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 40;
  padding: 2vh 4vw;
}

.toast {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.2rem 1.6rem;
  min-width: 280px;
  max-width: 520px;
  text-align: center;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.toast.info {
  border-color: var(--primary);
}

.toast.error {
  border-color: var(--danger);
}

.toast-text {
  margin: 0;
  color: var(--text);
  font-weight: 600;
}

.dialog {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.4rem 1.6rem;
  min-width: 280px;
  max-width: 520px;
  text-align: center;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.dialog-text {
  margin: 0;
  color: var(--muted);
}
</style>

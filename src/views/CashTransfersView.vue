<template>
  <div class="page container column">
    <SectionTitle :level="1" align="center">
      {{ $t("cashTransfers.title") }}
    </SectionTitle>
    <p class="lead">{{ $t("cashTransfers.subtitle") }}</p>

    <section class="panel">
      <SectionTitle :level="2">{{ $t("cashTransfers.filters.title") }}</SectionTitle>
      <div class="filters">
        <label class="field">
          {{ $t("cashTransfers.filters.search") }}
          <input v-model="filters.search" type="text" />
        </label>
        <label class="field">
          {{ $t("cashTransfers.filters.status") }}
          <select v-model="filters.status">
            <option value="all">{{ $t("cashTransfers.filters.all") }}</option>
            <option value="DRAFT">{{ $t("cashTransfers.status.draft") }}</option>
            <option value="CONFIRMED">
              {{ $t("cashTransfers.status.confirmed") }}
            </option>
            <option value="CANCELLED">
              {{ $t("cashTransfers.status.cancelled") }}
            </option>
          </select>
        </label>
        <label class="field">
          {{ $t("cashTransfers.filters.fromAccount") }}
          <select v-model="filters.from_cash_account_id">
            <option value="all">{{ $t("cashTransfers.filters.all") }}</option>
            <option v-for="account in cashAccounts" :key="account.id" :value="account.id">
              {{ account.name }}
            </option>
          </select>
        </label>
        <label class="field">
          {{ $t("cashTransfers.filters.toAccount") }}
          <select v-model="filters.to_cash_account_id">
            <option value="all">{{ $t("cashTransfers.filters.all") }}</option>
            <option v-for="account in cashAccounts" :key="account.id" :value="account.id">
              {{ account.name }}
            </option>
          </select>
        </label>
        <label class="field">
          {{ $t("cashTransfers.filters.dateFrom") }}
          <input v-model="filters.date_from" type="date" />
        </label>
        <label class="field">
          {{ $t("cashTransfers.filters.dateTo") }}
          <input v-model="filters.date_to" type="date" />
        </label>
      </div>
      <div class="actions">
        <button type="button" class="btn-secondary" @click="resetFilters">
          {{ $t("cashTransfers.filters.clear") }}
        </button>
      </div>
    </section>

    <section class="panel">
      <SectionTitle :level="2">
        {{
          isEditing
            ? $t("cashTransfers.form.editTitle")
            : $t("cashTransfers.form.createTitle")
        }}
      </SectionTitle>
      <form class="form" @submit.prevent="handleSubmit">
        <div class="movement">
          <span class="field-label">{{ $t("cashTransfers.form.movementType") }}</span>
          <div class="movement-options">
            <label class="movement-option">
              <input
                v-model="movementType"
                type="radio"
                value="transfer"
                :disabled="isReadOnly"
                @change="handleMovementChange"
              />
              {{ $t("cashTransfers.movement.transfer") }}
            </label>
            <label class="movement-option">
              <input
                v-model="movementType"
                type="radio"
                value="inbound"
                :disabled="isReadOnly"
                @change="handleMovementChange"
              />
              {{ $t("cashTransfers.movement.inbound") }}
            </label>
            <label class="movement-option">
              <input
                v-model="movementType"
                type="radio"
                value="outbound"
                :disabled="isReadOnly"
                @change="handleMovementChange"
              />
              {{ $t("cashTransfers.movement.outbound") }}
            </label>
          </div>
        </div>

        <label class="field">
          {{ $t("cashTransfers.form.amount") }}
          <input
            v-model.number="form.amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="1500.00"
            :disabled="isReadOnly"
          />
        </label>

        <label class="field">
          {{ $t("cashTransfers.form.fromAccount") }}
          <select
            v-model="form.from_cash_account_id"
            :disabled="isReadOnly || movementType === 'inbound'"
            @change="refreshBalances"
          >
            <option value="">--</option>
            <option v-for="account in cashAccounts" :key="account.id" :value="account.id">
              {{ account.name }}
            </option>
          </select>
        </label>

        <label class="field">
          {{ $t("cashTransfers.form.fromBalance") }}
          <input type="text" :value="fromBalanceText" readonly />
        </label>

        <label class="field">
          {{ $t("cashTransfers.form.toAccount") }}
          <select
            v-model="form.to_cash_account_id"
            :disabled="isReadOnly || movementType === 'outbound'"
            @change="refreshBalances"
          >
            <option value="">--</option>
            <option v-for="account in cashAccounts" :key="account.id" :value="account.id">
              {{ account.name }}
            </option>
          </select>
        </label>

        <label class="field">
          {{ $t("cashTransfers.form.toBalance") }}
          <input type="text" :value="toBalanceText" readonly />
        </label>

        <label class="field">
          {{ $t("cashTransfers.form.date") }}
          <input
            v-model="form.date"
            type="date"
            placeholder="2026-01-26"
            :disabled="isReadOnly"
          />
        </label>

        <label class="field field-wide">
          {{ $t("cashTransfers.form.notes") }}
          <textarea
            v-model="form.notes"
            rows="3"
            placeholder="Ej: Ajuste por caja"
            :disabled="isReadOnly"
          />
        </label>

        <div class="summary">
          <div class="summary-item">
            <span class="summary-label">{{ $t("cashTransfers.form.status") }}</span>
            <span class="summary-value">{{ statusLabel(currentStatus) }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">{{ $t("cashTransfers.form.movement") }}</span>
            <span class="summary-value">{{ movementLabel }}</span>
          </div>
        </div>

        <div class="actions">
          <button type="submit" class="btn-primary" :disabled="saving || isReadOnly">
            {{
              saving
                ? $t("cashTransfers.form.saving")
                : $t("cashTransfers.form.save")
            }}
          </button>
          <button
            v-if="isEditing"
            type="button"
            class="btn-secondary"
            @click="resetForm"
          >
            {{ $t("cashTransfers.form.cancel") }}
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
                ? $t("cashTransfers.form.confirming")
                : $t("cashTransfers.form.confirm")
            }}
          </button>
        </div>
      </form>
    </section>

    <section class="panel">
      <SectionTitle :level="2">{{ $t("cashTransfers.list.title") }}</SectionTitle>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>{{ $t("cashTransfers.list.id") }}</th>
              <th>{{ $t("cashTransfers.list.date") }}</th>
              <th>{{ $t("cashTransfers.list.amount") }}</th>
              <th>{{ $t("cashTransfers.list.fromAccount") }}</th>
              <th>{{ $t("cashTransfers.list.toAccount") }}</th>
              <th>{{ $t("cashTransfers.list.status") }}</th>
              <th>{{ $t("cashTransfers.list.actions") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredNotes.length === 0">
              <td :colspan="7" class="empty">
                {{ $t("cashTransfers.list.empty") }}
              </td>
            </tr>
            <tr v-for="note in filteredNotes" :key="note.id">
              <td>{{ note.id }}</td>
              <td>{{ note.date }}</td>
              <td>{{ note.amount }}</td>
              <td>{{ accountName(note.from_cash_account_id) }}</td>
              <td>{{ accountName(note.to_cash_account_id) }}</td>
              <td>{{ statusLabel(note.status) }}</td>
              <td class="row-actions">
                <button class="link" @click="startEdit(note)">
                  {{ $t("cashTransfers.list.view") }}
                </button>
                <button
                  v-if="note.status === 'DRAFT'"
                  class="link"
                  @click="confirmNoteById(note.id)"
                >
                  {{ $t("cashTransfers.list.confirm") }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div v-if="message" class="toast-backdrop">
      <div class="toast" :class="message.type">
        <p class="toast-text">{{ message.text }}</p>
        <button
          v-if="message.type === 'error'"
          type="button"
          class="btn-secondary"
          @click="clearMessage"
        >
          {{ $t("cashTransfers.messages.acknowledge") }}
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

interface CashAccount {
  id: number;
  name: string;
  balance: number;
}

interface CashTransferNote {
  id: number;
  from_cash_account_id: number | null;
  to_cash_account_id: number | null;
  amount: number;
  date: string;
  status: NoteStatus;
  notes?: string;
}

const { t } = useI18n();

const cashAccounts = ref<CashAccount[]>([]);
const notes = ref<CashTransferNote[]>([]);

const message = ref<{ text: string; type: "info" | "error" } | null>(null);
const messageTimeout = ref<number | null>(null);

const saving = ref(false);
const confirming = ref(false);
const isEditing = ref(false);
const editingId = ref<number | null>(null);

const filters = reactive({
  search: "",
  status: "all" as "all" | NoteStatus,
  from_cash_account_id: "all" as "all" | number,
  to_cash_account_id: "all" as "all" | number,
  date_from: "",
  date_to: "",
});

const movementType = ref<"transfer" | "inbound" | "outbound">("transfer");

const form = reactive({
  amount: 0,
  from_cash_account_id: "" as "" | number,
  to_cash_account_id: "" as "" | number,
  date: new Date().toISOString().slice(0, 10),
  notes: "",
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

const canConfirm = computed(() => Boolean(editingId.value) && !isReadOnly.value);

const movementLabel = computed(() => {
  switch (movementType.value) {
    case "inbound":
      return t("cashTransfers.movement.inbound");
    case "outbound":
      return t("cashTransfers.movement.outbound");
    default:
      return t("cashTransfers.movement.transfer");
  }
});

const fromAccount = computed(() =>
  cashAccounts.value.find((account) => account.id === form.from_cash_account_id)
);

const toAccount = computed(() =>
  cashAccounts.value.find((account) => account.id === form.to_cash_account_id)
);

const fromBalanceText = computed(() => {
  if (!form.from_cash_account_id) return t("cashTransfers.form.balanceEmpty");
  return fromAccount.value ? `${fromAccount.value.balance}` : "--";
});

const toBalanceText = computed(() => {
  if (!form.to_cash_account_id) return t("cashTransfers.form.balanceEmpty");
  return toAccount.value ? `${toAccount.value.balance}` : "--";
});

const filteredNotes = computed(() => {
  return notes.value.filter((note) => {
    const search = filters.search.trim().toLowerCase();
    const statusMatch = filters.status === "all" || note.status === filters.status;
    const fromMatch =
      filters.from_cash_account_id === "all" ||
      note.from_cash_account_id === filters.from_cash_account_id;
    const toMatch =
      filters.to_cash_account_id === "all" ||
      note.to_cash_account_id === filters.to_cash_account_id;

    const dateValue = note.date ? new Date(note.date) : null;
    const fromDateMatch = filters.date_from
      ? dateValue && dateValue >= new Date(filters.date_from)
      : true;
    const toDateMatch = filters.date_to
      ? dateValue && dateValue <= new Date(filters.date_to)
      : true;

    const fromLabel = accountName(note.from_cash_account_id).toLowerCase();
    const toLabel = accountName(note.to_cash_account_id).toLowerCase();
    const notesLabel = note.notes?.toLowerCase() ?? "";
    const searchMatch =
      !search ||
      fromLabel.includes(search) ||
      toLabel.includes(search) ||
      notesLabel.includes(search) ||
      String(note.id).includes(search);

    return statusMatch && fromMatch && toMatch && fromDateMatch && toDateMatch && searchMatch;
  });
});

const accountName = (accountId: number | null) => {
  if (!accountId) return t("cashTransfers.form.noAccount");
  const account = cashAccounts.value.find((item) => item.id === accountId);
  return account?.name || `#${accountId}`;
};

const statusLabel = (status?: NoteStatus) => {
  switch (status) {
    case "CONFIRMED":
      return t("cashTransfers.status.confirmed");
    case "CANCELLED":
      return t("cashTransfers.status.cancelled");
    default:
      return t("cashTransfers.status.draft");
  }
};

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

const resetFilters = () => {
  filters.search = "";
  filters.status = "all";
  filters.from_cash_account_id = "all";
  filters.to_cash_account_id = "all";
  filters.date_from = "";
  filters.date_to = "";
};

const resetForm = () => {
  isEditing.value = false;
  editingId.value = null;
  form.amount = 0;
  form.from_cash_account_id = "";
  form.to_cash_account_id = "";
  form.date = new Date().toISOString().slice(0, 10);
  form.notes = "";
  movementType.value = "transfer";
};

const fetchCashAccounts = async () => {
  try {
    const { data } = await api.get<CashAccount[]>("/cash_accounts/");
    cashAccounts.value = data;
  } catch (err) {
    console.error(err);
  }
};

const refreshBalances = async () => {
  await fetchCashAccounts();
};

const fetchNotes = async () => {
  try {
    const { data } = await api.get<CashTransferNote[]>("/cash_transfer_notes/");
    notes.value = data;
  } catch (err) {
    console.error(err);
    showError(t("cashTransfers.messages.loadError"));
  }
};

const startEdit = (note: CashTransferNote) => {
  isEditing.value = true;
  editingId.value = note.id;
  form.amount = note.amount;
  form.from_cash_account_id = note.from_cash_account_id ?? "";
  form.to_cash_account_id = note.to_cash_account_id ?? "";
  form.date = normalizeDate(note.date);
  form.notes = note.notes ?? "";
  if (note.from_cash_account_id && note.to_cash_account_id) {
    movementType.value = "transfer";
  } else if (note.to_cash_account_id) {
    movementType.value = "inbound";
  } else {
    movementType.value = "outbound";
  }
  clearMessage();
};

const handleMovementChange = () => {
  if (movementType.value === "inbound") {
    form.from_cash_account_id = "";
  }
  if (movementType.value === "outbound") {
    form.to_cash_account_id = "";
  }
};

const validateForm = () => {
  if (Number(form.amount) <= 0) {
    showError(t("cashTransfers.messages.amountError"));
    return false;
  }
  const hasFrom = Boolean(form.from_cash_account_id);
  const hasTo = Boolean(form.to_cash_account_id);
  if (movementType.value === "transfer" && (!hasFrom || !hasTo)) {
    showError(t("cashTransfers.messages.requiresAccount"));
    return false;
  }
  if (movementType.value === "inbound" && !hasTo) {
    showError(t("cashTransfers.messages.requiresAccount"));
    return false;
  }
  if (movementType.value === "outbound" && !hasFrom) {
    showError(t("cashTransfers.messages.requiresAccount"));
    return false;
  }
  if (hasFrom && hasTo && Number(form.from_cash_account_id) === Number(form.to_cash_account_id)) {
    showError(t("cashTransfers.messages.sameAccountError"));
    return false;
  }
  return true;
};

const handleSubmit = async () => {
  if (!validateForm()) return;
  saving.value = true;
  clearMessage();
  const payload: Record<string, unknown> = {
    amount: form.amount,
    date: toDateOnly(form.date),
    notes: form.notes,
  };
  if (form.from_cash_account_id) {
    payload.from_cash_account_id = form.from_cash_account_id;
  }
  if (form.to_cash_account_id) {
    payload.to_cash_account_id = form.to_cash_account_id;
  }
  try {
    if (isEditing.value && editingId.value) {
      await api.put(`/cash_transfer_notes/${editingId.value}`, payload);
      showMessage(t("cashTransfers.messages.updated"));
    } else {
      const { data } = await api.post<CashTransferNote>("/cash_transfer_notes/", payload);
      showMessage(t("cashTransfers.messages.created"));
      isEditing.value = true;
      editingId.value = data.id;
    }
    await fetchNotes();
    await fetchCashAccounts();
  } catch (err) {
    console.error(err);
    const apiMessage = extractErrorMessage(err);
    if (apiMessage === "CashTransfer requires from_cash_account_id or to_cash_account_id") {
      showError(t("cashTransfers.messages.requiresAccount"));
    } else if (apiMessage === "Transfer amount must be greater than zero") {
      showError(t("cashTransfers.messages.amountError"));
    } else if (apiMessage === "Source and destination cash accounts must be different") {
      showError(t("cashTransfers.messages.sameAccountError"));
    } else if (apiMessage === "CashAccount not found") {
      showError(t("cashTransfers.messages.accountNotFound"));
    } else {
      showError(t("cashTransfers.messages.saveError"));
    }
  } finally {
    saving.value = false;
  }
};

const confirmNote = async () => {
  if (!editingId.value) return;
  await confirmNoteById(editingId.value);
};

const confirmNoteById = async (noteId: number) => {
  confirming.value = true;
  clearMessage();
  try {
    await api.post(`/cash_transfer_notes/${noteId}/confirm`);
    showMessage(t("cashTransfers.messages.confirmed"));
    await fetchNotes();
    await fetchCashAccounts();
    if (editingId.value === noteId) {
      resetForm();
    }
  } catch (err) {
    console.error(err);
    const apiMessage = extractErrorMessage(err);
    if (apiMessage === "CashTransfer requires from_cash_account_id or to_cash_account_id") {
      showError(t("cashTransfers.messages.requiresAccount"));
    } else if (apiMessage === "Transfer amount must be greater than zero") {
      showError(t("cashTransfers.messages.amountError"));
    } else if (apiMessage === "Source and destination cash accounts must be different") {
      showError(t("cashTransfers.messages.sameAccountError"));
    } else if (apiMessage === "CashAccount not found") {
      showError(t("cashTransfers.messages.accountNotFound"));
    } else if (apiMessage === "CashAccount balance cannot become negative") {
      showError(t("cashTransfers.messages.negativeBalance"));
    } else {
      showError(t("cashTransfers.messages.confirmError"));
    }
  } finally {
    confirming.value = false;
  }
};

onMounted(async () => {
  await Promise.all([fetchCashAccounts(), fetchNotes()]);
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

.movement {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 0.6vh;
}

.movement-options {
  display: flex;
  gap: 1.5vw;
  flex-wrap: wrap;
}

.movement-option {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 600;
}

.field-label {
  font-weight: 600;
}

.field-wide {
  grid-column: 1 / -1;
}

.field input,
.field select,
.field textarea {
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
  grid-column: 1 / -1;
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

.payload-example {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 0.6vh;
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
  min-width: 760px;
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

.empty {
  text-align: center;
  color: var(--muted);
  padding: 1.2vh 0;
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
</style>

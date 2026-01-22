<template>
  <div class="page container column">
    <SectionTitle :level="1" align="center">
      {{ $t("salesNotes.title") }}
    </SectionTitle>
    <p class="lead">{{ $t("salesNotes.subtitle") }}</p>

    <section class="panel">
      <SectionTitle :level="2">{{ $t("salesNotes.filters.title") }}</SectionTitle>
      <div class="filters">
        <label class="field">
          {{ $t("salesNotes.filters.search") }}
          <input v-model="filters.search" type="text" />
        </label>
        <label class="field">
          {{ $t("salesNotes.filters.customer") }}
          <select v-model="filters.customer_id">
            <option value="all">{{ $t("salesNotes.filters.all") }}</option>
            <option
              v-for="customer in customers"
              :key="customer.id"
              :value="customer.id"
            >
              {{ customer.name }}
            </option>
          </select>
        </label>
        <label class="field">
          {{ $t("salesNotes.filters.status") }}
          <select v-model="filters.status">
            <option value="all">{{ $t("salesNotes.filters.all") }}</option>
            <option value="DRAFT">{{ $t("salesNotes.status.draft") }}</option>
            <option value="CONFIRMED">
              {{ $t("salesNotes.status.confirmed") }}
            </option>
            <option value="CANCELLED">
              {{ $t("salesNotes.status.cancelled") }}
            </option>
          </select>
        </label>
        <label class="field">
          {{ $t("salesNotes.filters.dateFrom") }}
          <input v-model="filters.date_from" type="date" />
        </label>
        <label class="field">
          {{ $t("salesNotes.filters.dateTo") }}
          <input v-model="filters.date_to" type="date" />
        </label>
      </div>
      <div class="actions">
        <button type="button" class="btn-secondary" @click="resetFilters">
          {{ $t("salesNotes.filters.clear") }}
        </button>
      </div>
    </section>

    <section class="panel">
      <SectionTitle :level="2">
        {{
          isEditing
            ? $t("salesNotes.form.editTitle")
            : $t("salesNotes.form.createTitle")
        }}
      </SectionTitle>
      <form class="form" @submit.prevent="handleSubmit">
        <label class="field">
          {{ $t("salesNotes.form.customer") }}
          <select v-model="form.customer_id" :disabled="isReadOnly">
            <option value="">--</option>
            <option
              v-for="customer in customers"
              :key="customer.id"
              :value="customer.id"
            >
              {{ customer.name }}
            </option>
          </select>
        </label>

        <label class="field">
          {{ $t("salesNotes.form.date") }}
          <input v-model="form.date" type="date" :disabled="isReadOnly" />
        </label>

        <label class="field">
          {{ $t("salesNotes.form.paid") }}
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
            <span class="summary-label">{{ $t("salesNotes.form.total") }}</span>
            <span class="summary-value">{{ displayTotal }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">{{ $t("salesNotes.form.pending") }}</span>
            <span class="summary-value">{{ pendingTotal }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">{{ $t("salesNotes.form.status") }}</span>
            <span class="summary-value">{{ statusLabel(currentStatus) }}</span>
          </div>
        </div>

        <div class="actions">
          <button type="submit" class="btn-primary" :disabled="saving || isReadOnly">
            {{ saving ? $t("salesNotes.form.saving") : $t("salesNotes.form.save") }}
          </button>
          <button
            v-if="isEditing"
            type="button"
            class="btn-secondary"
            @click="resetForm"
          >
            {{ $t("salesNotes.form.cancel") }}
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
                ? $t("salesNotes.form.confirming")
                : $t("salesNotes.form.confirm")
            }}
          </button>
        </div>
      </form>
    </section>

    <section class="panel">
      <SectionTitle :level="2">{{ $t("salesNotes.lines.title") }}</SectionTitle>
      <p v-if="!canEditLines" class="hint">
        {{ $t("salesNotes.lines.helper") }}
      </p>
      <form class="form" @submit.prevent="handleLineSubmit">
        <label class="field">
          {{ $t("salesNotes.lines.product") }}
          <select
            v-model="lineForm.product_id"
            :disabled="!canEditLines || isReadOnly"
          >
            <option value="">--</option>
            <option
              v-for="product in inventoryProducts"
              :key="product.id"
              :value="product.id"
            >
              {{ product.name }}
            </option>
          </select>
        </label>

        <label class="field">
          Disponible
          <input type="text" :value="availableStockText" readonly />
        </label>

        <label class="field">
          {{ $t("salesNotes.lines.quantity") }}
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
          {{ $t("salesNotes.lines.unitPrice") }}
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
          {{ $t("salesNotes.lines.totalPrice") }}
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
                ? $t("salesNotes.lines.saving")
                : isEditingLine
                ? $t("salesNotes.lines.update")
                : $t("salesNotes.lines.add")
            }}
          </button>
          <button
            v-if="isEditingLine"
            type="button"
            class="btn-secondary"
            :disabled="lineSaving"
            @click="resetLineForm"
          >
            {{ $t("salesNotes.lines.cancel") }}
          </button>
        </div>
      </form>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>{{ $t("salesNotes.lines.product") }}</th>
              <th>{{ $t("salesNotes.lines.quantity") }}</th>
              <th>{{ $t("salesNotes.lines.unitPrice") }}</th>
              <th>{{ $t("salesNotes.lines.totalPrice") }}</th>
              <th>{{ $t("salesNotes.list.actions") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="currentLines.length === 0">
              <td :colspan="5" class="empty">
                {{ $t("salesNotes.lines.empty") }}
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
                  {{ $t("salesNotes.lines.edit") }}
                </button>
                <button
                  class="link danger"
                  :disabled="isReadOnly"
                  @click="deleteLine(line)"
                >
                  {{ $t("salesNotes.lines.delete") }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="panel">
      <SectionTitle :level="2">{{ $t("salesNotes.list.title") }}</SectionTitle>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>{{ $t("salesNotes.list.id") }}</th>
              <th>{{ $t("salesNotes.list.date") }}</th>
              <th>{{ $t("salesNotes.list.customer") }}</th>
              <th>{{ $t("salesNotes.list.total") }}</th>
              <th>{{ $t("salesNotes.list.paid") }}</th>
              <th>{{ $t("salesNotes.list.status") }}</th>
              <th>{{ $t("salesNotes.list.actions") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredNotes.length === 0">
              <td :colspan="7" class="empty">
                {{ $t("salesNotes.list.empty") }}
              </td>
            </tr>
            <tr v-for="note in filteredNotes" :key="note.id">
              <td>{{ note.id }}</td>
              <td>{{ note.date }}</td>
              <td>{{ customerName(note.customer_id) }}</td>
              <td>{{ note.total_amount ?? 0 }}</td>
              <td>{{ note.paid_amount }}</td>
              <td>{{ statusLabel(note.status) }}</td>
              <td class="row-actions">
                <button class="link" @click="startEdit(note)">
                  {{ $t("salesNotes.list.view") }}
                </button>
                <button
                  v-if="note.status === 'DRAFT'"
                  class="link"
                  @click="confirmNoteById(note.id)"
                >
                  {{ $t("salesNotes.list.confirm") }}
                </button>
                <button
                  v-if="note.status === 'DRAFT'"
                  class="link danger"
                  @click="requestDelete(note)"
                >
                  {{ $t("salesNotes.list.delete") }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div v-if="deleteTargetId" class="toast-backdrop">
      <div class="dialog">
        <p class="toast-text">{{ $t("salesNotes.messages.deleteConfirmTitle") }}</p>
        <p class="dialog-text">{{ $t("salesNotes.messages.deleteConfirmBody") }}</p>
        <div class="actions">
          <button
            type="button"
            class="btn-secondary"
            @click="clearDeleteTarget"
          >
            {{ $t("salesNotes.messages.cancel") }}
          </button>
          <button
            type="button"
            class="btn-primary"
            :disabled="deleting"
            @click="confirmDelete"
          >
            {{
              deleting
                ? $t("salesNotes.messages.deleting")
                : $t("salesNotes.messages.confirmDelete")
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
          {{ $t("salesNotes.messages.acknowledge") }}
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

interface Customer {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  is_inventory: boolean;
}

interface SalesNote {
  id: number;
  customer_id: number;
  date: string;
  status: NoteStatus;
  total_amount?: number;
  paid_amount: number;
}

interface SalesLine {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface StockLocation {
  id: number;
  name: string;
}

interface StockProductLocation {
  id: number;
  product_id: number;
  stock_location_id: number;
  quantity: number;
}

const { t } = useI18n();

const customers = ref<Customer[]>([]);
const products = ref<Product[]>([]);
const notes = ref<SalesNote[]>([]);
const currentLines = ref<SalesLine[]>([]);
const stockLocations = ref<StockLocation[]>([]);
const stockProducts = ref<StockProductLocation[]>([]);
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
  customer_id: "all" as "all" | number,
  status: "all" as "all" | NoteStatus,
  date_from: "",
  date_to: "",
});

const form = reactive({
  customer_id: "" as "" | number,
  date: new Date().toISOString().slice(0, 10),
  paid_amount: 0,
});

const lineForm = reactive({
  product_id: "" as "" | number,
  quantity: 0,
  unit_price: 0,
  total_price: 0,
});

const DEME_STOCK_NAME = "DEME_STOCK";
const customerStockName = (customerId: number) => `customer_${customerId}_stock`;

const normalizeDate = (value?: string) => {
  if (!value) return "";
  return value.includes("T") ? value.slice(0, 10) : value;
};

const toDateOnly = (value: string) => normalizeDate(value);

const selectedNote = computed(() =>
  notes.value.find((note) => note.id === editingId.value)
);

const inventoryProducts = computed(() =>
  products.value.filter((product) => product.is_inventory)
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

const demestockId = computed(() => {
  return stockLocations.value.find((item) => item.name === DEME_STOCK_NAME)?.id ?? null;
});

const customerStockId = computed(() => {
  if (!form.customer_id) return null;
  const name = customerStockName(Number(form.customer_id));
  return stockLocations.value.find((item) => item.name === name)?.id ?? null;
});

const selectedProduct = computed(() =>
  products.value.find((product) => product.id === lineForm.product_id)
);

const availableStock = computed(() => {
  if (!lineForm.product_id || !form.customer_id) return null;
  if (selectedProduct.value && !selectedProduct.value.is_inventory) return null;
  const productId = Number(lineForm.product_id);
  const locationIds = [demestockId.value, customerStockId.value].filter(
    (id): id is number => typeof id === "number"
  );
  if (locationIds.length === 0) return 0;
  return locationIds.reduce((total, locationId) => {
    const qty = stockProducts.value
      .filter(
        (row) =>
          row.product_id === productId && row.stock_location_id === locationId
      )
      .reduce((sum, row) => sum + Number(row.quantity || 0), 0);
    return total + qty;
  }, 0);
});

const availableStockText = computed(() => {
  if (!lineForm.product_id || !form.customer_id) {
    return t("salesNotes.lines.availableUnknown");
  }
  if (selectedProduct.value && !selectedProduct.value.is_inventory) {
    return t("salesNotes.lines.availableNotInventory");
  }
  return availableStock.value?.toString() ?? "0";
});

const filteredNotes = computed(() => {
  return notes.value.filter((note) => {
    const search = filters.search.trim().toLowerCase();
    const customerMatch =
      filters.customer_id === "all" || note.customer_id === filters.customer_id;
    const statusMatch =
      filters.status === "all" || note.status === filters.status;

    const dateValue = note.date ? new Date(note.date) : null;
    const fromMatch = filters.date_from
      ? dateValue && dateValue >= new Date(filters.date_from)
      : true;
    const toMatch = filters.date_to
      ? dateValue && dateValue <= new Date(filters.date_to)
      : true;

    const customerLabel = customerName(note.customer_id).toLowerCase();
    const searchMatch =
      !search ||
      customerLabel.includes(search) ||
      String(note.id).includes(search);

    return customerMatch && statusMatch && fromMatch && toMatch && searchMatch;
  });
});

const customerName = (customerId: number) => {
  const customer = customers.value.find((item) => item.id === customerId);
  return customer?.name || `#${customerId}`;
};

const productName = (productId: number) => {
  const product = products.value.find((item) => item.id === productId);
  return product?.name || `#${productId}`;
};

const statusLabel = (status?: NoteStatus) => {
  switch (status) {
    case "CONFIRMED":
      return t("salesNotes.status.confirmed");
    case "CANCELLED":
      return t("salesNotes.status.cancelled");
    default:
      return t("salesNotes.status.draft");
  }
};

const sumLines = (lines: SalesLine[]) =>
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
  const warningText = t("salesNotes.messages.paidAmountWarning");
  if (Number(form.paid_amount || 0) > displayTotal.value) {
    showMessage(warningText, "info");
  } else if (message.value?.text === warningText) {
    clearMessage();
  }
};

const resetFilters = () => {
  filters.search = "";
  filters.customer_id = "all";
  filters.status = "all";
  filters.date_from = "";
  filters.date_to = "";
};

const resetForm = () => {
  isEditing.value = false;
  editingId.value = null;
  form.customer_id = "";
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

const fetchStockLocations = async () => {
  try {
    const { data } = await api.get<StockLocation[]>("/stock_locations/");
    stockLocations.value = data;
  } catch (err) {
    console.error(err);
  }
};

const fetchStockProducts = async () => {
  try {
    const { data } = await api.get<StockProductLocation[]>(
      "/stock_product_locations/"
    );
    stockProducts.value = data;
  } catch (err) {
    console.error(err);
  }
};

const fetchCustomers = async () => {
  try {
    const { data } = await api.get<Customer[]>("/customers/");
    customers.value = data;
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
    const { data } = await api.get<SalesNote[]>("/sales_notes/");
    notes.value = data;
  } catch (err) {
    console.error(err);
    showError(t("salesNotes.messages.loadError"));
  }
};

const fetchLines = async (noteId: number) => {
  const lineEndpoints = [
    `/sales_notes/${noteId}/lines`,
    `/sales_notes/sales_lines/?sales_note_id=${noteId}`,
  ];

  for (const endpoint of lineEndpoints) {
    try {
      const { data } = await api.get<SalesLine[]>(endpoint);
      currentLines.value = data;
      syncPaidAmountWarning();
      return;
    } catch (err) {
      console.error(err);
    }
  }

  try {
    const { data } = await api.get<{ lines?: SalesLine[] }>(
      `/sales_notes/${noteId}`
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
  showError(t("salesNotes.messages.linesError"));
};

const startEdit = async (note: SalesNote) => {
  isEditing.value = true;
  editingId.value = note.id;
  form.customer_id = note.customer_id;
  form.date = normalizeDate(note.date);
  form.paid_amount = note.paid_amount;
  clearMessage();
  await fetchLines(note.id);
  syncPaidAmountWarning();
};

const handleSubmit = async () => {
  if (!form.customer_id) return;
  if (Number(form.paid_amount) > displayTotal.value) {
    showError(t("salesNotes.messages.paidAmountError"));
    return;
  }
  saving.value = true;
  clearMessage();
  try {
    if (isEditing.value && editingId.value) {
      await api.put(`/sales_notes/${editingId.value}`, {
        customer_id: form.customer_id,
        date: toDateOnly(form.date),
        paid_amount: form.paid_amount,
      });
      showMessage(t("salesNotes.messages.updated"));
    } else {
      const { data } = await api.post<SalesNote>("/sales_notes/", {
        customer_id: form.customer_id,
        date: toDateOnly(form.date),
        paid_amount: form.paid_amount,
      });
      showMessage(t("salesNotes.messages.created"));
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
    showError(t("salesNotes.messages.saveError"));
  } finally {
    saving.value = false;
  }
};

const handleLineSubmit = async () => {
  if (!editingId.value || !lineForm.product_id) return;
  if (Number(lineForm.quantity) <= 0) {
    showError(t("salesNotes.messages.lineQuantityError"));
    return;
  }
  if (
    selectedProduct.value?.is_inventory &&
    availableStock.value !== null &&
    Number(lineForm.quantity) > Number(availableStock.value)
  ) {
    showError(
      t("salesNotes.messages.lineStockError", {
        available: availableStock.value,
      })
    );
    return;
  }
  lineSaving.value = true;
  clearMessage();
  try {
    if (isEditingLine.value && editingLineId.value) {
      await api.put(`/sales_notes/${editingId.value}/lines/${editingLineId.value}`, {
        product_id: lineForm.product_id,
        quantity: lineForm.quantity,
        unit_price: lineForm.unit_price,
        total_price: lineForm.total_price,
      });
      showMessage(t("salesNotes.messages.lineUpdated"));
    } else {
      await api.post(`/sales_notes/${editingId.value}/lines`, {
        product_id: lineForm.product_id,
        quantity: lineForm.quantity,
        unit_price: lineForm.unit_price,
        total_price: lineForm.total_price,
      });
      showMessage(t("salesNotes.messages.lineCreated"));
    }
    await fetchLines(editingId.value);
    await fetchNotes();
    resetLineForm();
    syncPaidAmountWarning();
  } catch (err) {
    console.error(err);
    showError(t("salesNotes.messages.lineSaveError"));
  } finally {
    lineSaving.value = false;
  }
};

const startEditLine = (line: SalesLine) => {
  if (isReadOnly.value) return;
  isEditingLine.value = true;
  editingLineId.value = line.id;
  lineForm.product_id = line.product_id;
  lineForm.quantity = line.quantity;
  lineForm.unit_price = line.unit_price;
  lineForm.total_price = line.total_price;
};

const deleteLine = async (line: SalesLine) => {
  if (!editingId.value || isReadOnly.value) return;
  try {
    await api.delete(`/sales_notes/${editingId.value}/lines/${line.id}`);
    showMessage(t("salesNotes.messages.lineDeleted"));
    await fetchLines(editingId.value);
    await fetchNotes();
    syncPaidAmountWarning();
  } catch (err) {
    console.error(err);
    try {
      await api.delete(`/sales_notes/lines/${line.id}`);
      showMessage(t("salesNotes.messages.lineDeleted"));
      await fetchLines(editingId.value);
      await fetchNotes();
      syncPaidAmountWarning();
    } catch (fallbackErr) {
      console.error(fallbackErr);
      showError(t("salesNotes.messages.lineDeleteError"));
    }
  }
};

const requestDelete = (note: SalesNote) => {
  if (note.status !== "DRAFT") return;
  deleteTargetId.value = note.id;
};

const clearDeleteTarget = () => {
  deleteTargetId.value = null;
};

const confirmNote = async () => {
  if (!editingId.value) return;
  await confirmNoteById(editingId.value);
};

const confirmNoteById = async (noteId: number) => {
  if (pendingTotal.value < 0) {
    showError(t("salesNotes.messages.paidAmountError"));
    return;
  }
  confirming.value = true;
  clearMessage();
  try {
    await api.post(`/sales_notes/${noteId}/confirm`);
    showMessage(t("salesNotes.messages.confirmed"));
    await fetchNotes();
    await fetchStockProducts();
    if (editingId.value === noteId) {
      await fetchLines(noteId);
    }
  } catch (err) {
    console.error(err);
    showError(extractErrorMessage(err) || t("salesNotes.messages.confirmError"));
  } finally {
    confirming.value = false;
  }
};

const confirmDelete = async () => {
  if (!deleteTargetId.value) return;
  deleting.value = true;
  clearMessage();
  try {
    await api.delete(`/sales_notes/${deleteTargetId.value}`);
    showMessage(t("salesNotes.messages.deleted"));
    if (editingId.value === deleteTargetId.value) {
      resetForm();
    }
    await fetchNotes();
    clearDeleteTarget();
  } catch (err) {
    console.error(err);
    showError(extractErrorMessage(err) || t("salesNotes.messages.deleteError"));
  } finally {
    deleting.value = false;
  }
};

onMounted(async () => {
  await Promise.all([
    fetchCustomers(),
    fetchProducts(),
    fetchNotes(),
    fetchStockLocations(),
    fetchStockProducts(),
  ]);
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

<template>
  <div class="page container column">
    <SectionTitle :level="1" align="center">
      {{ $t("stockDeposits.title") }}
    </SectionTitle>
    <p class="lead">{{ $t("stockDeposits.subtitle") }}</p>

    <section class="panel">
      <SectionTitle :level="2">{{ $t("stockDeposits.filters.title") }}</SectionTitle>
      <div class="filters">
        <label class="field">
          {{ $t("stockDeposits.filters.search") }}
          <input v-model="filters.search" type="text" />
        </label>
        <label class="field">
          {{ $t("stockDeposits.filters.product") }}
          <select v-model="filters.product_id">
            <option value="all">{{ $t("stockDeposits.filters.all") }}</option>
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
          {{ $t("stockDeposits.filters.status") }}
          <select v-model="filters.status">
            <option value="all">{{ $t("stockDeposits.filters.all") }}</option>
            <option value="DRAFT">{{ $t("stockDeposits.status.draft") }}</option>
            <option value="CONFIRMED">
              {{ $t("stockDeposits.status.confirmed") }}
            </option>
            <option value="CANCELLED">
              {{ $t("stockDeposits.status.cancelled") }}
            </option>
          </select>
        </label>
        <label class="field">
          {{ $t("stockDeposits.filters.fromLocation") }}
          <select v-model="filters.from_stock_location_id">
            <option value="all">{{ $t("stockDeposits.filters.all") }}</option>
            <option
              v-for="location in stockLocations"
              :key="location.id"
              :value="location.id"
            >
              {{ location.name }}
            </option>
          </select>
        </label>
        <label class="field">
          {{ $t("stockDeposits.filters.toLocation") }}
          <select v-model="filters.to_stock_location_id">
            <option value="all">{{ $t("stockDeposits.filters.all") }}</option>
            <option
              v-for="location in stockLocations"
              :key="location.id"
              :value="location.id"
            >
              {{ location.name }}
            </option>
          </select>
        </label>
        <label class="field">
          {{ $t("stockDeposits.filters.dateFrom") }}
          <input v-model="filters.date_from" type="date" />
        </label>
        <label class="field">
          {{ $t("stockDeposits.filters.dateTo") }}
          <input v-model="filters.date_to" type="date" />
        </label>
      </div>
      <div class="actions">
        <button type="button" class="btn-secondary" @click="resetFilters">
          {{ $t("stockDeposits.filters.clear") }}
        </button>
      </div>
    </section>

    <section class="panel">
      <SectionTitle :level="2">
        {{
          isEditing
            ? $t("stockDeposits.form.editTitle")
            : $t("stockDeposits.form.createTitle")
        }}
      </SectionTitle>
      <form class="form" @submit.prevent="handleSubmit">
        <div class="movement">
          <span class="field-label">{{ $t("stockDeposits.form.movementType") }}</span>
          <div class="movement-options">
            <label class="movement-option">
              <input
                v-model="movementType"
                type="radio"
                value="transfer"
                :disabled="isReadOnly"
                @change="handleMovementChange"
              />
              {{ $t("stockDeposits.movement.transfer") }}
            </label>
            <label class="movement-option">
              <input
                v-model="movementType"
                type="radio"
                value="inbound"
                :disabled="isReadOnly"
                @change="handleMovementChange"
              />
              {{ $t("stockDeposits.movement.inbound") }}
            </label>
            <label class="movement-option">
              <input
                v-model="movementType"
                type="radio"
                value="outbound"
                :disabled="isReadOnly"
                @change="handleMovementChange"
              />
              {{ $t("stockDeposits.movement.outbound") }}
            </label>
          </div>
        </div>
        <label class="field">
          {{ $t("stockDeposits.form.product") }}
          <select v-model="form.product_id" :disabled="isReadOnly">
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
          {{ $t("stockDeposits.form.quantity") }}
          <input
            v-model.number="form.quantity"
            type="number"
            step="0.01"
            min="0"
            placeholder="10"
            :disabled="isReadOnly"
          />
        </label>

        <label class="field">
          {{ $t("stockDeposits.form.fromLocation") }}
          <select
            v-model="form.from_stock_location_id"
            :disabled="isReadOnly || movementType === 'inbound'"
          >
            <option value="">--</option>
            <option
              v-for="location in stockLocations"
              :key="location.id"
              :value="location.id"
            >
              {{ location.name }}
            </option>
          </select>
        </label>

        <label class="field">
          {{ $t("stockDeposits.form.toLocation") }}
          <select
            v-model="form.to_stock_location_id"
            :disabled="isReadOnly || movementType === 'outbound'"
          >
            <option value="">--</option>
            <option
              v-for="location in stockLocations"
              :key="location.id"
              :value="location.id"
            >
              {{ location.name }}
            </option>
          </select>
        </label>

        <label class="field">
          {{ $t("stockDeposits.form.fromBalance") }}
          <input type="text" :value="fromBalanceText" readonly />
        </label>

        <label class="field">
          {{ $t("stockDeposits.form.toBalance") }}
          <input type="text" :value="toBalanceText" readonly />
        </label>

        <label class="field">
          {{ $t("stockDeposits.form.date") }}
          <input
            v-model="form.date"
            type="date"
            placeholder="2026-01-26"
            :disabled="isReadOnly"
          />
        </label>

        <label class="field field-wide">
          {{ $t("stockDeposits.form.notes") }}
          <textarea
            v-model="form.notes"
            rows="3"
            placeholder="Ej: Regularizacion de inventario"
            :disabled="isReadOnly"
          />
        </label>

        <div class="summary">
          <div class="summary-item">
            <span class="summary-label">{{ $t("stockDeposits.form.status") }}</span>
            <span class="summary-value">{{ statusLabel(currentStatus) }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">{{ $t("stockDeposits.form.movement") }}</span>
            <span class="summary-value">{{ movementLabel }}</span>
          </div>
        </div>

        <div class="actions">
          <button type="submit" class="btn-primary" :disabled="saving || isReadOnly">
            {{
              saving
                ? $t("stockDeposits.form.saving")
                : $t("stockDeposits.form.save")
            }}
          </button>
          <button
            v-if="isEditing"
            type="button"
            class="btn-secondary"
            @click="resetForm"
          >
            {{ $t("stockDeposits.form.cancel") }}
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
                ? $t("stockDeposits.form.confirming")
                : $t("stockDeposits.form.confirm")
            }}
          </button>
        </div>

      </form>
    </section>

    <section class="panel">
      <SectionTitle :level="2">{{ $t("stockDeposits.list.title") }}</SectionTitle>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>{{ $t("stockDeposits.list.id") }}</th>
              <th>{{ $t("stockDeposits.list.date") }}</th>
              <th>{{ $t("stockDeposits.list.product") }}</th>
              <th>{{ $t("stockDeposits.list.quantity") }}</th>
              <th>{{ $t("stockDeposits.list.fromLocation") }}</th>
              <th>{{ $t("stockDeposits.list.toLocation") }}</th>
              <th>{{ $t("stockDeposits.list.status") }}</th>
              <th>{{ $t("stockDeposits.list.actions") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredNotes.length === 0">
              <td :colspan="8" class="empty">
                {{ $t("stockDeposits.list.empty") }}
              </td>
            </tr>
            <tr v-for="note in filteredNotes" :key="note.id">
              <td>{{ note.id }}</td>
              <td>{{ note.date }}</td>
              <td>{{ productName(note.product_id) }}</td>
              <td>{{ note.quantity }}</td>
              <td>{{ locationName(note.from_stock_location_id) }}</td>
              <td>{{ locationName(note.to_stock_location_id) }}</td>
              <td>{{ statusLabel(note.status) }}</td>
              <td class="row-actions">
                <button class="link" @click="startEdit(note)">
                  {{ $t("stockDeposits.list.view") }}
                </button>
                <button
                  v-if="note.status === 'DRAFT'"
                  class="link"
                  @click="confirmNoteById(note.id)"
                >
                  {{ $t("stockDeposits.list.confirm") }}
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
          {{ $t("stockDeposits.messages.acknowledge") }}
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

interface Product {
  id: number;
  name: string;
  is_inventory?: boolean;
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

interface StockDepositNote {
  id: number;
  from_stock_location_id: number | null;
  to_stock_location_id: number | null;
  product_id: number;
  quantity: number;
  date: string;
  status: NoteStatus;
  notes?: string;
}

const { t } = useI18n();

const products = ref<Product[]>([]);
const stockLocations = ref<StockLocation[]>([]);
const stockProducts = ref<StockProductLocation[]>([]);
const notes = ref<StockDepositNote[]>([]);

const message = ref<{ text: string; type: "info" | "error" } | null>(null);
const messageTimeout = ref<number | null>(null);

const saving = ref(false);
const confirming = ref(false);
const isEditing = ref(false);
const editingId = ref<number | null>(null);

const filters = reactive({
  search: "",
  product_id: "all" as "all" | number,
  status: "all" as "all" | NoteStatus,
  from_stock_location_id: "all" as "all" | number,
  to_stock_location_id: "all" as "all" | number,
  date_from: "",
  date_to: "",
});

const movementType = ref<"transfer" | "inbound" | "outbound">("transfer");

const form = reactive({
  product_id: "" as "" | number,
  quantity: 0,
  from_stock_location_id: "" as "" | number,
  to_stock_location_id: "" as "" | number,
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

const inventoryProducts = computed(() =>
  products.value.filter((product) => product.is_inventory !== false)
);

const currentStatus = computed<NoteStatus>(() =>
  selectedNote.value?.status || "DRAFT"
);

const isReadOnly = computed(() =>
  selectedNote.value ? selectedNote.value.status !== "DRAFT" : false
);

const canConfirm = computed(() => Boolean(editingId.value) && !isReadOnly.value);

const selectedProduct = computed(() =>
  products.value.find((product) => product.id === form.product_id)
);

const fromStock = computed(() => {
  if (!form.product_id || !form.from_stock_location_id) return null;
  const productId = Number(form.product_id);
  const locationId = Number(form.from_stock_location_id);
  return stockProducts.value
    .filter(
      (row) => row.product_id === productId && row.stock_location_id === locationId
    )
    .reduce((sum, row) => sum + Number(row.quantity || 0), 0);
});

const toStock = computed(() => {
  if (!form.product_id || !form.to_stock_location_id) return null;
  const productId = Number(form.product_id);
  const locationId = Number(form.to_stock_location_id);
  return stockProducts.value
    .filter(
      (row) => row.product_id === productId && row.stock_location_id === locationId
    )
    .reduce((sum, row) => sum + Number(row.quantity || 0), 0);
});

const fromBalanceText = computed(() => {
  if (!form.product_id || !form.from_stock_location_id) {
    return t("stockDeposits.form.balanceEmpty");
  }
  if (selectedProduct.value && selectedProduct.value.is_inventory === false) {
    return t("stockDeposits.form.availableNotInventory");
  }
  return fromStock.value?.toString() ?? "0";
});

const toBalanceText = computed(() => {
  if (!form.product_id || !form.to_stock_location_id) {
    return t("stockDeposits.form.balanceEmpty");
  }
  if (selectedProduct.value && selectedProduct.value.is_inventory === false) {
    return t("stockDeposits.form.availableNotInventory");
  }
  return toStock.value?.toString() ?? "0";
});

const movementLabel = computed(() => {
  switch (movementType.value) {
    case "inbound":
      return t("stockDeposits.movement.inbound");
    case "outbound":
      return t("stockDeposits.movement.outbound");
    default:
      return t("stockDeposits.movement.transfer");
  }
});

const payloadExample = computed(() => {
  if (movementType.value === "inbound") {
    return JSON.stringify(
      {
        to_stock_location_id: 2,
        product_id: 1,
        quantity: 10,
        date: "2026-01-26",
        notes: "Entrada por regularizacion",
      },
      null,
      2
    );
  }
  if (movementType.value === "outbound") {
    return JSON.stringify(
      {
        from_stock_location_id: 2,
        product_id: 1,
        quantity: 5,
        date: "2026-01-26",
        notes: "Salida por ajuste",
      },
      null,
      2
    );
  }
  return JSON.stringify(
    {
      from_stock_location_id: 1,
      to_stock_location_id: 2,
      product_id: 1,
      quantity: 5,
      date: "2026-01-26",
      notes: "Transferencia interna",
    },
    null,
    2
  );
});

const filteredNotes = computed(() => {
  return notes.value.filter((note) => {
    const search = filters.search.trim().toLowerCase();
    const productMatch =
      filters.product_id === "all" || note.product_id === filters.product_id;
    const statusMatch =
      filters.status === "all" || note.status === filters.status;
    const fromMatch =
      filters.from_stock_location_id === "all" ||
      note.from_stock_location_id === filters.from_stock_location_id;
    const toMatch =
      filters.to_stock_location_id === "all" ||
      note.to_stock_location_id === filters.to_stock_location_id;

    const dateValue = note.date ? new Date(note.date) : null;
    const fromDateMatch = filters.date_from
      ? dateValue && dateValue >= new Date(filters.date_from)
      : true;
    const toDateMatch = filters.date_to
      ? dateValue && dateValue <= new Date(filters.date_to)
      : true;

    const productLabel = productName(note.product_id).toLowerCase();
    const fromLabel = locationName(note.from_stock_location_id).toLowerCase();
    const toLabel = locationName(note.to_stock_location_id).toLowerCase();
    const notesLabel = note.notes?.toLowerCase() ?? "";
    const searchMatch =
      !search ||
      productLabel.includes(search) ||
      fromLabel.includes(search) ||
      toLabel.includes(search) ||
      notesLabel.includes(search) ||
      String(note.id).includes(search);

    return (
      productMatch &&
      statusMatch &&
      fromMatch &&
      toMatch &&
      fromDateMatch &&
      toDateMatch &&
      searchMatch
    );
  });
});

const productName = (productId: number) => {
  const product = products.value.find((item) => item.id === productId);
  return product?.name || `#${productId}`;
};

const locationName = (locationId: number | null) => {
  if (!locationId) return t("stockDeposits.form.noLocation");
  const location = stockLocations.value.find((item) => item.id === locationId);
  return location?.name || `#${locationId}`;
};

const statusLabel = (status?: NoteStatus) => {
  switch (status) {
    case "CONFIRMED":
      return t("stockDeposits.status.confirmed");
    case "CANCELLED":
      return t("stockDeposits.status.cancelled");
    default:
      return t("stockDeposits.status.draft");
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
  filters.product_id = "all";
  filters.status = "all";
  filters.from_stock_location_id = "all";
  filters.to_stock_location_id = "all";
  filters.date_from = "";
  filters.date_to = "";
};

const resetForm = () => {
  isEditing.value = false;
  editingId.value = null;
  form.product_id = "";
  form.quantity = 0;
  form.from_stock_location_id = "";
  form.to_stock_location_id = "";
  form.date = new Date().toISOString().slice(0, 10);
  form.notes = "";
  movementType.value = "transfer";
};

const fetchProducts = async () => {
  try {
    const { data } = await api.get<Product[]>("/products/");
    products.value = data;
  } catch (err) {
    console.error(err);
  }
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

const fetchNotes = async () => {
  try {
    const { data } = await api.get<StockDepositNote[]>("/stock_deposit_notes/");
    notes.value = data;
  } catch (err) {
    console.error(err);
    showError(t("stockDeposits.messages.loadError"));
  }
};

const startEdit = (note: StockDepositNote) => {
  isEditing.value = true;
  editingId.value = note.id;
  form.product_id = note.product_id;
  form.quantity = note.quantity;
  form.from_stock_location_id = note.from_stock_location_id ?? "";
  form.to_stock_location_id = note.to_stock_location_id ?? "";
  form.date = normalizeDate(note.date);
  form.notes = note.notes ?? "";
  if (note.from_stock_location_id && note.to_stock_location_id) {
    movementType.value = "transfer";
  } else if (note.to_stock_location_id) {
    movementType.value = "inbound";
  } else {
    movementType.value = "outbound";
  }
  clearMessage();
};

const handleMovementChange = () => {
  if (movementType.value === "inbound") {
    form.from_stock_location_id = "";
  }
  if (movementType.value === "outbound") {
    form.to_stock_location_id = "";
  }
};

const validateForm = () => {
  if (!form.product_id) {
    showError(t("stockDeposits.messages.productError"));
    return false;
  }
  if (Number(form.quantity) <= 0) {
    showError(t("stockDeposits.messages.quantityError"));
    return false;
  }
  const hasFrom = Boolean(form.from_stock_location_id);
  const hasTo = Boolean(form.to_stock_location_id);
  if (movementType.value === "transfer" && (!hasFrom || !hasTo)) {
    showError(t("stockDeposits.messages.requiresLocation"));
    return false;
  }
  if (movementType.value === "inbound" && !hasTo) {
    showError(t("stockDeposits.messages.requiresLocation"));
    return false;
  }
  if (movementType.value === "outbound" && !hasFrom) {
    showError(t("stockDeposits.messages.requiresLocation"));
    return false;
  }
  if (hasFrom && fromStock.value !== null) {
    if (Number(form.quantity) > Number(fromStock.value)) {
      showError(t("stockDeposits.messages.stockNegative"));
      return false;
    }
  }
  return true;
};

const handleSubmit = async () => {
  if (!validateForm()) return;
  saving.value = true;
  clearMessage();
  const payload: Record<string, unknown> = {
    product_id: form.product_id,
    quantity: form.quantity,
    date: toDateOnly(form.date),
    notes: form.notes,
  };
  if (form.from_stock_location_id) {
    payload.from_stock_location_id = form.from_stock_location_id;
  }
  if (form.to_stock_location_id) {
    payload.to_stock_location_id = form.to_stock_location_id;
  }
  try {
    if (isEditing.value && editingId.value) {
      await api.put(`/stock_deposit_notes/${editingId.value}`, payload);
      showMessage(t("stockDeposits.messages.updated"));
    } else {
      const { data } = await api.post<StockDepositNote>(
        "/stock_deposit_notes/",
        payload
      );
      showMessage(t("stockDeposits.messages.created"));
      isEditing.value = true;
      editingId.value = data.id;
    }
    await fetchNotes();
    await fetchStockProducts();
  } catch (err) {
    console.error(err);
    const apiMessage = extractErrorMessage(err);
    if (apiMessage === "Deposit requires from_stock_location_id or to_stock_location_id") {
      showError(t("stockDeposits.messages.requiresLocation"));
    } else if (
      apiMessage === "Deposit quantity must be greater than zero" ||
      apiMessage === "StockDepositNote quantity cannot be zero"
    ) {
      showError(t("stockDeposits.messages.quantityError"));
    } else if (apiMessage === "Stock cannot become negative") {
      showError(t("stockDeposits.messages.stockNegative"));
    } else {
      showError(t("stockDeposits.messages.saveError"));
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
    await api.post(`/stock_deposit_notes/${noteId}/confirm`);
    showMessage(t("stockDeposits.messages.confirmed"));
    await fetchNotes();
    await fetchStockProducts();
    if (editingId.value === noteId) {
      resetForm();
    }
  } catch (err) {
    console.error(err);
    const apiMessage = extractErrorMessage(err);
    if (apiMessage === "Deposit requires from_stock_location_id or to_stock_location_id") {
      showError(t("stockDeposits.messages.requiresLocation"));
    } else if (
      apiMessage === "Deposit quantity must be greater than zero" ||
      apiMessage === "StockDepositNote quantity cannot be zero"
    ) {
      showError(t("stockDeposits.messages.quantityError"));
    } else if (apiMessage === "Stock cannot become negative") {
      showError(t("stockDeposits.messages.stockNegative"));
    } else {
      showError(t("stockDeposits.messages.confirmError"));
    }
  } finally {
    confirming.value = false;
  }
};

onMounted(async () => {
  await Promise.all([
    fetchProducts(),
    fetchStockLocations(),
    fetchStockProducts(),
    fetchNotes(),
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

.payload-example {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 0.6vh;
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

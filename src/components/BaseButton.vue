<template>
  <button
    :type="type"
    class="base-button"
    :class="`base-button--${variant}`"
    :disabled="disabled || loading"
  >
    <span v-if="loading" class="spinner" aria-hidden="true"></span>
    <span class="label"><slot /></span>
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: "primary" | "secondary" | "ghost";
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    loading?: boolean;
  }>(),
  {
    variant: "primary",
    type: "button",
    disabled: false,
    loading: false,
  }
);
</script>

<style scoped>
.base-button {
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s ease, opacity 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
}

.base-button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.base-button--primary {
  background-color: var(--primary);
  color: var(--primary-text);
}

.base-button--secondary {
  background-color: var(--muted);
  color: var(--primary-text);
}

.base-button--ghost {
  background-color: transparent;
  color: var(--text);
  border-color: var(--border);
}

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid var(--primary-text);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

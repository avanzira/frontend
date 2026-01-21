/* file: src/components/NavBar.vue */
<template>
  <nav class="nav">
    <RouterLink
      v-for="link in links"
      :key="link.path"
      :to="link.path"
      class="nav-link"
      :class="{ active: isActive(link.path) }"
    >
      <span class="icon">{{ link.icon }}</span>
      <span class="label">{{ t(link.labelKey) }}</span>
    </RouterLink>

    <button class="nav-link logout" @click="handleLogout">
      <span class="icon">🚪</span>
      <span class="label">{{ t("nav.logout") }}</span>
    </button>
  </nav>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "../store/auth.store";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const { t } = useI18n();

const isActive = (path: string) => {
  if (path === "/app") return route.path === "/app";
  return route.path.startsWith(path);
};

const links = [
  { path: "/app", labelKey: "nav.home", icon: "🏠" },
  { path: "/app/entities", labelKey: "nav.entities", icon: "🧩" },
  { path: "/app/documents", labelKey: "nav.documents", icon: "🧾" },
  { path: "/app/reports", labelKey: "nav.reports", icon: "📊" },
  { path: "/app/entities/me", labelKey: "nav.profile", icon: "👤" },
];

const handleLogout = () => {
  auth.logout();
  router.push("/");
};
</script>

<style scoped>
.nav {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  gap: 1rem;
}

.nav-link {
  background: none;
  border: none;
  color: var(--text);
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: opacity 0.2s, color 0.2s;
}

.nav-link:hover {
  opacity: 0.8;
}

.nav-link.active {
  color: var(--primary);
}

.logout {
  color: var(--danger);
}

.icon {
  font-size: 1.2rem;
  line-height: 1;
}

.label {
  font-size: 0.8rem;
}

@media (min-width: 768px) {
  .nav {
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    padding-top: 1rem;
  }

  .nav-link {
    flex-direction: row;
    gap: 0.5rem;
    font-size: 1rem;
  }

  .icon {
    font-size: 1.4rem;
  }
}
</style>
/* file: src/components/NavBar.vue */

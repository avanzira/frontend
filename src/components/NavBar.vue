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
import { computed } from "vue";
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

const baseLinks = [
  { path: "/app", labelKey: "nav.home", icon: "🏠" },
  { path: "/app/entities", labelKey: "nav.entities", icon: "🧩" },
  { path: "/app/documents", labelKey: "nav.documents", icon: "🧾" },
  { path: "/app/reports", labelKey: "nav.reports", icon: "📊" },
  { path: "/app/profile", labelKey: "nav.profile", icon: "👤" },
];

const links = computed(() => {
  if (auth.user?.rol === "ADMIN") return baseLinks;
  return baseLinks.filter((link) => link.path !== "/app/entities/users");
});

const handleLogout = () => {
  auth.logout();
  router.push("/");
};
</script>

<style scoped>
.nav {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  gap: 2vw;
  width: 100%;
  flex-wrap: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
}

.nav::-webkit-scrollbar {
  display: none;
}

.nav-link {
  background: none;
  border: none;
  color: var(--text);
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  transition: opacity 0.2s, color 0.2s;
  gap: 0.8vw;
  white-space: nowrap;
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
  font-size: 2vh;
  line-height: 1;
}

.label {
  font-size: 1.6vh;
}
</style>
/* file: src/components/NavBar.vue */

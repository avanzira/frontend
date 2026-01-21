/* file: src/store/settings.store.ts */
import { defineStore } from "pinia";
import { i18n } from "../i18n";

type Theme = "light" | "dark" | "earth";
type Language = "es" | "en" | "fr";

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    theme: (localStorage.getItem("theme") as Theme) || "light",
    language: (localStorage.getItem("language") as Language) || "es",
  }),

  actions: {
    setTheme(newTheme: Theme) {
      this.theme = newTheme;
      localStorage.setItem("theme", newTheme);
      document.documentElement.setAttribute("data-theme", newTheme);
    },

    setLanguage(newLang: Language) {
      this.language = newLang;
      localStorage.setItem("language", newLang);
      i18n.global.locale.value = newLang;
    },

    loadFromBackend(user: { user_theme?: Theme; user_language?: Language }) {
      if (user?.user_theme) this.setTheme(user.user_theme);
      if (user?.user_language) this.setLanguage(user.user_language);
    },
  },
});
/* file: src/store/settings.store.ts */

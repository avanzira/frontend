// file: src/store/auth.store.ts
import { defineStore } from "pinia";
import api from "../services/api";
import { useSettingsStore } from "./settings.store";

type Theme = "light" | "dark" | "earth";
type Language = "es" | "en" | "fr";

interface User {
  id: number;
  username: string;
  email: string;
  rol?: string;
  user_language?: Language | string;
  user_theme?: Theme | string;
  password_changed_at?: string;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  issued_at: string;
  user: User;
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || null,
    refreshToken: localStorage.getItem("refreshToken") || null,
    user: null as User | null,
  }),

  actions: {
    async login(username: string, password: string) {
      const { data } = await api.post<LoginResponse>("/auth/login", {
        username,
        password,
      });

      this.token = data.access_token;
      this.refreshToken = data.refresh_token;
      this.user = data.user;

      localStorage.setItem("token", this.token);
      localStorage.setItem("refreshToken", this.refreshToken);

      const settings = useSettingsStore();
      const lang = (data.user.user_language as Language) || "es";
      const theme = (data.user.user_theme as Theme) || "light";
      settings.setLanguage(lang);
      settings.setTheme(theme);
    },

    logout() {
      this.token = null;
      this.refreshToken = null;
      this.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    },
  },
});
// file: src/store/auth.store.ts

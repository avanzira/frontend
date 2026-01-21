import { createI18n } from "vue-i18n";
import es from "./es.json";
import en from "./en.json";
import fr from "./fr.json";

const messages = { es, en, fr };

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem("language") || "es",
  fallbackLocale: "es",
  messages,
});

export { i18n, messages };

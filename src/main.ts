// file: src/main.ts
import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import { i18n } from "./i18n";
import { useSettingsStore } from "./store/settings.store";
import App from "./App.vue";
import "./styles/main.scss";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(i18n);

const settings = useSettingsStore();
settings.setTheme(settings.theme);

app.mount("#app");
// file: src/main.ts

// src/main.js
import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import { useAuthStore } from "@/stores/authStore";

async function bootstrap() {
  const app = createApp(App);
  const pinia = createPinia();
  app.use(pinia);

  const authStore = useAuthStore();
  await authStore.initializeAuthStateListener();

  app.use(router);
  await router.isReady();
  app.mount("#app");
}

bootstrap();

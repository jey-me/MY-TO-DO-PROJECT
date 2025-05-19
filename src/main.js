// src/main.js
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './style.css';
import App from './App.vue';
import router from './router';
import { useAuthStore } from '@/stores/authStore';

async function bootstrap() {
  const app = createApp(App);
  const pinia = createPinia();
  app.use(pinia);

  // 1️⃣ Antes de tocar el router, restauramos sesión:
  const authStore = useAuthStore();
  await authStore.initializeAuthStateListener();

  // 2️⃣ Ahora sí, podemos montar el router con confianza:
  app.use(router);
  await router.isReady();

  // 3️⃣ Y finalmente arrancamos la app:
  app.mount('#app');
}

bootstrap();

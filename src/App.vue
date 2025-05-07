<template>
  <div></div>
  <div id="app-container">
    <h1>Mi Aplicación To-Do</h1>

    <div v-if="authStore.loading && !authStore.isLoggedIn">
      Cargando sesión...
    </div>
    <div v-else>
      <div v-if="authStore.isLoggedIn">
        <nav>
          <p>Bienvenido, {{ authStore.user?.email }}!</p>
          <button @click="handleLogout" :disabled="authStore.loading">
            {{ authStore.loading ? "Cerrando sesión..." : "Cerrar Sesión" }}
          </button>
        </nav>

        <main>
          <TaskManager />
        </main>
      </div>
      <div v-else>
        <RegisterForm v-if="showRegister" @show-login="showRegister = false" />
        <LoginForm v-else @show-register="showRegister = true" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"; // Importa ref
import { useAuthStore } from "@/stores/authStore";
import LoginForm from "@/components/LoginForm.vue";
import RegisterForm from "@/components/RegisterForm.vue"; // Importa RegisterForm
import TaskManager from "@/components/TaskManager.vue";

const authStore = useAuthStore();

// Nuevo estado para controlar qué formulario mostrar
const showRegister = ref(false);

const handleLogout = async () => {
  await authStore.logout();
  showRegister.value = false; // Al cerrar sesión, mostrar el login por defecto
};

onMounted(() => {
  authStore.initializeAuthStateListener();
});
</script>

<style>
.link-button {
  background: none;
  border: none;
  color: #42b983;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
  font-size: inherit; /* Heredar tamaño de fuente del párrafo */
  display: inline; /* Mostrar en línea con el texto */
}
.link-button:hover {
  color: #30a86e;
}
</style>

<template>
  <div id="app-container">
    <h1>To-Do-List</h1>

    <div v-if="authStore.loading">Cargando sesión...</div>
    <div v-else>
        <div v-if="authStore.isLoggedIn">
          <p>Bienvenido, {{ authStore.user?.email }}!</p>
          <button @click="handleLogout" :disabled="authStore.loading">
            {{ authStore.loading ? 'Cerrando sesión...' : 'Cerrar Sesión' }}
          </button>
          <hr>
          <h2>Tu Lista de Tareas (Próximamente)</h2>
        </div>

        <LoginForm v-else />
    </div>

  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import LoginForm from '@/components/LoginForm.vue'; // Importa tu componente de login

const authStore = useAuthStore();

// Función para manejar el logout
const handleLogout = async () => {
  await authStore.logout();
};

// Al montar la aplicación, inicializa el listener de estado de autenticación
// Esto también llamará inmediatamente al callback con el estado actual,
// por lo que reemplaza la necesidad de llamar a checkAuth() por separado si se usa.
onMounted(() => {
  authStore.initializeAuthStateListener();
  // Si prefieres no usar el listener y solo comprobar al inicio:
  // authStore.checkAuth();
});
</script>

<style>
/* Puedes añadir estilos globales aquí o en src/style.css */
#app-container {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
button {
   margin: 5px;
   padding: 0.5rem 1rem;
   cursor: pointer;
}
</style>
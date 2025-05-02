<template>
  <div>
  </div>
  <div id="app-container">
    <h1>Mi Aplicación To-Do</h1>

    <div v-if="authStore.loading && !authStore.isLoggedIn">Cargando sesión...</div>
    <div v-else>
        <div v-if="authStore.isLoggedIn">
          <p>Bienvenido, {{ authStore.user?.email }}!</p>
          <button @click="handleLogout" :disabled="authStore.loading">
            {{ authStore.loading ? 'Cerrando sesión...' : 'Cerrar Sesión' }}
          </button>
          <h2>Tu Lista de Tareas</h2>
          <form>
            <input type="text"><button>add</button>
          </form>
          <table>
  <thead>
    <tr>
      <th>Task</th>
      <th>Status</th>
      <th>Delete</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Complete the project this is a very long task to write. Deserunt, fugiat tenetur qui asperiores quos earum ut eum?</td>
      <td><button @click="handleStatusChange">In progress</button></td>
      <td><button @click="handleDelete">Delete</button></td>
    </tr>
  </tbody>
</table>


  </div>
        <div v-else>
          <RegisterForm v-if="showRegister" @show-login="showRegister = false" />
          <LoginForm v-else @show-register="showRegister = true" />
        </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'; // Importa ref
import { useAuthStore } from '@/stores/authStore';
import LoginForm from '@/components/LoginForm.vue';
import RegisterForm from '@/components/RegisterForm.vue'; // Importa RegisterForm

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
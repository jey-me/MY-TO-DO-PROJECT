<template>
  <div class="login-form">
    <h2>Iniciar Sesión</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div>
        <label for="password">Contraseña:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit" :disabled="authStore.loading">
        {{ authStore.loading ? 'Iniciando...' : 'Iniciar Sesión' }}
      </button>
      <button @click="$emit('show-register')" class="link-button">Sign up</button>
      <p v-if="authStore.authError" class="error-message">
        Error: {{ authStore.authError }}
      </p>
    </form>
    </div>
</template>


<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore'; // Importa tu store


const emit = defineEmits(['show-register']);

const email = ref('');
const password = ref('');
const authStore = useAuthStore();



const handleLogin = async () => {
  // Llama a la acción 'login' del store con las credenciales
  await authStore.login({ email: email.value, password: password.value });

  // Limpiar el formulario 
  // if (authStore.isLoggedIn) {
  //   email.value = '';
  //   password.value = '';
  // }
};
</script>

<style scoped>
.login-form {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.login-form div {
  margin-bottom: 1rem;
}
.login-form label {
  display: block;
  margin-bottom: 0.5rem;
}
.login-form input {
  width: 100%;
  padding: 0.5rem;
  box-sizing: border-box;
}
.login-form button {
  padding: 0.75rem 1.5rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  display: block;
  margin: 1rem auto;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.login-form button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
.login-form button:hover:not(:disabled) {
  background-color: #36a476;
}
.error-message {
  color: red;
  margin-top: 1rem;
}
</style>
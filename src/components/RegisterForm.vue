<template>
  <div class="register-form">
    <h2>Registrarse</h2>
    <form @submit.prevent="handleRegister">
      <div>
        <label for="register-email">Email:</label>
        <input type="email" id="register-email" v-model="email" required />
      </div>
      <div>
        <label for="register-password">Contraseña:</label>
        <input
          type="password"
          id="register-password"
          v-model="password"
          required
          minlength="6"
        />
      </div>
      <button
        type="submit"
        :disabled="authStore.loading"
      >
        {{ authStore.loading ? 'Registrando...' : 'Registrarse' }}
      </button>



      <!-- Mensaje genérico para otros errores -->
      <p v-if="authStore.authError" class="error-message">
        Error: {{ authStore.authError }}
      </p>

      <!-- registro exitoso -->
      <p v-if="registrationComplete" class="success-message">
        ¡Registro enviado! Revisa tu email para confirmar tu cuenta.
      </p>
    </form>
    
          <!-- email ya registrado -->
  <p v-if="authStore.authError === duplicateMessage" class="error-message">
      {{ duplicateMessage }}
      <br />
      <router-link :to="{ name: 'Login' }" class="link-button">
        Iniciar Sesión ahora
      </router-link>
    </p>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const registrationComplete = ref(false);
const authStore = useAuthStore();
const router = useRouter();

const duplicateMessage = 'Este email ya está registrado.';

async function handleRegister() {
  registrationComplete.value = false;
  authStore.authError = null;

  const success = await authStore.signUp({
    email: email.value,
    password: password.value,
  });

  if (success) {
    registrationComplete.value = true;
  } else if (authStore.authError === duplicateMessage) {
    router.push({ name: 'Login' });
  }
}
</script>

<style scoped>
.register-form {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.register-form div {
  margin-bottom: 1rem;
}
.register-form label {
  display: block;
  margin-bottom: 0.5rem;
}
.register-form input {
  width: 100%;
  padding: 0.5rem;
  box-sizing: border-box;
}
.register-form button {
  padding: 0.75rem 1.5rem;
  background-color: #41b883; /* Un verde ligeramente diferente para variar */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 0.5rem; /* Añadido margen superior */
  display: block; /* Hacer que el botón ocupe el ancho si se desea */
  width: 100%; /* Hacer que el botón ocupe el ancho */
}
.register-form button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
.register-form button:hover:not(:disabled) {
  background-color: #30a86e;
}
.error-message {
  color: red;
  margin-top: 1rem;
}
.success-message {
  color: green;
  margin-top: 1rem;
  font-weight: bold;
}
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

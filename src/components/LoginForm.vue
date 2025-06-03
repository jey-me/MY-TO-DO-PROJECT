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
        {{ authStore.loading ? "Iniciando..." : "Iniciar Sesión" }}
      </button>

      <p>
        ¿No tienes cuenta?
        <router-link :to="{ name: 'Register' }" class="link-button">Regístrate</router-link>
      </p>

      <!-- Error de login -->
      <p v-if="authStore.authError" class="error-message">
        Error: {{ authStore.authError }}
      </p>

      <!-- Link para reset de contraseña tras fallo -->
      <p v-if="authStore.authError && !resetSent" class="error-message">
        <button @click.prevent="handleResetPassword" class="link-button">
          Olvidé mi contraseña
        </button>
      </p>

      <!-- Mensaje de reset enviado -->
      <p v-if="resetSent" class="success-message">
        Si existe esa cuenta, recibirás un email para restablecer tu contraseña.
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";
import { supabase } from "@/supabaseClient";

const email = ref("");
const password = ref("");
const resetSent = ref(false);
const authStore = useAuthStore();
const router = useRouter();

async function handleLogin() {
  resetSent.value = false;
  await authStore.login({ email: email.value, password: password.value });
  if (authStore.isLoggedIn) {
    const redirect = router.currentRoute.value.query.redirect || { name: 'Tasks' };
    router.push(redirect);
  }
}

async function handleResetPassword() {
  authStore.authError = null;
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email.value);
    if (error) throw error;
    resetSent.value = true;
  } catch (err) {
    authStore.authError = err.message;
  }
}
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
.success-message {
  color: green;
  margin-top: 1rem;
}
.link-button {
  background: none;
  border: none;
  color: #42b983;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
  font-size: inherit;
  display: inline;
}
.link-button:hover {
  color: #30a86e;
}
</style>

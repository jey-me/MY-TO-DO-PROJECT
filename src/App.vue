<template>
  <div id="app-root-container">
    <NavBar
      v-if="authStore.isLoggedIn && initialAuthCheckCompleted"
      :userEmail="authStore.user?.email"
      :loading="authStore.loading"
      @logout="handleLogout"
    />
    <div v-else-if="!initialAuthCheckCompleted && authStore.loading" class="app-loading">
      Verificando sesión...
    </div>

    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router'; // Importa useRouter
import { useAuthStore } from '@/stores/authStore';
import { useTodoStore } from '@/stores/projectsStore'; // Tu store de "projects"
import NavBar from '@/components/NavBar.vue';

const authStore = useAuthStore();
const projectStore = useTodoStore(); // Usa tu store de "projects"
const router = useRouter(); // Obtén la instancia del router

const initialAuthCheckCompleted = ref(false);

const handleLogout = async () => {
  await authStore.logout(); // El listener en authStore limpiará user y session
  projectStore.clearTodos(); // Limpia las tareas del projectStore
  router.push({ name: 'Login' }); // Redirige a la página de Login
};

onMounted(() => {
  // initializeAuthStateListener actualiza user y session en authStore
  // cuando cambia el estado de autenticación de Supabase.
  authStore.initializeAuthStateListener();

  // El listener de onAuthStateChange se dispara con el estado actual.
  // Para saber cuándo la *primera* comprobación ha ocurrido (y no mostrar login/register prematuramente),
  // podemos observar 'session' o 'user'. Cuando 'session' deja de ser 'undefined' (su estado inicial antes de que Supabase responda)
  // o cuando 'loading' del authStore se vuelve false después de la primera carga.
  // O, más simple, asumimos que después de un breve instante, el estado es conocido.
  // Aquí, usaremos un watch para marcar cuando la sesión ya no es `undefined` (estado antes del primer chequeo) o `loading` se complete.

  const unwatch = watch(() => [authStore.session, authStore.loading], ([session, loading]) => {
    // session puede ser null (sin sesión) o un objeto (con sesión).
    // Lo importante es que ya no sea `undefined` (si así lo inicializas) o que `loading` de la comprobación inicial termine.
    // El `initializeAuthStateListener` pone loading a false.
    if (!loading) { // Cuando el loading de auth se complete (tras getSession o primer evento)
        initialAuthCheckCompleted.value = true;
        console.log('Initial auth check considered complete. Session:', session);
        unwatch(); // Dejamos de observar después de la primera vez
    }
  });
   //{ immediate: true }); // immediate: true para que se ejecute al inicio.

});

// En NavBar.vue, asegúrate de que el @logout="handleLogout" esté conectado.
// Si NavBar tiene links de navegación, usa <router-link>.
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

// src/stores/authStore.js
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { supabase } from "@/supabaseClient";

// defineStore recibe un ID único y una función de configuración
export const useAuthStore = defineStore("auth", () => {
  // --- State ---
  // Usamos ref() para propiedades reactivas del estado
  const user = ref(null); // Almacenará la información del usuario si está logueado
  const session = ref(null); // Almacenará la sesión completa de Supabase
  const loading = ref(false); // Para indicar si una operación de auth está en curso
  const authError = ref(null); // Para almacenar mensajes de error

  // --- Getters ---
  // Usamos computed() para getters derivados del estado
  const isLoggedIn = computed(() => !!user.value); // Verdadero si hay un usuario

  // --- Actions ---

  // iniciar sesión
  async function login(credentials) {
    loading.value = true;
    authError.value = null;
    try {
      // Llama a Supabase para iniciar sesión
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      if (error) throw error; // Si hay error, lánzalo para el catch

      // Si el login es exitoso, Supabase devuelve data.user y data.session
      console.log("Login successful:", data);
      user.value = data.user;
      session.value = data.session;
    } catch (error) {
      console.error("Login error:", error.message);
      authError.value = error.message; // Guarda el mensaje de error
      user.value = null; // Asegúrate de limpiar el usuario en caso de error
      session.value = null;
    } finally {
      loading.value = false; // Termina el estado de carga
    }
  }

  // Cerrar sesión
  async function logout() {
    loading.value = true;
    authError.value = null;
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      // Limpia el estado local
      user.value = null;
      session.value = null;
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout error:", error.message);
      authError.value = error.message;
    } finally {
      loading.value = false;
    }
  }

  // Acción para verificar si ya existe una sesión al cargar la app
  // Supabase guarda la sesión en localStorage por defecto
  async function checkAuth() {
    loading.value = true;
    try {
      // Intenta obtener la sesión actual
      const {
        data: { session: currentSession },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      if (currentSession) {
        session.value = currentSession;
        user.value = currentSession.user;
        console.log("Session restored:", session.value);
      } else {
        // Si no hay sesión, asegúrate de que el estado esté limpio
        user.value = null;
        session.value = null;
      }
    } catch (error) {
      console.error("Error checking auth status:", error.message);
      user.value = null;
      session.value = null;
    } finally {
      loading.value = false;
    }
  }

  // (MUY RECOMENDADO) Escuchar cambios de estado de autenticación de Supabase
  function initializeAuthStateListener() {
    supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log("Supabase auth event:", event, currentSession);
      // Actualiza el estado de Pinia según el evento de Supabase
      session.value = currentSession;
      user.value = currentSession ? currentSession.user : null;
      loading.value = false; // Asegúrate de que loading se desactive
    });
  }

  // --- Exportar ---
  // Devuelve las propiedades y métodos que quieres exponer
  return {
    user,
    session,
    loading,
    authError,
    isLoggedIn,
    login,
    logout,
    checkAuth,
    initializeAuthStateListener,
  };
});

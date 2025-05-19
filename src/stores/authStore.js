// src/stores/authStore.js
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { supabase } from "@/supabaseClient";

export const useAuthStore = defineStore("auth", () => {
  // --- State ---
  const user = ref(null);
  const session = ref(null);
  const loading = ref(true);
  const authError = ref(null);

  // --- Getters ---
  const isLoggedIn = computed(() => !!user.value);

  // --- Actions ---

  // Registro de usuario
  // src/stores/authStore.js
  async function signUp({ email, password }) {
    loading.value = true;
    authError.value = null;

    try {
      const { data, error } = await supabase.auth.signUp({ email, password });

      // Detectar duplicado explícito
      if (error?.message === "User already registered") {
        authError.value = "Este email ya está registrado.";
        return false;
      }

      // Detectar "fake user" (identities vacío)
      if (
        !error &&
        Array.isArray(data.user?.identities) &&
        data.user.identities.length === 0
      ) {
        authError.value = "Este email ya está registrado.";
        return false;
      }

      // Éxito auténtico
      return true;
    } catch (err) {
      console.error("Error en signUp:", err.message);
      authError.value = err.message;
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Login
  async function login(credentials) {
    loading.value = true;
    authError.value = null;
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      if (error) throw error;
      user.value = data.user;
      session.value = data.session;
      return true;
    } catch (err) {
      authError.value = err.message;
      user.value = null;
      session.value = null;
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Logout
  async function logout() {
    loading.value = true;
    authError.value = null;
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      user.value = null;
      session.value = null;
    } catch (err) {
      authError.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  // Inicializa listener y restaura sesión
  async function initializeAuthStateListener() {
    try {
      const {
        data: { session: currentSession },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      session.value = currentSession;
      user.value = currentSession?.user ?? null;
    } catch (err) {
      session.value = null;
      user.value = null;
    } finally {
      loading.value = false;
    }

    supabase.auth.onAuthStateChange((event, currentSession) => {
      session.value = currentSession;
      user.value = currentSession ? currentSession.user : null;
    });
  }

  return {
    user,
    session,
    loading,
    authError,
    isLoggedIn,
    signUp,
    login,
    logout,
    initializeAuthStateListener,
  };
});

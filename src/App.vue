<template>
  <div id="app-root-container">
    <NavBar
      v-if="authStore.isLoggedIn && initialAuthCheckCompleted"
      :userEmail="authStore.user?.email"
      :loading="authStore.loading"
      @logout="handleLogout"
    />
    <div
      v-else-if="!initialAuthCheckCompleted && authStore.loading"
      class="app-loading"
    >
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
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { useTodoStore } from "@/stores/projectsStore";
import NavBar from "@/components/NavBar.vue";

const authStore = useAuthStore();
const projectStore = useTodoStore();
const router = useRouter();

const initialAuthCheckCompleted = ref(false);

const handleLogout = async () => {
  await authStore.logout();
  projectStore.clearTodos();
  router.push({ name: "Login" });
};

onMounted(() => {
  authStore.initializeAuthStateListener();

  const unwatch = watch(
    () => [authStore.session, authStore.loading],
    ([session, loading]) => {
      if (!loading) {
        initialAuthCheckCompleted.value = true;
        console.log(
          "Initial auth check considered complete. Session:",
          session
        );
        unwatch();
      }
    }
  );
});
</script>

<style></style>

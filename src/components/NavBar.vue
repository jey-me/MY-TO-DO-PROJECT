<template>
  <nav>
    <p>Bienvenido, {{ userEmail }}!</p>
    <button @click="onLogout" :disabled="loading">
      {{ loading ? "Cerrando sesión..." : "Cerrar Sesión" }}
    </button>
  </nav>
</template>

<script setup>
const props = defineProps({
  userEmail: String,
  loading: Boolean,
});

const emit = defineEmits(["logout"]);

function onLogout() {
  emit("logout");
}
</script>

<style scoped>
nav {
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 10px;
  opacity: 70%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: rgba(255, 255, 255, 0.1);
}

p {
  color: rgb(255, 255, 255);
}
</style>

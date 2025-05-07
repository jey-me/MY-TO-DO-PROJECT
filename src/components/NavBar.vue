<template>
    <nav>
      <p>Bienvenido, {{ userEmail }}!</p>
      <button @click="handleLogout" :disabled="loading">
        {{ loading ? "Cerrando sesión..." : "Cerrar Sesión" }}
      </button>
    </nav>
  </template>
  
  <script setup>
  const props = defineProps({
    userEmail: String,
    loading: Boolean,
    handleLogout: Function
  });
  </script>
  
  <style scoped>
  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 80 vw;
    padding: 10px; /* Espaciado interno */
    opacity: 70%;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);    
    background-color: rgba(255, 255, 255, 0.1) ;
  }

  p {
    color: rgb(255, 255, 255);
  }
  </style>
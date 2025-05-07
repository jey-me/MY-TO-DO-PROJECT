<template>
          <p>Bienvenido, {{ authStore.user?.email }}!</p>
          <button @click="handleLogout" :disabled="authStore.loading">
            {{ authStore.loading ? 'Cerrando sesión...' : 'Cerrar Sesión' }}
          </button>
</template>

<script>

</script>

<style>

</style>
// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia' // Importa createPinia
import './style.css'
import App from './App.vue'

const app = createApp(App)

app.use(createPinia()) // Usa Pinia en tu aplicación

app.mount('#app')
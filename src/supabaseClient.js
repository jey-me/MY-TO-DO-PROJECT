// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// --- Añade estos logs para depuración detallada ---
console.log('--- Intentando inicializar Supabase Client ---');
console.log('Valor VITE_SUPABASE_URL:', supabaseUrl);
console.log('Tipo VITE_SUPABASE_URL:', typeof supabaseUrl);
console.log('Valor VITE_SUPABASE_ANON_KEY:', supabaseAnonKey);
console.log('Tipo VITE_SUPABASE_ANON_KEY:', typeof supabaseAnonKey);
// -------------------------------------------------

let supabase; // Declara la variable fuera

// Asegúrate de que ambos son strings válidos antes de crear
if (typeof supabaseUrl === 'string' && supabaseUrl.trim() !== '' &&
    typeof supabaseAnonKey === 'string' && supabaseAnonKey.trim() !== '') {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('>>> Cliente Supabase CREADO exitosamente.');
  } catch (error) {
     console.error('!!! ERROR al llamar a createClient:', error);
  }
} else {
  console.error('!!! ERROR: URL o Clave Anónima faltante/inválida en .env. No se puede crear el cliente Supabase.');
  // Podrías lanzar un error aquí si quieres detener la app:
  // throw new Error('Configuración de Supabase inválida en .env');
}

// Exporta la instancia (que podría ser undefined si falló la creación)
export { supabase };
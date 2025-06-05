import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase;

if (
  typeof supabaseUrl === "string" &&
  supabaseUrl.trim() !== "" &&
  typeof supabaseAnonKey === "string" &&
  supabaseAnonKey.trim() !== ""
) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error("!!! ERROR al llamar a createClient:", error);
  }
} else {
  console.error(
    "!!! ERROR: URL o Clave Anónima faltante/inválida en .env. No se puede crear el cliente Supabase."
  );
}

export { supabase };

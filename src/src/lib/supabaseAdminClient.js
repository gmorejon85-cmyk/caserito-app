import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Este es un segundo cliente de Supabase, separado del principal.
 * Se usa SOLO en la pantalla "Crear usuario" del panel de administrador.
 *
 * Motivo: crear una cuenta nueva con supabase.auth.signUp() normalmente
 * reemplaza la sesión activa por la del usuario recién creado. Como no
 * queremos que el administrador quede desconectado cada vez que crea un
 * empleado o vendedor, usamos esta segunda instancia con "persistSession: false"
 * para que la creación de la cuenta no toque la sesión del administrador.
 *
 * No usa ninguna clave secreta: sigue siendo la misma clave pública (anon key).
 */
export const supabaseForNewUsers = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

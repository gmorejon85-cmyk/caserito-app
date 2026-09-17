-- =========================================================================
--  Convertir un usuario en ADMINISTRADOR
--  Usa esto DESPUÉS de:
--   1) haber corrido schema.sql
--   2) haber creado tu usuario en Authentication > Users (panel de Supabase)
--
--  Reemplaza el correo de abajo por el correo que usaste al crear ese
--  usuario, y presiona "Run".
-- =========================================================================

update public.profiles
set tipo_usuario = 'admin'
where id = (select id from auth.users where email = 'TU-CORREO-AQUI@ejemplo.com');

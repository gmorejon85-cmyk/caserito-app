# Caserito — Guía de puesta en marcha

Esta guía está escrita para alguien sin conocimientos técnicos. Sigue los pasos en orden.

## Qué hay dentro de este ZIP

- `src/` — todo el código de la aplicación (funciona igual en computadora y en celular, se ajusta solo).
- `supabase/schema.sql` — el script que crea toda tu base de datos de un solo paso.
- `supabase/hacer_admin.sql` — un script chiquito para convertir a un usuario en administrador.
- `.env.example` — donde van tus dos datos de conexión con Supabase.
- `netlify.toml` — configuración lista para publicar en Netlify.

---

## PARTE 1 — Crear tu base de datos en Supabase

**Paso 1. Crea un proyecto en Supabase** (si no lo tienes ya)
Ve a [supabase.com](https://supabase.com) → "New project" → ponle un nombre y una contraseña de base de datos (guárdala, no la necesitarás seguido) → espera 1-2 minutos a que se cree.

**Paso 2. Crea las tablas con un solo script**
1. En el menú izquierdo de Supabase, entra a **SQL Editor**.
2. Haz clic en **New query**.
3. Abre el archivo `supabase/schema.sql` de este ZIP, copia todo su contenido y pégalo ahí.
4. Presiona **Run**. Deberías ver un mensaje de éxito. Con esto ya quedaron creadas todas las tablas, la seguridad y las reglas de la app. No necesitas tocar nada más aquí.

**Paso 3. Crea las dos carpetas para las fotos (buckets)**
1. En el menú izquierdo, entra a **Storage**.
2. Haz clic en **New bucket**, escribe exactamente `productos`, márcalo como **Public**, y guarda.
3. Repite lo mismo con otro bucket llamado exactamente `logos`, también **Public**.

Estos dos nombres son obligatorios porque el código ya los tiene programados así.

**Paso 4. Crea tu usuario administrador**
1. En el menú izquierdo, entra a **Authentication → Users**.
2. Haz clic en **Add user** (o "Invite user" / "Create new user", según la versión).
3. Escribe el correo y la contraseña que tú quieras usar para entrar como administrador. Si aparece una opción de "Auto Confirm User", actívala.
4. Vuelve a **SQL Editor → New query**, abre el archivo `supabase/hacer_admin.sql`, reemplaza el correo de ejemplo por el correo que acabas de usar, y presiona **Run**.

Con eso, ese usuario ya puede entrar a la app como administrador. Desde dentro de la app (menú "Crear usuario" del panel de administrador) podrás crear todos los empleados, vendedores u otros administradores que necesites — no vuelvas a tocar Supabase para eso.

**Paso 5 (opcional pero recomendado). Simplifica el ingreso de nuevos usuarios**
Por defecto, Supabase pide que cada persona confirme su correo antes de poder ingresar. Si quieres que tanto los clientes/comercios que se registran solos, como los usuarios que cree el administrador, puedan entrar de inmediato sin revisar su correo:
1. Ve a **Authentication → Providers → Email**.
2. Desactiva la opción **Confirm email**.
3. Guarda los cambios.

Esto es opcional: si lo dejas activado, simplemente cada persona nueva deberá hacer clic en el enlace que le llega por correo antes de su primer ingreso.

**Paso 6. Copia tus dos datos de conexión**
1. Ve a **Settings → API**.
2. Copia el valor de **Project URL**.
3. Copia el valor de **Project API keys → anon / public** (a veces se llama "Publishable key").

---

## PARTE 2 — Conectar la aplicación con tu Supabase

1. Dentro de la carpeta del proyecto, crea un archivo llamado `.env` (puedes copiar `.env.example` y renombrarlo).
2. Pega ahí tus dos datos:

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anon-aqui
```

3. Guarda el archivo. Eso es todo — la aplicación ya sabe cómo hablar con tu base de datos.

---

## PARTE 3 — Publicar en Netlify

**Opción A — Subiendo el código a GitHub (recomendada)**
1. Sube esta carpeta a un repositorio de GitHub.
2. En [netlify.com](https://netlify.com), haz clic en **Add new site → Import an existing project** y elige tu repositorio.
3. Netlify va a detectar solo la configuración (ya viene en `netlify.toml`): comando `npm run build`, carpeta `dist`.
4. Antes de publicar, ve a **Site configuration → Environment variables** y agrega las mismas dos variables de tu `.env`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Haz clic en **Deploy site**.

**Opción B — Publicar sin GitHub**
1. En tu computadora, dentro de la carpeta del proyecto, instala dependencias una vez con `npm install` y luego genera la versión final con `npm run build`. Esto crea una carpeta `dist`.
2. Ve a [app.netlify.com/drop](https://app.netlify.com/drop) y arrastra la carpeta `dist`.
3. Como este método no usa `.env`, agrega igualmente las dos variables de entorno desde **Site configuration → Environment variables** en Netlify y vuelve a publicar (**Trigger deploy**) para que las tome en cuenta.

---

## ¿Cómo se ve la app por dentro?

- **Clientes**: se registran en `/registro-cliente`, exploran ofertas, reservan y "pagan" con un QR simulado, ven su historial y sus estadísticas de ahorro.
- **Comercios**: se registran en `/registro-comercio`. Un administrador debe aprobarlos antes de que puedan publicar. Una vez aprobados, publican excedentes (con foto, precio, categoría, etc.) y gestionan sus pedidos.
- **Administrador**: aprueba o rechaza comercios, ve estadísticas generales, modera publicaciones, y crea nuevos usuarios (empleados, vendedores, otros admins) desde dentro de la app.

## Nota honesta sobre el pago con QR

El pago con QR de esta versión es **simulado**: confirma el pedido y descuenta el stock, pero no está conectado a un banco o pasarela de pago real. Conectar un cobro real (por ejemplo, con un procesador de QR boliviano) es un paso aparte que requiere contratar ese servicio y sus propias credenciales — avísame cuando quieras dar ese paso y lo vemos.

---

## Resumen rápido (lo mínimo que tienes que hacer)

**En Supabase:**
1. Crear el proyecto.
2. Pegar y correr `supabase/schema.sql` en el SQL Editor.
3. Crear los buckets `productos` y `logos` (públicos) en Storage.
4. Crear tu usuario admin en Authentication → Users, y correr `supabase/hacer_admin.sql` con su correo.
5. (Opcional) Desactivar "Confirm email" en Authentication → Providers → Email.
6. Copiar tu Project URL y tu anon key desde Settings → API.

**En tu computadora / Netlify:**
7. Pegar esas dos claves en tu archivo `.env` (o en las variables de entorno de Netlify).
8. Publicar el sitio en Netlify (con GitHub o arrastrando la carpeta `dist`).

Listo — tu app queda funcionando con base de datos real.

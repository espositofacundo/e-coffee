# Timón & Pumba

Tienda online de la distribuidora de alimentos secos Timón & Pumba: frutos secos, mix, semillas, granolas, harinas y más.

- Los clientes arman su pedido por ½ kg, por kilo o por unidad, cargan su dirección y lo envían por WhatsApp.
- El dueño administra productos, categorías y pedidos desde el panel de administración.

Hecho con Next.js 14, Prisma + PostgreSQL, NextAuth, Zustand y Tailwind.

## Correr en desarrollo

1. Clonar el repo.
2. Copiar `.env.template` a `.env` y completar `AUTH_SECRET` y `CLOUDINARY_URL` (Cloudinary guarda las fotos de productos; es opcional).
3. Instalar dependencias: `npm install`
4. Levantar la base con Docker: `docker compose up -d`
5. Correr las migraciones: `npx prisma migrate dev`
6. Cargar la lista de precios inicial: `npm run seed`
7. `npm run dev` y abrir http://localhost:3000

Usuarios que crea el seed (contraseña `123123`):

| Email | Rol |
| --- | --- |
| `admin@timonypumba.com` | Administrador |
| `cliente@timonypumba.com` | Cliente |

> El seed borra todos los datos antes de cargar. No correrlo contra la base de producción.

## Producción (Vercel + Neon)

Variables de entorno en Vercel: `DATABASE_URL` (conexión pooled), `DATABASE_URL_UNPOOLED` (conexión directa, la usan las migraciones), `AUTH_SECRET` y `CLOUDINARY_URL`. Si la base se crea desde **Storage → Neon**, Vercel carga las dos primeras solo.

El build (`npm run build`) aplica las migraciones pendientes antes de compilar.

Para cargar la lista de precios en una base nueva, desde la PC y en una terminal aparte:

```powershell
$env:DATABASE_URL="<DATABASE_URL de Neon>"
$env:DATABASE_URL_UNPOOLED="<DATABASE_URL_UNPOOLED de Neon>"
npx prisma migrate deploy
$env:SEED_ADMIN_EMAIL="<email del dueño>"
$env:SEED_ADMIN_PASSWORD="<contraseña>"
npm run seed
```

Con `SEED_ADMIN_EMAIL` y `SEED_ADMIN_PASSWORD` el seed crea solo ese administrador, sin los usuarios de prueba. En una base remota que ya tiene pedidos el seed no se ejecuta, para no borrarlos. Cerrá esa terminal al terminar, así no quedan apuntando a producción.

## Cómo funciona

**Productos.** Cada producto se vende por kilo (con precio opcional por ½ kg) o por unidad. Puede tener variedades, por ejemplo sabores; en ese caso el cliente tiene que elegir una al pedir. Un producto marcado "Sin stock" deja de aparecer en el catálogo.

**Pedidos.** El cliente tiene que tener cuenta para confirmar. El envío es gratis. Los precios siempre se recalculan en el servidor al registrar el pedido. Estados del pedido: Recibido → Preparando → En camino → Entregado (o Cancelado). El pago se marca aparte.

**Datos del negocio.** El nombre, los teléfonos y los números de WhatsApp están en `src/config/store.ts`.

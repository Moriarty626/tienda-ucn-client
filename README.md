# TiendaUCN - Cliente Web

Cliente web funcional para la plataforma TiendaUCN construido con **Next.js 15**, **TypeScript** y **Tailwind CSS**.

## Requisitos

- Node.js 18+
- npm 9+
- Backend corriendo en `http://localhost:5094`

## Instalacion

```bash
npm install
```

## Configuracion de Variables de Entorno

Crear archivo `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5094/api
NEXT_PUBLIC_API_TIMEOUT=30000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-secret-seguro-aqui
TEST_EMAIL=admin@tiendaucn.cl
TEST_PASSWORD=Admin1234!
```

## Ejecutar

```bash
# Desarrollo
npm run dev

# Build (debe compilar sin errores)
npm run build

# Production
npm start

# Linting
npm run lint

# Tests E2E
npm run test:e2e
```

Acceder a: `http://localhost:3000`

---

## Stack Tecnologico

| Componente | Libreria | Version |
|-----------|----------|---------|
| Framework | Next.js | 15 |
| Lenguaje | TypeScript | 5 |
| Estilos | Tailwind CSS | 4 |
| Autenticacion | NextAuth | 5.0 |
| Forms | React Hook Form | 7.78 |
| Validacion | Zod | 4.4 |
| HTTP Client | Axios | 1.18 |
| State (Server) | TanStack Query | 5.101 |
| State (Client) | Jotai | 2.20 |
| Notificaciones | Sonner | 2.0 |
| Componentes | Shadcn/ui | - |
| Testing | Playwright | 1.61 |

---

## Flujos Implementados

### Flujo 1: Identidad y Seguridad ✓

- Validacion de formularios con React Hook Form + Zod
- Autenticacion JWT con NextAuth
- Proteccion de rutas con Middleware
- Notificaciones con Toasts (Sonner)

**Rutas**:
- `/login` - Inicio de sesion
- `/register` - Registro de usuario
- `/verify-email` - Verificacion de email

### Flujo 2: Catalogo Publico (En desarrollo)

- Obtencion de datos con TanStack Query
- Filtros y busqueda sincronizados en URL
- Debounce en inputs de texto

### Flujo 3: Gestion Administrativa (Pendiente)

- CRUD de productos
- Preview local de imagenes
- Formularios de administracion

### Flujo 4: Transaccionalidad (Pendiente)

- Carrito con Jotai
- Historial de pedidos
- Generacion de PDFs

---

## Estructura del Proyecto

```
src/
├── app/                         # Next.js App Router
│   ├── (auth)/                 # Rutas de autenticacion
│   ├── admin/page.tsx          # Panel admin (protegido)
│   ├── carrito/page.tsx        # Carrito (protegido)
│   ├── pedidos/page.tsx        # Mis pedidos (protegido)
│   ├── perfil/page.tsx         # Perfil (protegido)
│   └── page.tsx                # Home
├── components/
│   ├── forms/                  # Formularios
│   ├── shared/                 # Componentes compartidos
│   ├── ui/                     # Componentes UI base
│   └── providers/              # Providers (QueryProvider, etc)
├── services/                   # Servicios HTTP (Axios)
├── hooks/                      # Hooks personalizados
├── store/                      # Estado local (Jotai)
├── domain/                     # DTOs, esquemas, tipos
├── clients/                    # Cliente Axios, rutas API
├── lib/                        # Utilidades
└── types/                      # Tipos TypeScript

middleware.ts                   # Proteccion de rutas
```

---

## Condiciones Habilitantes Cumplidas

- [x] Tecnologia Base: Next.js 15 + TypeScript + Tailwind CSS
- [x] Integracion Real: 100% Axios + API REST (sin datos estaticos)
- [x] Orquestacion Centralizada: Todo por API
- [x] Ejecucion: npm run build exitoso
- [x] Herramientas: ESLint, Prettier, Husky configurados
- [x] Gestion de Secretos: Variables de entorno

---

## Documentacion

- **SETUP.md** - Instrucciones detalladas de ejecucion
- **ARCHITECTURE.md** - Explicacion de la arquitectura
- **TESTING.md** - Guia de testing E2E

---

## Licencia

Proyecto del Taller 2 - Introduccion al Desarrollo Web y Movil
Universidad Catolica del Norte

# 🏪 Gráfica Santiago - Plataforma E-Commerce

Plataforma de comercio electrónico desarrollada para **Gráfica Santiago**, una empresa dedicada a la venta de productos de papelería, suministros de oficina y material escolar en Ecuador.

## 📋 Descripción del Proyecto

Este proyecto es un prototipo funcional de e-commerce desarrollado como proyecto académico de 4to ciclo. La plataforma incluye:

- 🛒 **Tienda Online**: Catálogo de productos con filtros, búsqueda y paginación
- 👨‍💼 **Panel de Administración**: Gestión de productos, usuarios, órdenes e inventario
- 👥 **Gestión de Usuarios**: CRUD completo con roles (Admin, Bodeguero, Cliente, Mayorista)
- 📦 **Sistema de Mayoristas**: Proceso de aprobación para cuentas mayoristas
- 🔐 **Autenticación**: Login, registro y protección de rutas por rol

## 🔗 Enlaces del Proyecto

- **Tablero Jira**: [Ver Sprint Backlog](https://alex45.atlassian.net/jira/software/projects/GRF/boards/37?atlOrigin=eyJpIjoiODdkYjE4YjI2YjUyNGRmNmE3NGVkYmFiYjBhYTE3ZjEiLCJwIjoiaiJ9)
- **Repositorio GitHub**: [proyecto_Grafica_Santiago](https://github.com/AlexJavierQ/proyecto_Grafica_Santiago)

## 🛠️ Tecnologías Utilizadas

| Tecnología | Uso |
|------------|-----|
| **Next.js 16** | Framework React con App Router |
| **TypeScript** | Tipado estático |
| **Prisma** | ORM para base de datos |
| **SQLite** | Base de datos de desarrollo |
| **Tailwind CSS** | Estilos utilitarios |
| **CSS Modules** | Estilos componentizados |
| **bcryptjs** | Hash de contraseñas |
| **JWT** | Autenticación con tokens |

## 🎨 Paleta de Colores

| Color | Código | Uso |
|-------|--------|-----|
| Azul Oscuro | `#012b42` | Color principal |
| Amarillo | `#ffe607` | Color de acento |

## 🚀 Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Configurar base de datos
npx prisma generate
npx prisma db push

# Poblar con datos de prueba
npm run db:seed

# Ejecutar en desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## 👤 Credenciales de Prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| Administrador | `admin@graficasantiago.com` | `password123` |
| Bodeguero | `bodega@graficasantiago.com` | `password123` |
| Cliente | `cliente@email.com` | `password123` |
| Mayorista | `mayorista@empresa.com` | `password123` |

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Rutas y páginas (App Router)
│   ├── admin/              # Panel de administración
│   ├── api/                # API Routes
│   ├── login/              # Página de login
│   └── productos/          # Catálogo de productos
├── components/             # Componentes reutilizables
│   ├── layout/             # Navbar, Footer
│   └── products/           # ProductCard
├── lib/                    # Utilidades y configuración
│   ├── auth.ts             # Funciones de autenticación
│   ├── prisma.ts           # Cliente Prisma
│   └── constants.ts        # Constantes del sistema
└── prisma/
    ├── schema.prisma       # Esquema de base de datos
    └── seed.ts             # Script de datos de prueba
```

## 📊 Sprints del Proyecto

### Sprint 1 ✅ Completado
- Configuración inicial del proyecto
- Página principal con Hero section
- Catálogo de productos
- Sistema de autenticación
- Panel de administración básico
- CRUD de usuarios
- Gestión de mayoristas

### Sprint 2 🔄 En Progreso
- Sistema de carrito de compras
- Página de detalle de producto
- Checkout simulado
- CRUD de productos en admin
- Sistema de inventario

## 👨‍💻 Autor

**Alex Javier Q.**

Proyecto académico - 4to Ciclo

---

© 2025 Gráfica Santiago. Todos los derechos reservados.

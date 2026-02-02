const { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, HeadingLevel, WidthType, BorderStyle, AlignmentType, PageBreak } = require('docx');
const fs = require('fs');
const path = require('path');

async function generarDocumentoArquitectura() {
    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                // === PORTADA ===
                new Paragraph({ text: '', spacing: { after: 1000 } }),
                new Paragraph({
                    children: [new TextRun({ text: 'GRÁFICA SANTIAGO', bold: true, size: 56, color: '4472C4' })],
                    alignment: AlignmentType.CENTER,
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'Plataforma E-commerce de Papelería', size: 32, italics: true })],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 800 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'Documento de Arquitectura de Software', bold: true, size: 40 })],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'Versión 1.0', size: 28 })],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 1500 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'Fecha: 27 de Enero de 2026', size: 24 })],
                    alignment: AlignmentType.CENTER,
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'Autor: Alex Quishpe', size: 24 })],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 }
                }),

                // === HISTORIAL DE REVISIONES ===
                new Paragraph({ children: [new PageBreak()] }),
                new Paragraph({
                    children: [new TextRun({ text: 'Historial de Revisiones', bold: true, size: 28 })],
                    heading: HeadingLevel.HEADING_1,
                    spacing: { after: 200 }
                }),
                crearTabla([
                    ['Versión', 'Descripción', 'Responsable', 'Fecha'],
                    ['1.0', 'Versión inicial del documento de arquitectura', 'Alex Quishpe', '27/01/2026'],
                ]),

                // === 1. INTRODUCCIÓN ===
                new Paragraph({ children: [new PageBreak()] }),
                new Paragraph({
                    children: [new TextRun({ text: '1. Introducción', bold: true, size: 32, color: '4472C4' })],
                    heading: HeadingLevel.HEADING_1,
                    spacing: { before: 400, after: 200 }
                }),

                // 1.1 Propósito
                new Paragraph({
                    children: [new TextRun({ text: '1.1. Propósito', bold: true, size: 26 })],
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 300, after: 150 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'Este documento describe la arquitectura del sistema Gráfica Santiago, una plataforma de comercio electrónico especializada en productos de papelería, artículos de oficina y útiles escolares. El propósito es proporcionar una visión integral de la arquitectura del software utilizando el modelo de vistas 4+1 de Kruchten, facilitando la comprensión del sistema para desarrolladores, arquitectos y stakeholders.', size: 22 })],
                    spacing: { after: 150 }
                }),

                // 1.2 Ámbito
                new Paragraph({
                    children: [new TextRun({ text: '1.2. Ámbito', bold: true, size: 26 })],
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 300, after: 150 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'Gráfica Santiago es una aplicación web de comercio electrónico que permite:', size: 22 })],
                    spacing: { after: 100 }
                }),
                new Paragraph({ children: [new TextRun({ text: '• Gestión de catálogo de productos organizados por categorías', size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: '• Registro y autenticación de usuarios (clientes minoristas y mayoristas)', size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: '• Carrito de compras y proceso de checkout', size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: '• Panel administrativo para gestión de productos, usuarios, pedidos e inventario', size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: '• Sistema de precios diferenciados para clientes mayoristas', size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: '• Gestión de solicitudes de cuentas mayoristas', size: 22 })], spacing: { after: 150 } }),

                // 1.3 Definiciones
                new Paragraph({
                    children: [new TextRun({ text: '1.3. Definiciones, Acrónimos y Abreviaturas', bold: true, size: 26 })],
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 300, after: 150 }
                }),
                crearTabla([
                    ['Término', 'Definición'],
                    ['Next.js', 'Framework de React para aplicaciones web con renderizado del lado del servidor (SSR)'],
                    ['Prisma', 'ORM (Object-Relational Mapping) para Node.js y TypeScript'],
                    ['PostgreSQL', 'Sistema de gestión de base de datos relacional open source'],
                    ['JWT', 'JSON Web Token - estándar para autenticación basada en tokens'],
                    ['SSR', 'Server-Side Rendering - renderizado en el servidor'],
                    ['SSG', 'Static Site Generation - generación de sitios estáticos'],
                    ['API REST', 'Interfaz de programación de aplicaciones basada en HTTP'],
                    ['ORM', 'Object-Relational Mapping - mapeo objeto-relacional'],
                    ['Vercel', 'Plataforma de despliegue para aplicaciones frontend y serverless'],
                    ['Neon', 'Servicio de base de datos PostgreSQL serverless en la nube'],
                ]),

                // 1.4 Referencias
                new Paragraph({
                    children: [new TextRun({ text: '1.4. Referencias', bold: true, size: 26 })],
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 300, after: 150 }
                }),
                new Paragraph({ children: [new TextRun({ text: '• Documentación oficial de Next.js: https://nextjs.org/docs', size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: '• Documentación de Prisma ORM: https://www.prisma.io/docs', size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: '• Modelo de vistas 4+1 de Philippe Kruchten', size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: '• Repositorio del proyecto: GitHub', size: 22 })], spacing: { after: 150 } }),

                // === 2. REPRESENTACIÓN DE LA ARQUITECTURA ===
                new Paragraph({ children: [new PageBreak()] }),
                new Paragraph({
                    children: [new TextRun({ text: '2. Representación de la Arquitectura', bold: true, size: 32, color: '4472C4' })],
                    heading: HeadingLevel.HEADING_1,
                    spacing: { before: 400, after: 200 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'La arquitectura del sistema se describe utilizando el modelo 4+1 de Philippe Kruchten, que organiza la descripción en cinco vistas complementarias:', size: 22 })],
                    spacing: { after: 150 }
                }),

                // 2.1 Vista de Escenarios
                new Paragraph({
                    children: [new TextRun({ text: '2.1. Vista de Escenarios (+1)', bold: true, size: 26 })],
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 300, after: 150 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'Representa los casos de uso del sistema que guían el diseño arquitectónico. Incluye los flujos principales de usuarios (clientes, mayoristas y administradores) y sus interacciones con el sistema.', size: 22 })],
                    spacing: { after: 150 }
                }),

                // 2.2 Vista Lógica
                new Paragraph({
                    children: [new TextRun({ text: '2.2. Vista Lógica', bold: true, size: 26 })],
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 300, after: 150 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'Describe la estructura del software en términos de módulos, clases y sus relaciones. En Gráfica Santiago, esta vista muestra los modelos de datos (User, Product, Category, Order, etc.) y los componentes React que conforman la interfaz.', size: 22 })],
                    spacing: { after: 150 }
                }),

                // 2.3 Vista de Procesos
                new Paragraph({
                    children: [new TextRun({ text: '2.3. Vista de Procesos', bold: true, size: 26 })],
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 300, after: 150 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'Describe los procesos del sistema y cómo se comunican. La aplicación utiliza un modelo de request-response HTTP donde Next.js maneja las peticiones del cliente, procesa la lógica de negocio mediante API Routes, y consulta la base de datos a través de Prisma.', size: 22 })],
                    spacing: { after: 150 }
                }),

                // 2.4 Vista de Implementación
                new Paragraph({
                    children: [new TextRun({ text: '2.4. Vista de Implementación/Desarrollo', bold: true, size: 26 })],
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 300, after: 150 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'Muestra la organización del código fuente en módulos y paquetes. El proyecto sigue la estructura de App Router de Next.js 14 con separación en componentes, páginas, API routes, y utilidades.', size: 22 })],
                    spacing: { after: 150 }
                }),

                // 2.5 Vista Física
                new Paragraph({
                    children: [new TextRun({ text: '2.5. Vista Física', bold: true, size: 26 })],
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 300, after: 150 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'Describe la infraestructura de hardware/cloud y cómo se despliega el software. Gráfica Santiago se despliega en Vercel (aplicación Next.js) conectada a una base de datos PostgreSQL en Neon (serverless).', size: 22 })],
                    spacing: { after: 150 }
                }),

                // === 3. OBJETIVOS Y RESTRICCIONES ===
                new Paragraph({ children: [new PageBreak()] }),
                new Paragraph({
                    children: [new TextRun({ text: '3. Objetivos y Restricciones Arquitectónicas', bold: true, size: 32, color: '4472C4' })],
                    heading: HeadingLevel.HEADING_1,
                    spacing: { before: 400, after: 200 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'Objetivos:', bold: true, size: 24 })],
                    spacing: { after: 100 }
                }),
                new Paragraph({ children: [new TextRun({ text: '• Escalabilidad: La arquitectura serverless permite escalar automáticamente según la demanda.', size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: '• Rendimiento: Uso de SSR/SSG para optimizar tiempos de carga y SEO.', size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: '• Mantenibilidad: Código organizado en componentes reutilizables y separación de responsabilidades.', size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: '• Seguridad: Autenticación JWT, validación de roles, y protección de rutas sensibles.', size: 22 })], spacing: { after: 150 } }),

                new Paragraph({
                    children: [new TextRun({ text: 'Restricciones:', bold: true, size: 24 })],
                    spacing: { after: 100 }
                }),
                new Paragraph({ children: [new TextRun({ text: '• Tecnología: Uso de Next.js 14 con App Router como framework principal.', size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: '• Base de datos: PostgreSQL como único sistema de gestión de base de datos.', size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: '• Hosting: Despliegue en plataforma Vercel con funciones serverless.', size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: '• Presupuesto: Uso de servicios con tier gratuito (Vercel Hobby, Neon Free).', size: 22 })], spacing: { after: 150 } }),

                // === 4. VISTA DE ESCENARIOS ===
                new Paragraph({ children: [new PageBreak()] }),
                new Paragraph({
                    children: [new TextRun({ text: '4. Vista de Escenarios', bold: true, size: 32, color: '4472C4' })],
                    heading: HeadingLevel.HEADING_1,
                    spacing: { before: 400, after: 200 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'Descripción:', bold: true, size: 24 })],
                    spacing: { after: 100 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'El sistema atiende a tres tipos de actores principales:', size: 22 })],
                    spacing: { after: 100 }
                }),
                new Paragraph({ children: [new TextRun({ text: '1. Cliente Minorista: Usuario que navega el catálogo, agrega productos al carrito y realiza compras a precio regular.', size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: '2. Cliente Mayorista: Usuario aprobado que accede a precios especiales para compras al por mayor.', size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: '3. Administrador: Usuario con acceso al panel de gestión para administrar productos, categorías, usuarios, pedidos e inventario.', size: 22 })], spacing: { after: 200 } }),

                new Paragraph({
                    children: [new TextRun({ text: 'Casos de Uso Principales:', bold: true, size: 24 })],
                    spacing: { after: 100 }
                }),
                crearTabla([
                    ['Actor', 'Caso de Uso', 'Descripción'],
                    ['Cliente', 'Registrarse', 'Crear cuenta nueva con opción de solicitar cuenta mayorista'],
                    ['Cliente', 'Iniciar Sesión', 'Autenticarse en el sistema con email y contraseña'],
                    ['Cliente', 'Navegar Catálogo', 'Explorar productos por categorías y buscar productos'],
                    ['Cliente', 'Agregar al Carrito', 'Seleccionar productos y cantidades para compra'],
                    ['Cliente', 'Realizar Checkout', 'Completar proceso de compra con dirección de envío'],
                    ['Mayorista', 'Ver Precios Especiales', 'Visualizar precios mayoristas en catálogo'],
                    ['Admin', 'Gestionar Productos', 'Crear, editar, eliminar productos del catálogo'],
                    ['Admin', 'Gestionar Categorías', 'Administrar categorías de productos'],
                    ['Admin', 'Aprobar Mayoristas', 'Revisar y aprobar solicitudes de cuentas mayoristas'],
                    ['Admin', 'Ver Dashboard', 'Consultar estadísticas y métricas del negocio'],
                ]),
                new Paragraph({
                    children: [new TextRun({ text: '[Diagrama de Casos de Uso - Insertar imagen del diagrama UML]', italics: true, color: '888888' })],
                    spacing: { before: 200, after: 200 }
                }),

                // === 5. VISTA LÓGICA ===
                new Paragraph({ children: [new PageBreak()] }),
                new Paragraph({
                    children: [new TextRun({ text: '5. Vista Lógica', bold: true, size: 32, color: '4472C4' })],
                    heading: HeadingLevel.HEADING_1,
                    spacing: { before: 400, after: 200 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'Descripción:', bold: true, size: 24 })],
                    spacing: { after: 100 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'La arquitectura lógica del sistema se organiza en las siguientes capas:', size: 22 })],
                    spacing: { after: 150 }
                }),

                new Paragraph({
                    children: [new TextRun({ text: 'Capa de Presentación (Frontend):', bold: true, size: 22 })],
                    spacing: { after: 50 }
                }),
                new Paragraph({ children: [new TextRun({ text: '• Componentes React (Server Components y Client Components)', size: 22 })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '• Páginas públicas: Home, Catálogo, Detalle de Producto, Login, Registro', size: 22 })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '• Páginas protegidas: Carrito, Checkout, Perfil de Usuario', size: 22 })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '• Panel Administrativo: Dashboard, Gestión de Productos, Usuarios, Pedidos', size: 22 })], spacing: { after: 100 } }),

                new Paragraph({
                    children: [new TextRun({ text: 'Capa de API (Backend):', bold: true, size: 22 })],
                    spacing: { after: 50 }
                }),
                new Paragraph({ children: [new TextRun({ text: '• API Routes de Next.js (/api/*)', size: 22 })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '• Endpoints de autenticación: /api/auth/login, /api/auth/register', size: 22 })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '• Endpoints de administración: /api/admin/products, /api/admin/users, etc.', size: 22 })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '• Endpoints públicos: /api/products, /api/categories', size: 22 })], spacing: { after: 100 } }),

                new Paragraph({
                    children: [new TextRun({ text: 'Capa de Datos:', bold: true, size: 22 })],
                    spacing: { after: 50 }
                }),
                new Paragraph({ children: [new TextRun({ text: '• Prisma ORM como capa de abstracción', size: 22 })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '• PostgreSQL como base de datos relacional', size: 22 })], spacing: { after: 100 } }),

                new Paragraph({
                    children: [new TextRun({ text: 'Modelo de Datos (Entidades Principales):', bold: true, size: 24 })],
                    spacing: { before: 150, after: 100 }
                }),
                crearTabla([
                    ['Entidad', 'Atributos Principales', 'Relaciones'],
                    ['User', 'id, email, password, name, role, status', 'Tiene muchos: Orders, Addresses'],
                    ['Category', 'id, name, description, image, isActive', 'Tiene muchos: Products'],
                    ['Product', 'id, name, sku, price, wholesalePrice, stock, images', 'Pertenece a: Category'],
                    ['Order', 'id, status, total, shippingAddress, createdAt', 'Pertenece a: User, Tiene muchos: OrderItems'],
                    ['OrderItem', 'id, quantity, price, productId', 'Pertenece a: Order, Product'],
                    ['Address', 'id, street, city, province, country', 'Pertenece a: User'],
                ]),
                new Paragraph({
                    children: [new TextRun({ text: '[Diagrama de Clases - Insertar imagen del diagrama UML]', italics: true, color: '888888' })],
                    spacing: { before: 200, after: 200 }
                }),

                // === 6. VISTA DE DESARROLLO ===
                new Paragraph({ children: [new PageBreak()] }),
                new Paragraph({
                    children: [new TextRun({ text: '6. Vista de Desarrollo', bold: true, size: 32, color: '4472C4' })],
                    heading: HeadingLevel.HEADING_1,
                    spacing: { before: 400, after: 200 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'Descripción:', bold: true, size: 24 })],
                    spacing: { after: 100 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'El proyecto sigue la estructura estándar de Next.js 14 con App Router:', size: 22 })],
                    spacing: { after: 150 }
                }),

                new Paragraph({
                    children: [new TextRun({ text: 'Estructura de Directorios:', bold: true, size: 22 })],
                    spacing: { after: 100 }
                }),
                new Paragraph({ children: [new TextRun({ text: 'plataforma/', size: 20, font: 'Consolas' })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '├── src/', size: 20, font: 'Consolas' })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '│   ├── app/                    # Páginas y rutas (App Router)', size: 20, font: 'Consolas' })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '│   │   ├── (auth)/             # Rutas de autenticación', size: 20, font: 'Consolas' })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '│   │   ├── admin/              # Panel administrativo', size: 20, font: 'Consolas' })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '│   │   ├── api/                # API Routes (endpoints REST)', size: 20, font: 'Consolas' })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '│   │   ├── productos/          # Catálogo de productos', size: 20, font: 'Consolas' })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '│   │   └── page.tsx            # Página principal (Home)', size: 20, font: 'Consolas' })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '│   ├── components/             # Componentes React reutilizables', size: 20, font: 'Consolas' })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '│   └── lib/                    # Utilidades y configuraciones', size: 20, font: 'Consolas' })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '├── prisma/', size: 20, font: 'Consolas' })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '│   ├── schema.prisma           # Esquema de base de datos', size: 20, font: 'Consolas' })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '│   └── seed.ts                 # Script de datos iniciales', size: 20, font: 'Consolas' })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '└── public/                     # Archivos estáticos', size: 20, font: 'Consolas' })], spacing: { after: 150 } }),

                new Paragraph({
                    children: [new TextRun({ text: 'Componentes Principales:', bold: true, size: 24 })],
                    spacing: { before: 150, after: 100 }
                }),
                crearTabla([
                    ['Componente', 'Responsabilidad', 'Ubicación'],
                    ['Navbar', 'Navegación principal, carrito, autenticación', 'components/layout/'],
                    ['ProductCard', 'Tarjeta de producto con botón agregar carrito', 'components/products/'],
                    ['HeroSlider', 'Slider promocional de la página principal', 'components/home/'],
                    ['AdminSidebar', 'Menú lateral del panel administrativo', 'app/admin/'],
                    ['CartProvider', 'Context de React para gestión del carrito', 'components/cart/'],
                ]),
                new Paragraph({
                    children: [new TextRun({ text: '[Diagrama de Componentes - Insertar imagen del diagrama UML]', italics: true, color: '888888' })],
                    spacing: { before: 200, after: 200 }
                }),

                // === 7. VISTA FÍSICA ===
                new Paragraph({ children: [new PageBreak()] }),
                new Paragraph({
                    children: [new TextRun({ text: '7. Vista Física', bold: true, size: 32, color: '4472C4' })],
                    heading: HeadingLevel.HEADING_1,
                    spacing: { before: 400, after: 200 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'Descripción:', bold: true, size: 24 })],
                    spacing: { after: 100 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'El sistema se despliega en infraestructura cloud serverless con la siguiente topología:', size: 22 })],
                    spacing: { after: 150 }
                }),

                new Paragraph({
                    children: [new TextRun({ text: 'Infraestructura de Despliegue:', bold: true, size: 22 })],
                    spacing: { after: 100 }
                }),
                crearTabla([
                    ['Componente', 'Servicio/Tecnología', 'Ubicación'],
                    ['Aplicación Web', 'Vercel (Edge Network)', 'Global CDN'],
                    ['API Serverless', 'Vercel Functions', 'us-east-1'],
                    ['Base de Datos', 'Neon PostgreSQL', 'us-east-1'],
                    ['Imágenes', 'Unsplash CDN (externo)', 'Global CDN'],
                    ['DNS', 'Vercel DNS', 'Global'],
                ]),

                new Paragraph({
                    children: [new TextRun({ text: 'Flujo de Despliegue:', bold: true, size: 22 })],
                    spacing: { before: 200, after: 100 }
                }),
                new Paragraph({ children: [new TextRun({ text: '1. Desarrollador hace push a rama main en GitHub', size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: '2. Vercel detecta cambios y ejecuta build automático', size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: '3. Next.js compila páginas SSR/SSG y API Routes', size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: '4. Vercel despliega a Edge Network global', size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: '5. Aplicación disponible en URL de producción', size: 22 })], spacing: { after: 150 } }),

                new Paragraph({
                    children: [new TextRun({ text: 'URL de Producción: ', bold: true, size: 22 }), new TextRun({ text: 'https://proyecto-grafica-santiago.vercel.app', size: 22, color: '0563C1' })],
                    spacing: { after: 100 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: '[Diagrama de Despliegue - Insertar imagen del diagrama UML]', italics: true, color: '888888' })],
                    spacing: { before: 200, after: 200 }
                }),

                // === 8. PROPUESTA DE DISEÑO ===
                new Paragraph({ children: [new PageBreak()] }),
                new Paragraph({
                    children: [new TextRun({ text: '8. Propuesta de Diseño', bold: true, size: 32, color: '4472C4' })],
                    heading: HeadingLevel.HEADING_1,
                    spacing: { before: 400, after: 200 }
                }),

                new Paragraph({
                    children: [new TextRun({ text: '8.1. Arquitectura Lógica (Estilos y Patrones)', bold: true, size: 26 })],
                    spacing: { before: 200, after: 150 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'El sistema implementa los siguientes patrones arquitectónicos:', size: 22 })],
                    spacing: { after: 100 }
                }),
                crearTabla([
                    ['Patrón', 'Aplicación en el Sistema'],
                    ['Arquitectura en Capas', 'Separación en Presentación, API, Datos'],
                    ['MVC (Model-View-Controller)', 'Modelos Prisma, Componentes React, API Routes'],
                    ['Repository Pattern', 'Prisma Client abstrae acceso a datos'],
                    ['Component-Based Architecture', 'Componentes React reutilizables'],
                    ['Server-Side Rendering (SSR)', 'Páginas renderizadas en servidor para SEO'],
                    ['Client-Side State Management', 'React Context para carrito de compras'],
                    ['JWT Authentication', 'Tokens para autenticación stateless'],
                    ['Middleware Pattern', 'Protección de rutas administrativas'],
                ]),

                new Paragraph({
                    children: [new TextRun({ text: '8.2. Arquitectura Física (Tiers y Servicios)', bold: true, size: 26 })],
                    spacing: { before: 300, after: 150 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'La arquitectura física sigue un modelo de 3 capas (3-Tier) desplegado en servicios serverless:', size: 22 })],
                    spacing: { after: 100 }
                }),
                new Paragraph({ children: [new TextRun({ text: 'Tier 1 - Presentación:', bold: true, size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: '   • Vercel Edge Network (CDN global)', size: 22 })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '   • Next.js SSR/SSG pages', size: 22 })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '   • Assets estáticos (CSS, JS, imágenes)', size: 22 })], spacing: { after: 100 } }),

                new Paragraph({ children: [new TextRun({ text: 'Tier 2 - Lógica de Negocio:', bold: true, size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: '   • Vercel Serverless Functions', size: 22 })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '   • Next.js API Routes', size: 22 })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '   • Autenticación JWT', size: 22 })], spacing: { after: 100 } }),

                new Paragraph({ children: [new TextRun({ text: 'Tier 3 - Datos:', bold: true, size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: '   • Neon PostgreSQL (Serverless)', size: 22 })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '   • Prisma ORM', size: 22 })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '   • Connection Pooling automático', size: 22 })], spacing: { after: 200 } }),

                new Paragraph({
                    children: [new TextRun({ text: 'Stack Tecnológico Completo:', bold: true, size: 24 })],
                    spacing: { before: 100, after: 100 }
                }),
                crearTabla([
                    ['Categoría', 'Tecnología', 'Versión'],
                    ['Framework', 'Next.js', '14.x'],
                    ['Lenguaje', 'TypeScript', '5.x'],
                    ['UI Library', 'React', '18.x'],
                    ['Estilos', 'CSS Modules', '-'],
                    ['ORM', 'Prisma', '5.x'],
                    ['Base de Datos', 'PostgreSQL', '15'],
                    ['Autenticación', 'JWT (jose)', '-'],
                    ['Hosting', 'Vercel', '-'],
                    ['DB Hosting', 'Neon', '-'],
                    ['Iconos', 'Lucide React', '-'],
                    ['Notificaciones', 'Sonner', '-'],
                ]),

                // Footer
                new Paragraph({ text: '', spacing: { after: 400 } }),
                new Paragraph({
                    children: [new TextRun({ text: '— Fin del Documento —', italics: true, color: '888888' })],
                    alignment: AlignmentType.CENTER,
                }),
            ],
        }],
    });

    // Guardar
    const buffer = await Packer.toBuffer(doc);
    const outputPath = path.join(__dirname, '..', '..', 'Documento_Arquitectura_Grafica_Santiago.docx');
    fs.writeFileSync(outputPath, buffer);
    console.log('✅ Documento de Arquitectura generado en:', outputPath);
}

function crearTabla(datos) {
    const rows = datos.map((fila, index) => {
        return new TableRow({
            children: fila.map(celda => {
                return new TableCell({
                    children: [new Paragraph({
                        children: [new TextRun({
                            text: celda,
                            bold: index === 0,
                            color: index === 0 ? 'FFFFFF' : '000000',
                            size: 20
                        })]
                    })],
                    shading: index === 0 ? { fill: '4472C4' } : undefined,
                });
            }),
        });
    });
    return new Table({ rows, width: { size: 100, type: WidthType.PERCENTAGE } });
}

generarDocumentoArquitectura().catch(console.error);

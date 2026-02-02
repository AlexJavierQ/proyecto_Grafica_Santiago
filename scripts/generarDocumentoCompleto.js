const { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, HeadingLevel, WidthType, BorderStyle, AlignmentType, PageBreak } = require('docx');
const fs = require('fs');
const path = require('path');

async function generarDocumentoCompleto() {
    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                // ============================================================
                // PORTADA
                // ============================================================
                new Paragraph({ text: '', spacing: { after: 600 } }),
                new Paragraph({
                    children: [new TextRun({ text: 'GRÁFICA SANTIAGO', bold: true, size: 60, color: '4472C4' })],
                    alignment: AlignmentType.CENTER,
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'Plataforma E-commerce de Papelería', size: 32, italics: true })],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 600 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'DOCUMENTO DE ARQUITECTURA', bold: true, size: 44 })],
                    alignment: AlignmentType.CENTER,
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'Y MODELOS DEL SISTEMA', bold: true, size: 44 })],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 300 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'Versión 2.0 - Completo', size: 28 })],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 1000 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'Fecha: 27 de Enero de 2026', size: 24 })],
                    alignment: AlignmentType.CENTER,
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'Autor: Alex Quishpe', size: 24 })],
                    alignment: AlignmentType.CENTER,
                }),

                // ============================================================
                // ÍNDICE
                // ============================================================
                new Paragraph({ children: [new PageBreak()] }),
                new Paragraph({
                    children: [new TextRun({ text: 'ÍNDICE', bold: true, size: 32, color: '4472C4' })],
                    heading: HeadingLevel.HEADING_1,
                    spacing: { after: 300 }
                }),
                new Paragraph({ children: [new TextRun({ text: '1. Introducción', size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: '2. Representación de la Arquitectura', size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: '3. Vista de Escenarios (Casos de Uso)', size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: '4. Vista Lógica (Modelo de Datos)', size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: '5. Vista de Desarrollo', size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: '6. Diccionario de Datos Completo', size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: '7. Anexos (Diagramas UML)', size: 22 })], spacing: { after: 200 } }),

                // ============================================================
                // 1. INTRODUCCIÓN
                // ============================================================
                new Paragraph({ children: [new PageBreak()] }),
                new Paragraph({
                    children: [new TextRun({ text: '1. Introducción', bold: true, size: 32, color: '4472C4' })],
                    heading: HeadingLevel.HEADING_1,
                    spacing: { after: 200 }
                }),

                new Paragraph({
                    children: [new TextRun({ text: '1.1. Propósito', bold: true, size: 26 })],
                    spacing: { before: 200, after: 100 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'Este documento describe la arquitectura completa del sistema Gráfica Santiago, una plataforma de comercio electrónico especializada en productos de papelería, artículos de oficina y útiles escolares. Proporciona una visión integral utilizando el modelo de vistas 4+1 de Kruchten.', size: 22 })],
                    spacing: { after: 150 }
                }),

                new Paragraph({
                    children: [new TextRun({ text: '1.2. Ámbito del Sistema', bold: true, size: 26 })],
                    spacing: { before: 200, after: 100 }
                }),
                new Paragraph({ children: [new TextRun({ text: '• Gestión de catálogo de productos organizados por categorías', size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: '• Registro y autenticación de usuarios (clientes minoristas y mayoristas)', size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: '• Carrito de compras persistente y proceso de checkout', size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: '• Panel administrativo completo para gestión del negocio', size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: '• Sistema de precios diferenciados para mayoristas', size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: '• Gestión de inventario con movimientos y alertas', size: 22 })], spacing: { after: 150 } }),

                new Paragraph({
                    children: [new TextRun({ text: '1.3. Definiciones y Acrónimos', bold: true, size: 26 })],
                    spacing: { before: 200, after: 100 }
                }),
                crearTabla([
                    ['Término', 'Definición'],
                    ['Next.js', 'Framework de React para aplicaciones web con SSR/SSG'],
                    ['Prisma', 'ORM (Object-Relational Mapping) para Node.js y TypeScript'],
                    ['PostgreSQL', 'Sistema de gestión de base de datos relacional'],
                    ['JWT', 'JSON Web Token - estándar para autenticación'],
                    ['SSR', 'Server-Side Rendering'],
                    ['API REST', 'Interfaz de programación basada en HTTP'],
                    ['Vercel', 'Plataforma de despliegue serverless'],
                    ['Neon', 'Base de datos PostgreSQL serverless en la nube'],
                ]),

                // ============================================================
                // 2. REPRESENTACIÓN DE LA ARQUITECTURA
                // ============================================================
                new Paragraph({ children: [new PageBreak()] }),
                new Paragraph({
                    children: [new TextRun({ text: '2. Representación de la Arquitectura', bold: true, size: 32, color: '4472C4' })],
                    heading: HeadingLevel.HEADING_1,
                    spacing: { after: 200 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'La arquitectura se describe utilizando el modelo 4+1 de Philippe Kruchten:', size: 22 })],
                    spacing: { after: 150 }
                }),

                new Paragraph({
                    children: [new TextRun({ text: '2.1. Stack Tecnológico', bold: true, size: 26 })],
                    spacing: { before: 200, after: 100 }
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
                    ['Hosting App', 'Vercel', '-'],
                    ['Hosting DB', 'Neon', '-'],
                    ['Iconos', 'Lucide React', '-'],
                    ['Notificaciones', 'Sonner', '-'],
                ]),

                new Paragraph({
                    children: [new TextRun({ text: '2.2. Patrones Arquitectónicos', bold: true, size: 26 })],
                    spacing: { before: 300, after: 100 }
                }),
                crearTabla([
                    ['Patrón', 'Aplicación en el Sistema'],
                    ['Arquitectura en 3 Capas', 'Presentación (React) → API (Next.js Routes) → Datos (Prisma/PostgreSQL)'],
                    ['MVC', 'Modelos Prisma, Vistas React, Controladores API Routes'],
                    ['Repository Pattern', 'Prisma Client abstrae acceso a base de datos'],
                    ['Component-Based', 'Componentes React reutilizables'],
                    ['Server-Side Rendering', 'Páginas SSR/SSG para SEO y rendimiento'],
                    ['JWT Authentication', 'Tokens stateless para autenticación'],
                    ['Middleware Pattern', 'Protección de rutas administrativas'],
                ]),

                // ============================================================
                // 3. VISTA DE ESCENARIOS (CASOS DE USO)
                // ============================================================
                new Paragraph({ children: [new PageBreak()] }),
                new Paragraph({
                    children: [new TextRun({ text: '3. Vista de Escenarios (Casos de Uso)', bold: true, size: 32, color: '4472C4' })],
                    heading: HeadingLevel.HEADING_1,
                    spacing: { after: 200 }
                }),

                new Paragraph({
                    children: [new TextRun({ text: '3.1. Actores del Sistema', bold: true, size: 26 })],
                    spacing: { before: 200, after: 100 }
                }),
                crearTabla([
                    ['Actor', 'Descripción', 'Permisos'],
                    ['Visitante', 'Usuario no autenticado', 'Ver catálogo, buscar, registrarse'],
                    ['Cliente', 'Usuario registrado con rol CUSTOMER', 'Comprar, ver pedidos, solicitar mayorista'],
                    ['Mayorista', 'Usuario con rol WHOLESALE aprobado', 'Comprar con precios especiales'],
                    ['Administrador', 'Usuario con rol ADMIN', 'Gestión completa del sistema'],
                ]),

                new Paragraph({
                    children: [new TextRun({ text: '3.2. Casos de Uso por Módulo', bold: true, size: 26 })],
                    spacing: { before: 300, after: 100 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'MÓDULO PÚBLICO:', bold: true, size: 22 })],
                    spacing: { after: 50 }
                }),
                crearTabla([
                    ['ID', 'Caso de Uso', 'Actor', 'Descripción'],
                    ['CU01', 'Ver Catálogo', 'Visitante', 'Navegar productos por categorías'],
                    ['CU02', 'Buscar Productos', 'Visitante', 'Buscar por nombre o SKU'],
                    ['CU03', 'Ver Detalle Producto', 'Visitante', 'Ver información completa del producto'],
                    ['CU04', 'Registrarse', 'Visitante', 'Crear cuenta de usuario'],
                    ['CU05', 'Iniciar Sesión', 'Visitante', 'Autenticarse con email/password'],
                ]),

                new Paragraph({
                    children: [new TextRun({ text: 'MÓDULO CLIENTE:', bold: true, size: 22 })],
                    spacing: { before: 200, after: 50 }
                }),
                crearTabla([
                    ['ID', 'Caso de Uso', 'Actor', 'Descripción'],
                    ['CU06', 'Agregar al Carrito', 'Cliente', 'Añadir productos al carrito de compras'],
                    ['CU07', 'Modificar Carrito', 'Cliente', 'Cambiar cantidades o eliminar productos'],
                    ['CU08', 'Realizar Checkout', 'Cliente', 'Completar proceso de compra'],
                    ['CU09', 'Ver Mis Pedidos', 'Cliente', 'Consultar historial de compras'],
                    ['CU10', 'Solicitar Mayorista', 'Cliente', 'Enviar solicitud de cuenta mayorista'],
                    ['CU11', 'Cerrar Sesión', 'Cliente', 'Terminar sesión activa'],
                ]),

                new Paragraph({
                    children: [new TextRun({ text: 'MÓDULO ADMINISTRACIÓN:', bold: true, size: 22 })],
                    spacing: { before: 200, after: 50 }
                }),
                crearTabla([
                    ['ID', 'Caso de Uso', 'Actor', 'Descripción'],
                    ['CU12', 'Gestionar Productos', 'Admin', 'CRUD completo de productos'],
                    ['CU13', 'Gestionar Categorías', 'Admin', 'CRUD de categorías'],
                    ['CU14', 'Gestionar Usuarios', 'Admin', 'Ver, editar, activar/desactivar usuarios'],
                    ['CU15', 'Aprobar Mayoristas', 'Admin', 'Revisar y aprobar/rechazar solicitudes'],
                    ['CU16', 'Ver Dashboard', 'Admin', 'Consultar estadísticas del negocio'],
                    ['CU17', 'Gestionar Pedidos', 'Admin', 'Ver y actualizar estado de pedidos'],
                    ['CU18', 'Gestionar Inventario', 'Admin', 'Registrar entradas/salidas de stock'],
                ]),

                new Paragraph({
                    children: [new TextRun({ text: '[Ver Anexo 7.1 - Diagrama de Casos de Uso]', italics: true, color: '888888' })],
                    spacing: { before: 200, after: 100 }
                }),

                // ============================================================
                // 4. VISTA LÓGICA (MODELO DE DATOS)
                // ============================================================
                new Paragraph({ children: [new PageBreak()] }),
                new Paragraph({
                    children: [new TextRun({ text: '4. Vista Lógica (Modelo de Datos)', bold: true, size: 32, color: '4472C4' })],
                    heading: HeadingLevel.HEADING_1,
                    spacing: { after: 200 }
                }),

                new Paragraph({
                    children: [new TextRun({ text: '4.1. Entidades del Sistema', bold: true, size: 26 })],
                    spacing: { before: 200, after: 100 }
                }),
                crearTabla([
                    ['Entidad', 'Tabla BD', 'Descripción', 'Campos Principales'],
                    ['User', 'users', 'Usuarios del sistema', 'id, email, name, role, status'],
                    ['WholesaleRequest', 'wholesale_requests', 'Solicitudes mayoristas', 'id, userId, companyName, status'],
                    ['Address', 'addresses', 'Direcciones de envío', 'id, userId, address, city'],
                    ['Category', 'categories', 'Categorías de productos', 'id, name, image, isActive'],
                    ['Product', 'products', 'Productos del catálogo', 'id, sku, name, price, stock'],
                    ['Order', 'orders', 'Pedidos de clientes', 'id, orderNumber, userId, total, status'],
                    ['OrderItem', 'order_items', 'Items de pedidos', 'id, orderId, productId, quantity'],
                    ['InventoryMovement', 'inventory_movements', 'Movimientos de stock', 'id, productId, type, quantity'],
                ]),

                new Paragraph({
                    children: [new TextRun({ text: '4.2. Relaciones entre Entidades', bold: true, size: 26 })],
                    spacing: { before: 300, after: 100 }
                }),
                crearTabla([
                    ['Relación', 'Cardinalidad', 'Descripción'],
                    ['User → Order', '1:N', 'Un usuario puede tener muchos pedidos'],
                    ['User → Address', '1:N', 'Un usuario puede tener muchas direcciones'],
                    ['User → WholesaleRequest', '1:N', 'Un usuario puede tener varias solicitudes'],
                    ['User → InventoryMovement', '1:N', 'Un usuario registra movimientos'],
                    ['Category → Product', '1:N', 'Una categoría contiene muchos productos'],
                    ['Order → OrderItem', '1:N', 'Un pedido tiene muchos items'],
                    ['Order → Address', 'N:1', 'Un pedido tiene una dirección de envío'],
                    ['Product → OrderItem', '1:N', 'Un producto aparece en muchos items'],
                    ['Product → InventoryMovement', '1:N', 'Un producto tiene movimientos'],
                ]),

                new Paragraph({
                    children: [new TextRun({ text: '[Ver Anexo 7.2 - Diagrama Entidad-Relación]', italics: true, color: '888888' })],
                    spacing: { before: 200, after: 50 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: '[Ver Anexo 7.3 - Diagrama de Clases]', italics: true, color: '888888' })],
                    spacing: { after: 100 }
                }),

                // ============================================================
                // 5. VISTA DE DESARROLLO
                // ============================================================
                new Paragraph({ children: [new PageBreak()] }),
                new Paragraph({
                    children: [new TextRun({ text: '5. Vista de Desarrollo', bold: true, size: 32, color: '4472C4' })],
                    heading: HeadingLevel.HEADING_1,
                    spacing: { after: 200 }
                }),

                new Paragraph({
                    children: [new TextRun({ text: '5.1. Estructura del Proyecto', bold: true, size: 26 })],
                    spacing: { before: 200, after: 100 }
                }),
                new Paragraph({ children: [new TextRun({ text: 'plataforma/', size: 20, font: 'Consolas' })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '├── src/', size: 20, font: 'Consolas' })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '│   ├── app/                    # Páginas y rutas (App Router)', size: 20, font: 'Consolas' })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '│   │   ├── (auth)/             # Rutas de autenticación', size: 20, font: 'Consolas' })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '│   │   ├── admin/              # Panel administrativo', size: 20, font: 'Consolas' })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '│   │   ├── api/                # API Routes', size: 20, font: 'Consolas' })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '│   │   ├── productos/          # Catálogo', size: 20, font: 'Consolas' })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '│   │   ├── carrito/            # Carrito de compras', size: 20, font: 'Consolas' })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '│   │   └── checkout/           # Proceso de compra', size: 20, font: 'Consolas' })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '│   ├── components/             # Componentes reutilizables', size: 20, font: 'Consolas' })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '│   └── lib/                    # Utilidades', size: 20, font: 'Consolas' })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '├── prisma/', size: 20, font: 'Consolas' })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '│   ├── schema.prisma           # Esquema de BD', size: 20, font: 'Consolas' })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '│   └── seed.ts                 # Datos iniciales', size: 20, font: 'Consolas' })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '└── public/                     # Archivos estáticos', size: 20, font: 'Consolas' })], spacing: { after: 150 } }),

                new Paragraph({
                    children: [new TextRun({ text: '5.2. Infraestructura de Despliegue', bold: true, size: 26 })],
                    spacing: { before: 200, after: 100 }
                }),
                crearTabla([
                    ['Componente', 'Servicio', 'Ubicación'],
                    ['Aplicación Web', 'Vercel Edge Network', 'Global CDN'],
                    ['API Serverless', 'Vercel Functions', 'us-east-1'],
                    ['Base de Datos', 'Neon PostgreSQL', 'us-east-1'],
                    ['Repositorio', 'GitHub', 'Cloud'],
                    ['CI/CD', 'Vercel (automático)', 'Push to main'],
                ]),

                new Paragraph({
                    children: [new TextRun({ text: 'URL de Producción: ', bold: true, size: 22 }), new TextRun({ text: 'https://proyecto-grafica-santiago.vercel.app', size: 22, color: '0563C1' })],
                    spacing: { before: 150, after: 100 }
                }),

                new Paragraph({
                    children: [new TextRun({ text: '[Ver Anexo 7.4 - Diagrama de Arquitectura]', italics: true, color: '888888' })],
                    spacing: { before: 100, after: 50 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: '[Ver Anexo 7.5 - Diagrama de Despliegue]', italics: true, color: '888888' })],
                    spacing: { after: 100 }
                }),

                // ============================================================
                // 6. DICCIONARIO DE DATOS COMPLETO
                // ============================================================
                new Paragraph({ children: [new PageBreak()] }),
                new Paragraph({
                    children: [new TextRun({ text: '6. Diccionario de Datos Completo', bold: true, size: 32, color: '4472C4' })],
                    heading: HeadingLevel.HEADING_1,
                    spacing: { after: 200 }
                }),

                // --- TABLA USER ---
                new Paragraph({
                    children: [new TextRun({ text: '6.1. USER (users)', bold: true, size: 26 })],
                    spacing: { before: 200, after: 100 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'Usuarios del sistema (clientes, mayoristas, administradores).', size: 20, italics: true })],
                    spacing: { after: 100 }
                }),
                crearTabla([
                    ['Campo', 'Tipo', 'Restricciones', 'Descripción'],
                    ['id', 'String', 'PK, CUID', 'Identificador único'],
                    ['email', 'String', 'UNIQUE, NOT NULL', 'Correo electrónico'],
                    ['password', 'String', 'NOT NULL', 'Contraseña (bcrypt)'],
                    ['name', 'String', 'NOT NULL', 'Nombre completo'],
                    ['phone', 'String', 'NULLABLE', 'Teléfono'],
                    ['role', 'String', 'DEFAULT "CUSTOMER"', 'CUSTOMER|WHOLESALE|ADMIN'],
                    ['status', 'String', 'DEFAULT "ACTIVE"', 'ACTIVE|INACTIVE|PENDING'],
                    ['wholesaleRequested', 'Boolean', 'DEFAULT false', 'Solicitó mayorista'],
                    ['companyName', 'String', 'NULLABLE', 'Empresa (mayoristas)'],
                    ['ruc', 'String', 'NULLABLE', 'RUC/NIT'],
                    ['wholesaleAddress', 'String', 'NULLABLE', 'Dirección comercial'],
                    ['wholesaleMessage', 'String', 'NULLABLE', 'Mensaje solicitud'],
                    ['lastLogin', 'DateTime', 'NULLABLE', 'Último acceso'],
                    ['createdAt', 'DateTime', 'DEFAULT now()', 'Fecha creación'],
                    ['updatedAt', 'DateTime', 'AUTO', 'Fecha modificación'],
                ]),

                // --- TABLA WHOLESALE_REQUEST ---
                new Paragraph({ children: [new PageBreak()] }),
                new Paragraph({
                    children: [new TextRun({ text: '6.2. WHOLESALE_REQUEST (wholesale_requests)', bold: true, size: 26 })],
                    spacing: { before: 200, after: 100 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'Solicitudes de cuentas mayoristas.', size: 20, italics: true })],
                    spacing: { after: 100 }
                }),
                crearTabla([
                    ['Campo', 'Tipo', 'Restricciones', 'Descripción'],
                    ['id', 'String', 'PK, CUID', 'Identificador único'],
                    ['userId', 'String', 'FK → USER', 'Usuario solicitante'],
                    ['companyName', 'String', 'NOT NULL', 'Nombre empresa'],
                    ['taxId', 'String', 'NOT NULL', 'RUC/NIT'],
                    ['phone', 'String', 'NOT NULL', 'Teléfono contacto'],
                    ['address', 'String', 'NOT NULL', 'Dirección comercial'],
                    ['message', 'String', 'NULLABLE', 'Mensaje adicional'],
                    ['status', 'String', 'DEFAULT "PENDING"', 'PENDING|APPROVED|REJECTED'],
                    ['createdAt', 'DateTime', 'DEFAULT now()', 'Fecha solicitud'],
                    ['updatedAt', 'DateTime', 'AUTO', 'Fecha modificación'],
                ]),

                // --- TABLA ADDRESS ---
                new Paragraph({
                    children: [new TextRun({ text: '6.3. ADDRESS (addresses)', bold: true, size: 26 })],
                    spacing: { before: 300, after: 100 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'Direcciones de envío de usuarios.', size: 20, italics: true })],
                    spacing: { after: 100 }
                }),
                crearTabla([
                    ['Campo', 'Tipo', 'Restricciones', 'Descripción'],
                    ['id', 'String', 'PK, CUID', 'Identificador único'],
                    ['userId', 'String', 'FK → USER', 'Usuario propietario'],
                    ['name', 'String', 'NOT NULL', 'Nombre destinatario'],
                    ['phone', 'String', 'NOT NULL', 'Teléfono contacto'],
                    ['address', 'String', 'NOT NULL', 'Dirección completa'],
                    ['city', 'String', 'NOT NULL', 'Ciudad'],
                    ['province', 'String', 'NOT NULL', 'Provincia/Estado'],
                    ['postalCode', 'String', 'NULLABLE', 'Código postal'],
                    ['isDefault', 'Boolean', 'DEFAULT false', 'Dirección principal'],
                    ['createdAt', 'DateTime', 'DEFAULT now()', 'Fecha creación'],
                    ['updatedAt', 'DateTime', 'AUTO', 'Fecha modificación'],
                ]),

                // --- TABLA CATEGORY ---
                new Paragraph({ children: [new PageBreak()] }),
                new Paragraph({
                    children: [new TextRun({ text: '6.4. CATEGORY (categories)', bold: true, size: 26 })],
                    spacing: { before: 200, after: 100 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'Categorías para organizar productos.', size: 20, italics: true })],
                    spacing: { after: 100 }
                }),
                crearTabla([
                    ['Campo', 'Tipo', 'Restricciones', 'Descripción'],
                    ['id', 'String', 'PK, CUID', 'Identificador único'],
                    ['name', 'String', 'UNIQUE, NOT NULL', 'Nombre categoría'],
                    ['description', 'String', 'NULLABLE', 'Descripción'],
                    ['image', 'String', 'NULLABLE', 'URL imagen'],
                    ['order', 'Int', 'DEFAULT 0', 'Orden visualización'],
                    ['isActive', 'Boolean', 'DEFAULT true', 'Activa/Inactiva'],
                    ['createdAt', 'DateTime', 'DEFAULT now()', 'Fecha creación'],
                    ['updatedAt', 'DateTime', 'AUTO', 'Fecha modificación'],
                ]),

                // --- TABLA PRODUCT ---
                new Paragraph({
                    children: [new TextRun({ text: '6.5. PRODUCT (products)', bold: true, size: 26 })],
                    spacing: { before: 300, after: 100 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'Productos del catálogo de la tienda.', size: 20, italics: true })],
                    spacing: { after: 100 }
                }),
                crearTabla([
                    ['Campo', 'Tipo', 'Restricciones', 'Descripción'],
                    ['id', 'String', 'PK, CUID', 'Identificador único'],
                    ['sku', 'String', 'UNIQUE, NOT NULL', 'Código SKU'],
                    ['barcode', 'String', 'UNIQUE, NULLABLE', 'Código de barras'],
                    ['name', 'String', 'NOT NULL', 'Nombre producto'],
                    ['description', 'String', 'NULLABLE', 'Descripción'],
                    ['price', 'Float', 'NOT NULL', 'Precio regular'],
                    ['wholesalePrice', 'Float', 'NULLABLE', 'Precio mayorista'],
                    ['stock', 'Int', 'DEFAULT 0', 'Cantidad inventario'],
                    ['minStock', 'Int', 'DEFAULT 5', 'Stock mínimo (alerta)'],
                    ['categoryId', 'String', 'FK → CATEGORY', 'Categoría'],
                    ['images', 'String', 'DEFAULT "[]"', 'URLs imágenes (JSON)'],
                    ['specifications', 'String', 'NULLABLE', 'Especificaciones'],
                    ['isActive', 'Boolean', 'DEFAULT true', 'Activo/Inactivo'],
                    ['createdAt', 'DateTime', 'DEFAULT now()', 'Fecha creación'],
                    ['updatedAt', 'DateTime', 'AUTO', 'Fecha modificación'],
                ]),

                // --- TABLA ORDER ---
                new Paragraph({ children: [new PageBreak()] }),
                new Paragraph({
                    children: [new TextRun({ text: '6.6. ORDER (orders)', bold: true, size: 26 })],
                    spacing: { before: 200, after: 100 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'Pedidos realizados por clientes.', size: 20, italics: true })],
                    spacing: { after: 100 }
                }),
                crearTabla([
                    ['Campo', 'Tipo', 'Restricciones', 'Descripción'],
                    ['id', 'String', 'PK, CUID', 'Identificador único'],
                    ['orderNumber', 'String', 'UNIQUE, NOT NULL', 'Número pedido'],
                    ['userId', 'String', 'FK → USER', 'Cliente'],
                    ['addressId', 'String', 'FK → ADDRESS', 'Dirección envío'],
                    ['subtotal', 'Float', 'NOT NULL', 'Subtotal'],
                    ['discount', 'Float', 'DEFAULT 0', 'Descuento'],
                    ['shipping', 'Float', 'DEFAULT 0', 'Costo envío'],
                    ['total', 'Float', 'NOT NULL', 'Total final'],
                    ['status', 'String', 'DEFAULT "PENDING"', 'PENDING|CONFIRMED|SHIPPED|DELIVERED'],
                    ['paymentStatus', 'String', 'DEFAULT "PENDING"', 'PENDING|PAID|FAILED'],
                    ['paymentMethod', 'String', 'NULLABLE', 'Método pago'],
                    ['notes', 'String', 'NULLABLE', 'Notas'],
                    ['createdAt', 'DateTime', 'DEFAULT now()', 'Fecha pedido'],
                    ['updatedAt', 'DateTime', 'AUTO', 'Fecha modificación'],
                ]),

                // --- TABLA ORDER_ITEM ---
                new Paragraph({
                    children: [new TextRun({ text: '6.7. ORDER_ITEM (order_items)', bold: true, size: 26 })],
                    spacing: { before: 300, after: 100 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'Items individuales de cada pedido.', size: 20, italics: true })],
                    spacing: { after: 100 }
                }),
                crearTabla([
                    ['Campo', 'Tipo', 'Restricciones', 'Descripción'],
                    ['id', 'String', 'PK, CUID', 'Identificador único'],
                    ['orderId', 'String', 'FK → ORDER', 'Pedido'],
                    ['productId', 'String', 'FK → PRODUCT', 'Producto'],
                    ['quantity', 'Int', 'NOT NULL', 'Cantidad'],
                    ['unitPrice', 'Float', 'NOT NULL', 'Precio unitario'],
                    ['subtotal', 'Float', 'NOT NULL', 'Subtotal (qty × price)'],
                    ['createdAt', 'DateTime', 'DEFAULT now()', 'Fecha creación'],
                ]),

                // --- TABLA INVENTORY_MOVEMENT ---
                new Paragraph({ children: [new PageBreak()] }),
                new Paragraph({
                    children: [new TextRun({ text: '6.8. INVENTORY_MOVEMENT (inventory_movements)', bold: true, size: 26 })],
                    spacing: { before: 200, after: 100 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'Registro de movimientos de inventario.', size: 20, italics: true })],
                    spacing: { after: 100 }
                }),
                crearTabla([
                    ['Campo', 'Tipo', 'Restricciones', 'Descripción'],
                    ['id', 'String', 'PK, CUID', 'Identificador único'],
                    ['productId', 'String', 'FK → PRODUCT', 'Producto afectado'],
                    ['userId', 'String', 'FK → USER', 'Usuario que registró'],
                    ['type', 'String', 'NOT NULL', 'IN|OUT|ADJUSTMENT'],
                    ['quantity', 'Int', 'NOT NULL', 'Cantidad movida'],
                    ['previousStock', 'Int', 'NOT NULL', 'Stock anterior'],
                    ['newStock', 'Int', 'NOT NULL', 'Stock nuevo'],
                    ['reason', 'String', 'NULLABLE', 'Motivo/razón'],
                    ['createdAt', 'DateTime', 'DEFAULT now()', 'Fecha movimiento'],
                ]),

                // ============================================================
                // 7. ANEXOS (DIAGRAMAS UML)
                // ============================================================
                new Paragraph({ children: [new PageBreak()] }),
                new Paragraph({
                    children: [new TextRun({ text: '7. Anexos (Diagramas UML)', bold: true, size: 32, color: '4472C4' })],
                    heading: HeadingLevel.HEADING_1,
                    spacing: { after: 300 }
                }),

                new Paragraph({
                    children: [new TextRun({ text: '7.1. Diagrama de Casos de Uso', bold: true, size: 26 })],
                    spacing: { before: 200, after: 100 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: '[Insertar diagrama de Casos de Uso aquí]', italics: true, color: '888888', size: 22 })],
                    spacing: { after: 50 }
                }),
                new Paragraph({ children: [new TextRun({ text: 'Muestra los 17 casos de uso organizados en 3 módulos (Público, Cliente, Admin) y 4 actores (Visitante, Cliente, Mayorista, Admin).', size: 20 })], spacing: { after: 300 } }),

                new Paragraph({
                    children: [new TextRun({ text: '7.2. Diagrama Entidad-Relación (ER)', bold: true, size: 26 })],
                    spacing: { before: 200, after: 100 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: '[Insertar diagrama ER aquí]', italics: true, color: '888888', size: 22 })],
                    spacing: { after: 50 }
                }),
                new Paragraph({ children: [new TextRun({ text: 'Muestra las 8 tablas de la base de datos con sus atributos y relaciones.', size: 20 })], spacing: { after: 300 } }),

                new Paragraph({
                    children: [new TextRun({ text: '7.3. Diagrama de Clases', bold: true, size: 26 })],
                    spacing: { before: 200, after: 100 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: '[Insertar diagrama de Clases aquí]', italics: true, color: '888888', size: 22 })],
                    spacing: { after: 50 }
                }),
                new Paragraph({ children: [new TextRun({ text: 'Muestra las clases del dominio (User, Product, Order, etc.) con sus atributos, métodos y relaciones.', size: 20 })], spacing: { after: 300 } }),

                new Paragraph({ children: [new PageBreak()] }),
                new Paragraph({
                    children: [new TextRun({ text: '7.4. Diagrama de Arquitectura (Componentes)', bold: true, size: 26 })],
                    spacing: { before: 200, after: 100 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: '[Insertar diagrama de Arquitectura aquí]', italics: true, color: '888888', size: 22 })],
                    spacing: { after: 50 }
                }),
                new Paragraph({ children: [new TextRun({ text: 'Muestra la arquitectura en 3 capas: Cliente (Browser), Servidor (Vercel/Next.js), Base de Datos (Neon/PostgreSQL).', size: 20 })], spacing: { after: 300 } }),

                new Paragraph({
                    children: [new TextRun({ text: '7.5. Diagrama de Despliegue', bold: true, size: 26 })],
                    spacing: { before: 200, after: 100 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: '[Insertar diagrama de Despliegue aquí]', italics: true, color: '888888', size: 22 })],
                    spacing: { after: 50 }
                }),
                new Paragraph({ children: [new TextRun({ text: 'Muestra la infraestructura cloud: Navegador → Vercel Edge → Vercel Functions → Neon PostgreSQL.', size: 20 })], spacing: { after: 300 } }),

                new Paragraph({
                    children: [new TextRun({ text: '7.6. Diagrama de Secuencia - Agregar al Carrito', bold: true, size: 26 })],
                    spacing: { before: 200, after: 100 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: '[Insertar diagrama de secuencia aquí]', italics: true, color: '888888', size: 22 })],
                    spacing: { after: 50 }
                }),
                new Paragraph({ children: [new TextRun({ text: 'Flujo: Usuario → UI → API → BD → Validar Stock → CartContext → LocalStorage → Toast.', size: 20 })], spacing: { after: 300 } }),

                new Paragraph({
                    children: [new TextRun({ text: '7.7. Diagrama de Secuencia - Checkout', bold: true, size: 26 })],
                    spacing: { before: 200, after: 100 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: '[Insertar diagrama de secuencia aquí]', italics: true, color: '888888', size: 22 })],
                    spacing: { after: 50 }
                }),
                new Paragraph({ children: [new TextRun({ text: 'Flujo: Usuario → Checkout → API → Auth → BEGIN TRANSACTION → Actualizar Stock → INSERT Order → COMMIT → Redirección.', size: 20 })], spacing: { after: 300 } }),

                // Footer
                new Paragraph({ children: [new PageBreak()] }),
                new Paragraph({
                    children: [new TextRun({ text: '— Fin del Documento —', italics: true, size: 24, color: '888888' })],
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 400 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'Gráfica Santiago © 2026', size: 20, color: '888888' })],
                    alignment: AlignmentType.CENTER,
                }),
            ],
        }],
    });

    // Guardar
    const buffer = await Packer.toBuffer(doc);
    const outputPath = path.join(__dirname, '..', '..', 'Documento_Arquitectura_Completo.docx');
    fs.writeFileSync(outputPath, buffer);
    console.log('✅ Documento completo generado en:', outputPath);
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
                            size: 18
                        })]
                    })],
                    shading: index === 0 ? { fill: '4472C4' } : undefined,
                });
            }),
        });
    });
    return new Table({ rows, width: { size: 100, type: WidthType.PERCENTAGE } });
}

generarDocumentoCompleto().catch(console.error);

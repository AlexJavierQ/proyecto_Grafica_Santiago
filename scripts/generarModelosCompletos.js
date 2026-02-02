const { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, HeadingLevel, WidthType, AlignmentType, PageBreak } = require('docx');
const fs = require('fs');
const path = require('path');

async function generarDocumentoModelos() {
    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                // PORTADA
                new Paragraph({ text: '', spacing: { after: 600 } }),
                new Paragraph({ children: [new TextRun({ text: 'GRÁFICA SANTIAGO', bold: true, size: 56, color: '4472C4' })], alignment: AlignmentType.CENTER }),
                new Paragraph({ children: [new TextRun({ text: 'Plataforma E-commerce de Papelería', size: 28, italics: true })], alignment: AlignmentType.CENTER, spacing: { after: 600 } }),
                new Paragraph({ children: [new TextRun({ text: 'DOCUMENTACIÓN DE MODELOS', bold: true, size: 36 })], alignment: AlignmentType.CENTER, spacing: { after: 300 } }),
                new Paragraph({ children: [new TextRun({ text: 'Requisitos • Casos de Uso • Base de Datos • Clases • Arquitectura', size: 24 })], alignment: AlignmentType.CENTER, spacing: { after: 800 } }),
                new Paragraph({ children: [new TextRun({ text: 'Versión 2.0 - Completo', size: 22 })], alignment: AlignmentType.CENTER, spacing: { after: 100 } }),
                new Paragraph({ children: [new TextRun({ text: 'Autor: Alex Quishpe | Fecha: 27 Enero 2026', size: 22 })], alignment: AlignmentType.CENTER }),

                // ÍNDICE
                new Paragraph({ children: [new PageBreak()] }),
                crearTitulo('ÍNDICE'),
                new Paragraph({ children: [new TextRun({ text: '1. Modelo de Requisitos', size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: '2. Modelo de Casos de Uso', size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: '3. Modelo de Base de Datos', size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: '4. Diccionario de Datos Completo', size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: '5. Modelo de Clases', size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: '6. Arquitectura del Sistema', size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: '7. Anexos (Diagramas UML)', size: 22 })], spacing: { after: 200 } }),

                // ========== 1. MODELO DE REQUISITOS ==========
                new Paragraph({ children: [new PageBreak()] }),
                crearTitulo('1. MODELO DE REQUISITOS'),

                crearSubtitulo('1.1 Requisitos Funcionales'),
                crearTabla([
                    ['ID', 'Requisito', 'Prioridad', 'Descripción'],
                    ['RF-01', 'Registro de usuarios', 'Alta', 'El sistema debe permitir el registro de nuevos usuarios con email, contraseña y datos personales'],
                    ['RF-02', 'Autenticación', 'Alta', 'El sistema debe autenticar usuarios mediante email y contraseña usando JWT'],
                    ['RF-03', 'Catálogo de productos', 'Alta', 'El sistema debe mostrar productos organizados por categorías con filtros'],
                    ['RF-04', 'Carrito de compras', 'Alta', 'El sistema debe permitir agregar, modificar y eliminar productos del carrito'],
                    ['RF-05', 'Proceso de checkout', 'Alta', 'El sistema debe procesar pedidos con dirección de envío'],
                    ['RF-06', 'Gestión de productos', 'Alta', 'Administradores pueden crear, editar y eliminar productos'],
                    ['RF-07', 'Gestión de categorías', 'Media', 'Administradores pueden gestionar categorías de productos'],
                    ['RF-08', 'Gestión de usuarios', 'Media', 'Administradores pueden ver y modificar usuarios del sistema'],
                    ['RF-09', 'Solicitud mayorista', 'Media', 'Usuarios pueden solicitar cuenta mayorista con datos de empresa'],
                    ['RF-10', 'Aprobación mayoristas', 'Media', 'Administradores pueden aprobar/rechazar solicitudes mayoristas'],
                    ['RF-11', 'Precios diferenciados', 'Alta', 'Sistema muestra precios mayoristas a usuarios aprobados'],
                    ['RF-12', 'Dashboard administrativo', 'Media', 'Panel con estadísticas de ventas, usuarios y productos'],
                    ['RF-13', 'Gestión de inventario', 'Media', 'Registro de movimientos de entrada, salida y ajustes de stock'],
                    ['RF-14', 'Historial de pedidos', 'Media', 'Clientes pueden consultar sus pedidos anteriores'],
                ]),

                crearSubtitulo('1.2 Requisitos No Funcionales'),
                crearTabla([
                    ['ID', 'Requisito', 'Categoría', 'Descripción'],
                    ['RNF-01', 'Rendimiento', 'Performance', 'Tiempo de carga < 3 segundos para páginas principales'],
                    ['RNF-02', 'Escalabilidad', 'Performance', 'Soportar hasta 1000 usuarios concurrentes'],
                    ['RNF-03', 'Disponibilidad', 'Confiabilidad', 'Uptime del 99.5% mensual'],
                    ['RNF-04', 'Seguridad', 'Seguridad', 'Contraseñas encriptadas con bcrypt, autenticación JWT'],
                    ['RNF-05', 'Usabilidad', 'Usabilidad', 'Interfaz responsiva compatible con móviles y desktop'],
                    ['RNF-06', 'Mantenibilidad', 'Calidad', 'Código modular con componentes reutilizables'],
                    ['RNF-07', 'Compatibilidad', 'Portabilidad', 'Compatible con Chrome, Firefox, Safari, Edge'],
                ]),

                // ========== 2. MODELO DE CASOS DE USO ==========
                new Paragraph({ children: [new PageBreak()] }),
                crearTitulo('2. MODELO DE CASOS DE USO'),

                crearSubtitulo('2.1 Actores del Sistema'),
                crearTabla([
                    ['Actor', 'Descripción', 'Permisos'],
                    ['Visitante', 'Usuario no autenticado', 'Ver catálogo, buscar, registrarse'],
                    ['Cliente', 'Usuario registrado con rol CUSTOMER', 'Comprar, ver pedidos, solicitar mayorista'],
                    ['Mayorista', 'Usuario con rol WHOLESALE aprobado', 'Comprar con precios especiales'],
                    ['Administrador', 'Usuario con rol ADMIN', 'Gestión completa del sistema'],
                ]),

                crearSubtitulo('2.2 Casos de Uso - Módulo Público'),
                crearTabla([
                    ['ID', 'Caso de Uso', 'Actor', 'Descripción'],
                    ['CU-01', 'Ver Catálogo', 'Visitante', 'Navegar productos por categorías'],
                    ['CU-02', 'Buscar Productos', 'Visitante', 'Buscar por nombre o SKU'],
                    ['CU-03', 'Ver Detalle Producto', 'Visitante', 'Ver información completa del producto'],
                    ['CU-04', 'Registrarse', 'Visitante', 'Crear cuenta de usuario'],
                    ['CU-05', 'Iniciar Sesión', 'Visitante', 'Autenticarse con email/password'],
                ]),

                crearSubtitulo('2.3 Casos de Uso - Módulo Cliente'),
                crearTabla([
                    ['ID', 'Caso de Uso', 'Actor', 'Descripción'],
                    ['CU-06', 'Agregar al Carrito', 'Cliente', 'Añadir productos al carrito de compras'],
                    ['CU-07', 'Modificar Carrito', 'Cliente', 'Cambiar cantidades o eliminar productos'],
                    ['CU-08', 'Realizar Checkout', 'Cliente', 'Completar proceso de compra'],
                    ['CU-09', 'Ver Mis Pedidos', 'Cliente', 'Consultar historial de compras'],
                    ['CU-10', 'Solicitar Mayorista', 'Cliente', 'Enviar solicitud de cuenta mayorista'],
                    ['CU-11', 'Cerrar Sesión', 'Cliente', 'Terminar sesión activa'],
                ]),

                crearSubtitulo('2.4 Casos de Uso - Módulo Administración'),
                crearTabla([
                    ['ID', 'Caso de Uso', 'Actor', 'Descripción'],
                    ['CU-12', 'Gestionar Productos', 'Admin', 'CRUD completo de productos'],
                    ['CU-13', 'Gestionar Categorías', 'Admin', 'CRUD de categorías'],
                    ['CU-14', 'Gestionar Usuarios', 'Admin', 'Ver, editar, activar/desactivar usuarios'],
                    ['CU-15', 'Aprobar Mayoristas', 'Admin', 'Revisar y aprobar/rechazar solicitudes'],
                    ['CU-16', 'Ver Dashboard', 'Admin', 'Consultar estadísticas del negocio'],
                    ['CU-17', 'Gestionar Pedidos', 'Admin', 'Ver y actualizar estado de pedidos'],
                    ['CU-18', 'Gestionar Inventario', 'Admin', 'Registrar entradas/salidas de stock'],
                ]),

                crearSubtitulo('2.5 Especificación CU-06: Agregar al Carrito'),
                new Paragraph({ children: [new TextRun({ text: 'Nombre: ', bold: true }), new TextRun('Agregar Producto al Carrito')], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: 'Actor: ', bold: true }), new TextRun('Cliente (autenticado o no)')], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: 'Precondiciones: ', bold: true }), new TextRun('Producto existe y tiene stock > 0')], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: 'Flujo Principal:', bold: true })], spacing: { before: 100, after: 50 } }),
                new Paragraph({ children: [new TextRun('1. Usuario navega al catálogo o detalle de producto')], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun('2. Usuario selecciona cantidad (por defecto 1)')], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun('3. Usuario hace clic en "Agregar al Carrito"')], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun('4. Sistema valida disponibilidad de stock')], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun('5. Sistema agrega producto al carrito (localStorage)')], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun('6. Sistema muestra notificación de éxito (Toast)')], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun('7. Sistema actualiza contador del carrito en navbar')], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: 'Postcondiciones: ', bold: true }), new TextRun('Producto agregado al carrito local')], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: 'Flujo Alternativo 4a: ', bold: true }), new TextRun('Stock insuficiente - Sistema muestra error')], spacing: { after: 100 } }),

                // ========== 3. MODELO DE BASE DE DATOS ==========
                new Paragraph({ children: [new PageBreak()] }),
                crearTitulo('3. MODELO DE BASE DE DATOS'),

                crearSubtitulo('3.1 Entidades del Sistema'),
                crearTabla([
                    ['Entidad', 'Tabla BD', 'Descripción', 'Tipo'],
                    ['User', 'users', 'Usuarios del sistema', 'Principal'],
                    ['WholesaleRequest', 'wholesale_requests', 'Solicitudes mayoristas', 'Dependiente'],
                    ['Address', 'addresses', 'Direcciones de envío', 'Dependiente'],
                    ['Category', 'categories', 'Categorías de productos', 'Principal'],
                    ['Product', 'products', 'Productos del catálogo', 'Principal'],
                    ['Order', 'orders', 'Pedidos de clientes', 'Principal'],
                    ['OrderItem', 'order_items', 'Items de pedidos', 'Asociativa'],
                    ['InventoryMovement', 'inventory_movements', 'Movimientos de stock', 'Histórica'],
                ]),

                crearSubtitulo('3.2 Relaciones entre Entidades'),
                crearTabla([
                    ['Relación', 'Cardinalidad', 'Descripción', 'Constraint'],
                    ['User → Order', '1:N', 'Un usuario tiene muchos pedidos', 'FK userId'],
                    ['User → Address', '1:N', 'Un usuario tiene muchas direcciones', 'FK userId, CASCADE'],
                    ['User → WholesaleRequest', '1:N', 'Un usuario tiene solicitudes', 'FK userId, CASCADE'],
                    ['User → InventoryMovement', '1:N', 'Un usuario registra movimientos', 'FK userId'],
                    ['Category → Product', '1:N', 'Una categoría tiene productos', 'FK categoryId'],
                    ['Order → OrderItem', '1:N', 'Un pedido tiene items', 'FK orderId, CASCADE'],
                    ['Order → Address', 'N:1', 'Un pedido tiene dirección', 'FK addressId'],
                    ['Product → OrderItem', '1:N', 'Un producto en items', 'FK productId'],
                    ['Product → InventoryMovement', '1:N', 'Un producto tiene movimientos', 'FK productId'],
                ]),

                // ========== 4. DICCIONARIO DE DATOS COMPLETO ==========
                new Paragraph({ children: [new PageBreak()] }),
                crearTitulo('4. DICCIONARIO DE DATOS COMPLETO'),

                // TABLA USER
                crearSubtitulo('4.1 Tabla: USER (users)'),
                new Paragraph({ children: [new TextRun({ text: 'Usuarios del sistema (clientes, mayoristas, administradores).', italics: true, size: 20 })], spacing: { after: 100 } }),
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
                    ['companyName', 'String', 'NULLABLE', 'Empresa'],
                    ['ruc', 'String', 'NULLABLE', 'RUC/NIT'],
                    ['wholesaleAddress', 'String', 'NULLABLE', 'Dirección comercial'],
                    ['wholesaleMessage', 'String', 'NULLABLE', 'Mensaje solicitud'],
                    ['lastLogin', 'DateTime', 'NULLABLE', 'Último acceso'],
                    ['createdAt', 'DateTime', 'DEFAULT now()', 'Fecha creación'],
                    ['updatedAt', 'DateTime', 'AUTO', 'Fecha modificación'],
                ]),

                // TABLA WHOLESALE_REQUEST
                crearSubtitulo('4.2 Tabla: WHOLESALE_REQUEST (wholesale_requests)'),
                new Paragraph({ children: [new TextRun({ text: 'Solicitudes de cuentas mayoristas.', italics: true, size: 20 })], spacing: { after: 100 } }),
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

                // TABLA ADDRESS
                new Paragraph({ children: [new PageBreak()] }),
                crearSubtitulo('4.3 Tabla: ADDRESS (addresses)'),
                new Paragraph({ children: [new TextRun({ text: 'Direcciones de envío de usuarios.', italics: true, size: 20 })], spacing: { after: 100 } }),
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

                // TABLA CATEGORY
                crearSubtitulo('4.4 Tabla: CATEGORY (categories)'),
                new Paragraph({ children: [new TextRun({ text: 'Categorías para organizar productos.', italics: true, size: 20 })], spacing: { after: 100 } }),
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

                // TABLA PRODUCT
                crearSubtitulo('4.5 Tabla: PRODUCT (products)'),
                new Paragraph({ children: [new TextRun({ text: 'Productos del catálogo de la tienda.', italics: true, size: 20 })], spacing: { after: 100 } }),
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

                // TABLA ORDER
                new Paragraph({ children: [new PageBreak()] }),
                crearSubtitulo('4.6 Tabla: ORDER (orders)'),
                new Paragraph({ children: [new TextRun({ text: 'Pedidos realizados por clientes.', italics: true, size: 20 })], spacing: { after: 100 } }),
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

                // TABLA ORDER_ITEM
                crearSubtitulo('4.7 Tabla: ORDER_ITEM (order_items)'),
                new Paragraph({ children: [new TextRun({ text: 'Items individuales de cada pedido.', italics: true, size: 20 })], spacing: { after: 100 } }),
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

                // TABLA INVENTORY_MOVEMENT
                crearSubtitulo('4.8 Tabla: INVENTORY_MOVEMENT (inventory_movements)'),
                new Paragraph({ children: [new TextRun({ text: 'Registro de movimientos de inventario.', italics: true, size: 20 })], spacing: { after: 100 } }),
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

                // ========== 5. MODELO DE CLASES ==========
                new Paragraph({ children: [new PageBreak()] }),
                crearTitulo('5. MODELO DE CLASES'),

                crearSubtitulo('5.1 Clases del Dominio'),

                // CLASE USER
                new Paragraph({ children: [new TextRun({ text: 'Clase User', bold: true, size: 24, color: '4472C4' })], spacing: { before: 150, after: 100 } }),
                crearTabla([
                    ['Atributo', 'Tipo'],
                    ['id', 'string'],
                    ['email', 'string'],
                    ['password', 'string'],
                    ['name', 'string'],
                    ['role', 'UserRole'],
                    ['status', 'UserStatus'],
                ]),
                crearTabla([
                    ['Método', 'Descripción'],
                    ['register()', 'Registrar nuevo usuario'],
                    ['login()', 'Iniciar sesión'],
                    ['logout()', 'Cerrar sesión'],
                    ['updateProfile()', 'Actualizar perfil'],
                    ['requestWholesale()', 'Solicitar cuenta mayorista'],
                ]),

                // CLASE PRODUCT
                new Paragraph({ children: [new TextRun({ text: 'Clase Product', bold: true, size: 24, color: '4472C4' })], spacing: { before: 200, after: 100 } }),
                crearTabla([
                    ['Atributo', 'Tipo'],
                    ['id', 'string'],
                    ['name', 'string'],
                    ['sku', 'string'],
                    ['price', 'number'],
                    ['wholesalePrice', 'number'],
                    ['stock', 'number'],
                    ['category', 'Category'],
                ]),
                crearTabla([
                    ['Método', 'Descripción'],
                    ['create()', 'Crear producto'],
                    ['update()', 'Actualizar producto'],
                    ['delete()', 'Eliminar producto'],
                    ['updateStock()', 'Actualizar inventario'],
                    ['getPrice(userRole)', 'Obtener precio según rol'],
                ]),

                // CLASE ORDER
                new Paragraph({ children: [new TextRun({ text: 'Clase Order', bold: true, size: 24, color: '4472C4' })], spacing: { before: 200, after: 100 } }),
                crearTabla([
                    ['Atributo', 'Tipo'],
                    ['id', 'string'],
                    ['orderNumber', 'string'],
                    ['user', 'User'],
                    ['items', 'OrderItem[]'],
                    ['total', 'number'],
                    ['status', 'OrderStatus'],
                ]),
                crearTabla([
                    ['Método', 'Descripción'],
                    ['create()', 'Crear pedido'],
                    ['updateStatus()', 'Cambiar estado'],
                    ['calculateTotal()', 'Calcular total'],
                    ['addItem()', 'Agregar item'],
                    ['removeItem()', 'Eliminar item'],
                ]),

                // CLASE CATEGORY
                new Paragraph({ children: [new TextRun({ text: 'Clase Category', bold: true, size: 24, color: '4472C4' })], spacing: { before: 200, after: 100 } }),
                crearTabla([
                    ['Atributo', 'Tipo'],
                    ['id', 'string'],
                    ['name', 'string'],
                    ['description', 'string'],
                    ['image', 'string'],
                    ['isActive', 'boolean'],
                ]),
                crearTabla([
                    ['Método', 'Descripción'],
                    ['create()', 'Crear categoría'],
                    ['update()', 'Actualizar categoría'],
                    ['delete()', 'Eliminar categoría'],
                    ['getProducts()', 'Obtener productos de la categoría'],
                ]),

                // CLASE ADDRESS
                new Paragraph({ children: [new PageBreak()] }),
                new Paragraph({ children: [new TextRun({ text: 'Clase Address', bold: true, size: 24, color: '4472C4' })], spacing: { before: 150, after: 100 } }),
                crearTabla([
                    ['Atributo', 'Tipo'],
                    ['id', 'string'],
                    ['userId', 'string'],
                    ['name', 'string'],
                    ['address', 'string'],
                    ['city', 'string'],
                    ['province', 'string'],
                    ['isDefault', 'boolean'],
                ]),
                crearTabla([
                    ['Método', 'Descripción'],
                    ['create()', 'Crear dirección'],
                    ['update()', 'Actualizar dirección'],
                    ['delete()', 'Eliminar dirección'],
                    ['setDefault()', 'Establecer como principal'],
                ]),

                // CLASE ORDERITEM
                new Paragraph({ children: [new TextRun({ text: 'Clase OrderItem', bold: true, size: 24, color: '4472C4' })], spacing: { before: 200, after: 100 } }),
                crearTabla([
                    ['Atributo', 'Tipo'],
                    ['id', 'string'],
                    ['orderId', 'string'],
                    ['productId', 'string'],
                    ['quantity', 'number'],
                    ['unitPrice', 'number'],
                    ['subtotal', 'number'],
                ]),
                crearTabla([
                    ['Método', 'Descripción'],
                    ['getSubtotal()', 'Calcular subtotal del item'],
                ]),

                // CLASE CARTSERVICE
                new Paragraph({ children: [new TextRun({ text: 'Clase CartService (Servicio)', bold: true, size: 24, color: '4472C4' })], spacing: { before: 200, after: 100 } }),
                crearTabla([
                    ['Atributo', 'Tipo'],
                    ['items', 'CartItem[]'],
                    ['total', 'number'],
                ]),
                crearTabla([
                    ['Método', 'Descripción'],
                    ['addProduct(product, qty)', 'Agregar producto al carrito'],
                    ['removeProduct(productId)', 'Eliminar producto del carrito'],
                    ['updateQuantity(productId, qty)', 'Actualizar cantidad'],
                    ['clear()', 'Vaciar carrito'],
                    ['getTotal()', 'Obtener total del carrito'],
                ]),

                // CLASE AUTHSERVICE
                new Paragraph({ children: [new TextRun({ text: 'Clase AuthService (Servicio)', bold: true, size: 24, color: '4472C4' })], spacing: { before: 200, after: 100 } }),
                crearTabla([
                    ['Atributo', 'Tipo'],
                    ['currentUser', 'User | null'],
                    ['token', 'string | null'],
                ]),
                crearTabla([
                    ['Método', 'Descripción'],
                    ['login(email, password)', 'Iniciar sesión'],
                    ['register(userData)', 'Registrar usuario'],
                    ['verifyToken()', 'Verificar token JWT'],
                    ['logout()', 'Cerrar sesión'],
                ]),

                // ========== 6. ARQUITECTURA ==========
                new Paragraph({ children: [new PageBreak()] }),
                crearTitulo('6. ARQUITECTURA DEL SISTEMA'),

                crearSubtitulo('6.1 Estilo Arquitectónico'),
                new Paragraph({ children: [new TextRun({ text: 'Arquitectura en Capas (Layered Architecture)', bold: true, size: 24, color: '4472C4' })], spacing: { after: 100 } }),
                crearTabla([
                    ['Capa', 'Responsabilidad', 'Tecnologías'],
                    ['Presentación', 'Interfaz de usuario, interacción', 'React, Next.js Pages, CSS Modules'],
                    ['Lógica de Negocio', 'Reglas de negocio, validaciones, API', 'Next.js API Routes, Middleware'],
                    ['Acceso a Datos', 'Persistencia, consultas BD', 'Prisma ORM, PostgreSQL'],
                ]),

                crearSubtitulo('6.2 Patrones de Diseño'),
                crearTabla([
                    ['Patrón', 'Aplicación', 'Ubicación'],
                    ['Singleton', 'Cliente Prisma único', 'lib/prisma.ts'],
                    ['Repository', 'Abstracción de acceso a datos', 'Prisma Client'],
                    ['Factory', 'Creación de objetos Response', 'API Routes'],
                    ['Observer', 'React Context para estado global', 'CartContext'],
                    ['Decorator', 'Middleware de autenticación', 'middleware.ts'],
                    ['Strategy', 'Cálculo de precios (normal/mayorista)', 'Product.getPrice()'],
                ]),

                crearSubtitulo('6.3 Stack Tecnológico'),
                crearTabla([
                    ['Categoría', 'Tecnología', 'Versión'],
                    ['Frontend', 'Next.js + React', '14.x / 18.x'],
                    ['Backend', 'Next.js API Routes', '14.x'],
                    ['ORM', 'Prisma', '5.x'],
                    ['Base de Datos', 'PostgreSQL (Neon)', '15'],
                    ['Autenticación', 'JWT (jose)', '-'],
                    ['Hosting', 'Vercel', '-'],
                    ['Estilos', 'CSS Modules', '-'],
                    ['Notificaciones', 'Sonner', '-'],
                ]),

                crearSubtitulo('6.4 URL de Producción'),
                new Paragraph({ children: [new TextRun({ text: 'https://proyecto-grafica-santiago.vercel.app', size: 24, color: '0563C1' })], spacing: { after: 100 } }),

                // ========== 7. ANEXOS ==========
                new Paragraph({ children: [new PageBreak()] }),
                crearTitulo('7. ANEXOS (DIAGRAMAS UML)'),

                crearSubtitulo('7.1 Diagrama de Casos de Uso'),
                new Paragraph({ children: [new TextRun({ text: '[Insertar diagrama de Casos de Uso aquí]', italics: true, color: '888888', size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: 'Muestra los 18 casos de uso organizados en 3 módulos (Público, Cliente, Admin) y 4 actores.', size: 20 })], spacing: { after: 300 } }),

                crearSubtitulo('7.2 Diagrama Entidad-Relación (ER)'),
                new Paragraph({ children: [new TextRun({ text: '[Insertar diagrama ER aquí]', italics: true, color: '888888', size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: 'Muestra las 8 tablas de la base de datos con sus atributos y relaciones.', size: 20 })], spacing: { after: 300 } }),

                crearSubtitulo('7.3 Diagrama de Clases'),
                new Paragraph({ children: [new TextRun({ text: '[Insertar diagrama de Clases aquí]', italics: true, color: '888888', size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: 'Muestra las clases del dominio con atributos, métodos y relaciones.', size: 20 })], spacing: { after: 300 } }),

                crearSubtitulo('7.4 Diagrama de Arquitectura (Componentes)'),
                new Paragraph({ children: [new TextRun({ text: '[Insertar diagrama de Arquitectura aquí]', italics: true, color: '888888', size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: 'Arquitectura en 3 capas: Cliente → Servidor → Base de Datos.', size: 20 })], spacing: { after: 300 } }),

                new Paragraph({ children: [new PageBreak()] }),
                crearSubtitulo('7.5 Diagrama de Despliegue'),
                new Paragraph({ children: [new TextRun({ text: '[Insertar diagrama de Despliegue aquí]', italics: true, color: '888888', size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: 'Infraestructura: Navegador → Vercel Edge → Vercel Functions → Neon PostgreSQL.', size: 20 })], spacing: { after: 300 } }),

                crearSubtitulo('7.6 Diagrama de Secuencia - Agregar al Carrito'),
                new Paragraph({ children: [new TextRun({ text: '[Insertar diagrama de secuencia aquí]', italics: true, color: '888888', size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: 'Flujo: Usuario → UI → API → BD → CartContext → LocalStorage → Toast.', size: 20 })], spacing: { after: 300 } }),

                crearSubtitulo('7.7 Diagrama de Secuencia - Checkout'),
                new Paragraph({ children: [new TextRun({ text: '[Insertar diagrama de secuencia aquí]', italics: true, color: '888888', size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: 'Flujo: Usuario → Checkout → API → Auth → Transaction → Insert Order → Redirect.', size: 20 })], spacing: { after: 300 } }),

                // FIN
                new Paragraph({ text: '', spacing: { after: 400 } }),
                new Paragraph({ children: [new TextRun({ text: '— Fin del Documento —', italics: true, color: '888888', size: 24 })], alignment: AlignmentType.CENTER }),
                new Paragraph({ children: [new TextRun({ text: 'Gráfica Santiago © 2026', size: 20, color: '888888' })], alignment: AlignmentType.CENTER }),
            ],
        }],
    });

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(path.join(__dirname, '..', '..', 'Modelos_Completos_Grafica_Santiago.docx'), buffer);
    console.log('✅ Documento generado: Modelos_Completos_Grafica_Santiago.docx');
}

function crearTitulo(texto) {
    return new Paragraph({ children: [new TextRun({ text: texto, bold: true, size: 32, color: '4472C4' })], heading: HeadingLevel.HEADING_1, spacing: { before: 200, after: 200 }, border: { bottom: { color: '4472C4', size: 6, space: 1, style: 'single' } } });
}

function crearSubtitulo(texto) {
    return new Paragraph({ children: [new TextRun({ text: texto, bold: true, size: 26 })], heading: HeadingLevel.HEADING_2, spacing: { before: 250, after: 100 } });
}

function crearTabla(datos) {
    return new Table({ rows: datos.map((fila, i) => new TableRow({ children: fila.map(c => new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: c, bold: i === 0, color: i === 0 ? 'FFFFFF' : '000000', size: 18 })] })], shading: i === 0 ? { fill: '4472C4' } : undefined })) })), width: { size: 100, type: WidthType.PERCENTAGE } });
}

generarDocumentoModelos().catch(console.error);

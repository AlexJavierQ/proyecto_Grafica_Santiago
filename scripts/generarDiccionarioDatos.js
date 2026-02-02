const { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, HeadingLevel, WidthType, BorderStyle, AlignmentType, PageBreak } = require('docx');
const fs = require('fs');
const path = require('path');

async function generarDiccionarioDatos() {
    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                // === PORTADA ===
                new Paragraph({ text: '', spacing: { after: 800 } }),
                new Paragraph({
                    children: [new TextRun({ text: 'GRÁFICA SANTIAGO', bold: true, size: 56, color: '4472C4' })],
                    alignment: AlignmentType.CENTER,
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'Plataforma E-commerce', size: 32, italics: true })],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 600 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'DICCIONARIO DE DATOS COMPLETO', bold: true, size: 40 })],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 300 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'Base de Datos PostgreSQL', size: 28 })],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 1200 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'Fecha: 27 de Enero de 2026', size: 24 })],
                    alignment: AlignmentType.CENTER,
                }),

                // === ÍNDICE ===
                new Paragraph({ children: [new PageBreak()] }),
                new Paragraph({
                    children: [new TextRun({ text: 'Índice de Tablas', bold: true, size: 32, color: '4472C4' })],
                    heading: HeadingLevel.HEADING_1,
                    spacing: { after: 200 }
                }),
                new Paragraph({ children: [new TextRun({ text: '1. USER (users) - Usuarios del sistema', size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: '2. WHOLESALE_REQUEST (wholesale_requests) - Solicitudes mayoristas', size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: '3. ADDRESS (addresses) - Direcciones de usuarios', size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: '4. CATEGORY (categories) - Categorías de productos', size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: '5. PRODUCT (products) - Productos del catálogo', size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: '6. ORDER (orders) - Pedidos de clientes', size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: '7. ORDER_ITEM (order_items) - Items de pedidos', size: 22 })], spacing: { after: 50 } }),
                new Paragraph({ children: [new TextRun({ text: '8. INVENTORY_MOVEMENT (inventory_movements) - Movimientos de inventario', size: 22 })], spacing: { after: 200 } }),

                // === TABLA 1: USER ===
                new Paragraph({ children: [new PageBreak()] }),
                new Paragraph({
                    children: [new TextRun({ text: '1. USER (users)', bold: true, size: 28, color: '4472C4' })],
                    heading: HeadingLevel.HEADING_1,
                    spacing: { after: 100 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'Descripción: Almacena la información de todos los usuarios del sistema (clientes, mayoristas y administradores).', size: 22 })],
                    spacing: { after: 150 }
                }),
                crearTablaAtributos([
                    ['Campo', 'Tipo', 'Restricciones', 'Descripción'],
                    ['id', 'String', 'PK, CUID', 'Identificador único del usuario'],
                    ['email', 'String', 'UNIQUE, NOT NULL', 'Correo electrónico (login)'],
                    ['password', 'String', 'NOT NULL', 'Contraseña encriptada (bcrypt)'],
                    ['name', 'String', 'NOT NULL', 'Nombre completo del usuario'],
                    ['phone', 'String', 'NULLABLE', 'Número de teléfono'],
                    ['role', 'String', 'DEFAULT "CUSTOMER"', 'Rol: CUSTOMER, WHOLESALE, ADMIN'],
                    ['status', 'String', 'DEFAULT "ACTIVE"', 'Estado: ACTIVE, INACTIVE, PENDING'],
                    ['wholesaleRequested', 'Boolean', 'DEFAULT false', 'Indica si solicitó cuenta mayorista'],
                    ['companyName', 'String', 'NULLABLE', 'Nombre de empresa (mayoristas)'],
                    ['ruc', 'String', 'NULLABLE', 'RUC/NIT de la empresa'],
                    ['wholesaleAddress', 'String', 'NULLABLE', 'Dirección comercial mayorista'],
                    ['wholesaleMessage', 'String', 'NULLABLE', 'Mensaje de solicitud mayorista'],
                    ['lastLogin', 'DateTime', 'NULLABLE', 'Fecha/hora último acceso'],
                    ['createdAt', 'DateTime', 'DEFAULT now()', 'Fecha de creación'],
                    ['updatedAt', 'DateTime', 'AUTO UPDATE', 'Fecha última modificación'],
                ]),
                new Paragraph({
                    children: [new TextRun({ text: 'Relaciones:', bold: true, size: 22 })],
                    spacing: { before: 150, after: 50 }
                }),
                new Paragraph({ children: [new TextRun({ text: '• 1:N con ORDER (un usuario puede tener muchos pedidos)', size: 20 })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '• 1:N con ADDRESS (un usuario puede tener muchas direcciones)', size: 20 })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '• 1:N con WHOLESALE_REQUEST (un usuario puede tener muchas solicitudes)', size: 20 })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '• 1:N con INVENTORY_MOVEMENT (un usuario registra movimientos)', size: 20 })], spacing: { after: 100 } }),

                // === TABLA 2: WHOLESALE_REQUEST ===
                new Paragraph({ children: [new PageBreak()] }),
                new Paragraph({
                    children: [new TextRun({ text: '2. WHOLESALE_REQUEST (wholesale_requests)', bold: true, size: 28, color: '4472C4' })],
                    heading: HeadingLevel.HEADING_1,
                    spacing: { after: 100 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'Descripción: Registra las solicitudes de clientes para obtener una cuenta mayorista con precios especiales.', size: 22 })],
                    spacing: { after: 150 }
                }),
                crearTablaAtributos([
                    ['Campo', 'Tipo', 'Restricciones', 'Descripción'],
                    ['id', 'String', 'PK, CUID', 'Identificador único de la solicitud'],
                    ['userId', 'String', 'FK → USER', 'Usuario que realiza la solicitud'],
                    ['companyName', 'String', 'NOT NULL', 'Nombre de la empresa'],
                    ['taxId', 'String', 'NOT NULL', 'RUC/NIT de la empresa'],
                    ['phone', 'String', 'NOT NULL', 'Teléfono de contacto'],
                    ['address', 'String', 'NOT NULL', 'Dirección comercial'],
                    ['message', 'String', 'NULLABLE', 'Mensaje adicional del solicitante'],
                    ['status', 'String', 'DEFAULT "PENDING"', 'Estado: PENDING, APPROVED, REJECTED'],
                    ['createdAt', 'DateTime', 'DEFAULT now()', 'Fecha de solicitud'],
                    ['updatedAt', 'DateTime', 'AUTO UPDATE', 'Fecha última modificación'],
                ]),
                new Paragraph({
                    children: [new TextRun({ text: 'Relaciones:', bold: true, size: 22 })],
                    spacing: { before: 150, after: 50 }
                }),
                new Paragraph({ children: [new TextRun({ text: '• N:1 con USER (muchas solicitudes pertenecen a un usuario)', size: 20 })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '• ON DELETE CASCADE: Si se elimina el usuario, se eliminan sus solicitudes', size: 20 })], spacing: { after: 100 } }),

                // === TABLA 3: ADDRESS ===
                new Paragraph({ children: [new PageBreak()] }),
                new Paragraph({
                    children: [new TextRun({ text: '3. ADDRESS (addresses)', bold: true, size: 28, color: '4472C4' })],
                    heading: HeadingLevel.HEADING_1,
                    spacing: { after: 100 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'Descripción: Almacena las direcciones de envío de los usuarios para sus pedidos.', size: 22 })],
                    spacing: { after: 150 }
                }),
                crearTablaAtributos([
                    ['Campo', 'Tipo', 'Restricciones', 'Descripción'],
                    ['id', 'String', 'PK, CUID', 'Identificador único de la dirección'],
                    ['userId', 'String', 'FK → USER', 'Usuario propietario'],
                    ['name', 'String', 'NOT NULL', 'Nombre del destinatario'],
                    ['phone', 'String', 'NOT NULL', 'Teléfono de contacto'],
                    ['address', 'String', 'NOT NULL', 'Dirección completa (calle, número)'],
                    ['city', 'String', 'NOT NULL', 'Ciudad'],
                    ['province', 'String', 'NOT NULL', 'Provincia/Estado'],
                    ['postalCode', 'String', 'NULLABLE', 'Código postal'],
                    ['isDefault', 'Boolean', 'DEFAULT false', 'Indica si es dirección principal'],
                    ['createdAt', 'DateTime', 'DEFAULT now()', 'Fecha de creación'],
                    ['updatedAt', 'DateTime', 'AUTO UPDATE', 'Fecha última modificación'],
                ]),
                new Paragraph({
                    children: [new TextRun({ text: 'Relaciones:', bold: true, size: 22 })],
                    spacing: { before: 150, after: 50 }
                }),
                new Paragraph({ children: [new TextRun({ text: '• N:1 con USER (muchas direcciones pertenecen a un usuario)', size: 20 })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '• 1:N con ORDER (una dirección puede usarse en muchos pedidos)', size: 20 })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '• ON DELETE CASCADE: Si se elimina el usuario, se eliminan sus direcciones', size: 20 })], spacing: { after: 100 } }),

                // === TABLA 4: CATEGORY ===
                new Paragraph({ children: [new PageBreak()] }),
                new Paragraph({
                    children: [new TextRun({ text: '4. CATEGORY (categories)', bold: true, size: 28, color: '4472C4' })],
                    heading: HeadingLevel.HEADING_1,
                    spacing: { after: 100 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'Descripción: Categorías para organizar los productos del catálogo.', size: 22 })],
                    spacing: { after: 150 }
                }),
                crearTablaAtributos([
                    ['Campo', 'Tipo', 'Restricciones', 'Descripción'],
                    ['id', 'String', 'PK, CUID', 'Identificador único de la categoría'],
                    ['name', 'String', 'UNIQUE, NOT NULL', 'Nombre de la categoría'],
                    ['description', 'String', 'NULLABLE', 'Descripción de la categoría'],
                    ['image', 'String', 'NULLABLE', 'URL de imagen representativa'],
                    ['order', 'Int', 'DEFAULT 0', 'Orden de visualización'],
                    ['isActive', 'Boolean', 'DEFAULT true', 'Indica si está activa'],
                    ['createdAt', 'DateTime', 'DEFAULT now()', 'Fecha de creación'],
                    ['updatedAt', 'DateTime', 'AUTO UPDATE', 'Fecha última modificación'],
                ]),
                new Paragraph({
                    children: [new TextRun({ text: 'Relaciones:', bold: true, size: 22 })],
                    spacing: { before: 150, after: 50 }
                }),
                new Paragraph({ children: [new TextRun({ text: '• 1:N con PRODUCT (una categoría contiene muchos productos)', size: 20 })], spacing: { after: 100 } }),

                // === TABLA 5: PRODUCT ===
                new Paragraph({ children: [new PageBreak()] }),
                new Paragraph({
                    children: [new TextRun({ text: '5. PRODUCT (products)', bold: true, size: 28, color: '4472C4' })],
                    heading: HeadingLevel.HEADING_1,
                    spacing: { after: 100 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'Descripción: Productos disponibles para venta en el catálogo de la tienda.', size: 22 })],
                    spacing: { after: 150 }
                }),
                crearTablaAtributos([
                    ['Campo', 'Tipo', 'Restricciones', 'Descripción'],
                    ['id', 'String', 'PK, CUID', 'Identificador único del producto'],
                    ['sku', 'String', 'UNIQUE, NOT NULL', 'Código SKU único'],
                    ['barcode', 'String', 'UNIQUE, NULLABLE', 'Código de barras'],
                    ['name', 'String', 'NOT NULL', 'Nombre del producto'],
                    ['description', 'String', 'NULLABLE', 'Descripción detallada'],
                    ['price', 'Float', 'NOT NULL', 'Precio de venta regular'],
                    ['wholesalePrice', 'Float', 'NULLABLE', 'Precio para mayoristas'],
                    ['stock', 'Int', 'DEFAULT 0', 'Cantidad en inventario'],
                    ['minStock', 'Int', 'DEFAULT 5', 'Stock mínimo (alerta)'],
                    ['categoryId', 'String', 'FK → CATEGORY, NULLABLE', 'Categoría del producto'],
                    ['images', 'String', 'DEFAULT "[]"', 'URLs de imágenes (JSON array)'],
                    ['specifications', 'String', 'NULLABLE', 'Especificaciones técnicas'],
                    ['isActive', 'Boolean', 'DEFAULT true', 'Indica si está activo'],
                    ['createdAt', 'DateTime', 'DEFAULT now()', 'Fecha de creación'],
                    ['updatedAt', 'DateTime', 'AUTO UPDATE', 'Fecha última modificación'],
                ]),
                new Paragraph({
                    children: [new TextRun({ text: 'Relaciones:', bold: true, size: 22 })],
                    spacing: { before: 150, after: 50 }
                }),
                new Paragraph({ children: [new TextRun({ text: '• N:1 con CATEGORY (un producto pertenece a una categoría)', size: 20 })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '• 1:N con ORDER_ITEM (un producto aparece en muchos items)', size: 20 })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '• 1:N con INVENTORY_MOVEMENT (un producto tiene movimientos)', size: 20 })], spacing: { after: 100 } }),

                // === TABLA 6: ORDER ===
                new Paragraph({ children: [new PageBreak()] }),
                new Paragraph({
                    children: [new TextRun({ text: '6. ORDER (orders)', bold: true, size: 28, color: '4472C4' })],
                    heading: HeadingLevel.HEADING_1,
                    spacing: { after: 100 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'Descripción: Pedidos realizados por los clientes en la plataforma.', size: 22 })],
                    spacing: { after: 150 }
                }),
                crearTablaAtributos([
                    ['Campo', 'Tipo', 'Restricciones', 'Descripción'],
                    ['id', 'String', 'PK, CUID', 'Identificador único del pedido'],
                    ['orderNumber', 'String', 'UNIQUE, NOT NULL', 'Número de pedido legible'],
                    ['userId', 'String', 'FK → USER', 'Cliente que realizó el pedido'],
                    ['addressId', 'String', 'FK → ADDRESS', 'Dirección de envío'],
                    ['subtotal', 'Float', 'NOT NULL', 'Subtotal antes de descuentos'],
                    ['discount', 'Float', 'DEFAULT 0', 'Monto de descuento aplicado'],
                    ['shipping', 'Float', 'DEFAULT 0', 'Costo de envío'],
                    ['total', 'Float', 'NOT NULL', 'Total final a pagar'],
                    ['status', 'String', 'DEFAULT "PENDING"', 'PENDING, CONFIRMED, SHIPPED, DELIVERED'],
                    ['paymentStatus', 'String', 'DEFAULT "PENDING"', 'PENDING, PAID, FAILED'],
                    ['paymentMethod', 'String', 'NULLABLE', 'Método de pago utilizado'],
                    ['notes', 'String', 'NULLABLE', 'Notas adicionales del cliente'],
                    ['createdAt', 'DateTime', 'DEFAULT now()', 'Fecha del pedido'],
                    ['updatedAt', 'DateTime', 'AUTO UPDATE', 'Fecha última modificación'],
                ]),
                new Paragraph({
                    children: [new TextRun({ text: 'Relaciones:', bold: true, size: 22 })],
                    spacing: { before: 150, after: 50 }
                }),
                new Paragraph({ children: [new TextRun({ text: '• N:1 con USER (un pedido pertenece a un usuario)', size: 20 })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '• N:1 con ADDRESS (un pedido tiene una dirección de envío)', size: 20 })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '• 1:N con ORDER_ITEM (un pedido tiene muchos items)', size: 20 })], spacing: { after: 100 } }),

                // === TABLA 7: ORDER_ITEM ===
                new Paragraph({ children: [new PageBreak()] }),
                new Paragraph({
                    children: [new TextRun({ text: '7. ORDER_ITEM (order_items)', bold: true, size: 28, color: '4472C4' })],
                    heading: HeadingLevel.HEADING_1,
                    spacing: { after: 100 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'Descripción: Items individuales dentro de un pedido (productos y cantidades).', size: 22 })],
                    spacing: { after: 150 }
                }),
                crearTablaAtributos([
                    ['Campo', 'Tipo', 'Restricciones', 'Descripción'],
                    ['id', 'String', 'PK, CUID', 'Identificador único del item'],
                    ['orderId', 'String', 'FK → ORDER', 'Pedido al que pertenece'],
                    ['productId', 'String', 'FK → PRODUCT', 'Producto comprado'],
                    ['quantity', 'Int', 'NOT NULL', 'Cantidad de unidades'],
                    ['unitPrice', 'Float', 'NOT NULL', 'Precio unitario al momento'],
                    ['subtotal', 'Float', 'NOT NULL', 'Subtotal (quantity × unitPrice)'],
                    ['createdAt', 'DateTime', 'DEFAULT now()', 'Fecha de creación'],
                ]),
                new Paragraph({
                    children: [new TextRun({ text: 'Relaciones:', bold: true, size: 22 })],
                    spacing: { before: 150, after: 50 }
                }),
                new Paragraph({ children: [new TextRun({ text: '• N:1 con ORDER (un item pertenece a un pedido)', size: 20 })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '• N:1 con PRODUCT (un item referencia un producto)', size: 20 })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '• ON DELETE CASCADE: Si se elimina el pedido, se eliminan los items', size: 20 })], spacing: { after: 100 } }),

                // === TABLA 8: INVENTORY_MOVEMENT ===
                new Paragraph({ children: [new PageBreak()] }),
                new Paragraph({
                    children: [new TextRun({ text: '8. INVENTORY_MOVEMENT (inventory_movements)', bold: true, size: 28, color: '4472C4' })],
                    heading: HeadingLevel.HEADING_1,
                    spacing: { after: 100 }
                }),
                new Paragraph({
                    children: [new TextRun({ text: 'Descripción: Registro de todos los movimientos de inventario (entradas, salidas, ajustes).', size: 22 })],
                    spacing: { after: 150 }
                }),
                crearTablaAtributos([
                    ['Campo', 'Tipo', 'Restricciones', 'Descripción'],
                    ['id', 'String', 'PK, CUID', 'Identificador único del movimiento'],
                    ['productId', 'String', 'FK → PRODUCT', 'Producto afectado'],
                    ['userId', 'String', 'FK → USER', 'Usuario que registró'],
                    ['type', 'String', 'NOT NULL', 'Tipo: IN, OUT, ADJUSTMENT'],
                    ['quantity', 'Int', 'NOT NULL', 'Cantidad movida'],
                    ['previousStock', 'Int', 'NOT NULL', 'Stock antes del movimiento'],
                    ['newStock', 'Int', 'NOT NULL', 'Stock después del movimiento'],
                    ['reason', 'String', 'NULLABLE', 'Razón/motivo del movimiento'],
                    ['createdAt', 'DateTime', 'DEFAULT now()', 'Fecha del movimiento'],
                ]),
                new Paragraph({
                    children: [new TextRun({ text: 'Relaciones:', bold: true, size: 22 })],
                    spacing: { before: 150, after: 50 }
                }),
                new Paragraph({ children: [new TextRun({ text: '• N:1 con PRODUCT (un movimiento afecta un producto)', size: 20 })], spacing: { after: 30 } }),
                new Paragraph({ children: [new TextRun({ text: '• N:1 con USER (un movimiento es registrado por un usuario)', size: 20 })], spacing: { after: 100 } }),

                // Footer
                new Paragraph({ children: [new PageBreak()] }),
                new Paragraph({
                    children: [new TextRun({ text: 'Resumen de Tablas', bold: true, size: 28, color: '4472C4' })],
                    heading: HeadingLevel.HEADING_1,
                    spacing: { after: 150 }
                }),
                crearTablaAtributos([
                    ['Tabla', 'Nombre BD', 'Total Campos', 'Descripción'],
                    ['User', 'users', '15', 'Usuarios del sistema'],
                    ['WholesaleRequest', 'wholesale_requests', '10', 'Solicitudes mayoristas'],
                    ['Address', 'addresses', '11', 'Direcciones de envío'],
                    ['Category', 'categories', '8', 'Categorías de productos'],
                    ['Product', 'products', '15', 'Productos del catálogo'],
                    ['Order', 'orders', '14', 'Pedidos de clientes'],
                    ['OrderItem', 'order_items', '7', 'Items de pedidos'],
                    ['InventoryMovement', 'inventory_movements', '9', 'Movimientos de inventario'],
                ]),

                new Paragraph({ text: '', spacing: { after: 400 } }),
                new Paragraph({
                    children: [new TextRun({ text: '— Fin del Diccionario de Datos —', italics: true, color: '888888' })],
                    alignment: AlignmentType.CENTER,
                }),
            ],
        }],
    });

    // Guardar
    const buffer = await Packer.toBuffer(doc);
    const outputPath = path.join(__dirname, '..', '..', 'Diccionario_Datos_Completo.docx');
    fs.writeFileSync(outputPath, buffer);
    console.log('✅ Diccionario de Datos generado en:', outputPath);
}

function crearTablaAtributos(datos) {
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

generarDiccionarioDatos().catch(console.error);

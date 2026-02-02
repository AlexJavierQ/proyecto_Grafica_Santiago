const { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, HeadingLevel, WidthType, BorderStyle, AlignmentType, ImageRun } = require('docx');
const fs = require('fs');
const path = require('path');

async function generarDocumento() {
    // Definir los casos de prueba
    const casos = [
        {
            titulo: 'CASO 1: Inicio de Sesión (Login)',
            imagen: 'login_page_screenshot',
            objetivo: 'Verificar que el sistema permite a los usuarios autenticarse correctamente mediante credenciales válidas y rechaza intentos con datos incorrectos.',
            requisitos: [
                'Usuario registrado previamente en el sistema',
                'Acceso a la página /login',
                'Conexión a internet activa',
                'Base de datos operativa'
            ],
            escenarios: [
                { entrada: 'Email: admin@graficasantiago.com\nPassword: password123', acciones: '1. Ingresar email\n2. Ingresar contraseña\n3. Clic en "Iniciar Sesión"', salidaEsperada: 'Sesión iniciada, redirección a home, nombre visible en navbar' },
                { entrada: 'Email: usuario@test.com\nPassword: incorrecta123', acciones: '1. Ingresar email\n2. Ingresar contraseña incorrecta\n3. Clic en "Iniciar Sesión"', salidaEsperada: 'Mensaje de error: "Credenciales inválidas", sesión NO iniciada' },
                { entrada: 'Email: (vacío)\nPassword: (vacío)', acciones: '1. Dejar campos vacíos\n2. Clic en "Iniciar Sesión"', salidaEsperada: 'Validación HTML5 impide envío, mensaje "Complete este campo"' },
                { entrada: 'Email: formato_invalido\nPassword: 123456', acciones: '1. Ingresar email sin @\n2. Ingresar contraseña\n3. Intentar iniciar sesión', salidaEsperada: 'Validación indica formato de email inválido' },
            ]
        },
        {
            titulo: 'CASO 2: Registro de Usuario',
            imagen: 'registration_page',
            objetivo: 'Verificar que nuevos usuarios pueden crear una cuenta correctamente, validando todos los campos requeridos y la opción de solicitud mayorista.',
            requisitos: [
                'Correo electrónico no registrado previamente',
                'Acceso a la página /registro',
                'Sistema operativo y base de datos disponible'
            ],
            escenarios: [
                { entrada: 'Nombre: Juan Pérez\nEmail: juan@nuevo.com\nTeléfono: 0991234567\nPassword: Password123', acciones: '1. Completar todos los campos\n2. Confirmar contraseña\n3. Clic en "Crear Cuenta"', salidaEsperada: 'Usuario creado, sesión iniciada automáticamente, redirección a home' },
                { entrada: 'Email: admin@graficasantiago.com (ya existe)', acciones: '1. Ingresar email existente\n2. Completar demás campos\n3. Intentar registro', salidaEsperada: 'Error: "Este correo ya está registrado"' },
                { entrada: 'Password: 123 (muy corta)', acciones: '1. Ingresar contraseña de menos de 8 caracteres\n2. Intentar registro', salidaEsperada: 'Error de validación: contraseña debe tener mínimo 8 caracteres' },
                { entrada: 'Checkbox "Solicitar cuenta mayorista" activado + datos empresa', acciones: '1. Activar opción mayorista\n2. Completar datos\n3. Crear cuenta', salidaEsperada: 'Usuario creado con status PENDING, mensaje de revisión pendiente' },
            ]
        },
        {
            titulo: 'CASO 3: Navegación del Catálogo de Productos',
            imagen: 'products_catalog_page',
            objetivo: 'Verificar que los usuarios pueden navegar el catálogo, filtrar por categorías, ordenar productos y visualizar detalles correctamente.',
            requisitos: [
                'Productos activos en la base de datos',
                'Categorías configuradas',
                'Imágenes de productos disponibles'
            ],
            escenarios: [
                { entrada: 'Acceso a /productos', acciones: '1. Navegar a la página de productos', salidaEsperada: 'Se muestran todos los productos activos con imagen, nombre, precio y stock' },
                { entrada: 'Filtro: Categoría "Papelería General"', acciones: '1. Hacer clic en categoría específica en barra lateral', salidaEsperada: 'Solo se muestran productos de esa categoría, contador actualizado' },
                { entrada: 'Ordenar por: "Precio menor"', acciones: '1. Seleccionar opción de ordenamiento', salidaEsperada: 'Productos reordenados de menor a mayor precio' },
                { entrada: 'Clic en tarjeta de producto', acciones: '1. Hacer clic en un producto específico', salidaEsperada: 'Redirección a /productos/[id] con detalles completos del producto' },
            ]
        },
        {
            titulo: 'CASO 4: Agregar Productos al Carrito',
            imagen: 'products_catalog_page',
            objetivo: 'Verificar que el sistema permite agregar productos al carrito correctamente, gestionando cantidades y validando disponibilidad de stock.',
            requisitos: [
                'Productos con stock disponible (stock > 0)',
                'Carrito de compras funcional (localStorage)',
                'Usuario puede estar autenticado o no'
            ],
            escenarios: [
                { entrada: 'Producto con stock = 50', acciones: '1. Clic en "Agregar al carrito"', salidaEsperada: 'Producto agregado, notificación toast de éxito, contador del carrito +1' },
                { entrada: 'Cantidad = 5 en detalle de producto', acciones: '1. Modificar cantidad a 5\n2. Agregar al carrito', salidaEsperada: '5 unidades del producto en carrito, subtotal = precio × 5' },
                { entrada: 'Cantidad > stock disponible', acciones: '1. Ingresar cantidad mayor al stock\n2. Intentar agregar', salidaEsperada: 'Error: "Stock insuficiente", producto NO agregado' },
                { entrada: 'Mismo producto agregado 2 veces', acciones: '1. Agregar producto (cant. 2)\n2. Agregar mismo producto (cant. 1)', salidaEsperada: 'Cantidad acumulada = 3, NO líneas duplicadas' },
            ]
        },
        {
            titulo: 'CASO 5: Página Principal (Home)',
            imagen: 'home_page_screenshot',
            objetivo: 'Verificar que la página principal carga correctamente, muestra las categorías, productos destacados y permite navegación fluida a otras secciones.',
            requisitos: [
                'Categorías con imágenes configuradas',
                'Productos destacados disponibles',
                'Slider hero funcional'
            ],
            escenarios: [
                { entrada: 'Acceso a URL raíz /', acciones: '1. Abrir página principal', salidaEsperada: 'Slider hero visible, categorías cargadas, productos destacados mostrados' },
                { entrada: 'Clic en categoría "Papelería General"', acciones: '1. Hacer clic en tarjeta de categoría', salidaEsperada: 'Redirección a /productos?categoria=[id] con filtro aplicado' },
                { entrada: 'Navegación del slider', acciones: '1. Usar botones de navegación o esperar autoplay', salidaEsperada: 'Slider cambia de diapositiva correctamente' },
                { entrada: 'Clic en "Ver productos" del banner', acciones: '1. Clic en botón CTA del hero', salidaEsperada: 'Redirección a página de catálogo correspondiente' },
            ]
        },
        {
            titulo: 'CASO 6: Control de Acceso al Panel Administrativo',
            imagen: 'admin_page_view',
            objetivo: 'Verificar que el sistema protege las rutas administrativas y solo permite acceso a usuarios con rol ADMIN autenticados.',
            requisitos: [
                'Middleware de autenticación activo',
                'Roles de usuario configurados (USER, ADMIN)',
                'Usuario ADMIN existente en el sistema'
            ],
            escenarios: [
                { entrada: 'Usuario NO autenticado', acciones: '1. Intentar acceder a /admin', salidaEsperada: 'Redirección automática a /login' },
                { entrada: 'Usuario autenticado con rol USER', acciones: '1. Iniciar sesión como usuario normal\n2. Acceder a /admin', salidaEsperada: 'Acceso denegado o redirección, mensaje de permisos insuficientes' },
                { entrada: 'Usuario autenticado con rol ADMIN', acciones: '1. Iniciar sesión como admin\n2. Acceder a /admin', salidaEsperada: 'Dashboard administrativo visible con estadísticas y menú de gestión' },
                { entrada: 'Sesión expirada', acciones: '1. Token JWT expirado\n2. Intentar acceder a /admin', salidaEsperada: 'Redirección a login con mensaje de sesión expirada' },
            ]
        },
    ];

    // Crear el documento
    const children = [];

    // Título principal
    children.push(
        new Paragraph({
            children: [new TextRun({ text: 'DOCUMENTO DE PRUEBAS DE CAJA NEGRA', bold: true, size: 36, color: '4472C4' })],
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
        }),
        new Paragraph({
            children: [new TextRun({ text: 'Proyecto: Gráfica Santiago - Plataforma E-commerce de Papelería', size: 24 })],
            alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
            children: [new TextRun({ text: 'Versión: 1.0 | Fecha: 25 de Enero de 2026 | Responsable: Alex Quishpe', size: 20, italics: true })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 600 }
        }),
    );

    // Agregar cada caso
    for (const caso of casos) {
        // Título del caso
        children.push(
            new Paragraph({
                children: [new TextRun({ text: caso.titulo, bold: true, size: 28, color: '4472C4' })],
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 400, after: 200 },
                border: { bottom: { color: '4472C4', size: 6, space: 1, style: BorderStyle.SINGLE } }
            }),
        );

        // Nota de imagen
        children.push(
            new Paragraph({
                children: [new TextRun({ text: `[Captura de pantalla: ${caso.imagen}.png]`, italics: true, color: '888888' })],
                spacing: { after: 200 }
            }),
        );

        // Objetivo
        children.push(
            new Paragraph({
                children: [
                    new TextRun({ text: 'Objetivo: ', bold: true, size: 22 }),
                    new TextRun({ text: caso.objetivo, size: 22 })
                ],
                spacing: { after: 150 }
            }),
        );

        // Requisitos
        children.push(
            new Paragraph({
                children: [new TextRun({ text: 'Requisitos:', bold: true, size: 22 })],
                spacing: { after: 100 }
            }),
        );
        for (const req of caso.requisitos) {
            children.push(
                new Paragraph({
                    children: [new TextRun({ text: `  ✓ ${req}`, size: 20 })],
                    spacing: { after: 50 }
                }),
            );
        }

        // Tabla de casos de prueba
        children.push(
            new Paragraph({
                children: [new TextRun({ text: 'Casos de Prueba:', bold: true, size: 22 })],
                spacing: { before: 200, after: 100 }
            }),
        );

        const tableRows = [
            // Header
            new TableRow({
                children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Entrada', bold: true, color: 'FFFFFF' })] })], shading: { fill: '4472C4' }, width: { size: 25, type: WidthType.PERCENTAGE } }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Acciones', bold: true, color: 'FFFFFF' })] })], shading: { fill: '4472C4' }, width: { size: 25, type: WidthType.PERCENTAGE } }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Salida Esperada', bold: true, color: 'FFFFFF' })] })], shading: { fill: '4472C4' }, width: { size: 25, type: WidthType.PERCENTAGE } }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Salida Real', bold: true, color: 'FFFFFF' })] })], shading: { fill: '4472C4' }, width: { size: 25, type: WidthType.PERCENTAGE } }),
                ],
            }),
        ];

        for (const esc of caso.escenarios) {
            tableRows.push(
                new TableRow({
                    children: [
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: esc.entrada, size: 18 })] })], width: { size: 25, type: WidthType.PERCENTAGE } }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: esc.acciones, size: 18 })] })], width: { size: 25, type: WidthType.PERCENTAGE } }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: esc.salidaEsperada, size: 18 })] })], width: { size: 25, type: WidthType.PERCENTAGE } }),
                        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '', size: 18 })] })], width: { size: 25, type: WidthType.PERCENTAGE } }),
                    ],
                }),
            );
        }

        children.push(
            new Table({
                rows: tableRows,
                width: { size: 100, type: WidthType.PERCENTAGE },
            }),
        );

        // Espacio entre casos
        children.push(new Paragraph({ text: '', spacing: { after: 400 } }));
    }

    const doc = new Document({
        sections: [{
            properties: {},
            children: children,
        }],
    });

    // Guardar el documento
    const buffer = await Packer.toBuffer(doc);
    const outputPath = path.join(__dirname, '..', '..', 'Pruebas_Caja_Negra_Grafica_Santiago.docx');
    fs.writeFileSync(outputPath, buffer);
    console.log('✅ Documento Word generado exitosamente en:', outputPath);
}

generarDocumento().catch(console.error);

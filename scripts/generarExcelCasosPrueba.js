const ExcelJS = require('exceljs');
const path = require('path');

async function generarCasosDePrueba() {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Alex Quishpe';
    workbook.created = new Date();

    // Definir los casos de prueba
    const casosDePrueba = [
        {
            casoUso: 'CU-001: Agregar Producto al Carrito de Compras',
            identificacion: 'CP-001',
            proposito: 'Verificar que un usuario puede agregar productos al carrito de compras correctamente y que el sistema actualiza el stock y totales de manera precisa',
            prerequisitos: '1. El sistema debe estar operativo y accesible\n2. Deben existir productos activos en la base de datos con stock disponible\n3. El usuario puede estar autenticado o ser visitante anónimo',
            responsable: 'Alex Quishpe',
            escenarios: [
                { entrada: 'Usuario accede a la página /productos', acciones: '1. Navegar al catálogo de productos\n2. Seleccionar un producto con stock > 0\n3. Hacer clic en "Agregar al carrito"', salidaEsperada: 'El producto se añade al carrito, aparece notificación de éxito "Producto agregado al carrito", el contador del carrito en el navbar se incrementa en 1' },
                { entrada: 'Usuario en página de detalle de producto /productos/[id] con cantidad = 3', acciones: '1. Ingresar cantidad "3" en el campo de cantidad\n2. Hacer clic en botón "Agregar al carrito"', salidaEsperada: 'El carrito muestra 3 unidades del producto, el subtotal refleja precio × 3, notificación toast confirma la acción' },
                { entrada: 'Usuario intenta agregar cantidad mayor al stock disponible (ej: stock=5, cantidad=10)', acciones: '1. Ingresar cantidad "10"\n2. Hacer clic en "Agregar al carrito"', salidaEsperada: 'El sistema muestra mensaje de error: "Stock insuficiente. Solo hay 5 unidades disponibles", el producto NO se agrega al carrito' },
                { entrada: 'Usuario agrega el mismo producto dos veces', acciones: '1. Agregar producto X (cantidad 2)\n2. Agregar producto X nuevamente (cantidad 1)', salidaEsperada: 'El carrito muestra el producto X con cantidad = 3, NO duplica el producto en líneas separadas, el total se actualiza correctamente' },
            ]
        },
        {
            casoUso: 'CU-002: Registro de Nuevo Usuario',
            identificacion: 'CP-002',
            proposito: 'Verificar que un visitante puede crear una cuenta de usuario correctamente, con validación de datos y opción de solicitud mayorista',
            prerequisitos: '1. El sistema debe estar operativo\n2. El correo electrónico a registrar no debe existir previamente\n3. Acceso a la página /registro',
            responsable: 'Alex Quishpe',
            escenarios: [
                { entrada: 'Datos válidos: nombre="Juan Pérez", email="juan@test.com", teléfono="0991234567", contraseña="Password123"', acciones: '1. Completar todos los campos\n2. Hacer clic en "Crear cuenta"', salidaEsperada: 'Usuario creado exitosamente, redirección a página principal, sesión iniciada automáticamente, notificación de bienvenida' },
                { entrada: 'Email ya registrado: email="admin@graficasantiago.com"', acciones: '1. Ingresar email existente\n2. Completar demás campos\n3. Hacer clic en "Crear cuenta"', salidaEsperada: 'Sistema muestra error: "Este correo electrónico ya está registrado", usuario NO se crea' },
                { entrada: 'Contraseña débil: contraseña="123"', acciones: '1. Ingresar contraseña corta\n2. Intentar crear cuenta', salidaEsperada: 'Sistema muestra error: "La contraseña debe tener al menos 6 caracteres"' },
                { entrada: 'Solicitud mayorista: checkbox activado, razónSocial="Mi Empresa", ruc="1234567890001"', acciones: '1. Activar opción "Solicitar cuenta mayorista"\n2. Completar campos de empresa\n3. Crear cuenta', salidaEsperada: 'Usuario creado con estado "PENDING" y wholesaleRequested=true, mensaje informando que la solicitud será revisada' },
            ]
        },
        {
            casoUso: 'CU-003: Realizar Compra (Checkout)',
            identificacion: 'CP-003',
            proposito: 'Verificar que un usuario autenticado puede completar el proceso de compra con sus productos del carrito',
            prerequisitos: '1. Usuario autenticado\n2. Carrito con al menos 1 producto\n3. Productos con stock suficiente\n4. Dirección de envío registrada o disponible para ingresar',
            responsable: 'Alex Quishpe',
            escenarios: [
                { entrada: 'Carrito con 2 productos, dirección guardada', acciones: '1. Ir a /checkout\n2. Seleccionar dirección existente\n3. Confirmar pedido', salidaEsperada: 'Orden creada con estado "PENDING", stock de productos decrementado, carrito vaciado, redirección a /checkout/exito con número de orden' },
                { entrada: 'Carrito con productos, sin dirección previa', acciones: '1. Ir a checkout\n2. Completar formulario de nueva dirección\n3. Confirmar pedido', salidaEsperada: 'Dirección guardada en perfil de usuario, orden creada correctamente' },
                { entrada: 'Usuario WHOLESALE (mayorista) con carrito', acciones: '1. Proceder al checkout como mayorista', salidaEsperada: 'Los precios mostrados son los precios mayoristas (wholesalePrice), descuento visible en resumen' },
                { entrada: 'Producto sin stock suficiente durante checkout', acciones: '1. Otro usuario compra el último stock\n2. Intentar confirmar pedido', salidaEsperada: 'Sistema muestra error: "Stock insuficiente para [producto]", pedido NO se crea, usuario puede modificar cantidades' },
            ]
        },
        {
            casoUso: 'CU-004: Crear/Editar Producto desde Panel Admin',
            identificacion: 'CP-004',
            proposito: 'Verificar que un administrador puede crear y modificar productos correctamente',
            prerequisitos: '1. Usuario con rol ADMIN autenticado\n2. Acceso al panel /admin/productos\n3. Al menos una categoría existente',
            responsable: 'Alex Quishpe',
            escenarios: [
                { entrada: 'Crear producto: nombre="Cuaderno Nuevo", sku="PAP-100", precio=3.50, stock=50, categoría seleccionada', acciones: '1. Ir a /admin/productos/nuevo\n2. Completar formulario\n3. Guardar', salidaEsperada: 'Producto creado, aparece en listado de productos, visible en catálogo público' },
                { entrada: 'Editar producto existente: cambiar precio de $3.50 a $4.00', acciones: '1. Ir a /admin/productos/[id]\n2. Modificar campo precio\n3. Guardar cambios', salidaEsperada: 'Precio actualizado en BD, reflejado inmediatamente en catálogo público' },
                { entrada: 'SKU duplicado: intentar crear producto con SKU existente', acciones: '1. Ingresar SKU que ya existe\n2. Intentar guardar', salidaEsperada: 'Sistema muestra error: "El SKU ya existe", producto NO se crea' },
                { entrada: 'Eliminar producto', acciones: '1. Seleccionar producto\n2. Confirmar eliminación', salidaEsperada: 'Producto eliminado o marcado como inactivo, desaparece del catálogo público' },
            ]
        },
        {
            casoUso: 'CU-005: Aprobar/Rechazar Solicitud de Cuenta Mayorista',
            identificacion: 'CP-005',
            proposito: 'Verificar que un administrador puede gestionar solicitudes de cuentas mayoristas',
            prerequisitos: '1. Usuario ADMIN autenticado\n2. Al menos una solicitud de mayorista pendiente (usuario con wholesaleRequested=true y status=PENDING)\n3. Acceso a /admin/mayoristas',
            responsable: 'Alex Quishpe',
            escenarios: [
                { entrada: 'Solicitud pendiente de "Empresa ABC"', acciones: '1. Ir a /admin/mayoristas\n2. Revisar datos de la solicitud\n3. Hacer clic en "Aprobar"', salidaEsperada: 'Usuario actualizado a role="WHOLESALE" y status="ACTIVE", usuario ahora ve precios mayoristas al comprar' },
                { entrada: 'Rechazar solicitud', acciones: '1. Seleccionar solicitud\n2. Hacer clic en "Rechazar"', salidaEsperada: 'Usuario mantiene role="CUSTOMER", status="ACTIVE", wholesaleRequested=false, puede seguir comprando como cliente normal' },
                { entrada: 'Mayorista aprobado realiza compra', acciones: '1. Mayorista inicia sesión\n2. Agrega productos al carrito\n3. Va al checkout', salidaEsperada: 'Precios mostrados son wholesalePrice, NO el precio regular, descuento reflejado en total' },
            ]
        },
        {
            casoUso: 'CU-006: Inicio y Cierre de Sesión',
            identificacion: 'CP-006',
            proposito: 'Verificar el correcto funcionamiento del sistema de autenticación',
            prerequisitos: '1. Usuario registrado en el sistema\n2. Acceso a página /login',
            responsable: 'Alex Quishpe',
            escenarios: [
                { entrada: 'Credenciales válidas: email="admin@graficasantiago.com", password="password123"', acciones: '1. Ingresar credenciales\n2. Hacer clic en "Iniciar Sesión"', salidaEsperada: 'Sesión iniciada, cookie JWT generada, redirección a página principal, nombre de usuario visible en navbar' },
                { entrada: 'Credenciales inválidas: password incorrecto', acciones: '1. Ingresar email correcto, contraseña incorrecta\n2. Intentar login', salidaEsperada: 'Mensaje de error: "Credenciales inválidas", sesión NO iniciada' },
                { entrada: 'Usuario con status="SUSPENDED"', acciones: '1. Intentar iniciar sesión', salidaEsperada: 'Error: "Tu cuenta ha sido suspendida. Contacta al administrador"' },
                { entrada: 'Cerrar sesión', acciones: '1. Usuario logueado\n2. Hacer clic en "Cerrar Sesión"', salidaEsperada: 'Cookie eliminada, redirección a home, opciones de admin ya no visibles' },
            ]
        },
    ];

    // Crear una hoja por cada caso de prueba
    for (const caso of casosDePrueba) {
        const sheetName = caso.identificacion;
        const sheet = workbook.addWorksheet(sheetName);

        // Configurar anchos de columna
        sheet.columns = [
            { width: 35 },
            { width: 35 },
            { width: 40 },
            { width: 20 },
        ];

        // Estilos
        const headerStyle = {
            font: { bold: true, size: 14 },
            alignment: { horizontal: 'center', vertical: 'middle' },
            fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } },
            font: { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 }
        };

        const labelStyle = {
            font: { bold: true, size: 11 },
            alignment: { vertical: 'middle' }
        };

        const tableHeaderStyle = {
            font: { bold: true, size: 11 },
            alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
            fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E2F3' } },
            border: {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            }
        };

        const cellStyle = {
            alignment: { vertical: 'top', wrapText: true },
            border: {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            }
        };

        // Título
        sheet.mergeCells('A1:D1');
        const titleCell = sheet.getCell('A1');
        titleCell.value = 'CASOS DE PRUEBA';
        titleCell.font = { bold: true, size: 16 };
        titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
        titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
        titleCell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 14 };
        sheet.getRow(1).height = 30;

        // Información del caso
        const infoRows = [
            ['Caso de uso:', caso.casoUso],
            ['Identificación:', caso.identificacion],
            ['Propósito:', caso.proposito],
            ['Prerequisitos:', caso.prerequisitos],
            ['Responsable:', caso.responsable]
        ];

        let currentRow = 2;
        for (const [label, value] of infoRows) {
            sheet.mergeCells(`B${currentRow}:D${currentRow}`);
            const labelCell = sheet.getCell(`A${currentRow}`);
            labelCell.value = label;
            labelCell.font = { bold: true };
            labelCell.alignment = { vertical: 'top' };

            const valueCell = sheet.getCell(`B${currentRow}`);
            valueCell.value = value;
            valueCell.alignment = { vertical: 'top', wrapText: true };

            sheet.getRow(currentRow).height = label === 'Prerequisitos:' ? 50 : 20;
            currentRow++;
        }

        // Espacio
        currentRow++;

        // Encabezados de la tabla
        const headers = ['Entrada', 'Acciones', 'Salida Esperada', 'Salida Real'];
        headers.forEach((header, index) => {
            const cell = sheet.getCell(currentRow, index + 1);
            cell.value = header;
            cell.font = { bold: true };
            cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E2F3' } };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });
        sheet.getRow(currentRow).height = 25;
        currentRow++;

        // Escenarios
        for (const escenario of caso.escenarios) {
            const row = sheet.getRow(currentRow);

            const cellA = sheet.getCell(currentRow, 1);
            cellA.value = escenario.entrada;
            cellA.alignment = { vertical: 'top', wrapText: true };
            cellA.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

            const cellB = sheet.getCell(currentRow, 2);
            cellB.value = escenario.acciones;
            cellB.alignment = { vertical: 'top', wrapText: true };
            cellB.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

            const cellC = sheet.getCell(currentRow, 3);
            cellC.value = escenario.salidaEsperada;
            cellC.alignment = { vertical: 'top', wrapText: true };
            cellC.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

            const cellD = sheet.getCell(currentRow, 4);
            cellD.value = '';
            cellD.alignment = { vertical: 'top', wrapText: true };
            cellD.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

            row.height = 80;
            currentRow++;
        }
    }

    // Guardar archivo
    const outputPath = path.join(__dirname, '..', 'Casos_de_Prueba_Grafica_Santiago.xlsx');
    await workbook.xlsx.writeFile(outputPath);
    console.log('✅ Archivo Excel generado exitosamente en:', outputPath);
}

generarCasosDePrueba().catch(console.error);

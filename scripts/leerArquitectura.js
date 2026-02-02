const mammoth = require('mammoth');
const path = require('path');

async function leerDocx() {
    const filePath = path.join(__dirname, '..', '..', 'Arquitectura.docx');

    try {
        const result = await mammoth.extractRawText({ path: filePath });
        console.log('=== CONTENIDO DEL DOCUMENTO ===\n');
        console.log(result.value);
        console.log('\n=== FIN DEL DOCUMENTO ===');
    } catch (error) {
        console.error('Error al leer el archivo:', error.message);
    }
}

leerDocx();

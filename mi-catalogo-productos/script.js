// --- CONFIGURACIÓN CON ARCHIVO DE TEXTO ---
const folderPath = 'img/portadas';
const nombresTxtPath = `${folderPath}/nombres.txt`; // Ruta al archivo de texto
const precioFijo = '$15.000';
// ------------------------------------------

const contenedorGrid = document.getElementById('catalogo-grid');

async function cargarCatalogoDesdeTexto() {
    try {
        // 1. Descargamos el archivo de texto
        const response = await fetch(`${nombresTxtPath}?ts=${new Date().getTime()}`);

        if (!response.ok) {
            throw new Error('No se pudo cargar el archivo nombres.txt. Revisa la ruta y el nombre.');
        }

        // 2. Leemos el contenido como texto plano
        const textContent = await response.text();

        // 3. Separamos el texto en líneas (un nombre por línea)
        // Usamos .filter(Boolean) para ignorar líneas vacías
        const nombresDeProductos = textContent.split('\n').filter(Boolean);

        // 4. Procesamos cada nombre
        nombresDeProductos.forEach((nombreLimpio, index) => {
            // El índice + 1 es el número de la imagen (0+1=1, 1+1=2, etc.)
            const numeroImagen = index + 1;
            const nombreArchivo = `${numeroImagen}.jpg`; // Asumimos todas son JPG

            // --- Creación de elementos HTML ---
            const tarjeta = document.createElement('div');
            tarjeta.classList.add('producto-card');

            const imagen = document.createElement('img');
            imagen.src = `${folderPath}/${nombreArchivo}`;
            imagen.alt = nombreLimpio;

            const titulo = document.createElement('h3');
            titulo.textContent = nombreLimpio;

            const precio = document.createElement('p');
            precio.textContent = `Valor ${precioFijo}`;

            tarjeta.appendChild(imagen);
            tarjeta.appendChild(titulo);
            tarjeta.appendChild(precio);
            contenedorGrid.appendChild(tarjeta);
        });

    } catch (error) {
        console.error("Error al cargar el catálogo:", error);
        contenedorGrid.innerHTML = `<p>Error al cargar los productos: ${error.message}</p>`;
    }
}

// Ejecuta la función cuando la página carga
cargarCatalogoDesdeTexto();




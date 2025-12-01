

// --- CONFIGURACIÓN CON ARCHIVO DE TEXTO ---
const folderPortadasPath = 'img/portadas';
const folderHoja1Path = 'img/hoja_1';
const folderHoja2Path = 'img/hoja_2';
const folderContraPortadasPath = 'img/contra_portadas';
const nombresTxtPath = `${folderPortadasPath}/nombres.txt`;

const tiempoInactividad = 6000;                             // 6 segundos de inactividad
const tiempoRetornoAutomatico = 1000;                       // 1 segundo para volver a portada

const precioFijo = '$15.000';


// ------------------------------------------


// Contenedor principal del catálogo
const contenedorGrid = document.getElementById('catalogo-grid');

// Función para cargar la imagen real desde un data-src
const cargarImagenReal = (imgElement, srcPath) => {

    // Si la fuente ya es la que buscamos o ya se ha cargado, no hacemos nada
    if (imgElement.src.includes(srcPath) || imgElement.dataset.loaded === srcPath) {
        return;
    }
    imgElement.src = srcPath;
    // imgElement.dataset.loaded = srcPath; // Opcional: marca como cargada
};


// Función principal para cargar el catálogo desde nombres.txt
async function cargarCatalogoDesdeTexto() {
    // ... (fetch() del nombres.txt) ...
    try {
        const response = await fetch(`${nombresTxtPath}?ts=${new Date().getTime()}`);

        if (!response.ok) {
            throw new Error('No se pudo cargar el archivo nombres.txt.');
        }

        const textContent = await response.text();
        const nombresDeProductos = textContent.split('\n').filter(Boolean);

        nombresDeProductos.forEach((nombreLimpio, index) => {
            const numeroImagen = index + 1;
            const nombreArchivo = `${numeroImagen}.webp`;

            const tarjeta = document.createElement('div');
            tarjeta.classList.add('producto-card');

            // --- IMAGEN (Portadas) ---
            const imagen = document.createElement('img');
            imagen.src = 'img/portadas/placeholder.webp';                           // placeholder
            imagen.dataset.srcPortadas = `${folderPortadasPath}/${nombreArchivo}`;  // URL real portada
            imagen.alt = nombreLimpio;
            imagen.loading = 'lazy';

            // Lazy loading inicial para la portada usando IntersectionObserver
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        cargarImagenReal(entry.target, entry.target.dataset.srcPortadas);
                        obs.unobserve(entry.target);
                    }
                });
            });
            observer.observe(imagen);

            // --- Data-src para otras vistas (no se descargan todavía) ---
            imagen.dataset.srcHoja1 = `${folderHoja1Path}/${nombreArchivo}`;
            imagen.dataset.srcHoja2 = `${folderHoja2Path}/${nombreArchivo}`;
            imagen.dataset.srcContra = `${folderContraPortadasPath}/${nombreArchivo}`;


            // --- Temporizador de inactividad para regresar a la portada ---
            let temporizadorInactividad = null;

            const iniciarTemporizadorInactividad = () => {
                if (temporizadorInactividad) clearTimeout(temporizadorInactividad);

                temporizadorInactividad = setTimeout(() => {
                    if (!imagen.src.includes(folderPortadasPath)) {
                        setTimeout(() => {
                            // --- EFECTO PARA CAMBIO AUTOMÁTICO ---
                            imagen.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
                            imagen.style.transform = 'rotateY(90deg)';
                            imagen.style.opacity = 0.8;

                            setTimeout(() => {
                                // Cambiamos la imagen a la portada
                                cargarImagenReal(imagen, imagen.dataset.srcPortadas);

                                // Volvemos al estado normal con efecto
                                imagen.style.transform = 'rotateY(0deg)';
                                imagen.style.opacity = 1;
                            }, 300); // coincide con la duración de la transición

                            temporizadorInactividad = null;
                        }, tiempoRetornoAutomatico);
                    }
                }, tiempoInactividad);
            };

            // --- Lógica de clic para cambiar vistas de la imagen ---
            imagen.addEventListener('click', () => {

                let nuevaSrc;

                if (imagen.src.includes(folderPortadasPath)) {
                    nuevaSrc = imagen.dataset.srcHoja1;
                } else if (imagen.src.includes(folderHoja1Path)) {
                    nuevaSrc = imagen.dataset.srcHoja2;
                } else if (imagen.src.includes(folderHoja2Path)) {
                    nuevaSrc = imagen.dataset.srcContra;
                } else if (imagen.src.includes(folderContraPortadasPath)) {
                    nuevaSrc = imagen.dataset.srcPortadas;
                }

                if (imagen.src !== nuevaSrc) {
                    // --- EFECTO DE TRANSICIÓN ---
                    imagen.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
                    imagen.style.transform = 'scale(0.85)';
                    imagen.style.opacity = 0.8;

                    setTimeout(() => {

                        cargarImagenReal(imagen, nuevaSrc);
                        imagen.style.transform = 'scale(1.1)';
                        imagen.style.opacity = 1;

                        setTimeout(() => {
                            imagen.style.transform = 'scale(1)';
                        }, 200);
                        
                    }, 200); // coincide con la duración de la transición

                    iniciarTemporizadorInactividad();
                }


            });

            // --- Título y precio del producto ---
            const titulo = document.createElement('h3');
            titulo.textContent = nombreLimpio;

            // Ocultamos el título inicialmente con un estilo inline simple
            titulo.style.opacity = 0; 

            const precio = document.createElement('p');
            precio.textContent = `Valor ${precioFijo}`;

            // Ocultamos el precio inicialmente
            precio.style.opacity = 0;

            tarjeta.appendChild(imagen);
            tarjeta.appendChild(titulo);
            tarjeta.appendChild(precio);
            contenedorGrid.appendChild(tarjeta);

            setTimeout(() => {
                titulo.style.opacity = 1; // Hacemos visible el título después de 200ms
            }, 100);

            setTimeout(() => {
                precio.style.opacity = 1; // Hacemos visible el precio después de 400ms
            }, 100);

        });

    } catch (error) {
        console.error("Error al cargar el catálogo:", error);
        contenedorGrid.innerHTML = `<p>Error al cargar los productos: ${error.message}</p>`;
        contenedorGrid.classList.add('is-loaded'); 
    }
}

cargarCatalogoDesdeTexto();

// --- Modo oscuro ---
const botonModoOscuro = document.getElementById('modo-oscuro-btn');
botonModoOscuro.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    botonModoOscuro.textContent = document.body.classList.contains('dark-mode') ? "☀️" : "🌙";
});


// --- Reducción del header durante scroll ---

const header = document.querySelector('.header');

window.addEventListener('scroll', () => {

        if (window.scrollY > 50) {                      // si se ha scrolleado más de 50px
            header.classList.add('header-small');
        } else {
            header.classList.remove('header-small');
        }
});

// --- Scroll suave para desktop ---

if (window.innerWidth >= 1200) {
    let targetScroll = window.scrollY;

    window.addEventListener('wheel', (e) => {
        e.preventDefault();

        targetScroll += e.deltaY * 0.6;           // velocidad del scroll

        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

        targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));
    }, { passive: false });

    function smoothScroll() {
        const currentScroll = window.scrollY;
        const diff = targetScroll - currentScroll;

        window.scrollBy(0, diff * 0.2);

        requestAnimationFrame(smoothScroll);
    }

    smoothScroll();
}

// --- Música interactiva con el logo ---

const musica = document.getElementById("musica");
const logo = document.querySelector("h1");

let musicaEncendida = false;

logo.addEventListener("click", () => {
    if (!musicaEncendida) {
        musica.volume = 0.5;
        musica.play();
        musicaEncendida = true;
        logo.style.animationDuration = "4s"; // acelera la animación
    } else {
        musica.pause();
        musica.currentTime = 0;
        musicaEncendida = false;
        logo.style.animationDuration = "5s"; // vuelve a la velocidad normal
    }
});

// --- Evitar menú contextual en imágenes ---
document.addEventListener("contextmenu", (e) => {
    if (e.target.tagName === "IMG") {
        e.preventDefault();
    }
});

// --- Evitar que cualquier imagen se pueda arrastrar ---
document.addEventListener("dragstart", (e) => {
    if (e.target.tagName === "IMG") {
        e.preventDefault();
    }
});



const API_URL = 'http://127.0.0.1:8000';

// --- CONTROLES DE LA INTERFAZ DE MODALES ---
function abrirModalAutenticacion() {
    const modal = document.getElementById('modal-auth');
    if (modal) modal.style.display = 'flex';
}

function cerrarModalAutenticacion() {
    const modal = document.getElementById('modal-auth');
    if (modal) modal.style.display = 'none';
}

function abrirModalRegistro() {
    const modal = document.getElementById('modal-registro');
    if (modal) modal.style.display = 'flex';
}

function cerrarModalRegistro() {
    const modal = document.getElementById('modal-registro');
    if (modal) modal.style.display = 'none';
}

function cerrarSesionCliente() {
    localStorage.removeItem('cliente_token');
    localStorage.removeItem('usuario_nombre');
    localStorage.removeItem('carrito_items'); 
    alert("Sesión cerrada.");
    window.location.reload(); 
}

// --- LOGICA DE CARRITO ---
let carrito = JSON.parse(localStorage.getItem('carrito_items')) || [];

function agregarAlCarrito(id, nombre, precio) {
    const token = localStorage.getItem('cliente_token');
    if (!token) {
        alert("⚠️ Debes iniciar sesión para poder agregar productos al carrito.");
        abrirModalAutenticacion();
        return;
    }

    const inputKilos = document.getElementById(`kilos-${id}`);
    const kilos = parseFloat(inputKilos.value);

    if (isNaN(kilos) || kilos <= 0) {
        alert("Por favor, ingresa una cantidad válida de kilos.");
        return;
    }

    const productoExistente = carrito.find(item => item.id === id);
    if (productoExistente) {
        productoExistente.kilos += kilos;
    } else {
        carrito.push({ id, nombre, precio, kilos });
    }

    localStorage.setItem('carrito_items', JSON.stringify(carrito));
    alert(`¡Se agregaron ${kilos} Kg de ${nombre} al carrito!`);
    actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
    const menuCarrito = document.getElementById('menu-privado-carrito');
    if (menuCarrito) {
        const totalProductos = carrito.length; 
        const enlace = menuCarrito.querySelector('a');
        if (enlace) {
            enlace.innerHTML = `🛒 Carrito (${totalProductos})`;
        }
    }
}

// --- CARGA DINÁMICA DE PRODUCTOS ULTRA RESISTENTE ---
async function cargarProductos() {
    const contenedor = document.getElementById('contenedor-productos');
    if (!contenedor) return;

    let res;
    // 🛠️ INTENTO 1: Ruta estándar con prefijo 'api/'
    try {
        res = await fetch(`${API_URL}/api/productos/`);
    } catch (e) {
        // 🛠️ INTENTO 2: Ruta directa (Por si tu urls.py principal no usa prefijo 'api/')
        try {
            res = await fetch(`${API_URL}/productos/`);
        } catch (err) {
            console.error("Error crítico de red:", err);
            contenedor.innerHTML = `<p style="color:red; text-align:center; font-weight:bold;">🛑 No se pudo conectar con el servidor Django. Verifica que esté encendido.</p>`;
            return;
        }
    }

    // Si ambos intentos fallan en responder un HTTP 200 OK
    if (!res || !res.ok) {
        console.error("Django respondió con un error de ruta o código HTTP:", res ? res.status : "Desconocido");
        contenedor.innerHTML = `<p style="color:orange; text-align:center; font-weight:bold;">⚠️ Error ${res ? res.status : ''}: No se encontraron productos. Revisa la consola o las rutas de Django.</p>`;
        return;
    }

    try {
        let datosRaw = await res.json();
        let productos = [];

        // 🛡️ Detectar el formato de Django (Directo o con paginación results)
        if (Array.isArray(datosRaw)) {
            productos = datosRaw;
        } else if (datosRaw && Array.isArray(datosRaw.results)) {
            productos = datosRaw.results;
        } else {
            console.error("El formato recibido de Django no es una lista válida:", datosRaw);
            return;
        }
        
        if (productos.length === 0) {
            contenedor.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #7f8c8d; width: 100%;">
                    <p style="font-size: 1.3rem; font-weight: bold;">🔓 ¡Conexión con Django Exitosa!</p>
                    <p style="font-size: 1.1rem; margin-top: 5px;">Pero actualmente no hay productos registrados en tu base de datos.</p>
                </div>`;
            return;
        }

        // 🌽 1. AGRUPACIÓN POR CATEGORÍA
        const productosPorCategoria = {};
        productos.forEach(p => {
            let catNombre = "Otros Insumos";
            if (p.categoria_nombre && p.categoria_nombre.trim() !== "") {
                catNombre = p.categoria_nombre;
            } else if (p.categoria) {
                if (typeof p.categoria === 'object' && p.categoria.nombre) {
                    catNombre = p.categoria.nombre; 
                } else if (typeof p.categoria === 'string' && p.categoria.trim() !== "") {
                    catNombre = p.categoria;
                } else if (typeof p.categoria === 'number' || !isNaN(p.categoria)) {
                    catNombre = `Categoría General`; 
                }
            }

            if (!productosPorCategoria[catNombre]) productosPorCategoria[catNombre] = [];
            productosPorCategoria[catNombre].push(p);
        });

       // 🎨 2. RENDERIZADO INTERACTIVO (CON ESCUDO PARA IMÁGENES ROTAS)
        let htmlFinal = `<div style="width: 100%; max-width: 1000px; margin: 0 auto; padding: 10px;">`;
        let indice = 0;

        for (const categoria in productosPorCategoria) {
            indice++;
            let categoriaImagen = "https://images.unsplash.com/photo-1595113316349-9fa4ee24f884?w=200&auto=format&fit=crop&q=80"; 
            let categoriaEmoji = "📦"; 
            let nombreMinuscula = categoria.toLowerCase();

            if (nombreMinuscula.includes("maiz") || nombreMinuscula.includes("maíz")) {
                categoriaImagen = "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=200&auto=format&fit=crop&q=80"; 
                categoriaEmoji = "🌽";
            } else if (nombreMinuscula.includes("semilla")) {
                categoriaImagen = "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=200&auto=format&fit=crop&q=80"; 
                categoriaEmoji = "🌱";
            } else if (nombreMinuscula.includes("chile")) {
                categoriaImagen = "https://images.unsplash.com/photo-1588252303782-cb80119cb665?w=200&auto=format&fit=crop&q=80"; 
                categoriaEmoji = "🌶️";
            } else if (nombreMinuscula.includes("fertilizante") || nombreMinuscula.includes("abono")) {
                categoriaImagen = "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=200&auto=format&fit=crop&q=80"; 
                categoriaEmoji = "🌾";
            } else if (nombreMinuscula.includes("herramienta")) {
                categoriaImagen = "https://images.unsplash.com/photo-1530124566582-a61a1275b1ae?w=200&auto=format&fit=crop&q=80"; 
                categoriaEmoji = "🛠️";
            }

            const totalProductos = productosPorCategoria[categoria].length;

            // NUEVO DISEÑO PREMIUM PARA LA BARRA DE CATEGORÍA
            htmlFinal += `
                <div onclick="alternarCategoria(${indice})" style="
                    display: flex; align-items: center; justify-content: space-between;
                    background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; 
                    padding: 14px 24px; margin-bottom: 16px; cursor: pointer; transition: all 0.25s ease;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.03);
                    font-family: 'Poppins', sans-serif;
                " 
                onmouseover="this.style.borderColor='#2e7d32'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 10px 15px -3px rgba(0,0,0,0.05)';" 
                onmouseout="this.style.borderColor='#e2e8f0'; this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 6px -1px rgba(0, 0, 0, 0.03)';"
                >
                    <div style="display: flex; align-items: center; gap: 16px;">
                        <div style="width: 48px; height: 48px; position: relative; border-radius: 50%; overflow: hidden; background: #f1f8e9; display: flex; align-items: center; justify-content: center;">
                            <span style="font-size: 1.5rem; position: absolute; z-index: 1;">${categoriaEmoji}</span>
                            <img src="${categoriaImagen}" style="width: 100%; height: 100%; object-fit: cover; position: absolute; z-index: 2; top: 0; left: 0; opacity: 0.15;" onerror="this.style.display='none';">
                        </div>
                        <div style="text-align: left;">
                            <h2 style="margin: 0; font-size: 1.15rem; color: #1a202c; font-weight: 700; letter-spacing: -0.3px;">${categoria}</h2>
                            <span style="font-size: 0.8rem; color: #4a5568; font-weight: 500; display: inline-block; margin-top: 2px;">${totalProductos} variedades disponibles</span>
                        </div>
                    </div>
                    <div id="contenedor-flecha-${indice}" style="background: #f7fafc; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease;">
                        <span id="flecha-${indice}" style="font-size: 0.75rem; color: #718096; transition: transform 0.3s ease; font-weight: bold;">▼</span>
                    </div>
                </div>

                <div id="categoria-bloque-${indice}" style="display: none; width: 100%; overflow: hidden; margin-bottom: 30px; padding: 10px 5px;">
                    <div style="display: flex; flex-wrap: wrap; gap: 25px; justify-content: flex-start; padding: 10px 0;">`;

            htmlFinal += productosPorCategoria[categoria].map(p => {
                const precio = p.precio_por_kilo || p.precio || 0;
                const stock = p.stock_disponible_kilos || p.stock || 0;
                const imagen = p.imagen_url || p.imagen || 'https://via.placeholder.com/150';

                // Retornamos la estructura premium vinculada a las nuevas clases de CSS
                return `
                <div class="tarjeta-producto">
                    <div>
                        <img src="${imagen}" width="100%" height="150" style="object-fit: cover; border-radius: 8px;" onerror="this.onerror=null; this.src='https://via.placeholder.com/150';">
                        <h3>${p.nombre || 'Producto'}</h3>
                        
                        <div class="producto-estrellas">⭐⭐⭐⭐⭐ <span>(15 reseñas)</span></div>
                        
                        <p>$${precio} <span>/ Kg</span></p>
                    </div>
                    
                    <div>
                        <div class="selector-kilos">
                            <label>Cantidad:</label>
                            <div style="display: flex; align-items: center; gap: 4px;">
                                <input type="number" id="kilos-${p.id}" value="1" min="1" max="${stock}">
                                <span style="font-size: 0.85rem; color: #718096; font-weight: bold;">Kg</span>
                            </div>
                        </div>
                        <button class="btn-agregar-carrito" onclick="agregarAlCarrito(${p.id}, '${p.nombre || ''}', ${precio})">
                            Agregar al carrito 🛒
                        </button>
                    </div>
                </div>`;
            }).join('');

            htmlFinal += `</div></div>`;
        }

        htmlFinal += `</div>`;
        contenedor.innerHTML = htmlFinal;

    } catch (error) {
        console.error("Error al procesar JSON:", error);
    }
}

// 🔄 FUNCIÓN PARA MOSTRAR U OCULTAR CATEGORÍAS
function alternarCategoria(indice) {
    const bloque = document.getElementById(`categoria-bloque-${indice}`);
    const flecha = document.getElementById(`flecha-${indice}`);
    
    if (bloque && (bloque.style.display === "none" || bloque.style.display === "")) {
        bloque.style.display = "block";
        if (flecha) flecha.style.transform = "rotate(180deg)"; 
    } else if (bloque) {
        bloque.style.display = "none";
        if (flecha) flecha.style.transform = "rotate(0deg)";   
    }
}

// 🚀 DISPARADOR MAESTRO AUTOMÁTICO SEGURO
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", cargarProductos);
} else {
    cargarProductos();
}
// --- LÓGICA DE LOGIN Y REGISTRO CON DJANGO ---

// Manejar Login
document.getElementById('form-login-modal').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = document.getElementById('modal-username').value;
    const password = document.getElementById('modal-password').value;

    try {
        const response = await fetch(`${API_URL}/api/login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('cliente_token', data.token);
            localStorage.setItem('usuario_nombre', data.nombre || username);
            alert("¡Bienvenido de nuevo!");
            window.location.reload(); 
        } else {
            alert("Error: " + (data.error || "Usuario o contraseña incorrectos"));
        }
    } catch (err) {
        console.error("Error:", err);
        alert("No se pudo conectar al servidor. Asegúrate de que Django esté corriendo.");
    }
});

// Manejar Registro (Opcional, si también quieres que funcione)
document.getElementById('form-registro-modal').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const datosRegistro = {
        username: document.getElementById('reg-username').value,
        password: document.getElementById('reg-password').value,
        nombre: document.getElementById('reg-nombre').value,
        apellido: document.getElementById('reg-apellido').value,
        correo: document.getElementById('reg-correo').value
    };

    try {
        const response = await fetch(`${API_URL}/api/registro/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosRegistro)
        });

        if (response.ok) {
            alert("¡Registro exitoso! Ya puedes iniciar sesión.");
            cerrarModalRegistro();
            abrirModalAutenticacion();
        } else {
            alert("Error al registrar. Verifica los campos.");
        }
    } catch (err) {
        console.error("Error:", err);
    }
});
// --- LÓGICA DE PROCESAR COMPRA ---
async function procesarCompra() {
    const carrito = JSON.parse(localStorage.getItem('carrito_items') || '[]');
    const token = localStorage.getItem('cliente_token');

    if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    // Preparamos los datos para que Django los entienda
    const itemsParaEnviar = carrito.map(item => ({
        producto_id: item.id,
        cantidad_kilos: item.kilos
    }));

    try {
        const response = await fetch(`${API_URL}/api/procesar-pago/`, {
            method: 'POST',
            headers: { 
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ 
                items: itemsParaEnviar,
                metodo_pago: 'EFECTIVO' 
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert("¡Compra realizada con éxito! Pedido #" + data.pedido_id);
            localStorage.removeItem('carrito_items'); // Limpiamos el carrito
            window.location.href = 'perfil.html'; // Enviamos al usuario a ver su historial
        } else {
            alert("Error: " + (data.error || "No se pudo procesar el pago."));
        }
    } catch (err) {
        console.error("Error:", err);
        alert("Hubo un problema al conectar con el servidor para procesar tu pago.");
    }
}
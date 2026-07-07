const API_URL = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost' 
    ? 'http://127.0.0.1:8000' 
    : 'https://proyecto-maiz.onrender.com';

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
    const kilos = inputKilos ? parseFloat(inputKilos.value) : 1;

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

// --- CARGA DINÁMICA DE PRODUCTOS ---
async function cargarProductos() {
    const contenedor = document.getElementById('contenedor-productos');
    if (!contenedor) return;

    try {
        const res = await fetch(`${API_URL}/api/productos/`);
        if (!res.ok) throw new Error("Error en la respuesta del servidor");
        
        let datosRaw = await res.json();
        let productos = Array.isArray(datosRaw) ? datosRaw : (datosRaw.results || []);

        if (productos.length === 0) {
            contenedor.innerHTML = `<p style="text-align:center;">No hay productos disponibles.</p>`;
            return;
        }

        // Renderizado simplificado
        contenedor.innerHTML = productos.map(p => `
            <div class="tarjeta-producto">
                <h3>${p.nombre}</h3>
                <p>$${p.precio_por_kilo || p.precio} / Kg</p>
                <input type="number" id="kilos-${p.id}" value="1" min="1">
                <button onclick="agregarAlCarrito(${p.id}, '${p.nombre}', ${p.precio_por_kilo || p.precio})">Agregar</button>
            </div>
        `).join('');

    } catch (error) {
        console.error("Error al cargar productos:", error);
    }
}

// --- LÓGICA DE FORMULARIOS (CON PROTECCIÓN) ---
document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
    actualizarContadorCarrito();

    const formLogin = document.getElementById('form-login-modal');
    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('modal-username').value;
            const password = document.getElementById('modal-password').value;
            
            const response = await fetch(`${API_URL}/api/login/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('cliente_token', data.token);
                window.location.reload();
            } else {
                alert("Error: " + (data.error || "Login fallido"));
            }
        });
    }

    const formRegistro = document.getElementById('form-registro-modal');
    if (formRegistro) {
        formRegistro.addEventListener('submit', async (e) => {
            e.preventDefault();
            alert("Función de registro activada.");
            // ... resto de tu lógica de registro
        });
    }
});

// --- LÓGICA DE PROCESAR COMPRA ---
async function procesarCompra() {
    const token = localStorage.getItem('cliente_token');
    if (!token) { alert("Inicia sesión primero"); return; }
    // ... tu lógica de fetch para procesar pago
}
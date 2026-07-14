alert("¡app.js se está ejecutando!");
console.log("El archivo app.js cargó correctamente");

const API_URL = window.location.hostname === "proyecto-maiz.onrender.com" 
    ? "https://proyecto-maiz.onrender.com" 
    : "http://127.0.0.1:8000";

// Funciones globales para que el HTML pueda verlas
window.abrirModalAutenticacion = function() {
    const modal = document.getElementById('modal-auth');
    if (modal) modal.style.display = 'flex';
};

window.abrirModalRegistro = function() {
    const modal = document.getElementById('modal-registro');
    if (modal) modal.style.display = 'flex';
};

window.cerrarSesionCliente = function() {
    localStorage.removeItem('cliente_token');
    localStorage.removeItem('usuario_nombre');
    location.reload();
};

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById('contenedor-tienda')) {
        cargarProductos();
    }
});
async function cargarProductos() {
    const contenedor = document.getElementById('contenedor-tienda');
    if (!contenedor) return;
    
    try {
        console.log("Intentando obtener productos desde:", `${API_URL}/api/productos-agrupados/`);
        const res = await fetch(`${API_URL}/api/productos-agrupados/`);
        const data = await res.json();
        
        console.log("Datos recibidos del servidor:", data); // <--- ESTO ES LO MÁS IMPORTANTE
        
        if (Object.keys(data).length === 0) {
            contenedor.innerHTML = '<p>No hay productos disponibles.</p>';
            return;
        }

        contenedor.innerHTML = '';
        // ... (resto del código de renderizado)
    } catch (e) {
        console.error("Error crítico en cargarProductos:", e);
    }
}
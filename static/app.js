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
    try {
        const res = await fetch(`${API_URL}/api/productos-agrupados/`);
        const data = await res.json();
        contenedor.innerHTML = '';
        
        for (const categoria in data) {
            const header = document.createElement('div');
            header.innerHTML = `<h2>${categoria}</h2>`;
            contenedor.appendChild(header);
            
            const grid = document.createElement('div');
            grid.className = 'productos-grid';
            
            data[categoria].forEach(p => {
                const prodDiv = document.createElement('div');
                prodDiv.className = 'tarjeta-producto';
                prodDiv.innerHTML = `
                    <h3>${p.nombre}</h3>
                    <p>$${p.precio_por_kilo}/Kg</p>
                    <button onclick="agregarAlCarrito(${p.id})">Agregar</button>
                `;
                grid.appendChild(prodDiv);
            });
            contenedor.appendChild(grid);
        }
    } catch (e) {
        console.error("Error al cargar productos", e);
    }
}
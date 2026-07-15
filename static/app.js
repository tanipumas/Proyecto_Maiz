// 1. PRIMERO: Definimos las variables y funciones
const API_URL = window.location.hostname === "proyecto-maiz.onrender.com" 
    ? "https://proyecto-maiz.onrender.com" 
    : "http://127.0.0.1:8000";

window.abrirModalAutenticacion = function() {
    const modal = document.getElementById('modal-auth');
    if (modal) modal.style.display = 'flex';
};

window.abrirModalRegistro = function() {
    const modal = document.getElementById('modal-registro');
    if (modal) modal.style.display = 'flex';
};

async function cargarProductos() {
    const contenedor = document.getElementById('contenedor-tienda');
    if (!contenedor) return;
    
    try {
        const res = await fetch(`${API_URL}/api/productos-agrupados/`);
        const data = await res.json();
        
        contenedor.innerHTML = ''; 
        
        for (const categoria in data) {
            // 1. Crear encabezado de categoría
            const seccion = document.createElement('div');
            seccion.className = 'categoria-header';
            seccion.innerHTML = `<h2>${categoria} <span>▼</span></h2>`;
            
            // 2. Crear contenedor grid (oculto por defecto según tu CSS)
            const grid = document.createElement('div');
            grid.className = 'productos-grid'; 
            
            // 3. Llenar productos
            data[categoria].forEach(p => {
                const prodDiv = document.createElement('div');
                prodDiv.className = 'tarjeta-producto';
                prodDiv.innerHTML = `
                    <h3>${p.nombre}</h3>
                    <p>$${p.precio_por_kilo}/Kg</p>
                    <button class="btn-agregar-carrito">Agregar</button>
                `;
                grid.appendChild(prodDiv);
            });

            // 4. Lógica de despliegue al hacer clic
            seccion.addEventListener('click', () => {
                grid.classList.toggle('active');
                // Opcional: rotar la flechita
                const span = seccion.querySelector('span');
                span.innerText = grid.classList.contains('active') ? '▲' : '▼';
            });

            contenedor.appendChild(seccion);
            contenedor.appendChild(grid);
        }
    } catch (e) {
        console.error("Error al cargar productos", e);
    }
}

// 2. DESPUÉS: Ejecutamos el listener cuando todo está cargado
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM listo");

    const contenedor = document.getElementById('contenedor-tienda');
    if (contenedor) {
        cargarProductos();
    }

    const btnLogin = document.getElementById('btn-nav-login');
    if (btnLogin) {
        btnLogin.addEventListener('click', () => window.abrirModalAutenticacion());
    }
});
window.pruebaLoginDirecto = async function() {
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
            // Guardamos el token y el nombre
            localStorage.setItem('cliente_token', data.token);
            localStorage.setItem('usuario_nombre', data.nombre);
            alert("¡Bienvenido!");
            window.location.reload(); // Recarga para actualizar el menú
        } else {
            alert(data.error || "Error al iniciar sesión");
        }
    } catch (error) {
        console.error("Error crítico:", error);
        alert("No se pudo conectar al servidor.");
    }
};
const API_URL = window.location.hostname === '127.0.0.1' ? 'http://127.0.0.1:8000' : 'https://proyecto-maiz.onrender.com';

document.addEventListener("DOMContentLoaded", () => {
    // 1. Cargar productos si estamos en la tienda
    if (document.getElementById('contenedor-productos')) {
        cargarProductos();
    }

    // 2. Manejo de Login (Solo si el formulario existe en la página)
    const loginForm = document.getElementById('form-login-modal');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('modal-username').value;
            const password = document.getElementById('modal-password').value;
            
            try {
                const res = await fetch(`${API_URL}/api/login/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                const data = await res.json();
                if (res.ok) {
                    localStorage.setItem('cliente_token', data.token);
                    window.location.reload();
                } else { alert("Error: " + (data.error || "Login fallido")); }
            } catch (err) { alert("Error de conexión"); }
        });
    }
});

async function cargarProductos() {
    const contenedor = document.getElementById('contenedor-productos');
    try {
        const res = await fetch(`${API_URL}/api/productos/`);
        const productos = await res.json();
        
        // Agrupar por categoría
        const porCategoria = productos.reduce((acc, p) => {
            const cat = p.categoria_nombre || "General";
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(p);
            return acc;
        }, {});

        contenedor.innerHTML = Object.keys(porCategoria).map(cat => `
            <div class="categoria">
                <h2>${cat}</h2>
                <div class="productos-grid">
                    ${porCategoria[cat].map(p => `
                        <div class="tarjeta-producto">
                            <h3>${p.nombre}</h3>
                            <p>$${p.precio}/Kg</p>
                            <button onclick="alert('Producto: ${p.nombre}')">Agregar</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    } catch (e) { contenedor.innerHTML = "Error cargando productos."; }
}
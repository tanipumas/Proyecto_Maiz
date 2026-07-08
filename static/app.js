// Usamos var o verificamos si ya existe para evitar el error de declaración
if (typeof API_URL === 'undefined') {
    var API_URL = window.location.hostname === '127.0.0.1' ? 'http://127.0.0.1:8000' : 'https://proyecto-maiz.onrender.com';

    // Funciones globales para que el HTML pueda encontrarlas

    window.abrirModalAutenticacion = function() {
    const modal = document.getElementById('modal-auth');
    if (modal) {
        modal.classList.add('active'); // Esto es suficiente
    }
};

window.cerrarModalAutenticacion = function() {
    const modal = document.getElementById('modal-auth');
    if (modal) {
        modal.classList.remove('active'); // Esto es suficiente
    }
};

    window.abrirModalRegistro = function() {
        const m = document.getElementById('modal-registro');
        if (m) m.style.display = 'flex';
    };

    window.cerrarModalRegistro = function() {
        const m = document.getElementById('modal-registro');
        if (m) m.style.display = 'none';
    };

    document.addEventListener("DOMContentLoaded", () => {
        // Cargar productos
        if (document.getElementById('contenedor-productos')) cargarProductos();

        // Manejo de Login
        // Manejo de Login
const loginForm = document.getElementById('form-login-modal');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = loginForm.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        
        // Feedback visual de carga
        btn.textContent = "Cargando...";
        btn.disabled = true;

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
                window.location.reload(); // Recarga y el usuario ya estará logueado
            } else {
                alert(data.error || "Error al iniciar sesión");
                btn.textContent = originalText;
                btn.disabled = false;
            }
        } catch (error) {
            console.error("Error:", error);
            alert("No se pudo conectar con el servidor.");
            btn.textContent = originalText;
            btn.disabled = false;
        }
    });
}
    });

    async function cargarProductos() {
        const contenedor = document.getElementById('contenedor-productos');
        try {
            const res = await fetch(`${API_URL}/api/productos/`);
            const productos = await res.json();
            
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
                                <p>$${p.precio_por_kilo}/Kg</p>
                                <button onclick="alert('Producto: ${p.nombre}')">Agregar</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('');
        } catch (e) { console.error(e); }
    }
}
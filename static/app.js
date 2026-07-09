// 1. CONFIGURACIÓN GLOBAL
if (typeof API_URL === 'undefined') {
    var API_URL = window.location.hostname === '127.0.0.1' ? 'http://127.0.0.1:8000' : 'https://proyecto-maiz.onrender.com';
}

// 2. FUNCIONES DE MODALES
window.abrirModalAutenticacion = function() {
    const modal = document.getElementById('modal-auth');
    if (modal) modal.style.display = 'flex';
};

window.cerrarModalAutenticacion = function() {
    const modal = document.getElementById('modal-auth');
    if (modal) modal.style.display = 'none';
};

window.abrirModalRegistro = function() {
    const m = document.getElementById('modal-registro');
    if (m) m.style.display = 'flex';
};

window.cerrarModalRegistro = function() {
    const m = document.getElementById('modal-registro');
    if (m) m.style.display = 'none';
};

// 3. LÓGICA PRINCIPAL AL CARGAR LA PÁGINA
document.addEventListener("DOMContentLoaded", function() {
    // Cargar productos si estamos en la tienda
    if (document.getElementById('contenedor-tienda')) {
        cargarProductos();
    }

    // Lógica de Login
    const loginForm = document.getElementById('form-login-modal');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const btn = loginForm.querySelector('button[type="submit"]');
            const username = document.getElementById('modal-username').value;
            const password = document.getElementById('modal-password').value;
            
            const originalText = btn.textContent;
            btn.textContent = "Validando...";
            btn.disabled = true;

            try {
                const res = await fetch(`${API_URL}/api/login/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                
                const data = await res.json();
                
                if (res.ok) {
                    localStorage.setItem('cliente_token', data.token);
                    localStorage.setItem('usuario_nombre', data.nombre);
                    window.location.reload(); 
                } else {
                    alert(data.error || "Usuario o contraseña incorrectos.");
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

// 4. CARGAR PRODUCTOS
async function cargarProductos() {

    Object.keys(data).forEach(categoria => {
    // 1. Crear el encabezado clicable
    const header = document.createElement('div');
    header.className = 'categoria-header';
    header.innerHTML = `<h2>${categoria} <span>▼</span></h2>`;
    
    // 2. Crear el grid
    const grid = document.createElement('div');
    grid.className = 'productos-grid';
    
    // 3. Agregar evento de clic para mostrar/ocultar
    header.onclick = () => {
        grid.classList.toggle('active');
        header.querySelector('span').textContent = grid.classList.contains('active') ? '▲' : '▼';
    };

    // 4. Llenar el grid
    data[categoria].forEach(p => {
        grid.innerHTML += `
            <div class="tarjeta-producto">
                <img src="${p.imagen}" alt="${p.nombre}" style="width:100px;">
                <h3>${p.nombre}</h3>
                <p>$${p.precio_por_kilo}/Kg</p>
                <button class="btn-agregar-carrito" onclick="agregarAlCarrito(${p.id})">Agregar</button>
            </div>
        `;
    });

    // 5. Añadir al contenedor principal
    contenedor.appendChild(header);
    contenedor.appendChild(grid);
});
    try {
        const res = await fetch(`${API_URL}/api/productos-agrupados/`);
        const data = await res.json();
        const contenedor = document.getElementById('contenedor-tienda');
        
        if (!contenedor) return;
        contenedor.innerHTML = '';

        Object.keys(data).forEach(categoria => {
            const titulo = document.createElement('h2');
            titulo.textContent = categoria;
            contenedor.appendChild(titulo);

            const grid = document.createElement('div');
            grid.className = 'productos-grid';
            
            data[categoria].forEach(p => {
                grid.innerHTML += `
                    <div class="tarjeta-producto">
                        <img src="${p.imagen}" alt="${p.nombre}" style="width:100px;">
                        <h3>${p.nombre}</h3>
                        <p>$${p.precio_por_kilo}/Kg</p>
                        <button class="btn-agregar-carrito" onclick="agregarAlCarrito(${p.id})">Agregar</button>
                    </div>
                `;
            });
            contenedor.appendChild(grid);
        });
    } catch (error) {
        console.error("Error al cargar productos:", error);
    }
}
// Detecta automáticamente el entorno
const API_URL = window.location.hostname === "proyecto-maiz.onrender.com" 
    ? "https://proyecto-maiz.onrender.com" 
    : "https://127.0.0.1:8000";

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById('contenedor-tienda')) {
        cargarProductos();
    }
});

async function cargarProductos() {
    const contenedor = document.getElementById('contenedor-tienda');
    try {
        const res = await fetch(`${API_URL}/api/productos-agrupados/`);
        if (!res.ok) throw new Error("Error al obtener productos");
        const data = await res.json();
        
        contenedor.innerHTML = '';
        Object.keys(data).forEach(categoria => {
            const header = document.createElement('div');
            header.className = 'categoria-header';
            header.innerHTML = `<h2>${categoria} <span>▲</span></h2>`;
            
            const grid = document.createElement('div');
            grid.className = 'productos-grid active';
            
            header.onclick = () => {
                grid.classList.toggle('active');
                header.querySelector('span').textContent = grid.classList.contains('active') ? '▲' : '▼';
            };

            data[categoria].forEach(p => {
                const prodDiv = document.createElement('div');
                prodDiv.className = 'tarjeta-producto';
                // Concatenación dinámica para la imagen
                let srcImagen = p.imagen ? (p.imagen.startsWith('http') ? p.imagen : `${API_URL}${p.imagen}`) : "";

                prodDiv.innerHTML = `
                    ${srcImagen ? `<img src="${srcImagen}" alt="${p.nombre}" style="width:100px;">` : '<p>Sin imagen</p>'}
                    <h3>${p.nombre}</h3>
                    <p>$${p.precio_por_kilo}/Kg</p>
                    <button class="btn-agregar-carrito" onclick="agregarAlCarrito(${p.id})">Agregar</button>
                `;
                grid.appendChild(prodDiv);
            });
            contenedor.appendChild(header);
            contenedor.appendChild(grid);
        });
    } catch (error) {
        console.error(error);
        contenedor.innerHTML = '<p>Error al cargar la tienda.</p>';
    }
}

// Lógica de Login simplificada y robusta
async function intentarLogin() {
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
            localStorage.setItem('usuario_nombre', data.nombre);
            alert(`¡Bienvenido, ${data.nombre}!`);
            location.reload();
        } else {
            alert(data.error || "Credenciales incorrectas");
        }
    } catch (error) {
        alert("Error de conexión con el servidor.");
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const btnLogin = document.getElementById('btn-login');
    if (btnLogin) {
        btnLogin.addEventListener('click', abrirModalAutenticacion);
    }
});
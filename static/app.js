const API_URL = "https://proyecto-maiz.onrender.com";

document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM cargado.");
    if (document.getElementById('contenedor-tienda')) {
        cargarProductos();
    }
});

async function cargarProductos() {
    const contenedor = document.getElementById('contenedor-tienda');
    let data = null;

    try {
        console.log("Fetching a:", `${API_URL}/api/productos-agrupados/`);
        const res = await fetch(`${API_URL}/api/productos-agrupados/`);
        
        if (!res.ok) throw new Error(`Error ${res.status}`);

        data = await res.json();
        console.log("Datos recibidos:", data);

        contenedor.innerHTML = '';

        if (!data || Object.keys(data).length === 0) {
            contenedor.innerHTML = '<p>No hay productos disponibles.</p>';
            return;
        }

        Object.keys(data).forEach(categoria => {
            const header = document.createElement('div');
            header.className = 'categoria-header';
            header.innerHTML = `<h2>${categoria} <span>▼</span></h2>`;
            
            const grid = document.createElement('div');
            grid.className = 'productos-grid active'; // Iniciamos como active para que se vean
            
            header.onclick = () => {
                grid.classList.toggle('active');
                header.querySelector('span').textContent = grid.classList.contains('active') ? '▲' : '▼';
            };

            data[categoria].forEach(p => {
                const prodDiv = document.createElement('div');
                prodDiv.className = 'tarjeta-producto';

                // Lógica robusta para imágenes
                let srcImagen = "";
                if (p.imagen) {
                    // Si p.imagen ya contiene 'http', es una URL completa (ej. Cloudinary).
                    // Si no, concatenamos la URL base.
                    srcImagen = p.imagen.startsWith('http') ? p.imagen : `${API_URL}${p.imagen}`;
                } else {
                    srcImagen = "https://via.placeholder.com/150?text=Sin+Imagen";
                }

                prodDiv.innerHTML = `
                    <img src="${srcImagen}" alt="${p.nombre}" style="width:100px;">
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
        console.error("Error capturado:", error);
        contenedor.innerHTML = '<p>Error al cargar la tienda.</p>';
    }
}

function agregarAlCarrito(productoId) {
    console.log("Agregando al carrito el producto ID:", productoId);
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.push(productoId);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    alert("Producto agregado al carrito");
}

function abrirModalAutenticacion() {
    const modal = document.getElementById('modal-auth');
    if (modal) {
        modal.style.display = 'block';
    } else {
        console.log("El modal de autenticación aún no está programado o no existe en el HTML");
    }
}

function abrirModalRegistro() {
    const modal = document.getElementById('modal-registro');
    if (modal) {
        modal.style.display = 'block';
    }
}
// Manejador para el inicio de sesión
document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('form-login-modal');
    
    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault(); // Esto evita que la página se recargue

            const username = document.getElementById('modal-username').value;
            const password = document.getElementById('modal-password').value;

            try {
                const response = await fetch(`${API_URL}/api/login/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (response.ok) {
                    // Guardamos la información en el navegador
                    localStorage.setItem('cliente_token', data.token);
                    localStorage.setItem('usuario_nombre', data.nombre);
                    
                    alert("¡Bienvenido, " + data.nombre + "!");
                    location.reload(); // Recargamos para que aparezca el menú de perfil
                } else {
                    alert("Error: " + (data.error || "Credenciales incorrectas"));
                }
            } catch (error) {
                console.error("Error al conectar:", error);
                alert("No se pudo conectar con el servidor. Intenta de nuevo.");
            }
        });
    }
});
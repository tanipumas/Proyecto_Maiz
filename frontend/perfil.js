// Variable global para guardar los pedidos que regrese Django
let misPedidos = [];

// 1. CARGAR LOS PEDIDOS DESDE EL BACKEND AL ENTRAR A LA PÁGINA
async function cargarHistorialPedidos() {
    const token = localStorage.getItem('cliente_token'); // 👈 CORREGIDO: Ajustado al formato de app.js
    const contenedor = document.getElementById('contenedor-historial');
    
    if (!token) {
        if (contenedor) {
            contenedor.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <p style="color: #dc3545; font-weight: bold;">No has iniciado sesión.</p>
                    <p>Por favor, ingresa con tu cuenta en la página principal para ver tus compras.</p>
                </div>
            `;
        }
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:8000/api/historial/', {
            method: 'GET',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            misPedidos = await response.json();
            renderizarPedidos(misPedidos); 
        } else {
            if (contenedor) contenedor.innerHTML = '<p>Error al obtener tus pedidos del servidor.</p>';
        }
    } catch (error) {
        console.error("Error de conexión:", error);
        if (contenedor) contenedor.innerHTML = '<p>No se pudo conectar con el servidor backend.</p>';
    }
}

// 2. DIBUJAR LAS TARJETAS DE LOS PEDIDOS DINÁMICAMENTE
function renderizarPedidos(pedidosAVisualizar) {
    const contenedor = document.getElementById('contenedor-historial');
    if (!contenedor) return;

    contenedor.innerHTML = ''; 

    if (pedidosAVisualizar.length === 0) {
        contenedor.innerHTML = '<p style="color: #666; font-style: italic; text-align: center; padding: 20px;">No se encontraron registros de pedidos bajo este estatus.</p>';
        return;
    }

    pedidosAVisualizar.forEach(pedido => {
        const tarjeta = document.createElement('div');
        
        let claseEstatus = 'status-pendiente';
        const estatusUpper = pedido.estatus.toUpperCase();
        
        if (estatusUpper.includes('PROCESO') || estatusUpper.includes('BODEGA')) {
            claseEstatus = 'status-proceso';
        } else if (estatusUpper.includes('ENTREGADO')) {
            claseEstatus = 'status-entregado';
        } else if (estatusUpper.includes('CANCELADO')) {
            claseEstatus = 'status-cancelado';
        }

        tarjeta.className = `tarjeta-pedido ${claseEstatus}`;

        let productosHTML = '<ul>';
        pedido.items.forEach(item => {
            productosHTML += `<li><strong>${item.kilos} Kg</strong> de ${item.producto} — ($${item.precio_unitario}/Kg)</li>`;
        });
        productosHTML += '</ul>';

        tarjeta.innerHTML = `
            <div class="pedido-header">
                <span>Pedido #${pedido.id}</span>
                <span class="badge-estatus">${pedido.estatus}</span>
            </div>
            <div>
                ${productosHTML}
                <p style="margin: 5px 0; font-size: 0.9em; color: #666;"><strong>Método de pago:</strong> ${pedido.metodo_pago}</p>
                <p style="margin: 5px 0; font-size: 0.85em; color: #999;">Fecha de compra: ${pedido.fecha}</p>
                <div class="pedido-total">Total: $${parseFloat(pedido.total).toFixed(2)}</div>
            </div>
        `;
        contenedor.appendChild(tarjeta);
    });
}

// 3. FILTRAR Y CLASIFICAR LAS TARJETAS AL HACER CLIC EN LOS BOTONES
function filtrarPedidos(estatusClave) {
    if (estatusClave === 'TODOS') {
        renderizarPedidos(misPedidos); 
    } else {
        const filtrados = misPedidos.filter(p => {
            const estatusUpper = p.estatus.toUpperCase();
            if (estatusClave === 'PROCESO') {
                return estatusUpper.includes('PROCESO') || estatusUpper.includes('BODEGA');
            }
            return estatusUpper.includes(estatusClave);
        });
        renderizarPedidos(filtrados);
    }
}

// 4. PROCESAR EL CAMBIO DE CONTRASEÑA CON LA API
async function procesarCambioPassword(event) {
    event.preventDefault(); 
    
    const token = localStorage.getItem('cliente_token'); // 👈 CORREGIDO: Ajustado al formato de app.js
    const oldPassword = document.getElementById('pass-actual').value;
    const newPassword = document.getElementById('pass-nueva').value;

    if (!token) {
        alert("Debes estar logueado para cambiar la contraseña.");
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:8000/api/cambiar-password/', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                old_password: oldPassword,
                new_password: newPassword
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert("¡Contraseña actualizada con éxito!");
            document.getElementById('form-cambiar-pass').reset(); 
        } else {
            alert(data.error || "Error al actualizar contraseña.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error de red, no se pudo contactar al servidor.");
    }
}

document.addEventListener('DOMContentLoaded', cargarHistorialPedidos);
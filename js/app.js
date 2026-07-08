/**
 * ======================================================
 * APLICACIÓN - MI COMEDOR
 * Curso: Programación Web - 5to Ciclo
 * Fecha: Julio 2026
 * ======================================================
 */

// ======================================================
// 1. BASE DE DATOS EN MEMORIA (SIMULACIÓN)
// ======================================================

/**
 * Datos iniciales de beneficiarios
 */
let beneficiarios = [
    { id: 1, nombre: 'María', apellidos: 'Gonzales', dni: '12345678', tipo: 'Adulto Mayor', telefono: '999888777', direccion: 'Av. Huancayo 123' },
    { id: 2, nombre: 'Juan', apellidos: 'Pérez', dni: '87654321', tipo: 'Familia en Situación Vulnerable', telefono: '999777666', direccion: 'Calle Real 456' },
    { id: 3, nombre: 'Ana', apellidos: 'Martínez', dni: '45678912', tipo: 'Niño', telefono: '999666555', direccion: 'Jr. Lima 789' },
    { id: 4, nombre: 'Carlos', apellidos: 'Huamán', dni: '78912345', tipo: 'Adulto Mayor', telefono: '999555444', direccion: 'Urb. San Carlos' },
    { id: 5, nombre: 'Rosa', apellidos: 'Quispe', dni: '32165498', tipo: 'Madre Gestante', telefono: '999444333', direccion: 'A.H. Nueva Esperanza' }
];

/**
 * Datos iniciales de donaciones
 */
let donaciones = [
    { id: 1, tipo: 'alimento', descripcion: 'Arroz 50kg', cantidad: 50, unidad: 'kg', donante: 'Supermercado Plaza', fecha: '2026-07-01' },
    { id: 2, tipo: 'dinero', descripcion: 'Donación económica', cantidad: 200, unidad: 'S/', donante: 'Empresa XYZ', fecha: '2026-07-05' },
    { id: 3, tipo: 'alimento', descripcion: 'Fideos 30kg', cantidad: 30, unidad: 'kg', donante: 'Comunidad Local', fecha: '2026-07-10' },
    { id: 4, tipo: 'alimento', descripcion: 'Leche 20L', cantidad: 20, unidad: 'L', donante: 'ONG Solidaridad', fecha: '2026-07-12' },
    { id: 5, tipo: 'dinero', descripcion: 'Apoyo económico', cantidad: 150, unidad: 'S/', donante: 'Anónimo', fecha: '2026-07-15' }
];

/**
 * Datos iniciales de inventario
 */
let inventario = [
    { id: 1, producto: 'Arroz', categoria: 'Granos', cantidad: 100, unidad: 'kg', vencimiento: '2027-06-01', proveedor: 'Distribuidora San José' },
    { id: 2, producto: 'Fideos', categoria: 'Granos', cantidad: 75, unidad: 'kg', vencimiento: '2026-12-31', proveedor: 'Molino Huancayo' },
    { id: 3, producto: 'Leche', categoria: 'Lácteos', cantidad: 40, unidad: 'L', vencimiento: '2026-08-20', proveedor: 'Ganadera Los Andes' },
    { id: 4, producto: 'Aceite', categoria: 'Otros', cantidad: 20, unidad: 'L', vencimiento: '2027-03-15', proveedor: 'Industrial Huancayo' },
    { id: 5, producto: 'Atún', categoria: 'Enlatados', cantidad: 60, unidad: 'unidades', vencimiento: '2027-09-30', proveedor: 'Importadora del Centro' }
];

/**
 * Contadores para IDs automáticos
 */
let proximoIdBeneficiario = 6;
let proximoIdDonacion = 6;
let proximoIdInventario = 6;

/**
 * Variable para almacenar los gráficos
 */
let graficoBeneficiariosInstance = null;
let graficoDonacionesInstance = null;

// ======================================================
// 2. AUTENTICACIÓN
// ======================================================

/**
 * Evento: Login
 * Valida las credenciales y muestra la aplicación
 */
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const user = document.getElementById('loginUser').value;
    const pass = document.getElementById('loginPass').value;
    
    // Credenciales de prueba (hardcodeadas para demostración)
    if (user === 'admin' && pass === 'admin123') {
        // Ocultar login y mostrar app
        document.getElementById('authSection').style.display = 'none';
        document.getElementById('appSection').style.display = 'block';
        document.getElementById('userName').textContent = 'Administrador';
        document.getElementById('loginError').classList.add('d-none');
        
        // Cargar todos los datos
        cargarTodo();
    } else {
        document.getElementById('loginError').classList.remove('d-none');
    }
});

/**
 * Evento: Registro
 * Simula el registro de un nuevo usuario
 */
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const user = document.getElementById('regUser').value;
    const email = document.getElementById('regEmail').value;
    const pass = document.getElementById('regPass').value;
    
    if (user && email && pass.length >= 6) {
        alert('✅ Registro exitoso. Ahora inicia sesión con tus credenciales.');
        // Cambiar a la pestaña de login
        const loginTab = document.querySelector('#authTabs a:first-child');
        if (loginTab) loginTab.click();
        // Limpiar formulario
        this.reset();
    } else {
        alert('⚠️ Por favor completa todos los campos. La contraseña debe tener al menos 6 caracteres.');
    }
});

/**
 * Cerrar sesión
 */
function cerrarSesion() {
    if (confirm('¿Estás seguro de cerrar sesión?')) {
        document.getElementById('authSection').style.display = 'block';
        document.getElementById('appSection').style.display = 'none';
        document.getElementById('loginForm').reset();
        document.getElementById('loginError').classList.add('d-none');
    }
}

// ======================================================
// 3. NAVEGACIÓN ENTRE PÁGINAS
// ======================================================

/**
 * Muestra la página seleccionada
 * @param {string} pagina - Nombre de la página (dashboard, beneficiarios, etc.)
 */
function mostrarPagina(pagina) {
    // Ocultar todas las páginas
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    // Mostrar la página seleccionada
    const target = document.getElementById('page-' + pagina);
    if (target) target.classList.add('active');
    
    // Actualizar sidebar
    document.querySelectorAll('.sidebar a').forEach(link => link.classList.remove('active'));
    const links = document.querySelectorAll('.sidebar a');
    for (let link of links) {
        const texto = link.textContent.trim().toLowerCase();
        if (texto.includes(pagina)) {
            link.classList.add('active');
            break;
        }
    }
    
    // Cargar datos según la página
    switch(pagina) {
        case 'beneficiarios':
            mostrarBeneficiarios();
            break;
        case 'donaciones':
            mostrarDonaciones();
            break;
        case 'inventario':
            mostrarInventario();
            break;
        case 'reportes':
            mostrarReportes();
            break;
        default:
            break;
    }
}

// ======================================================
// 4. CRUD - BENEFICIARIOS
// ======================================================

/**
 * Muestra la lista de beneficiarios en la tabla
 */
function mostrarBeneficiarios() {
    const tbody = document.getElementById('tablaBeneficiarios');
    tbody.innerHTML = '';
    
    if (beneficiarios.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No hay beneficiarios registrados</td></tr>';
        return;
    }
    
    for (let b of beneficiarios) {
        tbody.innerHTML += `
            <tr>
                <td>${b.id}</td>
                <td><strong>${b.nombre} ${b.apellidos}</strong></td>
                <td>${b.dni}</td>
                <td><span class="badge bg-info">${b.tipo}</span></td>
                <td>${b.telefono || '-'}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editarBeneficiario(${b.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarBeneficiario(${b.id})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }
    
    // Actualizar contador
    document.getElementById('totalBeneficiariosBadge').textContent = beneficiarios.length;
    actualizarContadores();
}

/**
 * Abre el modal para crear o editar un beneficiario
 * @param {number} id - ID del beneficiario (opcional)
 */
function abrirModalBeneficiario(id = null) {
    const modal = new bootstrap.Modal(document.getElementById('modalBeneficiario'));
    const form = document.getElementById('formBeneficiario');
    form.reset();
    document.getElementById('beneficiarioEditId').value = '';
    document.getElementById('modalBeneficiarioTitulo').textContent = 'Nuevo Beneficiario';
    
    if (id) {
        const b = beneficiarios.find(x => x.id === id);
        if (b) {
            document.getElementById('beneficiarioEditId').value = b.id;
            document.getElementById('benefNombre').value = b.nombre;
            document.getElementById('benefApellidos').value = b.apellidos;
            document.getElementById('benefDni').value = b.dni;
            document.getElementById('benefTipo').value = b.tipo;
            document.getElementById('benefTelefono').value = b.telefono || '';
            document.getElementById('benefDireccion').value = b.direccion || '';
            document.getElementById('modalBeneficiarioTitulo').textContent = 'Editar Beneficiario';
        }
    }
    
    modal.show();
}

/**
 * Función wrapper para editar desde la tabla
 */
function editarBeneficiario(id) {
    abrirModalBeneficiario(id);
}

/**
 * Guarda un beneficiario (crear o actualizar)
 */
function guardarBeneficiario() {
    const id = document.getElementById('beneficiarioEditId').value;
    const data = {
        nombre: document.getElementById('benefNombre').value.trim(),
        apellidos: document.getElementById('benefApellidos').value.trim(),
        dni: document.getElementById('benefDni').value.trim(),
        tipo: document.getElementById('benefTipo').value,
        telefono: document.getElementById('benefTelefono').value.trim(),
        direccion: document.getElementById('benefDireccion').value.trim()
    };
    
    // Validar campos obligatorios
    if (!data.nombre || !data.apellidos || !data.dni) {
        alert('⚠️ Los campos Nombre, Apellidos y DNI son obligatorios.');
        return;
    }
    
    if (data.dni.length !== 8 || isNaN(data.dni)) {
        alert('⚠️ El DNI debe tener 8 dígitos numéricos.');
        return;
    }
    
    if (id) {
        // Editar
        const index = beneficiarios.findIndex(b => b.id === parseInt(id));
        if (index !== -1) {
            beneficiarios[index] = { ...beneficiarios[index], ...data };
        }
    } else {
        // Nuevo
        data.id = proximoIdBeneficiario++;
        beneficiarios.push(data);
    }
    
    bootstrap.Modal.getInstance(document.getElementById('modalBeneficiario')).hide();
    mostrarBeneficiarios();
    actualizarContadores();
    alert('✅ Beneficiario guardado exitosamente.');
}

/**
 * Elimina un beneficiario
 * @param {number} id - ID del beneficiario
 */
function eliminarBeneficiario(id) {
    if (confirm('¿Estás seguro de eliminar este beneficiario?')) {
        beneficiarios = beneficiarios.filter(b => b.id !== id);
        mostrarBeneficiarios();
        actualizarContadores();
        alert('🗑️ Beneficiario eliminado.');
    }
}

/**
 * Busca beneficiarios por nombre o DNI
 */
function buscarBeneficiario() {
    const busqueda = document.getElementById('buscarBeneficiario').value.toLowerCase();
    const filas = document.querySelectorAll('#tablaBeneficiarios tr');
    
    for (let fila of filas) {
        const texto = fila.textContent.toLowerCase();
        fila.style.display = texto.includes(busqueda) ? '' : 'none';
    }
}

// ======================================================
// 5. CRUD - DONACIONES
// ======================================================

/**
 * Muestra la lista de donaciones en la tabla
 */
function mostrarDonaciones() {
    const tbody = document.getElementById('tablaDonaciones');
    tbody.innerHTML = '';
    
    if (donaciones.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No hay donaciones registradas</td></tr>';
        return;
    }
    
    for (let d of donaciones) {
        const tipoBadge = d.tipo === 'alimento' ? 'success' : 'primary';
        const cantidad = d.tipo === 'dinero' ? `S/ ${d.cantidad}` : `${d.cantidad} ${d.unidad || ''}`;
        const fecha = d.fecha || '-';
        
        tbody.innerHTML += `
            <tr>
                <td>${d.id}</td>
                <td><span class="badge bg-${tipoBadge}">${d.tipo}</span></td>
                <td>${d.descripcion || '-'}</td>
                <td>${cantidad}</td>
                <td>${d.donante || 'Anónimo'}</td>
                <td>${fecha}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="eliminarDonacion(${d.id})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }
    actualizarContadores();
}

/**
 * Abre el modal para registrar una donación
 */
function abrirModalDonacion() {
    const modal = new bootstrap.Modal(document.getElementById('modalDonacion'));
    document.getElementById('formDonacion').reset();
    document.getElementById('donacionFecha').value = new Date().toISOString().split('T')[0];
    modal.show();
}

/**
 * Guarda una nueva donación
 */
function guardarDonacion() {
    const data = {
        tipo: document.getElementById('donacionTipo').value,
        descripcion: document.getElementById('donacionDescripcion').value.trim(),
        cantidad: parseFloat(document.getElementById('donacionCantidad').value) || 0,
        unidad: document.getElementById('donacionUnidad').value,
        donante: document.getElementById('donacionDonante').value.trim(),
        fecha: document.getElementById('donacionFecha').value || new Date().toISOString().split('T')[0]
    };
    
    if (data.cantidad <= 0) {
        alert('⚠️ La cantidad debe ser mayor a 0.');
        return;
    }
    
    data.id = proximoIdDonacion++;
    donaciones.push(data);
    
    bootstrap.Modal.getInstance(document.getElementById('modalDonacion')).hide();
    mostrarDonaciones();
    actualizarContadores();
    alert('✅ Donación registrada exitosamente.');
}

/**
 * Elimina una donación
 * @param {number} id - ID de la donación
 */
function eliminarDonacion(id) {
    if (confirm('¿Eliminar esta donación?')) {
        donaciones = donaciones.filter(d => d.id !== id);
        mostrarDonaciones();
        actualizarContadores();
        alert('🗑️ Donación eliminada.');
    }
}

// ======================================================
// 6. CRUD - INVENTARIO
// ======================================================

/**
 * Muestra la lista de productos en la tabla
 */
function mostrarInventario() {
    const tbody = document.getElementById('tablaInventario');
    tbody.innerHTML = '';
    
    if (inventario.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No hay productos en el inventario</td></tr>';
        return;
    }
    
    for (let i of inventario) {
        const vencimiento = i.vencimiento || 'N/A';
        tbody.innerHTML += `
            <tr>
                <td>${i.id}</td>
                <td><strong>${i.producto}</strong></td>
                <td><span class="badge bg-warning">${i.categoria}</span></td>
                <td>${i.cantidad}</td>
                <td>${i.unidad}</td>
                <td>${vencimiento}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="eliminarInventario(${i.id})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }
    actualizarContadores();
}

/**
 * Abre el modal para agregar un producto
 */
function abrirModalInventario() {
    const modal = new bootstrap.Modal(document.getElementById('modalInventario'));
    document.getElementById('formInventario').reset();
    modal.show();
}

/**
 * Guarda un nuevo producto en el inventario
 */
function guardarInventario() {
    const data = {
        producto: document.getElementById('invProducto').value.trim(),
        categoria: document.getElementById('invCategoria').value,
        cantidad: parseFloat(document.getElementById('invCantidad').value) || 0,
        unidad: document.getElementById('invUnidad').value,
        vencimiento: document.getElementById('invVencimiento').value || null,
        proveedor: document.getElementById('invProveedor').value.trim()
    };
    
    if (!data.producto) {
        alert('⚠️ El nombre del producto es obligatorio.');
        return;
    }
    
    if (data.cantidad <= 0) {
        alert('⚠️ La cantidad debe ser mayor a 0.');
        return;
    }
    
    data.id = proximoIdInventario++;
    inventario.push(data);
    
    bootstrap.Modal.getInstance(document.getElementById('modalInventario')).hide();
    mostrarInventario();
    actualizarContadores();
    alert('✅ Producto agregado al inventario.');
}

/**
 * Elimina un producto del inventario
 * @param {number} id - ID del producto
 */
function eliminarInventario(id) {
    if (confirm('¿Eliminar este producto del inventario?')) {
        inventario = inventario.filter(i => i.id !== id);
        mostrarInventario();
        actualizarContadores();
        alert('🗑️ Producto eliminado.');
    }
}

// ======================================================
// 7. CONTADORES Y DASHBOARD
// ======================================================

/**
 * Actualiza todos los contadores en el dashboard
 */
function actualizarContadores() {
    document.getElementById('totalBeneficiarios').textContent = beneficiarios.length;
    document.getElementById('totalDonaciones').textContent = donaciones.length;
    document.getElementById('totalInventario').textContent = inventario.length;
    
    // Raciones del día (simulado)
    const raciones = Math.floor(Math.random() * 30) + 15;
    document.getElementById('racionesHoy').textContent = raciones;
}

/**
 * Carga todos los datos iniciales
 */
function cargarTodo() {
    mostrarBeneficiarios();
    mostrarDonaciones();
    mostrarInventario();
    actualizarContadores();
}

// ======================================================
// 8. REPORTES Y GRÁFICOS
// ======================================================

/**
 * Muestra los reportes y genera los gráficos
 */
function mostrarReportes() {
    // Actualizar resumen
    document.getElementById('reporteTotalBeneficiarios').textContent = beneficiarios.length;
    document.getElementById('reporteTotalDonaciones').textContent = donaciones.length;
    document.getElementById('reporteTotalInventario').textContent = inventario.length;
    document.getElementById('reporteRaciones').textContent = Math.floor(Math.random() * 30) + 15;
    
    // Generar gráficos
    generarGraficoBeneficiarios();
    generarGraficoDonaciones();
}

/**
 * Genera el gráfico de beneficiarios por tipo
 */
function generarGraficoBeneficiarios() {
    const ctx = document.getElementById('graficoBeneficiarios').getContext('2d');
    
    // Contar beneficiarios por tipo
    const tipos = {};
    for (let b of beneficiarios) {
        tipos[b.tipo] = (tipos[b.tipo] || 0) + 1;
    }
    
    const colores = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c'];
    
    if (graficoBeneficiariosInstance) {
        graficoBeneficiariosInstance.destroy();
    }
    
    graficoBeneficiariosInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(tipos),
            datasets: [{
                data: Object.values(tipos),
                backgroundColor: colores.slice(0, Object.keys(tipos).length),
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: { size: 12 },
                        padding: 15
                    }
                }
            }
        }
    });
}

/**
 * Genera el gráfico de donaciones por tipo
 */
function generarGraficoDonaciones() {
    const ctx = document.getElementById('graficoDonaciones').getContext('2d');
    
    // Sumar donaciones por tipo
    let totalAlimentos = 0;
    let totalDinero = 0;
    
    for (let d of donaciones) {
        if (d.tipo === 'alimento') {
            totalAlimentos += d.cantidad;
        } else if (d.tipo === 'dinero') {
            totalDinero += d.cantidad;
        }
    }
    
    if (graficoDonacionesInstance) {
        graficoDonacionesInstance.destroy();
    }
    
    graficoDonacionesInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Alimentos (kg)', 'Dinero (S/)'],
            datasets: [{
                label: 'Total donado',
                data: [totalAlimentos, totalDinero],
                backgroundColor: ['#2ecc71', '#3498db'],
                borderColor: ['#27ae60', '#2980b9'],
                borderWidth: 2,
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0,0,0,0.05)'
                    }
                }
            }
        }
    });
}

// ======================================================
// 9. INICIALIZACIÓN
// ======================================================

// La aplicación inicia en la pantalla de login
// Los datos se cargan cuando el usuario inicia sesión

console.log('🍲 Mi Comedor - Sistema de Gestión');
console.log('📚 Proyecto de Programación Web - 5to Ciclo');
console.log('👨‍💻 Desarrollado para la comunidad de Huancayo');
console.log('🔑 Credenciales: admin / admin123');

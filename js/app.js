let carrito = JSON.parse(sessionStorage.getItem("carritoSportyStyle")) || [];
let usuarioActivo = sessionStorage.getItem("usuarioSportyStyle") || null;

function formatear(valor){ return valor.toLocaleString("es-CL"); }

function login(){
  usuarioActivo = "Betsabé";
  sessionStorage.setItem("usuarioSportyStyle", usuarioActivo);
  actualizarUsuario();
}

function logout(){
  sessionStorage.clear();
  carrito = [];
  usuarioActivo = null;
  actualizarUsuario();
  mostrarCarrito();
  actualizarBoleta();
  alert("Sesión cerrada. Se eliminaron los datos del Session Storage.");
}

function actualizarUsuario(){
  const mensaje = document.getElementById("mensajeUsuario");
  const btnLogin = document.getElementById("btnLogin");
  const btnLogout = document.getElementById("btnLogout");
  if(usuarioActivo){
    mensaje.textContent = "👤 ¡Hola, " + usuarioActivo + "!";
    btnLogin.classList.add("hidden");
    btnLogout.classList.remove("hidden");
  }else{
    mensaje.textContent = "👤 Invitado";
    btnLogin.classList.remove("hidden");
    btnLogout.classList.add("hidden");
  }
}

function agregarCarrito(nombre, precio){
  const encontrado = carrito.find(item => item.nombre === nombre);
  if(encontrado){ encontrado.cantidad++; }
  else{ carrito.push({nombre, precio, cantidad:1}); }
  guardarCarrito();
  mostrarCarrito();
  actualizarBoleta();
}

function guardarCarrito(){
  sessionStorage.setItem("carritoSportyStyle", JSON.stringify(carrito));
}

function cambiarCantidad(nombre, cambio){
  const producto = carrito.find(item => item.nombre === nombre);
  if(!producto) return;
  producto.cantidad += cambio;
  if(producto.cantidad <= 0){
    carrito = carrito.filter(item => item.nombre !== nombre);
  }
  guardarCarrito();
  mostrarCarrito();
  actualizarBoleta();
}

function eliminarProducto(nombre){
  carrito = carrito.filter(item => item.nombre !== nombre);
  guardarCarrito();
  mostrarCarrito();
  actualizarBoleta();
}

function mostrarCarrito(){
  const contenedor = document.getElementById("lista-carrito");
  const totalSpan = document.getElementById("total");
  contenedor.innerHTML = "";
  let total = 0;

  if(carrito.length === 0){
    contenedor.innerHTML = "<p>Tu carrito está vacío.</p>";
    totalSpan.textContent = "0";
    return;
  }

  carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <strong>${item.nombre}</strong>
      <span>$${formatear(item.precio)} x ${item.cantidad}</span>
      <div>
        <button onclick="cambiarCantidad('${item.nombre}', -1)">-</button>
        <button onclick="cambiarCantidad('${item.nombre}', 1)">+</button>
        <button onclick="eliminarProducto('${item.nombre}')">X</button>
      </div>
    `;
    contenedor.appendChild(div);
  });

  totalSpan.textContent = formatear(total);
}

function vaciarCarrito(){
  carrito = [];
  guardarCarrito();
  mostrarCarrito();
  actualizarBoleta();
}

function validarFormulario(nombre, direccion, correo, telefono){
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
  const telefonoValido = /^[0-9]{8,12}$/.test(telefono.replace(/\s/g, ""));
  return nombre.trim() !== "" && direccion.trim() !== "" && emailValido && telefonoValido;
}

function finalizarCompra(event){
  event.preventDefault();

  if(carrito.length === 0){
    alert("Debes agregar al menos un producto al carrito.");
    return;
  }

  const nombre = document.getElementById("nombre").value;
  const direccion = document.getElementById("direccion").value;
  const correo = document.getElementById("correo").value;
  const telefono = document.getElementById("telefono").value;

  if(!validarFormulario(nombre, direccion, correo, telefono)){
    alert("Revisa los datos ingresados. El correo y teléfono deben tener formato válido.");
    return;
  }

  let total = carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
  const envio = 4990;

  const confirmacion = document.getElementById("confirmacion");
  confirmacion.classList.remove("hidden");
  confirmacion.innerHTML = `
    <h3>✅ Compra realizada con éxito</h3>
    <p>Gracias por tu compra, <strong>${nombre}</strong>.</p>
    <p>Enviaremos los detalles a: <strong>${correo}</strong></p>
    <p>Dirección de despacho: ${direccion}</p>
    <h4>Resumen del pedido</h4>
    <p>Productos: ${carrito.reduce((suma, item) => suma + item.cantidad, 0)}</p>
    <p>Subtotal: $${formatear(total)}</p>
    <p>Envío: $${formatear(envio)}</p>
    <h3>Total pagado: $${formatear(total + envio)}</h3>
  `;

  actualizarBoleta();
}

function actualizarBoleta(){
  const detalle = document.getElementById("detalle-boleta");
  const nombre = document.getElementById("nombre")?.value || "Cliente";
  if(!detalle) return;

  if(carrito.length === 0){
    detalle.innerHTML = "Agrega productos al carrito para generar el detalle.";
    return;
  }

  let subtotal = 0;
  let filas = "";
  carrito.forEach(item => {
    const sub = item.precio * item.cantidad;
    subtotal += sub;
    filas += `<tr><td>${item.nombre}</td><td>${item.cantidad}</td><td>$${formatear(sub)}</td></tr>`;
  });

  const envio = 4990;
  detalle.innerHTML = `
    <p><strong>Cliente:</strong> ${nombre}</p>
    <p><strong>Fecha:</strong> ${new Date().toLocaleDateString("es-CL")}</p>
    <table>
      <thead><tr><th>Producto</th><th>Cant.</th><th>Subtotal</th></tr></thead>
      <tbody>${filas}</tbody>
    </table>
    <p>Subtotal: $${formatear(subtotal)}</p>
    <p>Envío: $${formatear(envio)}</p>
    <p class="total">Total: $${formatear(subtotal + envio)}</p>
  `;
}

actualizarUsuario();
mostrarCarrito();
actualizarBoleta();

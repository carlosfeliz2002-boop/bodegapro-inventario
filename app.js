/* ==========================================================================
   BodegaPro — Lógica de Negocio, Manipulación del DOM, Eventos y Validaciones
   JavaScript Puro (ES6+) — Clases 6, 7 y 8
   ========================================================================== */

// 1. FUNDAMENTOS DE JAVASCRIPT: Variables, Tipos de Datos y Array de Objetos en Memoria
let inventario = [
  {
    id: 101,
    sku: "ALM-001",
    nombre: "Café Molido Premium 500g",
    categoria: "Alimentos y Bebidas",
    precio: 8.50,
    stock: 28,
    stockMinimo: 10,
    proveedorEmail: "ventas@cafetaldelvalle.com"
  },
  {
    id: 102,
    sku: "LIM-014",
    nombre: "Detergente Biodegradable 3L",
    categoria: "Limpieza y Hogar",
    precio: 12.75,
    stock: 6,
    stockMinimo: 12,
    proveedorEmail: "pedidos@ecolimpiard.com"
  },
  {
    id: 103,
    sku: "TEC-008",
    nombre: "Lector Código de Barras USB",
    categoria: "Equipos y Accesorios",
    precio: 45.00,
    stock: 9,
    stockMinimo: 5,
    proveedorEmail: "soporte@tecnoabasto.do"
  },
  {
    id: 104,
    sku: "EMP-022",
    nombre: "Cajas Cartón Corrugado (Paq. 25)",
    categoria: "Empaques y Bolsas",
    precio: 18.20,
    stock: 0,
    stockMinimo: 8,
    proveedorEmail: "logistica@cartonescaribe.com"
  },
  {
    id: 105,
    sku: "ALM-009",
    nombre: "Aceite de Oliva Extra Virgen 1L",
    categoria: "Alimentos y Bebidas",
    precio: 14.90,
    stock: 19,
    stockMinimo: 8,
    proveedorEmail: "importaciones@mediterraneo.do"
  }
];

let idEnEdicion = null; // null = Modo Registro, Number = Modo Edición

// Referencias a elementos del DOM
const formProducto = document.getElementById("form-producto");
const inputSku = document.getElementById("sku");
const inputNombre = document.getElementById("nombre");
const selectCategoria = document.getElementById("categoria");
const inputPrecio = document.getElementById("precio");
const inputStock = document.getElementById("stock");
const inputStockMinimo = document.getElementById("stockMinimo");
const inputEmail = document.getElementById("proveedorEmail");

const previewSubtotal = document.getElementById("preview-subtotal");
const btnSubmit = document.getElementById("btn-submit");
const btnCancelar = document.getElementById("btn-cancelar");
const indicadorModo = document.getElementById("mode-indicator");

const inputBusqueda = document.getElementById("input-busqueda");
const selectFiltroCategoria = document.getElementById("filtro-categoria");
const selectFiltroEstado = document.getElementById("filtro-estado");
const btnLimpiarFiltros = document.getElementById("btn-limpiar-filtros");

const tablaBody = document.getElementById("tabla-inventario-body");
const resumenCategoriasEl = document.getElementById("category-breakdown");

// Referencias a tarjetas de estadísticas
const statTotalSkus = document.getElementById("stat-total-skus");
const statTotalUnidades = document.getElementById("stat-total-unidades");
const statValorTotal = document.getElementById("stat-valor-total");
const statAlertasStock = document.getElementById("stat-alertas-stock");

// Referencias al banner de notificación
const toastBanner = document.getElementById("toast-banner");
const toastText = document.getElementById("toast-text");
const toastClose = document.getElementById("toast-close");

/* ==========================================================================
   FUNCIÓN PROPIA #1: validarDatosProducto(datos, idActual)
   Valida campos obligatorios, formatos regex (SKU y correo) y reglas del negocio.
   ========================================================================== */
function validarDatosProducto(datos, idActual = null) {
  const errores = {};
  const regexSku = /^[A-Z]{3}-\d{3}$/;
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // 1. Validar SKU obligatorio, formato AAA-000 y unicidad en el array
  if (!datos.sku) {
    errores.sku = "El código SKU es obligatorio.";
  } else if (!regexSku.test(datos.sku)) {
    errores.sku = "Formato inválido. Usa 3 letras, guion y 3 dígitos (ej. ALM-001).";
  } else {
    let skuDuplicado = false;
    for (let i = 0; i < inventario.length; i++) {
      if (inventario[i].sku.toUpperCase() === datos.sku && inventario[i].id !== idActual) {
        skuDuplicado = true;
        break;
      }
    }
    if (skuDuplicado) {
      errores.sku = "Regla de negocio: Este código SKU ya está registrado en el inventario.";
    }
  }

  // 2. Validar Nombre del producto
  if (!datos.nombre || datos.nombre.length < 3) {
    errores.nombre = "El nombre debe contener al menos 3 caracteres.";
  } else if (datos.nombre.length > 75) {
    errores.nombre = "El nombre no puede exceder 75 caracteres.";
  }

  // 3. Validar Categoría
  if (!datos.categoria) {
    errores.categoria = "Selecciona una categoría comercial válida.";
  }

  // 4. Validar Precio Unitario (Regla de negocio: > 0 y <= 50,000)
  if (isNaN(datos.precio) || datos.precio <= 0) {
    errores.precio = "El precio unitario debe ser mayor a $0.00.";
  } else if (datos.precio > 50000) {
    errores.precio = "Regla de negocio: El precio unitario máximo permitido es $50,000.";
  }

  // 5. Validar Stock Actual (Entero >= 0)
  if (isNaN(datos.stock) || !Number.isInteger(datos.stock) || datos.stock < 0) {
    errores.stock = "La cantidad en stock debe ser un número entero mayor o igual a 0.";
  } else if (datos.stock > 100000) {
    errores.stock = "La cantidad ingresada excede la capacidad física de bodega.";
  }

  // 6. Validar Stock Mínimo de Alerta (Entero >= 1)
  if (isNaN(datos.stockMinimo) || !Number.isInteger(datos.stockMinimo) || datos.stockMinimo < 1) {
    errores.stockMinimo = "El punto de reorden debe ser un entero de al menos 1 unidad.";
  }

  // 7. Validar Correo del Proveedor
  if (!datos.proveedorEmail) {
    errores.proveedorEmail = "El correo de contacto del proveedor es obligatorio.";
  } else if (!regexEmail.test(datos.proveedorEmail)) {
    errores.proveedorEmail = "Introduce un correo electrónico con formato válido (ej. ventas@empresa.com).";
  }

  return {
    esValido: Object.keys(errores).length === 0,
    errores: errores
  };
}

/* ==========================================================================
   FUNCIÓN PROPIA #2: calcularMetricasInventario(listaProductos)
   Utiliza ciclos, acumuladores y estructuras condicionales para calcular
   indicadores financieros y alertas operativas del negocio.
   ========================================================================== */
function calcularMetricasInventario(listaProductos) {
  let totalUnidades = 0;
  let valorPatrimonial = 0;
  let alertasReorden = 0;
  let agotados = 0;
  const conteoPorCategoria = {};

  for (let i = 0; i < listaProductos.length; i++) {
    const item = listaProductos[i];
    const subtotalItem = item.precio * item.stock;

    totalUnidades += item.stock;
    valorPatrimonial += subtotalItem;

    if (item.stock === 0) {
      agotados++;
      alertasReorden++;
    } else if (item.stock <= item.stockMinimo) {
      alertasReorden++;
    }

    if (!conteoPorCategoria[item.categoria]) {
      conteoPorCategoria[item.categoria] = { skus: 0, valor: 0 };
    }
    conteoPorCategoria[item.categoria].skus += 1;
    conteoPorCategoria[item.categoria].valor += subtotalItem;
  }

  return {
    totalSkus: listaProductos.length,
    totalUnidades: totalUnidades,
    valorPatrimonial: valorPatrimonial,
    alertasReorden: alertasReorden,
    agotados: agotados,
    conteoPorCategoria: conteoPorCategoria
  };
}

/* ==========================================================================
   FUNCIÓN PROPIA #3: filtrarCatalogoProductos(termino, categoria, estado)
   Filtra el array de inventario combinando búsqueda textual y criterios de stock.
   ========================================================================== */
function filtrarCatalogoProductos(termino, categoria, estado) {
  const textoLimpio = termino.trim().toLowerCase();
  const resultado = [];

  for (let i = 0; i < inventario.length; i++) {
    const prod = inventario[i];

    // Filtro por texto (SKU, nombre o correo del proveedor)
    const coincideTexto =
      textoLimpio === "" ||
      prod.sku.toLowerCase().includes(textoLimpio) ||
      prod.nombre.toLowerCase().includes(textoLimpio) ||
      prod.proveedorEmail.toLowerCase().includes(textoLimpio);

    // Filtro por categoría
    const coincideCategoria = categoria === "TODAS" || prod.categoria === categoria;

    // Determinar estado operativo del producto
    let estadoProducto = "OPTIMO";
    if (prod.stock === 0) {
      estadoProducto = "AGOTADO";
    } else if (prod.stock <= prod.stockMinimo) {
      estadoProducto = "BAJO";
    }

    const coincideEstado = estado === "TODOS" || estadoProducto === estado;

    if (coincideTexto && coincideCategoria && coincideEstado) {
      resultado.push(prod);
    }
  }

  return resultado;
}

/* ==========================================================================
   FUNCIÓN PROPIA #4: renderizarInterfazDOM()
   Manipulación dinámica del DOM: crea filas, celdas, badges y botones sin
   recargar la página, y actualiza los paneles estadísticos.
   ========================================================================== */
function renderizarInterfazDOM() {
  const productosFiltrados = filtrarCatalogoProductos(
    inputBusqueda.value,
    selectFiltroCategoria.value,
    selectFiltroEstado.value
  );

  // Limpiar contenido previo de la tabla
  tablaBody.innerHTML = "";

  if (productosFiltrados.length === 0) {
    const filaVacia = document.createElement("tr");
    const celdaVacia = document.createElement("td");
    celdaVacia.colSpan = 7;
    celdaVacia.className = "empty-state";
    celdaVacia.textContent = "No se encontraron productos que coincidan con los filtros seleccionados.";
    filaVacia.appendChild(celdaVacia);
    tablaBody.appendChild(filaVacia);
  } else {
    for (let i = 0; i < productosFiltrados.length; i++) {
      const prod = productosFiltrados[i];
      const subtotal = prod.precio * prod.stock;

      const tr = document.createElement("tr");

      // Columna 1: SKU
      const tdSku = document.createElement("td");
      const spanSku = document.createElement("span");
      spanSku.className = "sku-tag";
      spanSku.textContent = prod.sku;
      tdSku.appendChild(spanSku);

      // Columna 2: Producto y Proveedor
      const tdNombre = document.createElement("td");
      const strongNombre = document.createElement("strong");
      strongNombre.textContent = prod.nombre;
      const divEmail = document.createElement("div");
      divEmail.className = "field-hint";
      divEmail.textContent = "Proveedor: " + prod.proveedorEmail;
      tdNombre.appendChild(strongNombre);
      tdNombre.appendChild(divEmail);

      // Columna 3: Categoría
      const tdCat = document.createElement("td");
      const spanCat = document.createElement("span");
      spanCat.className = "cat-badge";
      spanCat.textContent = prod.categoria;
      tdCat.appendChild(spanCat);

      // Columna 4: Precio Unitario
      const tdPrecio = document.createElement("td");
      tdPrecio.textContent = "$" + prod.precio.toFixed(2);

      // Columna 5: Stock y Punto de Reorden
      const tdStock = document.createElement("td");
      tdStock.innerHTML = "<strong>" + prod.stock + " uds.</strong><div class='field-hint'>Mín: " + prod.stockMinimo + "</div>";

      // Columna 6: Subtotal y Estado
      const tdEstado = document.createElement("td");
      const divValor = document.createElement("div");
      divValor.style.fontWeight = "700";
      divValor.style.marginBottom = "4px";
      divValor.textContent = "$" + subtotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

      const spanEstado = document.createElement("span");
      if (prod.stock === 0) {
        spanEstado.className = "status-pill status-out";
        spanEstado.textContent = "Agotado";
      } else if (prod.stock <= prod.stockMinimo) {
        spanEstado.className = "status-pill status-low";
        spanEstado.textContent = "Reordenar";
      } else {
        spanEstado.className = "status-pill status-ok";
        spanEstado.textContent = "Óptimo";
      }
      tdEstado.appendChild(divValor);
      tdEstado.appendChild(spanEstado);

      // Columna 7: Botones de Acción (Creación dinámica de controles con eventos)
      const tdAcciones = document.createElement("td");
      const divAcciones = document.createElement("div");
      divAcciones.className = "actions-cell";

      const btnMasStock = document.createElement("button");
      btnMasStock.type = "button";
      btnMasStock.className = "btn btn-sm btn-stock";
      btnMasStock.textContent = "+1 Stock";
      btnMasStock.title = "Registrar entrada rápida de 1 unidad";
      btnMasStock.addEventListener("click", function () {
        ajustarStockRapido(prod.id, 1);
      });

      const btnEditar = document.createElement("button");
      btnEditar.type = "button";
      btnEditar.className = "btn btn-sm btn-edit";
      btnEditar.textContent = "Editar";
      btnEditar.addEventListener("click", function () {
        cargarProductoEnFormulario(prod.id);
      });

      const btnEliminar = document.createElement("button");
      btnEliminar.type = "button";
      btnEliminar.className = "btn btn-sm btn-delete";
      btnEliminar.textContent = "Eliminar";
      btnEliminar.addEventListener("click", function () {
        eliminarProductoPorId(prod.id);
      });

      divAcciones.appendChild(btnMasStock);
      divAcciones.appendChild(btnEditar);
      divAcciones.appendChild(btnEliminar);
      tdAcciones.appendChild(divAcciones);

      tr.appendChild(tdSku);
      tr.appendChild(tdNombre);
      tr.appendChild(tdCat);
      tr.appendChild(tdPrecio);
      tr.appendChild(tdStock);
      tr.appendChild(tdEstado);
      tr.appendChild(tdAcciones);

      tablaBody.appendChild(tr);
    }
  }

  // Actualizar panel estadístico global (Actividad 6)
  const metricas = calcularMetricasInventario(inventario);
  statTotalSkus.textContent = metricas.totalSkus;
  statTotalUnidades.textContent = metricas.totalUnidades.toLocaleString("en-US");
  statValorTotal.textContent = "$" + metricas.valorPatrimonial.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  statAlertasStock.textContent = metricas.alertasReorden + " (" + metricas.agotados + " agotados)";

  // Renderizar desglose por categoría en la parte inferior
  resumenCategoriasEl.innerHTML = "";
  const categoriasClaves = Object.keys(metricas.conteoPorCategoria);
  for (let c = 0; c < categoriasClaves.length; c++) {
    const nombreCat = categoriasClaves[c];
    const infoCat = metricas.conteoPorCategoria[nombreCat];
    const chip = document.createElement("div");
    chip.className = "cat-chip";
    chip.innerHTML =
      nombreCat + ": <strong>" + infoCat.skus + " SKUs</strong> ($" +
      infoCat.valor.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ")";
    resumenCategoriasEl.appendChild(chip);
  }
}

/* ==========================================================================
   Funciones Auxiliares de Interfaz, Edición, Eliminación y Feedback
   ========================================================================== */
function mostrarNotificacion(mensaje, tipo = "success") {
  toastText.textContent = mensaje;
  toastBanner.className = "toast-banner show " + tipo;
}

function limpiarErroresVisuales() {
  const campos = ["sku", "nombre", "categoria", "precio", "stock", "stockMinimo", "proveedorEmail"];
  for (let i = 0; i < campos.length; i++) {
    const idCampo = campos[i];
    const inputEl = document.getElementById(idCampo);
    const errorEl = document.getElementById("error-" + idCampo);
    if (inputEl) {
      inputEl.classList.remove("input-error", "input-valid");
    }
    if (errorEl) {
      errorEl.textContent = "";
      errorEl.classList.remove("visible");
    }
  }
}

function mostrarErroresEnFormulario(errores) {
  limpiarErroresVisuales();
  const campos = ["sku", "nombre", "categoria", "precio", "stock", "stockMinimo", "proveedorEmail"];
  for (let i = 0; i < campos.length; i++) {
    const campo = campos[i];
    const inputEl = document.getElementById(campo);
    const errorEl = document.getElementById("error-" + campo);
    if (errores[campo]) {
      inputEl.classList.add("input-error");
      errorEl.textContent = errores[campo];
      errorEl.classList.add("visible");
    } else {
      inputEl.classList.add("input-valid");
    }
  }
}

function actualizarPrevisualizacionSubtotal() {
  const precio = parseFloat(inputPrecio.value) || 0;
  const stock = parseInt(inputStock.value, 10) || 0;
  const total = precio > 0 && stock >= 0 ? precio * stock : 0;
  previewSubtotal.textContent = "$" + total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function reiniciarFormulario() {
  formProducto.reset();
  idEnEdicion = null;
  limpiarErroresVisuales();
  actualizarPrevisualizacionSubtotal();
  btnSubmit.textContent = "Registrar Producto";
  indicadorModo.textContent = "Modo: Nuevo Registro";
  indicadorModo.classList.remove("editing");
}

function cargarProductoEnFormulario(idProducto) {
  let productoEncontrado = null;
  for (let i = 0; i < inventario.length; i++) {
    if (inventario[i].id === idProducto) {
      productoEncontrado = inventario[i];
      break;
    }
  }
  if (!productoEncontrado) return;

  idEnEdicion = productoEncontrado.id;
  inputSku.value = productoEncontrado.sku;
  inputNombre.value = productoEncontrado.nombre;
  selectCategoria.value = productoEncontrado.categoria;
  inputPrecio.value = productoEncontrado.precio;
  inputStock.value = productoEncontrado.stock;
  inputStockMinimo.value = productoEncontrado.stockMinimo;
  inputEmail.value = productoEncontrado.proveedorEmail;

  limpiarErroresVisuales();
  actualizarPrevisualizacionSubtotal();

  btnSubmit.textContent = "Guardar Cambios";
  indicadorModo.textContent = "Editando: " + productoEncontrado.sku;
  indicadorModo.classList.add("editing");
  mostrarNotificacion("Editando el producto " + productoEncontrado.sku + ". Modifica los campos y presiona Guardar Cambios.", "success");
}

function ajustarStockRapido(idProducto, incremento) {
  for (let i = 0; i < inventario.length; i++) {
    if (inventario[i].id === idProducto) {
      inventario[i].stock += incremento;
      mostrarNotificacion("Stock actualizado para " + inventario[i].nombre + " (" + inventario[i].stock + " unidades).", "success");
      break;
    }
  }
  renderizarInterfazDOM();
}

function eliminarProductoPorId(idProducto) {
  let nombreEliminado = "";
  const nuevoInventario = [];
  for (let i = 0; i < inventario.length; i++) {
    if (inventario[i].id === idProducto) {
      nombreEliminado = inventario[i].nombre;
    } else {
      nuevoInventario.push(inventario[i]);
    }
  }
  inventario = nuevoInventario;

  if (idEnEdicion === idProducto) {
    reiniciarFormulario();
  }

  renderizarInterfazDOM();
  mostrarNotificacion("Producto '" + nombreEliminado + "' eliminado correctamente del inventario.", "success");
}

/* ==========================================================================
   GESTIÓN DE EVENTOS (Actividad 4: submit, input, change, click)
   ========================================================================== */

// Evento submit del formulario principal
formProducto.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const datosCapturados = {
    sku: inputSku.value.trim().toUpperCase(),
    nombre: inputNombre.value.trim(),
    categoria: selectCategoria.value,
    precio: parseFloat(inputPrecio.value),
    stock: Number(inputStock.value),
    stockMinimo: Number(inputStockMinimo.value),
    proveedorEmail: inputEmail.value.trim().toLowerCase()
  };

  const validacion = validarDatosProducto(datosCapturados, idEnEdicion);

  if (!validacion.esValido) {
    mostrarErroresEnFormulario(validacion.errores);
    mostrarNotificacion("Por favor corrige los campos marcados en rojo antes de guardar.", "error");
    return;
  }

  if (idEnEdicion === null) {
    // Crear nuevo registro
    const nuevoProducto = {
      id: Date.now(),
      sku: datosCapturados.sku,
      nombre: datosCapturados.nombre,
      categoria: datosCapturados.categoria,
      precio: datosCapturados.precio,
      stock: datosCapturados.stock,
      stockMinimo: datosCapturados.stockMinimo,
      proveedorEmail: datosCapturados.proveedorEmail
    };
    inventario.unshift(nuevoProducto);
    mostrarNotificacion("Producto '" + nuevoProducto.nombre + "' registrado con éxito.", "success");
  } else {
    // Actualizar registro existente
    for (let i = 0; i < inventario.length; i++) {
      if (inventario[i].id === idEnEdicion) {
        inventario[i].sku = datosCapturados.sku;
        inventario[i].nombre = datosCapturados.nombre;
        inventario[i].categoria = datosCapturados.categoria;
        inventario[i].precio = datosCapturados.precio;
        inventario[i].stock = datosCapturados.stock;
        inventario[i].stockMinimo = datosCapturados.stockMinimo;
        inventario[i].proveedorEmail = datosCapturados.proveedorEmail;
        break;
      }
    }
    mostrarNotificacion("Los datos del producto '" + datosCapturados.sku + "' fueron actualizados.", "success");
  }

  reiniciarFormulario();
  renderizarInterfazDOM();
});

// Eventos input en tiempo real para previsualizar subtotal y normalizar SKU
inputPrecio.addEventListener("input", actualizarPrevisualizacionSubtotal);
inputStock.addEventListener("input", actualizarPrevisualizacionSubtotal);
inputSku.addEventListener("input", function () {
  inputSku.value = inputSku.value.toUpperCase();
});

// Evento click para cancelar edición / limpiar formulario
btnCancelar.addEventListener("click", function () {
  reiniciarFormulario();
  mostrarNotificacion("Formulario reiniciado a modo de nuevo registro.", "success");
});

// Eventos input y change para búsqueda y filtrado instantáneo
inputBusqueda.addEventListener("input", renderizarInterfazDOM);
selectFiltroCategoria.addEventListener("change", renderizarInterfazDOM);
selectFiltroEstado.addEventListener("change", renderizarInterfazDOM);

btnLimpiarFiltros.addEventListener("click", function () {
  inputBusqueda.value = "";
  selectFiltroCategoria.value = "TODAS";
  selectFiltroEstado.value = "TODOS";
  renderizarInterfazDOM();
});

toastClose.addEventListener("click", function () {
  toastBanner.className = "toast-banner";
});

// Inicializar aplicación al cargar el DOM
document.addEventListener("DOMContentLoaded", function () {
  renderizarInterfazDOM();
});

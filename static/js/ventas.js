const ctxVentas = document.getElementById("ventasChart").getContext("2d");

// 🎨 Crear un degradado suave (de amarillo a transparente)
const gradient = ctxVentas.createLinearGradient(0, 0, 0, 350);
gradient.addColorStop(0, "rgba(255, 200, 0, 0.6)");
gradient.addColorStop(1, "rgba(255, 200, 0, 0)");

new Chart(ctxVentas, {
  type: "line",
  data: {
    labels: [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ],
    datasets: [
      {
        label: "Ventas ($)",
        data: [
          1200000, 950000, 1100000, 1400000, 1250000, 1600000, 1750000, 1550000,
          1800000, 1900000, 2100000, 2300000,
        ],
        fill: true,
        backgroundColor: gradient, // el degradado bajo la línea
        borderColor: "#ffc107", // color de la línea
        borderWidth: 3,
        tension: 0.4, // suaviza las curvas
        pointRadius: 4,
        pointBackgroundColor: "#000",
        pointBorderColor: "#ffa120",
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `Ventas: $${context.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(255,255,255,0.05)" },
        ticks: { color: "#aaa" },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#aaa",
          callback: (value) => `$${value.toLocaleString()}`,
        },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
    },
  },
});

// 🔹 FILTRO DE VENTAS
const filterProducto = document.getElementById("filterProducto");
const filterEstado = document.getElementById("filterEstado");
const searchVenta = document.getElementById("searchVenta");
const ventasTable = document.getElementById("ventasTable");

// Función para filtrar las filas
function filtrarVentas() {
  const productoValor = filterProducto.value.toLowerCase();
  const estadoValor = filterEstado.value.toLowerCase();
  const searchValor = searchVenta.value.toLowerCase();

  let totalVentas = 0;
  let numVentas = 0;
  let pendientes = 0;

  Array.from(ventasTable.rows).forEach((row) => {
    const producto = row.cells[1].textContent.toLowerCase();
    const estado = row.cells[6].textContent.toLowerCase();
    const precio = parseInt(row.cells[4].textContent.replace(/[^0-9]/g, ""));
    const mostrar =
      (producto.includes(productoValor) || !productoValor) &&
      (estado.includes(estadoValor) || !estadoValor) &&
      (producto.includes(searchValor) ||
        estado.includes(searchValor) ||
        row.cells[0].textContent.toLowerCase().includes(searchValor));

    row.style.display = mostrar ? "" : "none";

    if (mostrar) {
      totalVentas += precio;
      numVentas++;
      if (estado === "pendiente") pendientes++;
    }
  });

  // Actualizar tarjetas de resumen
  document.getElementById("totalVentas").textContent = `$${totalVentas.toLocaleString()}`;
  document.getElementById("numVentas").textContent = numVentas;
  document.getElementById("ventasPendientes").textContent = pendientes;
}

// 🔹 Event listeners
filterProducto.addEventListener("change", filtrarVentas);
filterEstado.addEventListener("change", filtrarVentas);
searchVenta.addEventListener("input", filtrarVentas);

// Ejecutar una vez al cargar para inicializar los totales
filtrarVentas();




const metodoPago = document.getElementById("metodoPago");
const comprobanteContainer = document.getElementById("comprobanteContainer");
const estadoVenta = document.getElementById("estadoVenta");

metodoPago.addEventListener("change", () => {
  if (metodoPago.value === "Transferencia") {
    comprobanteContainer.style.display = "block"; // mostrar subida de comprobante
    estadoVenta.value = "Pendiente"; // cambiar estado automáticamente
  } else {
    comprobanteContainer.style.display = "none";
    estadoVenta.value = "Completada";
  }
});

// Actualizar total al cambiar cantidad o precio
const cantidadVenta = document.getElementById("cantidadVenta");
const precioVenta = document.getElementById("precioVenta");
const totalVenta = document.getElementById("totalVenta");

function actualizarTotal() {
  const precio = parseInt(precioVenta.value.replace(/[^0-9]/g, "")) || 0;
  const cantidad = parseInt(cantidadVenta.value) || 1;
  totalVenta.value = `$${(precio * cantidad).toLocaleString()}`;
}

cantidadVenta.addEventListener("input", actualizarTotal);
precioVenta.addEventListener("input", actualizarTotal);

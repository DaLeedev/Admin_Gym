document.addEventListener("DOMContentLoaded", () => {
  feather.replace();

  // ====== Datos de ejemplo ======
  const dailyPayments = 35000; // total de pagos diarios
  const monthlyRevenue = [
    120000, 180000, 220000, 160000, 250000, 300000, 280000, 310000, 400000,
    350000, 390000, 420000,
  ];
  const months = [
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
  ];
  const membershipDistribution = {
    Básica: 45,
    Premium: 35,
    VIP: 20,
  };

  // ====== Actualizar totales ======
  document.getElementById(
    "totalDailyPayments"
  ).textContent = `$${dailyPayments.toLocaleString()}`;
  document.getElementById(
    "totalRevenue"
  ).textContent = `$${monthlyRevenue[9].toLocaleString()}`;

  // ====== Gráfico de ingresos mensuales ======
  const ctxBar = document.getElementById("monthlyBarChart").getContext("2d");
  new Chart(ctxBar, {
    type: "bar",
    data: {
      labels: months,
      datasets: [
        {
          label: "Ingresos",
          data: monthlyRevenue,
          backgroundColor: "rgba(0, 123, 255, 0.6)",
          borderRadius: 6,
        },
      ],
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: "#bbb" }, grid: { color: "#333" } },
        y: { ticks: { color: "#bbb" }, grid: { color: "#333" } },
      },
    },
  });

  // ====== Gráfico de distribución de membresías ======
  const ctxDoughnut = document
    .getElementById("membershipDoughnut")
    .getContext("2d");
  new Chart(ctxDoughnut, {
    type: "doughnut",
    data: {
      labels: Object.keys(membershipDistribution),
      datasets: [
        {
          data: Object.values(membershipDistribution),
          backgroundColor: ["#007bff", "#ffc107", "#dc3545"],
          borderWidth: 0,
        },
      ],
    },
    options: {
      plugins: {
        legend: { labels: { color: "#fff" } },
      },
    },
  });

  // ====== Gráfico de tendencia ======
  const ctxLine = document.getElementById("revenueLineChart").getContext("2d");
  new Chart(ctxLine, {
    type: "line",
    data: {
      labels: months,
      datasets: [
        {
          label: "Ingresos",
          data: monthlyRevenue,
          borderColor: "#0dcaf0",
          backgroundColor: "rgba(13, 202, 240, 0.2)",
          fill: true,
          tension: 0.4,
          borderWidth: 2,
        },
      ],
    },
    options: {
      plugins: { legend: { labels: { color: "#fff" } } },
      scales: {
        x: { ticks: { color: "#bbb" }, grid: { color: "#333" } },
        y: { ticks: { color: "#bbb" }, grid: { color: "#333" } },
      },
    },
  });

  // ====== Exportar reportes ======
  document
    .getElementById("exportPdf")
    .addEventListener("click", () => exportToPDF());
  document
    .getElementById("exportExcel")
    .addEventListener("click", () => exportToExcel());

  function exportToPDF() {
    import(
      "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
    ).then(() => {
      const element = document.getElementById("reportArea");
      html2pdf()
        .from(element)
        .set({
          margin: 10,
          filename: `reporte_contabilidad_${new Date()
            .toISOString()
            .slice(0, 10)}.pdf`,
          html2canvas: { scale: 2 },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .save();
    });
  }

  function exportToExcel() {
    const wb = XLSX.utils.book_new();
    const data = [["Mes", "Ingresos"]];
    months.forEach((m, i) => data.push([m, monthlyRevenue[i]]));
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "Ingresos");
    XLSX.writeFile(
      wb,
      `reporte_contabilidad_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  }
});


// Datos de ejemplo
const latestRecords = [
  { date: "2025-10-15", concept: "Pago diario - Juan Pérez", value: 10000, method: "Efectivo", status: "Completado", type: "pago" },
  { date: "2025-10-14", concept: "Venta producto - Proteína", value: 85000, method: "Transferencia", status: "Pendiente", type: "producto" },
  { date: "2025-10-13", concept: "Renovación membresía - Laura G.", value: 120000, method: "Efectivo", status: "Completado", type: "membresia" },
];

// Renderizar tabla con animación
const tbody = document.getElementById("latestRecords");
tbody.innerHTML = "";

latestRecords.forEach((r, i) => {
  const icon = r.type === "pago"
    ? `<i data-feather="credit-card" class="text-info"></i>`
    : r.type === "producto"
    ? `<i data-feather="shopping-bag" class="text-warning"></i>`
    : `<i data-feather="user-check" class="text-success"></i>`;

  const color = r.status === "Pendiente" ? "text-warning" : "text-success";

  const row = document.createElement("tr");
  row.classList.add("fade-in-row");
  row.style.animationDelay = `${i * 0.1}s`;
  row.innerHTML = `
    <td>${r.date}</td>
    <td>${icon} ${r.concept}</td>
    <td class="text-end ${color}">$${r.value.toLocaleString()}</td>
    <td class="text-center">
      <button class="btn btn-sm btn-outline-info" data-index="${i}" data-bs-toggle="modal" data-bs-target="#recordDetailModal">
        Ver
      </button>
    </td>
  `;
  tbody.appendChild(row);
});

feather.replace();

// Mostrar detalles en modal
document.querySelectorAll('[data-bs-target="#recordDetailModal"]').forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const i = e.target.dataset.index;
    const r = latestRecords[i];
    document.getElementById("detailDate").textContent = r.date;
    document.getElementById("detailConcept").textContent = r.concept;
    document.getElementById("detailValue").textContent = `$${r.value.toLocaleString()}`;
    document.getElementById("detailMethod").textContent = r.method;
    document.getElementById("detailStatus").textContent = r.status;
  });
});

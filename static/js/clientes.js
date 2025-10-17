document.addEventListener("DOMContentLoaded", () => {
  const method = document.getElementById("dailyPaymentMethod");
  const status = document.getElementById("dailyPaymentStatus");

  method.addEventListener("change", () => {
    if (method.value === "transferencia") {
      status.value = "Pendiente";
    } else if (method.value === "efectivo") {
      status.value = "Completado";
    } else {
      status.value = "";
    }
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchClients");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const tableBody = document.getElementById("clientsTableBody");
  const clientsCount = document.getElementById("clientsCount");
  const filteredLabel = document.getElementById("clientsFilteredLabel");
  const clientsActiveCount = document.getElementById("clientsActiveCount");

  let activeFilter = null; // ← guarda el filtro activo

  updateCounts();

  // --- Búsqueda ---
  searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase().trim();
    filterRows((row) => {
      const text = row.textContent.toLowerCase();
      return text.includes(term);
    });
  });

  // --- Filtros ---
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const label = btn.querySelector("span").textContent.trim();

      // Si es el mismo filtro activo → desactívalo
      if (activeFilter === label) {
        btn.classList.remove("active", "btn-secondary");
        activeFilter = null;
        filteredLabel.textContent = "Todos";
        showAllRows();
        return;
      }

      // Si se selecciona otro filtro → activar este
      filterButtons.forEach((b) => b.classList.remove("active", "btn-secondary"));
      btn.classList.add("active", "btn-secondary");
      activeFilter = label;
      filteredLabel.textContent = label;

      filterByType(label);
    });
  });

  // --- Función principal para filtrar filas ---
  function filterRows(callback) {
    const rows = tableBody.querySelectorAll("tr");
    let visibleCount = 0;

    rows.forEach((row) => {
      if (callback(row)) {
        row.style.display = "";
        visibleCount++;
      } else {
        row.style.display = "none";
      }
    });

    clientsCount.textContent = rows.length;
    clientsActiveCount.textContent = `Activos: ${visibleCount}`;
  }

  // --- Mostrar todas las filas ---
  function showAllRows() {
    const rows = tableBody.querySelectorAll("tr");
    rows.forEach((row) => (row.style.display = ""));
    clientsCount.textContent = rows.length;
    clientsActiveCount.textContent = `Activos: ${rows.length}`;
  }

  // --- Filtro por tipo ---
  function filterByType(type) {
    filterRows((row) => {
      const membership = row.querySelector("td:nth-child(4) span").textContent.toLowerCase();
      const status = row.querySelector("td:nth-child(5) span").textContent.toLowerCase();

      switch (type.toLowerCase()) {
        case "activas":
          return status.includes("activa");
        case "próximas a vencer":
          return status.includes("vencer");
        case "vencidas":
          return status.includes("vencida");
        case "pagos diarios":
          return membership.includes("diario");
        case "en revisión":
          return status.includes("pendiente") || status.includes("revisión");
        case "todas":
          return true;
        default:
          return true;
      }
    });
  }

  // --- Actualiza contadores iniciales ---
  function updateCounts() {
    const rows = tableBody.querySelectorAll("tr");
    clientsCount.textContent = rows.length;
    clientsActiveCount.textContent = `Activos: ${rows.length}`;
  }
});


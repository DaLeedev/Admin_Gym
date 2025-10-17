document.addEventListener("DOMContentLoaded", () => {
  const filterStatus = document.getElementById("filterStatus");
  const filterUser = document.getElementById("filterUser");
  const filterDate = document.getElementById("filterDate");
  const paymentsTable = document.getElementById("paymentsTable");
  const rows = paymentsTable.getElementsByTagName("tr");

  // 🔄 Función principal para filtrar
  const applyFilters = () => {
    const statusValue = filterStatus.value.toLowerCase();
    const userValue = filterUser.value.toLowerCase();
    const dateValue = filterDate.value;

    for (let row of rows) {
      const user = row.cells[1].textContent.toLowerCase();
      const method = row.cells[3].textContent.toLowerCase();
      const date = row.cells[4].textContent.trim();
      const status = row.cells[5].textContent.toLowerCase();

      // Verifica condiciones de coincidencia
      const matchStatus = !statusValue || status.includes(statusValue);
      const matchUser = !userValue || user.includes(userValue);
      const matchDate = !dateValue || date === dateValue;

      // Si cumple con todo, mostrar; si no, ocultar
      if (matchStatus && matchUser && matchDate) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    }
  };

  // 🎯 Eventos
  filterStatus.addEventListener("change", applyFilters);
  filterUser.addEventListener("input", applyFilters);
  filterDate.addEventListener("change", applyFilters);

  // 🔁 Botón de refrescar (reinicia filtros)
  document.getElementById("refreshPayments").addEventListener("click", () => {
    filterStatus.value = "";
    filterUser.value = "";
    filterDate.value = "";
    applyFilters();
  });
});

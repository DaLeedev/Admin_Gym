document.addEventListener("DOMContentLoaded", () => {
  feather.replace();

  const searchInput = document.getElementById("searchProduct");
  const filterCategory = document.getElementById("filterCategory");
  const filterStatus = document.getElementById("filterStatus");
  const tableBody = document.getElementById("productTable");

  const applyFilters = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const category = filterCategory.value.toLowerCase();
    const status = filterStatus.value.toLowerCase();

    let total = 0;
    let stockSum = 0;

    Array.from(tableBody.rows).forEach((row) => {
      const product = row.cells[1].textContent.toLowerCase();
      const cat = row.cells[2].textContent.toLowerCase();
      const state = row.cells[6].textContent.toLowerCase();
      const stock = parseInt(row.cells[3].textContent);

      const matches =
        (product.includes(searchTerm) ||
          cat.includes(searchTerm) ||
          state.includes(searchTerm)) &&
        (category === "" || cat === category) &&
        (status === "" || state === status);

      row.style.display = matches ? "" : "none";

      if (matches) {
        total++;
        stockSum += stock;
      }
    });

    document.getElementById("totalProducts").textContent = total;
    document.getElementById("totalStock").textContent = stockSum;
  };

  searchInput.addEventListener("input", applyFilters);
  filterCategory.addEventListener("change", applyFilters);
  filterStatus.addEventListener("change", applyFilters);

  // === Chart.js ===
  // ==== GRÁFICO MODERNO DE VENTAS POR CATEGORÍA ====
  const ctx = document.getElementById("salesChart").getContext("2d");

  // Crear degradado (de naranja a amarillo)
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, "#FFD700"); // Amarillo
  gradient.addColorStop(1, "#FF8C00"); // Naranja

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Proteínas", "Accesorios", "Batidos", "Ropa", "Bebidas"],
      datasets: [
        {
          label: "Ventas (COP)",
          data: [4250000, 1800000, 950000, 700000, 1200000],
          backgroundColor: gradient,
          borderRadius: 10,
          barThickness: 40,
          borderSkipped: false,
          borderColor: "#222",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: false,
        },
        tooltip: {
          backgroundColor: "#1e1e1e",
          titleColor: "#FFD700",
          bodyColor: "#fff",
          cornerRadius: 8,
          padding: 10,
          callbacks: {
            label: function (context) {
              return ` $${context.formattedValue.toLocaleString("es-CO")}`;
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#FFD700",
            font: {
              weight: "bold",
            },
          },
          grid: {
            color: "rgba(255, 215, 0, 0.1)",
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: "#aaa",
            callback: (value) => `$${value / 1000}k`,
          },
          grid: {
            color: "rgba(255,255,255,0.1)",
          },
        },
      },
      animation: {
        duration: 1500,
        easing: "easeOutQuart",
      },
    },
  });
});

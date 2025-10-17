document.addEventListener("DOMContentLoaded", async () => {
  /* ============================================================
     📈 LINE CHART – Ventas Mensuales
  ============================================================ */
  const ctxLine = document.getElementById("chartjs-dashboard-line");
  if (ctxLine) {
    const ctx = ctxLine.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 8, 0, 200);
    gradient.addColorStop(0, "rgba(255, 213, 79, 0.7)");
    gradient.addColorStop(1, "rgba(215, 227, 244, 0)");

    new Chart(ctx, {
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
            label: "Ganancias ($)",
            fill: true,
            backgroundColor: gradient,
            borderColor: "#ffc800d8",
            data: [
              2115, 1562, 1584, 1892, 1587, 1923, 2566, 2448, 2805, 3438, 2917,
              3327,
            ],
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: "rgba(0,0,0,0)" } },
          y: {
            ticks: { stepSize: 1000 },
            grid: { color: "rgba(0,0,0,0)" },
          },
        },
      },
    });
  }

  /* ============================================================
     📊 BAR CHART – Datos Anuales
  ============================================================ */
  const barCanvas = document.getElementById("chartjs-dashboard-bar");
  if (barCanvas) {
    new Chart(barCanvas, {
      type: "bar",
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
            label: "Este año",
            backgroundColor: "#ffc800d8",
            borderColor: "#ffc800d8",
            hoverBackgroundColor: "#ffc8007a",
            hoverBorderColor: "#ffc800d2",
            data: [54, 67, 41, 55, 62, 45, 55, 73, 60, 76, 48, 79],
            barPercentage: 0.75,
            categoryPercentage: 0.5,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            grid: { display: false },
            ticks: { stepSize: 20 },
          },
          x: { grid: { color: "transparent" } },
        },
      },
    });
  }

  /* ============================================================
     📅 FLATPICKR – Calendario Dashboard
  ============================================================ */
  const calendar = document.getElementById("datetimepicker-dashboard");
  if (calendar) {
    flatpickr(calendar, {
      inline: true,
      dateFormat: "Y-m-d",
      defaultDate: "today",
      locale: {
        firstDayOfWeek: 1,
        weekdays: {
          shorthand: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
          longhand: [
            "Domingo",
            "Lunes",
            "Martes",
            "Miércoles",
            "Jueves",
            "Viernes",
            "Sábado",
          ],
        },
        months: {
          shorthand: [
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
          longhand: [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre",
          ],
        },
      },
    });
  }

  /* ============================================================
     🧭 NAVBAR Y FOOTER DINÁMICOS
  ============================================================ */
  try {
    await Promise.all([
      loadPartial("navbar", "../components/navbar.html"),
      loadPartial("footer", "../components/footer.html"),
    ]);

    if (window.feather) feather.replace();

    initSidebarToggle();
    setActiveLink();
    window.addEventListener("popstate", setActiveLink);
  } catch (err) {
    console.error("Error cargando parciales:", err);
  }
});

/* ============================================================
   🔧 FUNCIONES AUXILIARES
============================================================ */
const normalizePath = (path) => path.replace(/^\/|\/$/g, "").toLowerCase();

const getFileName = (path) => path.split("/").pop().split("?")[0].split("#")[0];

const currentFile = getFileName(window.location.pathname);

function setActiveLink() {
  document.querySelectorAll("#navbar .nav-item").forEach((li) => {
    const a = li.querySelector("a.nav-link, a");
    if (!a) return;
    const href = a.getAttribute("href") || "";
    if (!href || href === "#" || href.startsWith("javascript:")) return;

    const linkPath = normalizePath(href);
    const linkFile = getFileName(linkPath);
    if (linkFile === currentFile) {
      li.classList.add("active");
      a.classList.add("active");
    } else {
      li.classList.remove("active");
      a.classList.remove("active");
    }
  });
}

// 🔹 Cargar componentes parciales (navbar/footer)
async function loadPartial(id, file) {
  const el = document.getElementById(id);
  if (!el) return;
  const response = await fetch(file);
  if (!response.ok) throw new Error(`No se pudo cargar ${file}`);
  el.innerHTML = await response.text();
}

// 🔹 Inicializa el toggle del sidebar
function initSidebarToggle() {
  const toggle = document.querySelector(".js-sidebar-toggle");
  const sidebar = document.querySelector("#sidebar");
  if (toggle && sidebar) {
    toggle.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
    });
  }
}

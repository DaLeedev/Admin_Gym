// js/loadSidebar.js
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Cargar sidebar.html
    const response = await fetch("../components/sidebar.html");
    const sidebarHTML = await response.text();
    document.getElementById("sidebar-container").innerHTML = sidebarHTML;

    // Reemplazar iconos feather
    if (typeof feather !== "undefined") feather.replace();

    // Detectar la página actual y activar el enlace
    const currentPage = window.location.pathname.split("/").pop(); // ej: "membresia.html"
    const links = document.querySelectorAll(".sidebar-link");

    links.forEach((link) => {
      const href = link.getAttribute("href");
      if (href === currentPage) {
        link.parentElement.classList.add("active");
      } else {
        link.parentElement.classList.remove("active");
      }
    });
  } catch (error) {
    console.error("Error cargando sidebar:", error);
  }

  
});

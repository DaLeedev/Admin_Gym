// main.js - reemplaza el actual con esto

// Carga parcial (devuelve Promise)
const loadPartial = (id, file) => {
  const container = document.getElementById(id);
  if (!container) return Promise.resolve();
  return fetch(`/components/${file}`)
    .then((res) => {
      if (!res.ok) throw new Error(`Error ${res.status}`);
      return res.text();
    })
    .then((html) => {
      container.innerHTML = html;
    })
    .catch((err) => {
      console.error(`Error cargando ${file}:`, err);
    });
};

// Normaliza path (quita query/hash, maneja slash final)
const normalizePath = (p) => {
  if (!p) return "/index.html";
  try {
    const u = new URL(p, window.location.origin);
    p = u.pathname;
  } catch (e) {
    // p puede ser relativo, ok
  }
  p = p.split(/[?#]/)[0]; // quitar query/hash
  if (p.endsWith("/")) p = p.slice(0, -1);
  if (p === "") p = "/";
  return p;
};

const getFileName = (path) => {
  // path: '/admin/pages-profile.html' -> 'pages-profile.html'
  if (!path) return "index.html";
  const parts = path.split("/");
  let last = parts.pop();
  if (!last) last = parts.pop(); // por si termina en '/'
  return last || "index.html";
};

// Marca el enlace activo: aplica .active al <li> (sidebar-item / nav-item) y al <a>
const setActiveLink = () => {
  const currentPath = normalizePath(window.location.pathname); // e.g. '/index.html' or '/'
  const currentFile = getFileName(currentPath); // 'index.html' o 'pages-profile.html'

  // Quitar active previos
  document
    .querySelectorAll("#sidebar .sidebar-item.active")
    .forEach((li) => li.classList.remove("active"));
  document
    .querySelectorAll("#sidebar .sidebar-link.active")
    .forEach((a) => a.classList.remove("active"));
  document
    .querySelectorAll("#navbar .nav-item.active")
    .forEach((li) => li.classList.remove("active"));
  document
    .querySelectorAll("#navbar .nav-link.active")
    .forEach((a) => a.classList.remove("active"));

  // Procesa sidebar (li.sidebar-item)
  document.querySelectorAll("#sidebar .sidebar-item").forEach((li) => {
    const a = li.querySelector("a.sidebar-link") || li.querySelector("a");
    if (!a) return;
    const href = a.getAttribute("href") || "";
    if (!href || href === "#" || href.startsWith("javascript:")) return;

    const linkPath = normalizePath(href);
    const linkFile = getFileName(linkPath);

    if (linkFile === currentFile) {
      li.classList.add("active");
      a.classList.add("active");
    }
  });

  // Procesa navbar nav-items (si tienes enlaces en el navbar)
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
    }
  });

  // DEBUG opcional: ver qué archivo detecta la página
  // console.log("setActiveLink -> currentFile:", currentFile);
};

// Toggle sidebar
const toggleSidebar = (e) => {
  if (e) e.preventDefault();
  const sidebar = document.querySelector(".sidebar");
  if (sidebar) sidebar.classList.toggle("collapsed");
};

const initSidebarToggle = () => {
  // Delegación segura: elimina listener previo y lo reasigna
  const toggle = document.querySelector(".js-sidebar-toggle");
  if (!toggle) return;
  toggle.removeEventListener("click", toggleSidebar);
  toggle.addEventListener("click", toggleSidebar);
};

// Init: carga todos los parciales y luego ejecuta las inicializaciones
document.addEventListener("DOMContentLoaded", () => {
  Promise.all([
    loadPartial("navbar", "navbar.html"),
    loadPartial("footer", "footer.html"),
  ])
    .then(() => {
      // Reemplazar icons feather si procede
      if (window.feather) feather.replace();

      // Inicia toggle y marcas
      initSidebarToggle();
      setActiveLink();

      // Si tu aplicación usa history API (pushState), actualiza active al navegar
      window.addEventListener("popstate", setActiveLink);
    })

    .catch((err) => {
      console.error("Error cargando parciales:", err);
    });
});



//-------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("togglePasswordFields");
  const passwordSection = document.getElementById("passwordFields");

  toggleBtn.addEventListener("click", () => {
    const isVisible = passwordSection.style.display === "block";
    passwordSection.style.display = isVisible ? "none" : "block";
    toggleBtn.textContent = isVisible
      ? "Cambiar contraseña"
      : "Cancelar cambio de contraseña";
  });

  // Validación de fuerza de contraseña
  const newPass = document.getElementById("newPassword");
  const strengthText = document.getElementById("passwordStrength");

  newPass?.addEventListener("input", (e) => {
    const val = e.target.value;
    if (val.length < 6) strengthText.textContent = "Fuerza: débil";
    else if (/[A-Z]/.test(val) && /[0-9]/.test(val))
      strengthText.textContent = "Fuerza: fuerte";
    else strengthText.textContent = "Fuerza: media";
  });
});


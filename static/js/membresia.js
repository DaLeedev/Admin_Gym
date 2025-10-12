// Selección de elementos
const btnAddMembership = document.getElementById("btnAddMembership");
const membershipModal = new bootstrap.Modal(
  document.getElementById("membershipModal")
);
const membershipForm = document.getElementById("membershipForm");
const saveMembershipBtn = document.getElementById("saveMembership");
const membershipsTableBody = document.getElementById("membershipsTableBody");
const membershipsCount = document.getElementById("membershipsCount");
const searchMemberships = document.getElementById("searchMemberships");
const filterButtons = document.querySelectorAll("[data-filter]");

// Lista de membresías (simulación de base de datos)
let memberships = [];
let editIndex = null;

// Función para renderizar la tabla
function renderTable(list) {
  membershipsTableBody.innerHTML = "";
  list.forEach((m, index) => {
    const row = document.createElement("tr");
    row.setAttribute("data-status", m.status);
    row.innerHTML = `
      <td>${m.client}</td>
      <td>${m.type}</td>
      <td>
        <span class="badge ${
          m.status === "active"
            ? "bg-success"
            : m.status === "expiring"
            ? "bg-warning text-dark"
            : "bg-danger"
        }">
          ${
            m.status === "active"
              ? "Activa"
              : m.status === "expiring"
              ? "Próxima a vencer"
              : "Vencida"
          }
        </span>
      </td>
      <td>${m.startDate}</td>
      <td>${m.endDate}</td>
      <td class="text-end">
        <button class="btn btn-sm btn-outline-light me-1 editMembership" data-index="${index}">
          <i data-feather="edit"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger deleteMembership" data-index="${index}">
          <i data-feather="trash-2"></i>
        </button>
      </td>
    `;
    membershipsTableBody.appendChild(row);
  });
  feather.replace(); // Actualiza los iconos feather
  membershipsCount.textContent = memberships.length;
}

// Abrir modal para agregar nueva membresía
btnAddMembership.addEventListener("click", () => {
  membershipForm.reset();
  editIndex = null;
  membershipModal.show();
});

// Guardar membresía (nuevo o editar)
saveMembershipBtn.addEventListener("click", () => {
  const formData = new FormData(membershipForm);
  const membershipData = {
    client: formData.get("client") || membershipForm[0].value,
    type: membershipForm[1].value,
    startDate: membershipForm[2].value,
    endDate: membershipForm[3].value,
    status: membershipForm[4].value,
  };

  if (
    !membershipData.client ||
    !membershipData.startDate ||
    !membershipData.endDate
  ) {
    alert("Por favor completa todos los campos obligatorios.");
    return;
  }

  if (editIndex !== null) {
    memberships[editIndex] = membershipData;
  } else {
    memberships.push(membershipData);
  }

  renderTable(memberships);
  membershipModal.hide();
});

// Editar membresía
membershipsTableBody.addEventListener("click", (e) => {
  if (e.target.closest(".editMembership")) {
    editIndex = parseInt(e.target.closest(".editMembership").dataset.index);
    const m = memberships[editIndex];
    membershipForm[0].value = m.client;
    membershipForm[1].value = m.type;
    membershipForm[2].value = m.startDate;
    membershipForm[3].value = m.endDate;
    membershipForm[4].value = m.status;
    membershipModal.show();
  }

  // Eliminar membresía
  if (e.target.closest(".deleteMembership")) {
    const index = parseInt(e.target.closest(".deleteMembership").dataset.index);
    if (
      confirm(`¿Deseas eliminar la membresía de ${memberships[index].client}?`)
    ) {
      memberships.splice(index, 1);
      renderTable(memberships);
    }
  }
});

// Filtrar membresías
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.filter;
    let filtered = memberships;
    if (filter !== "all") {
      filtered = memberships.filter((m) => m.status === filter);
    }
    renderTable(filtered);
  });
});

// Buscador
searchMemberships.addEventListener("input", () => {
  const query = searchMemberships.value.toLowerCase();
  const filtered = memberships.filter(
    (m) =>
      m.client.toLowerCase().includes(query) ||
      m.type.toLowerCase().includes(query)
  );
  renderTable(filtered);
});

// Inicializar tabla vacía
renderTable(memberships);

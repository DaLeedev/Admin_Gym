// Inicializamos modales de Bootstrap
const clientFormModal = new bootstrap.Modal(
  document.getElementById("clientFormModal")
);
const clientViewModal = new bootstrap.Modal(
  document.getElementById("clientViewModal")
);
const confirmDeleteModal = new bootstrap.Modal(
  document.getElementById("confirmDeleteModal")
);

// Botones
const btnAddClient = document.getElementById("btnAddClient");
const saveClientBtn = document.getElementById("saveClientBtn");
const btnRenewMembership = document.getElementById("btnRenewMembership");
const btnRegisterDailyPayment = document.getElementById(
  "btnRegisterDailyPayment"
);
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

// Inputs del formulario
const clientPhoto = document.getElementById("clientPhoto");
const clientPhotoPreview = document.getElementById("clientPhotoPreview");
const clientForm = document.getElementById("clientForm");

// Lista de clientes simulada
let clients = [];
let selectedClientId = null;

// -------------------- FUNCIONES -------------------- //

// Abrir modal para agregar cliente
btnAddClient.addEventListener("click", () => {
  clientForm.reset();
  clientPhotoPreview.style.display = "none";
  selectedClientId = null;
  clientFormModal.show();
});

// Previsualizar foto
clientPhoto.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    clientPhotoPreview.src = URL.createObjectURL(file);
    clientPhotoPreview.style.display = "block";
  }
});

// Guardar cliente (nuevo o editar)
saveClientBtn.addEventListener("click", () => {
  const clientData = {
    id: selectedClientId ?? Date.now(),
    name: document.getElementById("clientName").value,
    email: document.getElementById("clientEmail").value,
    phone: document.getElementById("clientPhone").value,
    idNumber: document.getElementById("clientIdNumber").value,
    membershipType: document.getElementById("clientMembershipType").value,
    membershipStart: document.getElementById("clientMembershipStart").value,
    membershipEnd: document.getElementById("clientMembershipEnd").value,
    paymentMethod: document.getElementById("paymentMethod").value,
    paymentStatus: document.getElementById("paymentStatus").value,
    price: document.getElementById("membershipPrice").value,
    photo: clientPhotoPreview.src || "",
  };

  if (selectedClientId) {
    // Editar cliente
    clients = clients.map((c) => (c.id === selectedClientId ? clientData : c));
  } else {
    // Nuevo cliente
    clients.push(clientData);
  }

  clientFormModal.hide();
  renderClientsTable();
});

// Abrir modal para ver cliente
function openViewClientModal(clientId) {
  const client = clients.find((c) => c.id === clientId);
  if (!client) return;

  document.getElementById("viewPhoto").src =
    client.photo || "https://via.placeholder.com/150";
  document.getElementById("viewName").textContent = client.name;
  document.getElementById("viewIdNumber").textContent = client.idNumber;
  document.getElementById("viewContact").innerHTML = `
        ${client.email ? "Email: " + client.email + "<br>" : ""}
        ${client.phone ? "Teléfono: " + client.phone : ""}
    `;
  document.getElementById("viewMembership").textContent = client.membershipType;
  document.getElementById("viewLastPayment").textContent = client.paymentStatus;

  selectedClientId = clientId;
  clientViewModal.show();
}

// Abrir modal para confirmar eliminación
function openConfirmDeleteModal(clientId) {
  selectedClientId = clientId;
  confirmDeleteModal.show();
}

// Confirmar eliminación
confirmDeleteBtn.addEventListener("click", () => {
  clients = clients.filter((c) => c.id !== selectedClientId);
  confirmDeleteModal.hide();
  renderClientsTable();
});

// -------------------- RENDER TABLA -------------------- //
const clientsTableBody = document.getElementById("clientsTableBody");

function renderClientsTable() {
  clientsTableBody.innerHTML = "";
  clients.forEach((client) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td><img src="${
              client.photo || "https://via.placeholder.com/50"
            }" alt="" class="rounded-circle" style="width:40px;height:40px;object-fit:cover;"></td>
            <td>${client.name}</td>
            <td>${client.idNumber}</td>
            <td>${client.membershipType}</td>
            <td>${client.paymentStatus}</td>
            <td>${client.membershipEnd}</td>
            <td class="text-end">
                <button class="btn btn-sm btn-info me-1" onclick="openViewClientModal(${
                  client.id
                })">Ver</button>
                <button class="btn btn-sm btn-warning me-1" onclick="editClient(${
                  client.id
                })">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="openConfirmDeleteModal(${
                  client.id
                })">Eliminar</button>
            </td>
        `;
    clientsTableBody.appendChild(tr);
  });
}

// -------------------- EDITAR CLIENTE -------------------- //
function editClient(clientId) {
  const client = clients.find((c) => c.id === clientId);
  if (!client) return;

  selectedClientId = clientId;
  document.getElementById("clientName").value = client.name;
  document.getElementById("clientEmail").value = client.email;
  document.getElementById("clientPhone").value = client.phone;
  document.getElementById("clientIdNumber").value = client.idNumber;
  document.getElementById("clientMembershipType").value = client.membershipType;
  document.getElementById("clientMembershipStart").value =
    client.membershipStart;
  document.getElementById("clientMembershipEnd").value = client.membershipEnd;
  document.getElementById("paymentMethod").value = client.paymentMethod;
  document.getElementById("paymentStatus").value = client.paymentStatus;
  document.getElementById("membershipPrice").value = client.price;

  if (client.photo) {
    clientPhotoPreview.src = client.photo;
    clientPhotoPreview.style.display = "block";
  }

  clientFormModal.show();
}

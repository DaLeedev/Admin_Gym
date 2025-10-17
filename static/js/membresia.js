// Boton editar con Valores

document.querySelectorAll(".btnEditar").forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.getAttribute("data-id");
    const nombre = btn.getAttribute("data-nombre");
    const duracion = btn.getAttribute("data-duracion");
    const precio = btn.getAttribute("data-precio");

    document.getElementById("editarId").value = id;
    document.getElementById("editarNombre").value = nombre;
    document.getElementById("editarDuracion").value = duracion;
    document.getElementById("editarPrecio").value = precio;

    const modal = new bootstrap.Modal(
      document.getElementById("editarMembresiaModal")
    );
    modal.show();
  });
});

// ---------------------------------------------

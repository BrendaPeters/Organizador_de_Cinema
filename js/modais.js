function abrirModal(id) {
  document.getElementById(id).classList.add("aberto");
  document.body.style.overflow = "hidden";
}

function fecharModal(id) {
  document.getElementById(id).classList.remove("aberto");
  document.body.style.overflow = "";
}

document.querySelectorAll(".modal-overlay").forEach(modal => {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) fecharModal(modal.id);
  });
  modal.addEventListener("keydown", (e) => {
    if (e.key === "Escape") fecharModal(modal.id);
  });
});
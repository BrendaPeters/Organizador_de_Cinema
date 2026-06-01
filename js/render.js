function renderFilmesAgendados() {
  const lista = document.getElementById("lista-filmes");
  if (!lista) return;

  const chaves = Object.keys(filmesAgendados).sort();

  if (!chaves.length) {
    lista.innerHTML = `<li class="sem-filmes">Nenhum filme agendado ainda. Clique em uma data no calendário para começar! 🎬</li>`;
    return;
  }

  lista.innerHTML = chaves.map(chave => {
    const [ano, mes, dia] = chave.split("-");
    const dataFormatada   = `${dia}/${mes}/${ano}`;
    const filmes          = filmesAgendados[chave];

    const filmesHtml = filmes.map(f => `
      <div class="filme-item">
        <span class="filme-horario">${f.horario}</span>
        <span class="filme-titulo">${f.titulo}</span>
        <button class="filme-del" data-chave="${chave}" data-id="${f.id}" title="Remover">✕</button>
      </div>
    `).join("");

    return `
      <li class="dia-agendado">
        <div class="dia-cabecalho">
          <strong>${dataFormatada}</strong>
        </div>
        <div class="dia-filmes">${filmesHtml}</div>
      </li>
    `;
  }).join("");

  lista.querySelectorAll(".filme-del").forEach(btn => {
    btn.addEventListener("click", () => {
      const { chave, id } = btn.dataset;
      if (!filmesAgendados[chave]) return;
      if (!confirm(`Remover este filme?`)) return;
      filmesAgendados[chave] = filmesAgendados[chave].filter(f => f.id !== id);
      if (!filmesAgendados[chave].length) delete filmesAgendados[chave];
      salvarEstado();
      renderFilmesAgendados();
      renderCalendario();
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const original = salvarEstado;
  window.salvarEstado = function () {
    original();
    renderFilmesAgendados();
  };
  setTimeout(renderFilmesAgendados, 50);
});

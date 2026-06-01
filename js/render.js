

function renderFilmesAgendados() {
  const lista = document.getElementById("lista-filmes");
  if (!lista) return;

  // Coleta todos os dias com filmes, ordenados por data
  const chaves = Object.keys(filmesAgendados).sort();

  if (!chaves.length) {
    lista.innerHTML = `<li class="sem-filmes">Nenhum filme agendado ainda. Clique em uma data no calendário para começar! 🎬</li>`;
    return;
  }

  lista.innerHTML = chaves.map(chave => {
    const [ano, mes, dia] = chave.split("-");
    const dataFormatada   = `${dia}/${mes}/${ano}`;
    const bloqueado       = diasBloqueados.has(chave);
    const filmes          = filmesAgendados[chave];

    const filmesHtml = filmes.map(f => `
      <div class="filme-item">
        <span class="filme-horario">${f.horario}</span>
        <span class="filme-titulo">${f.titulo}</span>
        ${!bloqueado
          ? `<button class="filme-del" data-chave="${chave}" data-id="${f.id}" title="Remover">✕</button>`
          : `<span class="filme-lock" title="Dia bloqueado">🔒</span>`
        }
      </div>
    `).join("");

    return `
      <li class="dia-agendado ${bloqueado ? "bloqueado" : ""}">
        <div class="dia-cabecalho">
          <strong>${dataFormatada}</strong>
          ${bloqueado ? '<span class="tag-bloqueado">🔒 Bloqueado</span>' : ""}
        </div>
        <div class="dia-filmes">${filmesHtml}</div>
      </li>
    `;
  }).join("");

  // Handlers de remoção
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

const _salvarEstadoOriginal = typeof salvarEstado === "function" ? salvarEstado : null;

// Aguarda o calendario.js definir salvarEstado e então estende
document.addEventListener("DOMContentLoaded", () => {
  const original = salvarEstado; // referência definida em calendario.js
  // Substitui por versão que também atualiza a lista
  window.salvarEstado = function () {
    original();
    renderFilmesAgendados();
  };

  // Primeira renderização (dados já carregados pelo calendario.js via DOMContentLoaded)
  // Aguarda um tick para garantir que calendario.js rodou primeiro
  setTimeout(renderFilmesAgendados, 50);
});
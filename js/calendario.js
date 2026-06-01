
// ─── Estado global ──────────────────────────────────────────
let usuarioLogado = null;          // string: nome do usuário
let mesAtual = new Date().getMonth();
let anoAtual = new Date().getFullYear();
let dataSelecionada = null;        // string "YYYY-MM-DD"

// filmesAgendados  →  { "YYYY-MM-DD": [ { id, titulo, horario } ] }
// diasBloqueados   →  Set de strings "YYYY-MM-DD"
let filmesAgendados = {};
let diasBloqueados  = new Set();

// ─── Persistência ───────────────────────────────────────────
function salvarEstado() {
  localStorage.setItem("pipoteca_filmes",    JSON.stringify(filmesAgendados));
  localStorage.setItem("pipoteca_bloqueados", JSON.stringify([...diasBloqueados]));
}

function carregarEstado() {
  try {
    const f = localStorage.getItem("pipoteca_filmes");
    const b = localStorage.getItem("pipoteca_bloqueados");
    if (f) filmesAgendados = JSON.parse(f);
    if (b) diasBloqueados  = new Set(JSON.parse(b));
  } catch (e) {
    filmesAgendados = {};
    diasBloqueados  = new Set();
  }
}

// ─── Helpers ────────────────────────────────────────────────
function chaveData(ano, mes, dia) {
  return `${ano}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

// ─── 1. LOGIN ───────────────────────────────────────────────
function iniciarLogin() {
  const salvo = localStorage.getItem("pipoteca_usuario");
  if (salvo) {
    usuarioLogado = salvo;
    mostrarApp();
    return;
  }
  criarModalLogin();
}

function criarModalLogin() {
  // Evita duplicar se já existe
  if (document.getElementById("modal-login")) return;

  const overlay = document.createElement("div");
  overlay.id = "modal-login";
  overlay.className = "modal-overlay aberto";
  overlay.innerHTML = `
    <div class="modal-conteudo modal-login-conteudo">
      <h3>🍿 Bem-vindo à Pipoteca</h3>
      <p>Digite seu nome para começar:</p>
      <input type="text" id="input-login-nome" placeholder="Seu nome" maxlength="40" autocomplete="off">
      <div id="login-erro" style="color:#e53;font-size:.85rem;min-height:1.2em"></div>
      <div class="modal-botoes">
        <button id="btn-entrar-login">Entrar</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const inputNome = document.getElementById("input-login-nome");
  const btnEntrar = document.getElementById("btn-entrar-login");
  const erroEl   = document.getElementById("login-erro");

  function tentarLogin() {
    const nome = inputNome.value.trim();
    if (!nome) { erroEl.textContent = "Por favor, informe seu nome."; return; }
    usuarioLogado = nome;
    localStorage.setItem("pipoteca_usuario", nome);
    overlay.remove();
    mostrarApp();
  }

  btnEntrar.addEventListener("click", tentarLogin);
  inputNome.addEventListener("keydown", e => { if (e.key === "Enter") tentarLogin(); });
  // Não fecha ao clicar fora – login é obrigatório
}

function mostrarApp() {
  // Exibe nome do usuário no header se houver elemento para isso
  const nomeEl = document.getElementById("usuario-nome");
  if (nomeEl) nomeEl.textContent = usuarioLogado;

  carregarEstado();
  renderCalendario();

  // Garante que o calendário esteja visível
  const secCal = document.getElementById("section-calendario");
  if (secCal) secCal.style.display = "";
}

// ─── 2. CALENDÁRIO ──────────────────────────────────────────
const MESES_PT = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
];
const DIAS_PT = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

function renderCalendario() {
  const container = document.getElementById("calendario-container");
  if (!container) return;

  const hoje = new Date();
  const primeiroDia = new Date(anoAtual, mesAtual, 1).getDay(); // 0=Dom
  const totalDias   = new Date(anoAtual, mesAtual + 1, 0).getDate();

  let html = `
    <div class="cal-header">
      <button class="cal-nav" id="cal-prev">&#8249;</button>
      <span class="cal-titulo">${MESES_PT[mesAtual]} ${anoAtual}</span>
      <button class="cal-nav" id="cal-next">&#8250;</button>
    </div>
    <div class="cal-grid">
      ${DIAS_PT.map(d => `<div class="cal-dia-semana">${d}</div>`).join("")}
  `;

  // Células vazias antes do 1º dia
  for (let i = 0; i < primeiroDia; i++) {
    html += `<div class="cal-celula vazia"></div>`;
  }

  for (let dia = 1; dia <= totalDias; dia++) {
    const chave     = chaveData(anoAtual, mesAtual, dia);
    const ehHoje    = hoje.getDate() === dia && hoje.getMonth() === mesAtual && hoje.getFullYear() === anoAtual;
    const bloqueado = diasBloqueados.has(chave);
    const temFilmes = filmesAgendados[chave] && filmesAgendados[chave].length > 0;

    let classes = "cal-celula";
    if (ehHoje)    classes += " hoje";
    if (bloqueado) classes += " bloqueado";
    if (temFilmes) classes += " tem-filme";
    if (chave === dataSelecionada) classes += " selecionado";

    const qtd = temFilmes ? filmesAgendados[chave].length : 0;

    html += `
      <div class="${classes}" data-chave="${chave}" data-dia="${dia}">
        <span class="cal-num">${dia}</span>
        ${bloqueado ? '<span class="cal-lock" title="Dia bloqueado">🔒</span>' : ""}
        ${temFilmes && !bloqueado ? `<span class="cal-badge">${qtd}</span>` : ""}
      </div>
    `;
  }

  html += `</div>`;
  container.innerHTML = html;

  // Navegação
  document.getElementById("cal-prev").addEventListener("click", () => {
    mesAtual--;
    if (mesAtual < 0) { mesAtual = 11; anoAtual--; }
    renderCalendario();
  });
  document.getElementById("cal-next").addEventListener("click", () => {
    mesAtual++;
    if (mesAtual > 11) { mesAtual = 0; anoAtual++; }
    renderCalendario();
  });

  // Clique nas células
  container.querySelectorAll(".cal-celula:not(.vazia)").forEach(cel => {
    cel.addEventListener("click", () => {
      const chave = cel.dataset.chave;
      if (diasBloqueados.has(chave)) {
        alert("🔒 Este dia já foi bloqueado. Nenhum agendamento pode ser alterado.");
        return;
      }
      dataSelecionada = chave;
      abrirModalAgendamento(chave);
      renderCalendario(); // Atualiza seleção visual
    });
  });
}

// ─── 3. MODAL DE AGENDAMENTO ────────────────────────────────
function abrirModalAgendamento(chave) {
  // Remove modal anterior se houver
  const anterior = document.getElementById("modal-agendamento");
  if (anterior) anterior.remove();

  const [ano, mes, dia] = chave.split("-");
  const titulo = `${dia}/${mes}/${ano}`;
  const filmesDia = filmesAgendados[chave] || [];

  const overlay = document.createElement("div");
  overlay.id = "modal-agendamento";
  overlay.className = "modal-overlay aberto";
  overlay.innerHTML = `
    <div class="modal-conteudo modal-agenda-conteudo">
      <h3>📅 ${titulo}</h3>

      <div class="agenda-form">
        <label>Filme:</label>
        <div class="input-wrapper">
          <input type="text" id="agenda-input-filme" placeholder="Nome do filme..." autocomplete="off">
          <div id="agenda-sugestoes" class="sugestoes-dropdown"></div>
        </div>
        <label>Horário:</label>
        <input type="time" id="agenda-input-horario" value="20:00">
        <button id="agenda-btn-add" class="btn-salvar" style="margin-top:.5rem">Adicionar</button>
      </div>

      <div id="agenda-lista-filmes" class="agenda-lista"></div>

      <div class="modal-botoes" style="margin-top:1rem;gap:.5rem;flex-wrap:wrap">
        <button id="agenda-btn-bloquear" class="btn-bloquear">🔒 Salvar e Bloquear Dia</button>
        <button id="agenda-btn-fechar">Fechar</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  // Renderiza lista inicial
  renderListaFilmesDia(chave);

  // Sugestões inline
  const inputFilme = document.getElementById("agenda-input-filme");
  const dropAgenda = document.getElementById("agenda-sugestoes");

  function mostrarSugestoesAgenda(filtro = "") {
    dropAgenda.innerHTML = "";
    const lista = filtro
      ? filme_sugestao.filter(f => f.toLowerCase().includes(filtro.toLowerCase()))
      : filme_sugestao;
    if (!lista.length) { dropAgenda.classList.remove("aberto"); return; }
    lista.slice(0, 8).forEach(f => {
      const div = document.createElement("div");
      div.className = "opcao";
      div.textContent = f;
      div.addEventListener("click", () => {
        inputFilme.value = f;
        dropAgenda.classList.remove("aberto");
      });
      dropAgenda.appendChild(div);
    });
    dropAgenda.classList.add("aberto");
  }

  inputFilme.addEventListener("focus", () => mostrarSugestoesAgenda());
  inputFilme.addEventListener("input", () => mostrarSugestoesAgenda(inputFilme.value));
  document.addEventListener("click", function fecharDrop(e) {
    if (!e.target.closest("#modal-agendamento .input-wrapper")) {
      dropAgenda.classList.remove("aberto");
    }
  });

  // Adicionar filme
  function adicionarFilme() {
    const nome    = document.getElementById("agenda-input-filme").value.trim();
    const horario = document.getElementById("agenda-input-horario").value;
    if (!nome) { alert("Digite o nome do filme."); return; }
    if (!filmesAgendados[chave]) filmesAgendados[chave] = [];

    // Verifica conflito de horário
    const conflito = filmesAgendados[chave].find(f => f.horario === horario);
    if (conflito) {
      alert(`⚠️ Já existe "${conflito.titulo}" agendado para as ${horario} neste dia.`);
      return;
    }

    filmesAgendados[chave].push({ id: uid(), titulo: nome, horario });
    // Ordena por horário
    filmesAgendados[chave].sort((a, b) => a.horario.localeCompare(b.horario));
    salvarEstado();
    renderListaFilmesDia(chave);
    renderCalendario();
    document.getElementById("agenda-input-filme").value = "";
  }

  document.getElementById("agenda-btn-add").addEventListener("click", adicionarFilme);
  document.getElementById("agenda-input-filme").addEventListener("keydown", e => {
    if (e.key === "Enter") adicionarFilme();
    if (e.key === "Escape") overlay.remove();
  });

  // Bloquear dia
  document.getElementById("agenda-btn-bloquear").addEventListener("click", () => {
    if (!(filmesAgendados[chave] && filmesAgendados[chave].length)) {
      alert("Adicione pelo menos um filme antes de bloquear o dia.");
      return;
    }
    if (confirm(`Bloquear o dia ${titulo}? Nenhum filme poderá ser adicionado ou removido depois.`)) {
      diasBloqueados.add(chave);
      salvarEstado();
      renderCalendario();
      overlay.remove();
    }
  });

  // Fechar
  document.getElementById("agenda-btn-fechar").addEventListener("click", () => overlay.remove());
  overlay.addEventListener("click", e => { if (e.target === overlay) overlay.remove(); });
}

// ─── Renderiza lista de filmes dentro do modal ───────────────
function renderListaFilmesDia(chave) {
  const container = document.getElementById("agenda-lista-filmes");
  if (!container) return;

  const filmes = filmesAgendados[chave] || [];
  if (!filmes.length) {
    container.innerHTML = `<p class="agenda-vazia">Nenhum filme agendado para este dia.</p>`;
    return;
  }

  container.innerHTML = filmes.map(f => `
    <div class="agenda-item" data-id="${f.id}">
      <span class="agenda-horario">${f.horario}</span>
      <span class="agenda-titulo">${f.titulo}</span>
      <button class="agenda-del" data-id="${f.id}" title="Remover">✕</button>
    </div>
  `).join("");

  container.querySelectorAll(".agenda-del").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      filmesAgendados[chave] = filmesAgendados[chave].filter(f => f.id !== id);
      if (!filmesAgendados[chave].length) delete filmesAgendados[chave];
      salvarEstado();
      renderListaFilmesDia(chave);
      renderCalendario();
    });
  });
}

// ─── Inicialização ───────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  iniciarLogin();
});
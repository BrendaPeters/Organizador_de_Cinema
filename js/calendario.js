// Calendário de sessões, localStorage e modais de agendamento
var mesAtual = new Date().getMonth();
var anoAtual = new Date().getFullYear();
var dataSelecionada = null;
var filmesAgendados = {};

var MESES_PT = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
var DIAS_PT = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

function chaveData(ano, mes, dia) {
  return ano + "-" + String(mes + 1).padStart(2, "0") + "-" + String(dia).padStart(2, "0");
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function salvarEstado() {
  localStorage.setItem("pipoteca_filmes", JSON.stringify(filmesAgendados));
}

function carregarEstado() {
  try {
    var f = localStorage.getItem("pipoteca_filmes");
    if (f) filmesAgendados = JSON.parse(f);
  } catch (e) {
    filmesAgendados = {};
  }
}

function renderCalendario() {
  var container = document.getElementById("calendario-container");
  if (!container) return;

  var hoje = new Date();
  var primeiroDia = new Date(anoAtual, mesAtual, 1).getDay();
  var totalDias = new Date(anoAtual, mesAtual + 1, 0).getDate();

  var html = "";
  html += '<div class="cal-header">';
  html += '<button class="cal-nav" id="cal-prev">&#8249;</button>';
  html += '<span class="cal-titulo">' + MESES_PT[mesAtual] + " " + anoAtual + '</span>';
  html += '<button class="cal-nav" id="cal-next">&#8250;</button>';
  html += '</div>';
  html += '<div class="cal-grid">';

  for (var i = 0; i < DIAS_PT.length; i++) {
    html += '<div class="cal-dia-semana">' + DIAS_PT[i] + '</div>';
  }

  var totalDiasMesAnterior = new Date(anoAtual, mesAtual, 0).getDate();
  var inicio = totalDiasMesAnterior - primeiroDia + 1;
  for (var i = inicio; i <= totalDiasMesAnterior; i++) {
    var mesAnterior = mesAtual - 1;
    var anoAnterior = anoAtual;
    if (mesAnterior < 0) { mesAnterior = 11; anoAnterior--; }
    var chave = chaveData(anoAnterior, mesAnterior, i);
    html += '<div class="cal-celula cal-outro-mes" data-chave="' + chave + '" data-dia="' + i + '"><span class="cal-num">' + i + '</span></div>';
  }

  for (var dia = 1; dia <= totalDias; dia++) {
    var chave = chaveData(anoAtual, mesAtual, dia);
    var Hoje = hoje.getDate() === dia && hoje.getMonth() === mesAtual && hoje.getFullYear() === anoAtual;
    var temFilmes = filmesAgendados[chave] && filmesAgendados[chave].length > 0;

    var classes = "cal-celula";
    if (Hoje) classes += " hoje";
    if (temFilmes) classes += " tem-filme";
    if (chave === dataSelecionada) classes += " selecionado";

    var qtd = temFilmes ? filmesAgendados[chave].length : 0;

    html += '<div class="' + classes + '" data-chave="' + chave + '" data-dia="' + dia + '">';
    html += '<span class="cal-num">' + dia + '</span>';
    if (temFilmes) html += '<span class="cal-badge">' + qtd + '</span>';
    html += '</div>';
  }

  var totalCelulas = primeiroDia + totalDias;
  var resto = totalCelulas % 7;
  if (resto !== 0) {
    var diasProximoMes = 7 - resto;
    for (var i = 1; i <= diasProximoMes; i++) {
      var proximoMes = mesAtual + 1;
      var proximoAno = anoAtual;
      if (proximoMes > 11) { proximoMes = 0; proximoAno++; }
      var chave = chaveData(proximoAno, proximoMes, i);
      html += '<div class="cal-celula cal-outro-mes" data-chave="' + chave + '" data-dia="' + i + '"><span class="cal-num">' + i + '</span></div>';
    }
  }

  html += '</div>';
  container.innerHTML = html;

  document.getElementById("cal-prev").addEventListener("click", function() {
    mesAtual--;
    if (mesAtual < 0) { mesAtual = 11; anoAtual--; }
    renderCalendario();
    renderFilmesAgendados();
  });

  document.getElementById("cal-next").addEventListener("click", function() {
    mesAtual++;
    if (mesAtual >= 12) { mesAtual = 0; anoAtual++; }
    renderCalendario();
    renderFilmesAgendados();
  });

  var celulas = container.querySelectorAll(".cal-celula");
  for (var i = 0; i < celulas.length; i++) {
    celulas[i].addEventListener("click", function() {
      var chave = this.dataset.chave;
      dataSelecionada = chave;
      abrirModalAgendamento(chave);
      renderCalendario();
    });
  }
}

function abrirModalAgendamento(chave) {
  var anterior = document.getElementById("modal-agendamento");
  if (anterior) anterior.remove();

  var partes = chave.split("-");
  var titulo = partes[2] + "/" + partes[1] + "/" + partes[0];

  var overlay = document.createElement("div");
  overlay.id = "modal-agendamento";
  overlay.className = "modal-overlay aberto";
  overlay.innerHTML =
    '<div class="modal-conteudo modal-agenda-conteudo">' +
      '<h3>' + titulo + '</h3>' +
      '<div class="agenda-form">' +
        '<label>Filme:</label>' +
        '<div class="input-wrapper">' +
          '<input type="text" id="agenda-input-filme" placeholder="Nome do filme..." autocomplete="off">' +
          '<div id="agenda-sugestoes" class="sugestoes-dropdown"></div>' +
        '</div>' +
        '<label>Horário:</label>' +
        '<input type="time" id="agenda-input-horario" value="20:00">' +
        '<button id="agenda-btn-add" class="btn-api-carregar">Adicionar</button>' +
      '</div>' +
      '<div id="agenda-lista-filmes" class="agenda-lista"></div>' +
      '<div class="modal-botoes">' +
        '<button id="agenda-btn-fechar">Fechar</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(overlay);

  renderListaFilmesDia(chave);

  var inputFilme = document.getElementById("agenda-input-filme");
  var dropAgenda = document.getElementById("agenda-sugestoes");

  function mostrarSugestoesAgenda(filtro) {
    if (filtro === undefined) filtro = "";
    dropAgenda.innerHTML = "";
    var lista = [];
    if (filtro === "") {
      lista = filme_sugestao;
    } else {
      for (var i = 0; i < filme_sugestao.length; i++) {
        if (filme_sugestao[i].toLowerCase().indexOf(filtro.toLowerCase()) !== -1) {
          lista.push(filme_sugestao[i]);
        }
      }
    }
    if (lista.length === 0) { dropAgenda.classList.remove("aberto"); return; }
    for (var i = 0; i < lista.length; i++) {
      (function(nome) {
        var div = document.createElement("div");
        div.className = "opcao";
        div.textContent = nome;
        div.addEventListener("click", function() {
          inputFilme.value = nome;
          dropAgenda.classList.remove("aberto");
        });
        dropAgenda.appendChild(div);
      })(lista[i]);
    }
    dropAgenda.classList.add("aberto");
  }

  inputFilme.addEventListener("focus", function() { mostrarSugestoesAgenda(); });
  inputFilme.addEventListener("input", function() { mostrarSugestoesAgenda(inputFilme.value); });
  document.addEventListener("click", function fecharDrop(e) {
    if (!e.target.closest("#modal-agendamento .input-wrapper")) {
      dropAgenda.classList.remove("aberto");
    }
  });

  document.getElementById("agenda-btn-add").addEventListener("click", function() {
    var nomeDigitado = document.getElementById("agenda-input-filme").value.trim();
    var horario = document.getElementById("agenda-input-horario").value;
    if (!nomeDigitado) { alert("Escolha um filme da lista"); return; }

    var nome = buscarFilmeNaSugestao(nomeDigitado);
    if (!nome) {
      alert("Este filme não está na lista. Escolha um da lista ou adicione em \"+ Adicionar novo filme\".");
      return;
    }

    if (!filmesAgendados[chave]) filmesAgendados[chave] = [];
    var conflito = false;
    for (var i = 0; i < filmesAgendados[chave].length; i++) {
      if (filmesAgendados[chave][i].horario === horario) {
        conflito = true;
        alert("Já existe \"" + filmesAgendados[chave][i].titulo + "\" agendado para as " + horario + " neste dia.");
        break;
      }
    }
    if (conflito) return;
    filmesAgendados[chave].push({ id: uid(), titulo: nome, horario: horario });
    filmesAgendados[chave].sort(function(a, b) { return a.horario.localeCompare(b.horario); });
    salvarEstado();
    renderListaFilmesDia(chave);
    renderCalendario();
    renderFilmesAgendados();
    document.getElementById("agenda-input-filme").value = "";
  });

  inputFilme.addEventListener("keydown", function(e) {
    if (e.key === "Enter") document.getElementById("agenda-btn-add").click();
    if (e.key === "Escape") overlay.remove();
  });

  document.getElementById("agenda-btn-fechar").addEventListener("click", function() { overlay.remove(); });
  overlay.addEventListener("click", function(e) { if (e.target === overlay) overlay.remove(); });
}

function renderListaFilmesDia(chave) {
  var container = document.getElementById("agenda-lista-filmes");
  if (!container) return;
  var filmes = filmesAgendados[chave] || [];
  if (filmes.length === 0) {
    container.innerHTML = '<p class="agenda-vazia">Nenhum filme agendado para este dia.</p>';
    return;
  }
  var html = "";
  for (var i = 0; i < filmes.length; i++) {
    html += '<div class="agenda-item" data-id="' + filmes[i].id + '">' +
      '<span class="agenda-horario">' + filmes[i].horario + '</span>' +
      '<span class="agenda-titulo">' + filmes[i].titulo + '</span>' +
      '<div class="agenda-acoes">' +
        '<button type="button" class="agenda-edit" data-id="' + filmes[i].id + '" title="Editar"><span class="material-symbols-outlined">edit</span></button>' +
        '<button type="button" class="agenda-del" data-id="' + filmes[i].id + '" title="Remover"><span class="material-symbols-outlined">close_small</span></button>' +
      '</div>' +
    '</div>';
  }
  container.innerHTML = html;

  var botoesEdit = container.querySelectorAll(".agenda-edit");
  for (var i = 0; i < botoesEdit.length; i++) {
    botoesEdit[i].addEventListener("click", function() {
      var id = this.dataset.id;
      editarFilmeAgendado(chave, id);
    });
  }

  var botoesDel = container.querySelectorAll(".agenda-del");
  for (var i = 0; i < botoesDel.length; i++) {
    botoesDel[i].addEventListener("click", function() {
      var id = this.dataset.id;
      removerFilme(chave, id);
    });
  }
}

function removerFilme(chave, id) {
  if (!filmesAgendados[chave]) return;
  var novaLista = [];
  for (var j = 0; j < filmesAgendados[chave].length; j++) {
    if (filmesAgendados[chave][j].id !== id) {
      novaLista.push(filmesAgendados[chave][j]);
    }
  }
  filmesAgendados[chave] = novaLista;
  if (filmesAgendados[chave].length === 0) delete filmesAgendados[chave];
  salvarEstado();
  renderListaFilmesDia(chave);
  renderCalendario();
  renderFilmesAgendados();
}

function renderFilmesAgendados() {
  var lista = document.getElementById("lista-filmes");
  if (!lista) return;
  var chaves = [];
  for (var chave in filmesAgendados) {
    if (filmesAgendados.hasOwnProperty(chave)) {
      chaves.push(chave);
    }
  }
  chaves.sort();
  if (chaves.length === 0) {
    lista.innerHTML = '<li class="sem-filmes">Nenhum filme agendado ainda. Clique em uma data no calendário para começar!</li>';
    return;
  }
  var html = "";
  for (var i = 0; i < chaves.length; i++) {
    var partes = chaves[i].split("-");
    var dataFormatada = partes[2] + "/" + partes[1] + "/" + partes[0];
    var filmes = filmesAgendados[chaves[i]];
    html += '<li class="dia-agendado">' +
      '<div class="dia-cabecalho"><strong>' + dataFormatada + '</strong></div>' +
      '<div class="dia-filmes">';
    for (var j = 0; j < filmes.length; j++) {
      html += '<div class="filme-item">' +
        '<span class="filme-horario">' + filmes[j].horario + '</span>' +
        '<span class="filme-titulo">' + filmes[j].titulo + '</span>' +
        '<div class="filme-acoes">' +
          '<button type="button" class="filme-edit" data-chave="' + chaves[i] + '" data-id="' + filmes[j].id + '" title="Editar"><span class="material-symbols-outlined">edit</span></button>' +
          '<button type="button" class="filme-del" data-chave="' + chaves[i] + '" data-id="' + filmes[j].id + '" title="Remover"><span class="material-symbols-outlined">close_small</span></button>' +
        '</div>' +
      '</div>';
    }
    html += '</div></li>';
  }
  lista.innerHTML = html;

  var botoesDel = lista.querySelectorAll(".filme-del");
  for (var i = 0; i < botoesDel.length; i++) {
    botoesDel[i].addEventListener("click", function() {
      var chave = this.dataset.chave;
      var id = this.dataset.id;
      removerFilme(chave, id);
    });
  }
}

carregarEstado();
renderCalendario();
renderFilmesAgendados();
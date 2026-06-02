var lista_usuarios = [];

function inicio_modal(id) {
  document.getElementById(id).classList.add("aberto");
}

function fim_modal(id) {
  document.getElementById(id).classList.remove("aberto");
}

function mostrarUsers() {
  var divResultado = document.getElementById("api-resultado");
  if (!divResultado) return;

  if (lista_usuarios.length === 0) {
    divResultado.innerHTML = "<p>Nenhum usuário carregado.</p>";
    return;
  }

  var html = "";
  for (var i = 0; i < lista_usuarios.length; i++) {
    var usuario = lista_usuarios[i];
    var cidade = usuario.address && usuario.address.city ? usuario.address.city : "—";
    html += "<p>" + usuario.name + "<br>" + usuario.email + "<br>" + cidade + "</p>";
  }
  divResultado.innerHTML = html;
}

function config_modal_api() {
  var botao_api = document.getElementById("btn-api");
  if (botao_api) {
    botao_api.addEventListener("click", function() {
      inicio_modal("modal-api");
    });
  }

  var botao_fechar_api = document.getElementById("fechar-api");
  if (botao_fechar_api) {
    botao_fechar_api.addEventListener("click", function() {
      fim_modal("modal-api");
    });
  }

  var botao_carregar_usuarios = document.getElementById("btn-carregar-api");
  if (botao_carregar_usuarios) {
    botao_carregar_usuarios.addEventListener("click", function() {
      var divResultado = document.getElementById("api-resultado");
      divResultado.innerHTML = "<p>Carregando...</p>";

      fetch("https://jsonplaceholder.typicode.com/users")
        .then(function(resposta) { return resposta.json(); })
        .then(function(dados) {
          lista_usuarios = dados;
          mostrarUsers();
        })
        .catch(function() {
          divResultado.innerHTML = "<p>Erro ao carregar usuários.</p>";
        });
    });
  }
}

function buscarFilmeNaSugestao(nome) {
  if (!nome) return null;
  nome = nome.trim();
  for (var i = 0; i < filme_sugestao.length; i++) {
    if (filme_sugestao[i].toLowerCase() === nome.toLowerCase()) {
      return filme_sugestao[i];
    }
  }
  return null;
}

function escolherFilmeSugerido(tituloAtual, aoEscolher) {
  var overlay = document.createElement("div");
  overlay.className = "modal-overlay aberto";

  var conteudo = document.createElement("div");
  conteudo.className = "modal-conteudo modal-escolher-filme";

  var titulo = document.createElement("h3");
  titulo.textContent = "Escolher filme";

  var select = document.createElement("select");
  select.className = "select-filmes";
  select.size = 12;

  for (var i = 0; i < filme_sugestao.length; i++) {
    var opcao = document.createElement("option");
    opcao.value = i;
    opcao.textContent = filme_sugestao[i];
    if (tituloAtual && filme_sugestao[i].toLowerCase() === tituloAtual.toLowerCase()) {
      opcao.selected = true;
    }
    select.appendChild(opcao);
  }

  var botoes = document.createElement("div");
  botoes.className = "modal-botoes";

  var btnCancelar = document.createElement("button");
  btnCancelar.type = "button";
  btnCancelar.textContent = "Cancelar";

  var btnConfirmar = document.createElement("button");
  btnConfirmar.type = "button";
  btnConfirmar.textContent = "Confirmar";

  botoes.appendChild(btnCancelar);
  botoes.appendChild(btnConfirmar);
  conteudo.appendChild(titulo);
  conteudo.appendChild(select);
  conteudo.appendChild(botoes);
  overlay.appendChild(conteudo);
  document.body.appendChild(overlay);

  function fechar(resultado) {
    overlay.remove();
    aoEscolher(resultado);
  }

  btnCancelar.addEventListener("click", function() { fechar(null); });
  overlay.addEventListener("click", function(evento) {
    if (evento.target === overlay) fechar(null);
  });
  btnConfirmar.addEventListener("click", function() {
    fechar(filme_sugestao[select.value]);
  });
}

function editarFilmeAgendado(chave, id) {
  if (!filmesAgendados[chave]) return;

  var filmes = filmesAgendados[chave];
  var filme = null;
  var index = -1;

  for (var i = 0; i < filmes.length; i++) {
    if (String(filmes[i].id) === String(id)) {
      filme = filmes[i];
      index = i;
      break;
    }
  }
  if (!filme) return;

  escolherFilmeSugerido(filme.titulo, function(novoTitulo) {
    if (novoTitulo === null) return;

    var novoHorario = prompt("Editar horário (HH:MM):", filme.horario);
    if (novoHorario === null) return;
    novoHorario = novoHorario.trim();
    if (!novoHorario) return;

    filmesAgendados[chave][index].titulo = novoTitulo;
    filmesAgendados[chave][index].horario = novoHorario;
    filmesAgendados[chave].sort(function(a, b) {
      return a.horario.localeCompare(b.horario);
    });

    salvarEstado();
    renderCalendario();
    renderFilmesAgendados();

    if (document.getElementById("agenda-lista-filmes")) {
      renderListaFilmesDia(chave);
    }
  });
}

function configurarEdicaoFilmes() {
  var lista = document.getElementById("lista-filmes");
  if (!lista) return;

  lista.addEventListener("click", function(evento) {
    var botaoEditar = evento.target.closest(".filme-edit");
    if (!botaoEditar) return;
    editarFilmeAgendado(botaoEditar.dataset.chave, botaoEditar.dataset.id);
  });
}

function add_filme() {
  var listaFilmes = document.getElementById("lista-filmes");
  if (!listaFilmes) return;

  var botao_add = document.createElement("div");
  botao_add.innerHTML = '<a href="#" id="link-add-filme">+ Adicionar novo filme</a>';
  listaFilmes.parentNode.insertBefore(botao_add, listaFilmes.nextSibling);

  document.getElementById("link-add-filme").addEventListener("click", function(evento) {
    evento.preventDefault();

    var nomeFilme = prompt("Digite o nome do filme:");
    if (nomeFilme === null || nomeFilme.trim() === "") return;
    nomeFilme = nomeFilme.trim();

    var tem_filme = false;
    for (var i = 0; i < filme_sugestao.length; i++) {
      if (filme_sugestao[i].toLowerCase() === nomeFilme.toLowerCase()) {
        tem_filme = true;
        break;
      }
    }

    if (tem_filme === false) {
      filme_sugestao.push(nomeFilme);
      filme_sugestao.sort();
      alert("Filme '" + nomeFilme + "' adicionado às sugestões!");
    } else {
      alert("Este filme já está na lista!");
    }
  });
}

function load_posts() {
  var container = document.getElementById("comentarios-container");
  if (!container) return;

  container.innerHTML = "<p>Carregando...</p>";

  fetch("https://jsonplaceholder.typicode.com/users")
    .then(function(resposta) { return resposta.json(); })
    .then(function(usuarios) {
      return fetch("https://jsonplaceholder.typicode.com/posts")
        .then(function(resposta) { return resposta.json(); })
        .then(function(posts) {
          var nomes_ID = {};
          for (var u = 0; u < usuarios.length; u++) {
            nomes_ID[usuarios[u].id] = usuarios[u].name;
          }

          var html = "";
          for (var i = 0; i < Math.min(posts.length, 20); i++) {
            var post = posts[i];
            var nomeAutor = nomes_ID[post.userId] || "Desconhecido";

            html += '<div class="comentario-item">' +
              "<strong>" + nomeAutor + "</strong>" +
              "<span>" + post.title + "<br>" + post.body + "</span>" +
              "</div>";
          }

          container.innerHTML = html;
        });
    })
    .catch(function() {
      container.innerHTML = "<p>Erro ao carregar posts.</p>";
    });
}

document.addEventListener("DOMContentLoaded", function() {
  config_modal_api();
  configurarEdicaoFilmes();
  add_filme();
  load_posts();
});
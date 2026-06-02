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
  add_filme();
  load_posts();
});
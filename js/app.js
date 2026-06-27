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

function modalEditar(horarioAtual, callback) {
  var overlay = document.createElement("div");
  overlay.className = "modal-overlay aberto";

  var conteudo = document.createElement("div");
  conteudo.className = "modal-conteudo";
  conteudo.style.maxWidth = "280px";

  var tituloEl = document.createElement("h3");
  tituloEl.textContent = "Editar horário";

  var input = document.createElement("input");
  input.type = "time";
  input.value = horarioAtual;
  input.style.cssText = "width:100%;padding:6px 10px;background:#121214;border:1px solid #29292e;border-radius:6px;color:#fff;font-size:1.1rem;cursor:pointer;outline:none;box-sizing:border-box;";

  input.id = "input-horario";
  input.style.marginBottom = "16px";

  var botoes = document.createElement("div");
  botoes.className = "modal-botoes";

  var btnCancelar = document.createElement("button");
  btnCancelar.type = "button";
  btnCancelar.textContent = "Cancelar";
  btnCancelar.style.cssText = "background:#333;color:#fff;border:0;border-radius:6px;padding:8px 18px;cursor:pointer;font-weight:600;font-size:0.85rem;";

  var btnSalvar = document.createElement("button");
  btnSalvar.type = "button";
  btnSalvar.textContent = "Salvar";
  btnSalvar.style.cssText = "background:#04d361;color:#fff;border:0;border-radius:6px;padding:8px 18px;cursor:pointer;font-weight:600;font-size:0.85rem;";

  botoes.appendChild(btnCancelar);
  botoes.appendChild(btnSalvar);
  conteudo.appendChild(tituloEl);
  conteudo.appendChild(input);
  conteudo.appendChild(botoes);
  overlay.appendChild(conteudo);
  document.body.appendChild(overlay);

  function fechar(resultado) {
    overlay.remove();
    if (callback) callback(resultado);
  }

  btnCancelar.addEventListener("click", function() { fechar(null); });
  btnSalvar.addEventListener("click", function() { fechar(input.value || null); });
  input.addEventListener("keydown", function(e) {
    if (e.key === "Enter") btnSalvar.click();
    if (e.key === "Escape") fechar(null);
  });
  overlay.addEventListener("click", function(e) {
    if (e.target === overlay) fechar(null);
  });

  setTimeout(function() { input.focus(); }, 50);
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

    modalEditar(filme.horario, function(novoHorario) {
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

function modalAdicionarFilme(nomeSugerido) {
  var overlay = document.createElement("div");
  overlay.className = "modal-overlay aberto";

  var conteudo = document.createElement("div");
  conteudo.className = "modal-conteudo";
  conteudo.style.maxWidth = "340px";

  var tituloEl = document.createElement("h3");
  tituloEl.textContent = "Adicionar filme";

  var wrapper = document.createElement("div");
  wrapper.style.cssText = "position:relative;margin-bottom:16px;";

  var input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Nome do filme...";
  if (nomeSugerido) input.value = nomeSugerido;
  input.style.cssText = "width:100%;padding:10px 12px;background:#121214;border:1px solid #29292e;border-radius:6px;color:#fff;font-size:0.95rem;outline:none;box-sizing:border-box;";

  var dropdown = document.createElement("div");
  dropdown.style.cssText = "display:none;position:absolute;top:100%;left:0;right:0;background:#202024;border:1px solid #7159c144;border-radius:6px;max-height:200px;overflow-y:auto;z-index:10;";

  function mostrarSugestoes(filtro) {
    dropdown.innerHTML = "";
    var lista = [];
    for (var i = 0; i < filme_sugestao.length; i++) {
      if (!filtro || filme_sugestao[i].toLowerCase().indexOf(filtro.toLowerCase()) !== -1) {
        lista.push(filme_sugestao[i]);
      }
    }
    if (lista.length === 0 || lista.length === filme_sugestao.length) {
      dropdown.style.display = "none";
      return;
    }
    for (var i = 0; i < lista.length; i++) {
      (function(nome) {
        var div = document.createElement("div");
        div.textContent = nome;
        div.style.cssText = "padding:8px 12px;cursor:pointer;color:#ccc;font-size:0.9rem;border-bottom:1px solid #29292e;";
        div.addEventListener("mouseenter", function() { this.style.background = "#7159c122"; this.style.color = "#fff"; });
        div.addEventListener("mouseleave", function() { this.style.background = ""; this.style.color = "#ccc"; });
        div.addEventListener("click", function() {
          input.value = nome;
          dropdown.style.display = "none";
        });
        dropdown.appendChild(div);
      })(lista[i]);
    }
    dropdown.style.display = "block";
  }

  wrapper.appendChild(input);
  wrapper.appendChild(dropdown);
  conteudo.appendChild(tituloEl);
  conteudo.appendChild(wrapper);

  var msg = document.createElement("p");
  msg.style.cssText = "display:none;font-size:0.85rem;margin:-8px 0 12px;padding:0;";

  var botoes = document.createElement("div");
  botoes.className = "modal-botoes";

  var btnCancelar = document.createElement("button");
  btnCancelar.type = "button";
  btnCancelar.textContent = "Cancelar";
  btnCancelar.style.cssText = "background:#333;color:#fff;border:0;border-radius:6px;padding:8px 18px;cursor:pointer;font-weight:600;font-size:0.85rem;";

  var btnAdicionar = document.createElement("button");
  btnAdicionar.type = "button";
  btnAdicionar.textContent = "Adicionar";
  btnAdicionar.style.cssText = "background:#7159c1;color:#fff;border:0;border-radius:6px;padding:8px 18px;cursor:pointer;font-weight:600;font-size:0.85rem;";

  botoes.appendChild(btnCancelar);
  botoes.appendChild(btnAdicionar);
  conteudo.appendChild(msg);
  conteudo.appendChild(botoes);
  overlay.appendChild(conteudo);
  document.body.appendChild(overlay);

  function fechar() {
    overlay.remove();
  }

  input.addEventListener("focus", function() { mostrarSugestoes(input.value); });
  input.addEventListener("input", function() { mostrarSugestoes(input.value); });
  document.addEventListener("click", function fecharDrop(e) {
    if (!wrapper.contains(e.target)) dropdown.style.display = "none";
  });

  btnCancelar.addEventListener("click", function() { fechar(); });
  btnAdicionar.addEventListener("click", function() {
    var nome = input.value.trim();
    if (!nome) return;

    for (var i = 0; i < filme_sugestao.length; i++) {
      if (filme_sugestao[i].toLowerCase() === nome.toLowerCase()) {
        msg.style.cssText = "font-size:0.85rem;margin:-10px 0 12px;padding:0;color:#e2b04a;display:block;";
        msg.textContent = "Este filme já está na lista!";
        return;
      }
    }

    filme_sugestao.push(nome);
    filme_sugestao.sort();
    msg.style.cssText = "font-size:0.85rem;margin:-10px 0 12px;padding:0;color:#04d361;display:block;";
    msg.textContent = "Filme adicionado com sucesso!";
    input.value = "";
    dropdown.style.display = "none";
  });
  input.addEventListener("keydown", function(e) {
    if (e.key === "Enter") btnAdicionar.click();
    if (e.key === "Escape") fechar();
  });
  overlay.addEventListener("click", function(e) {
    if (e.target === overlay) fechar();
  });

  setTimeout(function() { input.focus(); }, 50);
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
  load_posts();
});
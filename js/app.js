let usuarios = [];
let posts = [];

function renderList(id, dados, nomeCampo, campoExtra) {
  const container = document.getElementById(id);
  container.innerHTML = "";
  dados.forEach((item, idx) => {
    const div = document.createElement("div");
    div.className = "api-item";
    div.innerHTML = `
      <div class="info">
        <strong>${item[nomeCampo]}</strong>
        ${campoExtra ? `<span>${item[campoExtra]}</span>` : ""}
      </div>
      <div class="acoes">
        <button class="btn-edit" data-idx="${idx}">Editar</button>
        <button class="btn-del" data-idx="${idx}">Remover</button>
      </div>
    `;
    div.querySelector(".btn-edit").onclick = () => {
      const novo = prompt("Editar:", item[nomeCampo]);
      if (novo && novo.trim()) {
        item[nomeCampo] = novo.trim();
        renderList(id, dados, nomeCampo, campoExtra);
      }
    };
    div.querySelector(".btn-del").onclick = () => {
      if (confirm(`Remover "${item[nomeCampo]}"?`)) {
        dados.splice(idx, 1);
        renderList(id, dados, nomeCampo, campoExtra);
      }
    };
    container.appendChild(div);
  });
}

document.getElementById("btn-users").onclick = async () => {
  usuarios = await fetchUsers();
  renderList("lista-users", usuarios, "name", "email");
};

document.getElementById("btn-posts").onclick = async () => {
  posts = await fetchPosts();
  renderList("lista-posts", posts, "title", "body");
};
// Carrega os filmes salvos ao abrir a página
let filmes = carregarFilmes();
renderFilmes(filmes);
 
// Chamada pelo onclick="salvarFilme()" no botão do HTML
function salvarFilme() {
  const inputTitulo = document.getElementById("input-title");
  const inputData   = document.getElementById("input-date");
  const inputId     = document.getElementById("item-id");
  const titulo      = inputTitulo.value.trim();
  const data        = inputData.value.trim();
 
  if (!titulo) {
    inputTitulo.focus();
    inputTitulo.style.borderColor = "#ca4949";
    setTimeout(() => { inputTitulo.style.borderColor = "#29292e"; }, 1500);
    return;
  }
 
  if (inputId.value) {
    // EDITAR filme existente
    const id = Number(inputId.value);
    const filme = filmes.find(f => f.id === id);
    if (filme) {
      filme.titulo = titulo;
      filme.data   = data;
    }
    salvarFilmes(filmes);
    renderFilmes(filmes);
    cancelarEdicao();
  } else {
    // ADICIONAR novo filme
    filmes.unshift({ id: Date.now(), titulo, data });
    salvarFilmes(filmes);
    renderFilmes(filmes);
    inputTitulo.value = "";
    inputData.value   = "";
    inputTitulo.focus();
  }
}
 
// Chamada pelo onclick="editarFilme(id)" no botão Editar de cada item
function editarFilme(id) {
  const filme = filmes.find(f => f.id === id);
  if (!filme) return;
 
  document.getElementById("input-title").value      = filme.titulo;
  document.getElementById("input-date").value       = filme.data || "";
  document.getElementById("item-id").value          = id;
  document.getElementById("form-title").textContent = "✏️ Editando Filme";
  document.getElementById("btn-salvar").textContent  = "Salvar Alterações";
 
  if (!document.getElementById("btn-cancelar")) {
    const btn = document.createElement("button");
    btn.id            = "btn-cancelar";
    btn.textContent   = "Cancelar";
    btn.style.cssText = "background:#333;color:#aaa;border:0;padding:14px;border-radius:4px;cursor:pointer;font-weight:bold;font-size:1rem;margin-top:8px;width:100%;";
    btn.onclick       = cancelarEdicao;
    document.getElementById("btn-salvar").insertAdjacentElement("afterend", btn);
  }
 
  window.scrollTo({ top: 0, behavior: "smooth" });
}
 
function cancelarEdicao() {
  document.getElementById("form-title").textContent = "Agendar Novo Filme";
  document.getElementById("btn-salvar").textContent  = "Agendar Filme";
  document.getElementById("input-title").value       = "";
  document.getElementById("input-date").value        = "";
  document.getElementById("item-id").value           = "";
  document.getElementById("btn-cancelar")?.remove();
}
 
// Chamada pelo onclick="removerFilme(id)" no botão Remover de cada item
function removerFilme(id) {
  if (!confirm("Deseja remover este filme da agenda?")) return;
  filmes = filmes.filter(f => f.id !== id);
  salvarFilmes(filmes);
  renderFilmes(filmes);
}
 
// Enter nos campos do formulário dispara o salvar
document.getElementById("input-title").addEventListener("keydown", e => {
  if (e.key === "Enter") salvarFilme();
});
document.getElementById("input-date").addEventListener("keydown", e => {
  if (e.key === "Enter") salvarFilme();
});

var filmes = carregarFilmes();
renderFilmes(filmes);
 
var filmes = carregarFilmes();
renderFilmes(filmes);
 
function salvarFilme() {
  const inputTitulo = document.getElementById("input-title");
  const inputData   = document.getElementById("input-date");
  const inputId     = document.getElementById("item-id");
  const titulo      = inputTitulo.value.trim();
  const data        = inputData.value.trim();
 
  if (!titulo) {
    inputTitulo.focus();
    inputTitulo.style.borderColor = "#ca4949";
    setTimeout(() => { inputTitulo.style.borderColor = "#29292e"; }, 1500);
    return;
  }
 
  if (inputId.value) {
    const id = Number(inputId.value);
    const filme = filmes.find(f => f.id === id);
    if (filme) { filme.titulo = titulo; filme.data = data; }
    salvarFilmes(filmes);
    renderFilmes(filmes);
    cancelarEdicao();
  } else {
    filmes.unshift({ id: Date.now(), titulo, data });
    salvarFilmes(filmes);
    renderFilmes(filmes);
    inputTitulo.value = "";
    inputData.value   = "";
    inputTitulo.focus();
  }
}
 
function editarFilme(id) {
  const filme = filmes.find(f => f.id === id);
  if (!filme) return;
  document.getElementById("input-title").value      = filme.titulo;
  document.getElementById("input-date").value       = filme.data || "";
  document.getElementById("item-id").value          = id;
  document.getElementById("form-title").textContent = "✏️ Editando Filme";
  document.getElementById("btn-salvar").textContent  = "Salvar Alterações";
  if (!document.getElementById("btn-cancelar")) {
    const btn = document.createElement("button");
    btn.id            = "btn-cancelar";
    btn.textContent   = "Cancelar";
    btn.style.cssText = "background:#333;color:#aaa;border:0;padding:14px;border-radius:4px;cursor:pointer;font-weight:bold;font-size:1rem;margin-top:8px;width:100%;";
    btn.onclick       = cancelarEdicao;
    document.getElementById("btn-salvar").insertAdjacentElement("afterend", btn);
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}
 
function cancelarEdicao() {
  document.getElementById("form-title").textContent = "Agendar Novo Filme";
  document.getElementById("btn-salvar").textContent  = "Agendar Filme";
  document.getElementById("input-title").value       = "";
  document.getElementById("input-date").value        = "";
  document.getElementById("item-id").value           = "";
  document.getElementById("btn-cancelar")?.remove();
}
 
function removerFilme(id) {
  if (!confirm("Deseja remover este filme da agenda?")) return;
  filmes = filmes.filter(f => f.id !== id);
  salvarFilmes(filmes);
  renderFilmes(filmes);
}
 
document.getElementById("input-title").addEventListener("keydown", e => {
  if (e.key === "Enter") salvarFilme();
});
document.getElementById("input-date").addEventListener("keydown", e => {
  if (e.key === "Enter") salvarFilme();
});
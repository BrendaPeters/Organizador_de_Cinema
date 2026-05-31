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
let abaAtual = "users";
let dadosUsers = [];
let dadosPosts = [];

async function carregarDados() {
  const resultado = document.getElementById("api-resultado");
  resultado.innerHTML = "<p style='color:#888'>Carregando...</p>";

  try {
    if (abaAtual === "users") {
      dadosUsers = await fetchUsers();
      renderResultado(dadosUsers, "name", "email");
    } else {
      dadosPosts = await fetchPosts();
      renderResultado(dadosPosts, "title", "body");
    }
  } catch {
    resultado.innerHTML = "<p style='color:#e53'>Erro ao carregar dados.</p>";
  }
}

function renderResultado(dados, titulo, subtitulo) {
  const container = document.getElementById("api-resultado");
  container.innerHTML = dados.map(d => `
    <div class="item">
      <strong>${d[titulo]}</strong>
      <span>${d[subtitulo]}</span>
    </div>
  `).join("");
}

document.getElementById("btn-api").onclick = () => {
  document.getElementById("modal-api").classList.add("aberto");
};

document.getElementById("fechar-api").onclick = () => {
  document.getElementById("modal-api").classList.remove("aberto");
};

document.getElementById("modal-api").addEventListener("click", (e) => {
  if (e.target === e.currentTarget) {
    e.target.classList.remove("aberto");
  }
});

document.getElementById("btn-carregar-api").onclick = carregarDados;

document.querySelectorAll(".aba-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".aba-btn").forEach(b => b.classList.remove("ativa"));
    btn.classList.add("ativa");
    abaAtual = btn.dataset.target;
    if (dadosUsers.length || dadosPosts.length) carregarDados();
  });
});
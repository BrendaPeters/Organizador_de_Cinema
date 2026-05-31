const filme_sugestao = [
  "O Poderoso Chefão",
  "Interestelar",
  "Clube da Luta",
  "Forrest Gump",
  "Matrix",
  "Matrix Reloaded",
  "Matrix Revolutions",
  "O Senhor dos Anéis: O Retorno do Rei",
  "Pulp Fiction",
  "O Cavaleiro das Trevas",
  "A Origem",
  "Os Bons Companheiros",
  "Parasita",
  "Vingadores: Ultimato",
  "O Silêncio dos Inocentes",
  "Coringa",
  "Toy Story",
  "Toy Story 2",
  "Toy Story 3",
  "Toy Story 4",
  "De Volta para o Futuro",
  "Gladiador",
  "O Grande Lebowski",
  "Cidade de Deus",
  "Harry Potter e a Pedra Filosofal",
  "Harry Potter e a Câmara Secreta",
  "Harry Potter e o Prisioneiro de Azkaban",
  "Harry Potter e o Cálice de Fogo",
  "Harry Potter e a Ordem da Fênix",
  "Harry Potter e o Enigma do Príncipe",
  "Harry Potter e os Relíquias da Morte - Parte 1",
  "Harry Potter e os Relíquias da Morte - Parte 2",
  "Star Wars: Episódio IV - Uma Nova Esperança",
  "Star Wars: Episódio V - O Império Contra-Ataca",
  "Star Wars: Episódio VI - O Retorno de Jedi",
  "Star Wars: Episódio VII - O Despertar da Força",
  "Star Wars: Episódio VIII - Os Últimos Jedi",
  "Star Wars: Episódio IX - A Ascensão Skywalker",
  "Homem-Aranha: Através do Aranhaverso",
];

const input = document.getElementById("input-title");
const dropdown = document.getElementById("sugestoes-dropdown");

function mostrarSugestoes(filtro = "") {
  dropdown.innerHTML = "";
  const lista = filtro
    ? filme_sugestao.filter(f => f.toLowerCase().includes(filtro.toLowerCase()))
    : filme_sugestao;

  if (lista.length === 0) {
    dropdown.classList.remove("aberto");
    return;
  }

  lista.forEach(f => {
    const div = document.createElement("div");
    div.className = "opcao";
    div.textContent = f;
    div.addEventListener("click", () => {
      input.value = f;
      dropdown.classList.remove("aberto");
    });
    dropdown.appendChild(div);
  });

  dropdown.classList.add("aberto");
}

input.addEventListener("focus", () => mostrarSugestoes());
input.addEventListener("input", () => {
  mostrarSugestoes(input.value);
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".input-wrapper")) {
    dropdown.classList.remove("aberto");
  }
});

function adicionarSugestao() {
  const nome = input.value.trim();
  if (!nome) return;
  filme_sugestao.push(nome);
  input.value = nome;
  dropdown.classList.remove("aberto");
}

const modal = document.getElementById("modal-sugestao");
const inputModal = document.getElementById("input-modal-filme");

function adicionarSugestao() {
  inputModal.value = "";
  modal.classList.add("aberto");
  inputModal.focus();
}

document.getElementById("btn-modal-cancelar").addEventListener("click", () => {
  modal.classList.remove("aberto");
});

document.getElementById("btn-modal-add").addEventListener("click", () => {
  const nome = inputModal.value.trim();
  if (!nome) return;
  filme_sugestao.push(nome);
  modal.classList.remove("aberto");
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.remove("aberto");
});

inputModal.addEventListener("keydown", (e) => {
  if (e.key === "Enter") document.getElementById("btn-modal-add").click();
  if (e.key === "Escape") modal.classList.remove("aberto");
});
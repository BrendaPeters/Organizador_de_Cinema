const API_BASE = "https://jsonplaceholder.typicode.com";

// Busca a lista de usuários da API
async function fetchUsers() {
  const res = await fetch(`${API_BASE}/users`);
  return res.json();
}

// Busca a lista de posts da API
async function fetchPosts() {
  const res = await fetch(`${API_BASE}/posts`);
  return res.json();
}

// Busca posts de um usuário específico pelo ID
async function fetchPostsPorUsuario(userId) {
  const res = await fetch(`${API_BASE}/posts?userId=${userId}`);
  return res.json();
}

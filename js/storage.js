const FILMES_KEY = "pipoteca_filmes";
 
function salvarFilmes(filmes) {
  localStorage.setItem(FILMES_KEY, JSON.stringify(filmes));
}
 
function carregarFilmes() {
  try {
    return JSON.parse(localStorage.getItem(FILMES_KEY)) || [];
  } catch {
    return [];
  }
}
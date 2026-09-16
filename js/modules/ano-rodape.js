// Mantém o ano do rodapé sempre atual.

export function iniciarAnoRodape() {
  const elemento = document.getElementById('ano');
  if (!elemento) return;
  elemento.textContent = String(new Date().getFullYear());
}

// Revela blocos conforme entram na viewport.
// Os elementos nascem visíveis no HTML: a classe que os esconde é
// aplicada aqui, por JS. Assim, se o script não rodar, o conteúdo
// aparece normalmente em vez de ficar invisível para sempre.

const ALVOS = '.cartao-estatistica, .etiqueta, .passo, .vitrine, .cartao-contato, .sobre__texto';

export function iniciarRevelarScroll() {
  const elementos = document.querySelectorAll(ALVOS);
  if (!elementos.length) return;

  elementos.forEach((elemento) => elemento.classList.add('revelar'));

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('visivel');
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.15 });

  elementos.forEach((elemento) => observador.observe(elemento));
}

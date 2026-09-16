// Efeito "digitando" na capa.

const FRASES = [
  'landing pages que carregam rápido',
  'sites com caminho claro pro WhatsApp',
  'código revisado linha por linha, com ou sem IA no meio',
];

export function iniciarEfeitoDigitando() {
  const elemento = document.getElementById('digitado');
  if (!elemento) return;

  // Quem pediu menos movimento no sistema recebe a frase estática —
  // o efeito é decorativo, não vale custar desconforto.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elemento.textContent = FRASES[0];
    return;
  }

  let indiceFrase = 0;
  let indiceLetra = 0;
  let apagando = false;

  function digitar() {
    const fraseAtual = FRASES[indiceFrase];

    if (!apagando) {
      elemento.textContent = fraseAtual.slice(0, indiceLetra + 1);
      indiceLetra++;
      if (indiceLetra === fraseAtual.length) {
        apagando = true;
        setTimeout(digitar, 1800);
        return;
      }
    } else {
      elemento.textContent = fraseAtual.slice(0, indiceLetra - 1);
      indiceLetra--;
      if (indiceLetra === 0) {
        apagando = false;
        indiceFrase = (indiceFrase + 1) % FRASES.length;
      }
    }

    setTimeout(digitar, apagando ? 35 : 55);
  }

  digitar();
}

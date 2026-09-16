// Menu mobile + rolagem para o topo.

export function iniciarMenu() {
  const botaoMenu = document.getElementById('botaoMenu');
  const navegacao = document.getElementById('navegacao');

  if (botaoMenu && navegacao) {
    const fecharMenu = () => {
      navegacao.classList.remove('aberto');
      botaoMenu.setAttribute('aria-expanded', 'false');
      botaoMenu.setAttribute('aria-label', 'Abrir menu');
    };

    const alternarMenu = () => {
      const estaAberto = navegacao.classList.toggle('aberto');
      botaoMenu.setAttribute('aria-expanded', String(estaAberto));
      // O aria-label acompanha o estado real do menu — sem isso ele
      // anunciaria "Abrir menu" mesmo com o menu já aberto.
      botaoMenu.setAttribute('aria-label', estaAberto ? 'Fechar menu' : 'Abrir menu');
    };

    botaoMenu.addEventListener('click', alternarMenu);
    navegacao.querySelectorAll('.navegacao__link').forEach((link) => {
      link.addEventListener('click', fecharMenu);
    });
  }

  // Links "Início" (menu e logotipo): forçamos o scroll ao topo em JS
  // em vez de confiar só no href="#topo". Motivo: colocar o id do
  // destino dentro de um elemento position:fixed (o cabeçalho) faz
  // o navegador calcular a posição de forma instável — em alguns
  // casos o clique simplesmente não rolava a página. Por isso a
  // âncora real fica fora do cabeçalho, e aqui garantimos o scroll.
  document.querySelectorAll('[data-rolar-topo]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

// main.js — Portfólio Douglas Fernandes
//
// O que esse arquivo faz:
//   1. Menu hambúrguer no mobile
//   2. Marca o link ativo conforme a seção visível (scroll spy)
//   3. Troca de abas nos Projetos
//   4. Troca de abas nas Habilidades (com animação de barra)
//   5. Animação de entrada nas seções ao rolar a página
//   6. Preenche o ano no rodapé automaticamente


// -----------------------------------------------
// 1. MENU HAMBÚRGUER
// -----------------------------------------------

const hamburgerBtn = document.getElementById('hamburgerBtn');
const menu         = document.getElementById('menu');
const overlay      = document.getElementById('menuOverlay');

function abrirMenu() {
  menu.classList.add('aberto');
  hamburgerBtn.classList.add('aberto');
  overlay.classList.add('visivel');
  hamburgerBtn.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden'; // evita scroll enquanto o menu está aberto
}

function fecharMenu() {
  menu.classList.remove('aberto');
  hamburgerBtn.classList.remove('aberto');
  overlay.classList.remove('visivel');
  hamburgerBtn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

hamburgerBtn.addEventListener('click', () => {
  const estaAberto = menu.classList.contains('aberto');
  estaAberto ? fecharMenu() : abrirMenu();
});

// Fechar ao clicar no overlay escuro
overlay.addEventListener('click', fecharMenu);

// Fechar ao clicar em qualquer link do menu
menu.querySelectorAll('.menu-link').forEach(link => {
  link.addEventListener('click', fecharMenu);
});

// Fechar com a tecla Escape
document.addEventListener('keydown', evento => {
  if (evento.key === 'Escape') fecharMenu();
});


// -----------------------------------------------
// 2. SCROLL SPY — destaca o link da seção atual
// -----------------------------------------------

const secoes   = document.querySelectorAll('section[id], footer[id]');
const menuLinks = document.querySelectorAll('.menu-link');

const observadorSecao = new IntersectionObserver(entradas => {
  entradas.forEach(entrada => {
    if (!entrada.isIntersecting) return;

    // Remove ativo de todos os links e coloca no correspondente
    menuLinks.forEach(link => link.classList.remove('ativo'));

    const linkAtivo = document.querySelector(`.menu-link[href="#${entrada.target.id}"]`);
    if (linkAtivo) linkAtivo.classList.add('ativo');
  });
}, {
  rootMargin: '-30% 0px -60% 0px'
});

secoes.forEach(secao => observadorSecao.observe(secao));


// -----------------------------------------------
// 3. ABAS DOS PROJETOS
// -----------------------------------------------

function iniciarAbas(seletorAbas, seletorPaineis) {
  const botoes  = document.querySelectorAll(seletorAbas);
  const paineis = document.querySelectorAll(seletorPaineis);

  botoes.forEach(botao => {
    botao.addEventListener('click', () => {
      const alvo = botao.dataset.alvo;

      // Atualiza os botões
      botoes.forEach(b => {
        b.classList.remove('ativa');
        b.setAttribute('aria-selected', 'false');
      });
      botao.classList.add('ativa');
      botao.setAttribute('aria-selected', 'true');

      // Mostra o painel correspondente e esconde os outros
      paineis.forEach(painel => {
        const esteEOAlvo = painel.id === `painel-${alvo}`;
        painel.classList.toggle('ativo', esteEOAlvo);

        if (esteEOAlvo) {
          painel.removeAttribute('hidden');
        } else {
          painel.setAttribute('hidden', '');
        }
      });
    });
  });
}

iniciarAbas('.abas-projetos .aba-btn', '.painel-projeto');


// -----------------------------------------------
// 4. ABAS DE HABILIDADES + ANIMAÇÃO DAS BARRAS
// -----------------------------------------------

function animarBarras(painel) {
  painel.querySelectorAll('.barra-preenchimento').forEach(barra => {
    const largura = barra.dataset.largura + '%';

    // Reseta antes de animar (para reativar a transição)
    barra.style.width = '0';

    // Precisa de dois frames para garantir que o reset foi aplicado
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        barra.style.width = largura;
      });
    });
  });
}

const botoesHabilidades = document.querySelectorAll('.abas-habilidades .aba-btn');
const paineisHabilidades = document.querySelectorAll('.painel-habilidades');

botoesHabilidades.forEach(botao => {
  botao.addEventListener('click', () => {
    const alvo = botao.dataset.alvo;

    botoesHabilidades.forEach(b => {
      b.classList.remove('ativa');
      b.setAttribute('aria-selected', 'false');
    });
    botao.classList.add('ativa');
    botao.setAttribute('aria-selected', 'true');

    paineisHabilidades.forEach(painel => {
      const esteEOAlvo = painel.id === `painel-${alvo}`;
      painel.classList.toggle('ativo', esteEOAlvo);

      if (esteEOAlvo) {
        painel.removeAttribute('hidden');
        animarBarras(painel);
      } else {
        painel.setAttribute('hidden', '');
      }
    });
  });
});

// Anima as barras do painel inicial quando a página carrega
const painelInicial = document.querySelector('.painel-habilidades.ativo');
if (painelInicial) {
  // Pequeno delay para garantir que o CSS já foi processado
  setTimeout(() => animarBarras(painelInicial), 400);
}


// -----------------------------------------------
// 5. ANIMAÇÃO DE ENTRADA DAS SEÇÕES
// -----------------------------------------------

// Adiciona a classe de animação nas seções principais
const elementosParaAnimar = document.querySelectorAll(
  '.hero-texto, .hero-foto, .sobre, .habilidades, .projetos, .contato'
);

elementosParaAnimar.forEach(el => el.classList.add('animar-entrada'));

const observadorEntrada = new IntersectionObserver(entradas => {
  entradas.forEach(entrada => {
    if (entrada.isIntersecting) {
      entrada.target.classList.add('visivel');
      observadorEntrada.unobserve(entrada.target); // anima só uma vez
    }
  });
}, {
  threshold: 0.1
});

elementosParaAnimar.forEach(el => observadorEntrada.observe(el));


// -----------------------------------------------
// 6. ANO DINÂMICO NO RODAPÉ
// -----------------------------------------------

const campoAno = document.getElementById('ano-atual');
if (campoAno) {
  campoAno.textContent = new Date().getFullYear();
}
// main.js — Portfólio Douglas Fernandes
//
// O que esse arquivo faz:
//   1. Menu hambúrguer no mobile
//   2. Marca o link ativo conforme a seção visível (scroll spy)
//   3. Troca de abas nos Projetos
//   4. Troca de abas nas Habilidades (com animação de barra)
//   5. Animação de entrada nas seções ao rolar a página
//   6. Preenche o ano no rodapé automaticamente



const hamburgerBtn = document.getElementById('hamburgerBtn');
const menu         = document.getElementById('menu');
const overlay      = document.getElementById('menuOverlay');

function abrirMenu() {
  menu.classList.add('aberto');
  hamburgerBtn.classList.add('aberto');
  overlay.classList.add('visivel');
  hamburgerBtn.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden'; 
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


overlay.addEventListener('click', fecharMenu);


menu.querySelectorAll('.menu-link').forEach(link => {
  link.addEventListener('click', fecharMenu);
});


document.addEventListener('keydown', evento => {
  if (evento.key === 'Escape') fecharMenu();
});

const secoes   = document.querySelectorAll('section[id], footer[id]');
const menuLinks = document.querySelectorAll('.menu-link');

const observadorSecao = new IntersectionObserver(entradas => {
  entradas.forEach(entrada => {
    if (!entrada.isIntersecting) return;

    
    menuLinks.forEach(link => link.classList.remove('ativo'));

    const linkAtivo = document.querySelector(`.menu-link[href="#${entrada.target.id}"]`);
    if (linkAtivo) linkAtivo.classList.add('ativo');
  });
}, {
  rootMargin: '-30% 0px -60% 0px'
});

secoes.forEach(secao => observadorSecao.observe(secao));




function iniciarAbas(seletorAbas, seletorPaineis) {
  const botoes  = document.querySelectorAll(seletorAbas);
  const paineis = document.querySelectorAll(seletorPaineis);

  botoes.forEach(botao => {
    botao.addEventListener('click', () => {
      const alvo = botao.dataset.alvo;

      
      botoes.forEach(b => {
        b.classList.remove('ativa');
        b.setAttribute('aria-selected', 'false');
      });
      botao.classList.add('ativa');
      botao.setAttribute('aria-selected', 'true');

      
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




function animarBarras(painel) {
  painel.querySelectorAll('.barra-preenchimento').forEach(barra => {
    const largura = barra.dataset.largura + '%';

  
    barra.style.width = '0';

    
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


const painelInicial = document.querySelector('.painel-habilidades.ativo');
if (painelInicial) {
  
  setTimeout(() => animarBarras(painelInicial), 400);
}




const elementosParaAnimar = document.querySelectorAll(
  '.hero-texto, .hero-foto, .sobre, .habilidades, .projetos, .contato'
);

elementosParaAnimar.forEach(el => el.classList.add('animar-entrada'));

const observadorEntrada = new IntersectionObserver(entradas => {
  entradas.forEach(entrada => {
    if (entrada.isIntersecting) {
      entrada.target.classList.add('visivel');
      observadorEntrada.unobserve(entrada.target);
    }
  });
}, {
  threshold: 0.1
});

elementosParaAnimar.forEach(el => observadorEntrada.observe(el));



const campoAno = document.getElementById('ano-atual');
if (campoAno) {
  campoAno.textContent = new Date().getFullYear();
}
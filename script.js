// =========================================================
// MENU MOBILE
// =========================================================
const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');

function closeMenu(){
  nav.classList.remove('is-open');
  menuBtn.setAttribute('aria-expanded', 'false');
}

menuBtn.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  menuBtn.setAttribute('aria-expanded', String(isOpen));
});

nav.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// =========================================================
// EFEITO "DIGITANDO" NO HERO
// =========================================================
const typedEl = document.getElementById('typed');
const frases = [
  '"criar interfaces que as pessoas usam"',
  '"código limpo e responsivo"',
  '"boas experiências digitais"'
];

let fraseIndex = 0;
let charIndex = 0;
let apagando = false;

function digitar(){
  if(!typedEl) return;
  const fraseAtual = frases[fraseIndex];

  if(!apagando){
    typedEl.textContent = fraseAtual.slice(0, charIndex + 1);
    charIndex++;
    if(charIndex === fraseAtual.length){
      apagando = true;
      setTimeout(digitar, 1800);
      return;
    }
  } else {
    typedEl.textContent = fraseAtual.slice(0, charIndex - 1);
    charIndex--;
    if(charIndex === 0){
      apagando = false;
      fraseIndex = (fraseIndex + 1) % frases.length;
    }
  }

  const velocidade = apagando ? 35 : 55;
  setTimeout(digitar, velocidade);
}

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(typedEl){
  if(reduceMotion){
    typedEl.textContent = frases[0];
  } else {
    digitar();
  }
}

// =========================================================
// REVEAL AO ROLAR (scroll reveal)
// =========================================================
const revealTargets = document.querySelectorAll(
  '.stat-card, .chip, .project-card, .socials, .editor-card, .sobre__texto'
);

revealTargets.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealTargets.forEach(el => observer.observe(el));

// =========================================================
// ANO NO RODAPÉ
// =========================================================
const yearEl = document.getElementById('year');
if(yearEl){
  yearEl.textContent = new Date().getFullYear();
}
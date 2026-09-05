// =========================================================
// MENU MOBILE
// =========================================================
const botaoMenu = document.getElementById('botaoMenu');
const navegacao = document.getElementById('navegacao');

function fecharMenu(){
  navegacao.classList.remove('aberto');
  botaoMenu.setAttribute('aria-expanded', 'false');
  botaoMenu.setAttribute('aria-label', 'Abrir menu');
}

function alternarMenu(){
  const estaAberto = navegacao.classList.toggle('aberto');
  botaoMenu.setAttribute('aria-expanded', String(estaAberto));
  // Corrigido: antes o aria-label ficava sempre em "Abrir menu",
  // mesmo com o menu já aberto. Agora ele acompanha o estado real,
  // o que ajuda quem usa leitor de tela.
  botaoMenu.setAttribute('aria-label', estaAberto ? 'Fechar menu' : 'Abrir menu');
}

botaoMenu.addEventListener('click', alternarMenu);

navegacao.querySelectorAll('.navegacao__link').forEach(link => {
  link.addEventListener('click', fecharMenu);
});

// Links "Início" (menu e logotipo): forçamos o scroll ao topo em JS
// em vez de confiar só no href="#topo". Motivo: colocar o id do
// destino dentro de um elemento position:fixed (o cabeçalho) faz
// o navegador calcular a posição de forma instável — em alguns
// casos o clique simplesmente não rolava a página. Por isso a
// âncora real fica fora do cabeçalho, e aqui garantimos o scroll.
document.querySelectorAll('[data-rolar-topo]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// =========================================================
// FORMULÁRIO RÁPIDO PARA O WHATSAPP
// =========================================================
// Não existe backend aqui: o formulário só monta um texto e
// abre o WhatsApp com a mensagem já preenchida. Nenhum dado é
// salvo ou enviado a lugar nenhum além do próprio WhatsApp.
const NUMERO_WHATSAPP = '5522998984135';
const formularioWhatsapp = document.getElementById('formularioWhatsapp');

if(formularioWhatsapp){
  formularioWhatsapp.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.getElementById('nomeContato').value.trim();
    const mensagem = document.getElementById('mensagemContato').value.trim();

    if(!nome || !mensagem) return;

    const texto = `Olá! Me chamo ${nome}. ${mensagem}`;
    const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(texto)}`;

    window.open(url, '_blank', 'noopener,noreferrer');
  });
}

// =========================================================
// EFEITO "DIGITANDO" NA CAPA
// =========================================================
const elementoDigitado = document.getElementById('digitado');
const frases = [
  'landing pages que carregam rápido',
  'sites com caminho claro pro WhatsApp',
  'código revisado linha por linha, com ou sem IA no meio'
];

let indiceFrase = 0;
let indiceLetra = 0;
let apagando = false;

function digitar(){
  if(!elementoDigitado) return;
  const fraseAtual = frases[indiceFrase];

  if(!apagando){
    elementoDigitado.textContent = fraseAtual.slice(0, indiceLetra + 1);
    indiceLetra++;
    if(indiceLetra === fraseAtual.length){
      apagando = true;
      setTimeout(digitar, 1800);
      return;
    }
  } else {
    elementoDigitado.textContent = fraseAtual.slice(0, indiceLetra - 1);
    indiceLetra--;
    if(indiceLetra === 0){
      apagando = false;
      indiceFrase = (indiceFrase + 1) % frases.length;
    }
  }

  const velocidade = apagando ? 35 : 55;
  setTimeout(digitar, velocidade);
}

const prefereMenosMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(elementoDigitado){
  if(prefereMenosMovimento){
    elementoDigitado.textContent = frases[0];
  } else {
    digitar();
  }
}

// =========================================================
// REVELAR AO ROLAR A PÁGINA (scroll reveal)
// =========================================================
const alvosParaRevelar = document.querySelectorAll(
  '.cartao-estatistica, .etiqueta, .passo, .vitrine, .cartao-contato, .sobre__texto'
);

alvosParaRevelar.forEach(elemento => elemento.classList.add('revelar'));

const observador = new IntersectionObserver((entradas) => {
  entradas.forEach(entrada => {
    if(entrada.isIntersecting){
      entrada.target.classList.add('visivel');
      observador.unobserve(entrada.target);
    }
  });
}, { threshold: 0.15 });

alvosParaRevelar.forEach(elemento => observador.observe(elemento));

// =========================================================
// ANO NO RODAPÉ
// =========================================================
const elementoAno = document.getElementById('ano');
if(elementoAno){
  elementoAno.textContent = new Date().getFullYear();
}
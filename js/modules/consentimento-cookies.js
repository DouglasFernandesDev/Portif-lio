// Banner de consentimento de cookies (LGPD) + carregamento condicional do GA4.
// Regra que orienta este módulo: nenhuma requisição ao Google acontece antes
// do clique em "Aceitar" — o <script> do GA só é criado e inserido no DOM
// depois disso, nunca antes.

const CHAVE_ARMAZENAMENTO = 'consentimento-cookies';
const VERSAO_POLITICA = '2026-09-15';
const GA_ID = 'G-B2Y27C3RE3';

function carregarGA() {
  if (document.getElementById('scriptGA')) return;

  const script = document.createElement('script');
  script.id = 'scriptGA';
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(){ window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID);
}

function lerConsentimento() {
  try {
    const salvo = localStorage.getItem(CHAVE_ARMAZENAMENTO);
    return salvo ? JSON.parse(salvo) : null;
  } catch {
    return null;
  }
}

function registrarConsentimento(aceitou) {
  const consentimento = { analytics: aceitou, versao: VERSAO_POLITICA, data: new Date().toISOString() };
  try {
    localStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(consentimento));
  } catch {
    // localStorage indisponível (modo privado/bloqueado) — segue sem persistir
  }
  if (aceitou) carregarGA();
}

export function iniciarConsentimentoCookies() {
  const banner = document.getElementById('bannerCookies');
  if (!banner) return;

  const botaoAceitar = document.getElementById('aceitarCookies');
  const botaoRecusar = document.getElementById('recusarCookies');
  const botaoPreferencias = document.getElementById('preferenciasCookies');

  function mostrarBanner() {
    banner.hidden = false;
  }

  const consentimento = lerConsentimento();
  if (consentimento && consentimento.versao === VERSAO_POLITICA) {
    if (consentimento.analytics) carregarGA();
  } else {
    mostrarBanner();
  }

  botaoAceitar?.addEventListener('click', () => {
    registrarConsentimento(true);
    banner.hidden = true;
  });

  botaoRecusar?.addEventListener('click', () => {
    registrarConsentimento(false);
    banner.hidden = true;
  });

  // Revogação: limpa o consentimento salvo e reexibe o banner. Não recarrega
  // a página — se o GA já tinha carregado nesta sessão, a revogação vale a
  // partir da próxima visita (é o que o registro em localStorage garante).
  botaoPreferencias?.addEventListener('click', () => {
    try {
      localStorage.removeItem(CHAVE_ARMAZENAMENTO);
    } catch {
      // segue mesmo sem conseguir limpar
    }
    mostrarBanner();
  });
}


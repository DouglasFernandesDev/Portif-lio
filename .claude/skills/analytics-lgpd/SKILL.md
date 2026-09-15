---
name: analytics-lgpd
description: >
  Instala Google Analytics 4 em JavaScript puro (sem framework) com banner
  de consentimento de cookies em conformidade com a LGPD — nada dispara
  antes do aceite. Dispara em: "google analytics", "GA4", "gtag",
  "cookies", "banner de cookies", "LGPD", "consentimento", "política de
  privacidade", "rastreamento".
---

# Google Analytics + Consentimento (LGPD) — site estático

## Objetivo

Medir audiência **sem** ferir a LGPD. A regra que orienta tudo aqui: cookie
de analytics só existe **depois** do aceite livre e informado — e recusar
tem que ser tão fácil quanto aceitar. Neste projeto (HTML/CSS/JS vanilla),
isso é feito sem framework: sem `next/script`, sem componente React, sem
`npm install`.

> **Idioma:** comunicação e textos do banner em **PT-BR**.

---

## Passo 0 — Alinhar com o usuário antes de codar

Pergunte e **espere resposta**:

1. Qual o ID de medição do GA4 (formato `G-XXXXXXXXXX`)? Sem ele não dá
   para concluir.
2. Existe **Política de Privacidade** publicada? O banner precisa linkar
   para uma. Se não existir, avise que é obrigatório pela LGPD (art. 9º —
   informação clara sobre finalidade) e ofereça criar
   `politica-de-privacidade/index.html`, seguindo a mesma estrutura de
   `sobre/`/`contato/` já prevista na arquitetura do CLAUDE.md.

## Passo 1 — Onde entra no projeto

Sem bundler: o GA carrega via `<script>` apontando pro CDN do Google,
inserido no DOM **só depois do consentimento**. Crie um módulo novo em
`js/modules/consentimento-cookies.js`, importado por `script.js` (ou
`main.js`, se o entry point migrar) — siga a organização já combinada no
CLAUDE.md (`js/modules/` com `import`/`export`).

O ID de medição não é segredo (fica visível no HTML de qualquer jeito) —
pode ficar direto como constante no JS, igual ao `NUMERO_WHATSAPP` que já
existe em `script.js`.

## Passo 2 — Banner de consentimento em HTML/CSS/JS puro

HTML (em `index.html`, antes de `</body>`, escondido por padrão):

```html
<div class="banner-cookies" id="bannerCookies" role="dialog" aria-modal="false" aria-labelledby="tituloBannerCookies" hidden>
  <p id="tituloBannerCookies" class="banner-cookies__titulo">Usamos cookies</p>
  <p class="banner-cookies__texto">
    Usamos cookies de análise para entender como o site é usado. Você pode recusar sem perder nenhuma funcionalidade.
    <a href="politica-de-privacidade/">Saiba mais</a>.
  </p>
  <div class="banner-cookies__acoes">
    <button type="button" id="recusarCookies" class="botao botao--secundario">Recusar</button>
    <button type="button" id="aceitarCookies" class="botao botao--primario">Aceitar</button>
  </div>
</div>
```

CSS: reaproveite os tokens existentes (`--grafite-alto`, `--borda`,
`--raio`, `--largura-max`) — mesma lógica visual dos cartões já no site,
fixo na base da tela (`position: fixed; bottom: 0;`).

JS (`js/modules/consentimento-cookies.js`):

```js
const CHAVE_ARMAZENAMENTO = 'consentimento-cookies';
const VERSAO_POLITICA = '2026-09-15';
const GA_ID = 'G-XXXXXXXXXX';

function carregarGA() {
  const script = document.createElement('script');
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

  const consentimento = lerConsentimento();
  if (consentimento && consentimento.versao === VERSAO_POLITICA) {
    if (consentimento.analytics) carregarGA();
    return;
  }

  banner.hidden = false;
  document.getElementById('aceitarCookies').addEventListener('click', () => {
    registrarConsentimento(true);
    banner.hidden = true;
  });
  document.getElementById('recusarCookies').addEventListener('click', () => {
    registrarConsentimento(false);
    banner.hidden = true;
  });
}
```

Chame `iniciarConsentimentoCookies()` a partir de `script.js`, depois que o
DOM carregou.

**Por que não precisa do "Consent Mode default denied" do Next:** aqui o
`<script>` do GA só é **criado e inserido no DOM** depois do clique em
"Aceitar" — antes disso, nenhuma requisição ao Google acontece. O risco
que o Consent Mode resolve (biblioteca carregando antes de saber o
consentimento, comum em setups com GTM/SSR) simplesmente não existe neste
desenho mais simples.

**Ajuste de CSP.** O site já tem uma `Content-Security-Policy` restrita em
`index.html` (`script-src 'self'`). Como o GA carrega de
`googletagmanager.com`/`google-analytics.com`, atualize `script-src` e
`connect-src` do `<meta http-equiv="Content-Security-Policy">` para
incluir `https://www.googletagmanager.com` e
`https://www.google-analytics.com` **só quando** o GA for de fato
instalado — não deixe a CSP mais permissiva do que o site realmente
precisa neste momento.

## Passo 3 — Regras de conformidade (não negociáveis)

- "Recusar" com o **mesmo peso visual** de "Aceitar" — mesmo tamanho de
  botão, mesma proeminência.
- Sem pré-marcação, sem *cookie wall*: recusar não pode esconder ou
  bloquear conteúdo.
- Nenhuma requisição ao Google antes do clique em aceitar.
- Guarde **data e versão** do consentimento; ao mudar a política,
  incremente `VERSAO_POLITICA` — isso reexibe o banner.
- Ofereça revogação: um link "Preferências de cookies" no rodapé que limpa
  a chave do `localStorage` e reexibe o banner.
- Fechar no "X" ou simplesmente rolar a página **não** conta como
  consentimento.

## Passo 4 — Eventos personalizados (opcional)

Os CTAs que valem medir aqui são os botões de WhatsApp:

```js
document.querySelectorAll('[href^="https://wa.me"]').forEach(link => {
  link.addEventListener('click', () => window.gtag?.('event', 'clique_whatsapp', { origem: link.closest('section')?.id }));
});
```

`window.gtag` só existe depois do aceite — o encadeamento `?.` evita erro
se o script ainda não carregou.

## Passo 5 — Verificar

Com o site rodando local (`npx live-server`) e o DevTools aberto:

1. Aba anônima → banner aparece; na aba **Network**, filtrar por
   `google-analytics`/`gtag` → nenhuma requisição antes do clique.
2. Clicar em **Recusar** → banner some, sem requisição; recarregar não
   reexibe.
3. Limpar `localStorage`, clicar em **Aceitar** → `gtag/js` carrega;
   conferir em Tempo Real no painel do GA4.
4. Em **Application → Local Storage**, confirmar o registro com `data` e
   `versao`.
5. Confirmar no console (`list_console_messages`) que a CSP não bloqueou o
   script do GA.

---

## Checklist final

- [ ] Banner com "Recusar" tão visível quanto "Aceitar"
- [ ] Nenhuma requisição ao Google antes do aceite (verificado no Network)
- [ ] Link para a Política de Privacidade funcionando
- [ ] Consentimento gravado com data e versão; revogação possível pelo rodapé
- [ ] CSP atualizada para permitir os domínios do GA, sem abrir mais do que o necessário

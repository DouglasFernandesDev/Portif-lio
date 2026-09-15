---
name: paginas-de-estado
description: >
  Cria e revisa a página 404 do site estático (GitHub Pages) e o tratamento
  de erro em JavaScript no cliente (formulário, digitação, scroll-reveal).
  Dispara em: "criar página 404", "página de erro", "estado de carregamento",
  "tela de erro", "not found", "error boundary". Use antes de publicar
  qualquer página nova.
---

# Páginas de Estado (site estático)

## Objetivo

Garantir que o visitante nunca bata numa tela quebrada: uma URL errada tem
que cair numa 404 com a cara do site, e uma falha em JS (ex.: o link do
WhatsApp não abrir) não pode travar silenciosamente sem alternativa.

> **Idioma:** toda comunicação com o usuário em **PT-BR**. O texto das
> páginas também em PT-BR (`lang="pt-BR"` no projeto).

Este projeto é HTML/CSS/JS estático publicado no GitHub Pages — não existe
roteador de servidor nem build step. Os conceitos de `not-found.tsx` /
`error.tsx` / `global-error.tsx` do Next.js **não se aplicam** aqui. O
equivalente real:

| Situação | Equivalente neste projeto |
|---|---|
| 404 (rota não existe) | `404.html` na raiz — GitHub Pages serve automaticamente para qualquer URL sem match |
| Erro em runtime (JS) | `try/catch` nos pontos de risco de `script.js`, com fallback visível pro usuário |
| Carregamento (loading) | Só relevante se houver `fetch`/dado assíncrono; hoje o site não busca nada externo |

---

## Passo 1 — Levantar o que falta

```bash
ls 404.html 2>/dev/null || echo "404.html não existe"
grep -n "try\s*{" script.js
```

## Passo 2 — `404.html`

Crie na raiz do repositório (mesmo nível de `index.html`). GitHub Pages
detecta esse arquivo pelo nome e o serve com status 404 para qualquer
caminho inexistente, sem configuração adicional — tanto em
`usuario.github.io/repo/` quanto num domínio próprio.

Reaproveite o `<head>` de `index.html` (CSP, favicon, fontes, meta tags) e
o cabeçalho/rodapé, mas:

- `<title>` diz "Página não encontrada"
- `<meta name="robots" content="noindex">` — não indexar a 404
- Um único bloco central, texto claro, **link de volta pra home**
- **Não** repita as seções pesadas (projetos, formulário) — é página de
  saída, não uma cópia da home

```html
<main class="pagina-erro">
  <p class="rotulo-secao">// erro 404</p>
  <h1 class="titulo-secao">Essa página não existe</h1>
  <p>O endereço que você tentou acessar não existe ou foi movido.</p>
  <a href="./" class="botao botao--primario">Voltar para o início</a>
</main>
```

Estilize `.pagina-erro` em `estilo.css` reaproveitando os tokens já
existentes (`--grafite`, `--amarelo`, `--fonte-display`, `--largura-max`)
— não crie uma paleta nova só para essa página.

**Caminho relativo, sempre.** Como o CLAUDE.md já observa em "Common
Gotchas", o repositório pode ser servido de uma subpasta
(`usuario.github.io/repo/`). O link de volta deve ser `href="./"` ou
`href="index.html"` — nunca `href="/"` absoluto, senão quebra em qualquer
repositório que não seja a raiz do domínio.

## Passo 3 — Erros de JavaScript no cliente

Não existe "error boundary" numa página estática, mas `script.js` tem
pontos que podem falhar silenciosamente — o mais óbvio é `window.open` no
envio do formulário, que retorna `null` (em vez de lançar exceção) quando
um pop-up blocker intercepta a chamada.

```js
const nova = window.open(url, '_blank', 'noopener,noreferrer');
if (!nova) {
  // pop-up blocker interceptou: mostre o link pro usuário clicar manualmente
  // em vez de deixar o clique não fazer nada visível
}
```

Regra: **nenhuma** ação do usuário (clique, envio de formulário) pode
falhar sem feedback nenhum na tela.

## Passo 4 — Estado de carregamento

Hoje o site não busca dado nenhum de fora (sem `fetch`, sem API) — não há
necessidade de skeleton/spinner. Se um formulário passar a enviar para uma
API de verdade (em vez de só montar o link do WhatsApp), aplique então:

- desabilite o botão durante o envio (`disabled` + texto trocado, ex.
  "Enviando…")
- nunca deixe o botão clicável duas vezes seguidas
- use `aria-busy="true"` no container em espera

## Passo 5 — Verificar

```bash
npx live-server --no-browser &
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8080/rota-que-nao-existe.html
```

Um servidor de dev genérico (`live-server`) **não replica** o comportamento
de 404 do GitHub Pages — ele serve seu próprio "not found" padrão para
rotas ausentes, não o `404.html` do projeto. Para validar visualmente,
abra `404.html` direto no navegador. A confirmação real de que "GitHub
Pages serve `404.html` para rota inexistente" só acontece **depois do
deploy** — declare isso no relatório em vez de afirmar que testou algo que
só se comprova em produção.

---

## Checklist final

- [ ] `404.html` na raiz, com `<meta name="robots" content="noindex">` e link relativo de volta
- [ ] Visual consistente com o resto do site (mesmos tokens de `estilo.css`)
- [ ] `try`/checagem de retorno nos pontos de risco de `script.js` (ex.: `window.open`), com fallback visível
- [ ] Nenhum `fetch`/dado assíncrono sem tratamento de erro (se algum for adicionado no futuro)
- [ ] Textos em PT-BR e no tom do site

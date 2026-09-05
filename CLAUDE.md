# Project: [Nome do Projeto]

## Tech Stack

### Instalado
- HTML5 semântico
- CSS3 — Custom Properties (variáveis), Flexbox, Grid, Container Queries
- JavaScript (ES6+, Vanilla — sem frameworks)
- Playwright (testes E2E)
- ESLint — lint de JavaScript (`eslint.config.js`, flat config)
- Stylelint — lint de CSS (`.stylelintrc.json`, `stylelint-config-standard`)
- `live-server` — servidor de desenvolvimento com live reload

### Planejada (ainda não instalada)
> Adotar conforme a necessidade. Instalar a dependência **antes** de referenciá-la em código ou nas regras.
- Prettier — formatação automática de código
- Vite — se o projeto crescer além do que `live-server` cobre bem
- Web Components (`customElements`) ou templates JS — se precisar de componentização sem framework

## Commands
- `npx live-server` (ou `npx vite`) — servidor local com live reload
- `npx eslint .` — lint de JavaScript
- `npx stylelint "**/*.css"` — lint de CSS
- `npx prettier --check .` / `npx prettier --write .` — checagem/formatação de código
- `npx playwright test <arquivo>` — Playwright, um arquivo por vez

## Architecture
- Estrutura de projeto estático, organizada por tipo de arquivo na raiz:
  - `index.html` — página principal; demais páginas ficam na raiz ou em subpastas por seção (`sobre/index.html`, `contato/index.html`)
  - `css/` — folhas de estilo; `css/base.css` (reset + variáveis), `css/layout.css`, `css/components/` para estilos por componente
  - `js/` — scripts; `js/main.js` como ponto de entrada, `js/modules/` para módulos ES6 importados via `import`/`export`
  - `assets/` — imagens, ícones, fontes (`assets/images/`, `assets/fonts/`)
  - `tests/` — testes Playwright (`tests/<nome>.spec.js`)
- JavaScript organizado em módulos ES6 (`<script type="module" src="js/main.js">`) — evita poluir o escopo global
- CSS organizado por camadas: variáveis/tokens → reset → layout → componentes → utilitários
- Sem lógica de servidor: tudo roda no navegador. Se precisar de backend/API, documentar endpoint e método de chamada (`fetch`) aqui quando for adicionado

## Code Style
- HTML: tags semânticas (`<header>`, `<main>`, `<nav>`, `<section>`, `<article>`, `<footer>`) em vez de `<div>` genérico sempre que houver equivalente
- Acessibilidade: todo `<img>` com `alt`; inputs com `<label>` associado; usar atributos `aria-*` quando o HTML semântico não for suficiente
- CSS: nomenclatura de classes em BEM (`bloco__elemento--modificador`); usar Custom Properties (`--cor-primaria`) para tokens de design em vez de valores soltos; mobile-first (media queries com `min-width`)
- JavaScript: ES6+ (`const`/`let`, nunca `var`); arrow functions onde fizer sentido; módulos ES (`import`/`export`), sem `require()`
- Sem CSS inline (`style="..."`) e sem JS inline (`onclick="..."`) — manter separação entre estrutura, estilo e comportamento
- Nomes de arquivo: kebab-case (`menu-principal.js`, `card-produto.css`)

## Environment Variables
- Projeto estático não tem `.env` por padrão — se adotar um bundler (Vite), usar `import.meta.env` e prefixo `VITE_PUBLIC_*` para valores expostos ao client
- **Nunca** colocar chaves/segredos em JavaScript do lado do cliente: qualquer coisa em `js/` é pública e visível no navegador (não existe "server-side" aqui, diferente de Next.js/Server Actions)
- Se precisar de chamadas autenticadas a uma API, isso exige um backend próprio (fora do escopo deste stack) — documentar separadamente se for adicionado

## Workflow
- ALWAYS rodar `npx eslint .` e `npx stylelint "**/*.css"` após uma série de mudanças
- Rodar um teste por vez, não o suite completo: `npx playwright test tests/NomeDoArquivo.spec.js`
- Validar visualmente em pelo menos dois navegadores (Chrome + Firefox) antes de considerar uma tela pronta
- Branch naming: `feat/`, `fix/`, `chore/` + descrição em kebab-case
- Commits em inglês, imperativo: "add mobile nav toggle"

## Common Gotchas
- Abrir `index.html` direto via `file://` quebra `fetch`/módulos ES por CORS — sempre usar um servidor local (`live-server`, `vite`, etc.)
- Scripts que manipulam o DOM devem rodar após o DOM carregar: usar `defer` no `<script>` ou ouvir `DOMContentLoaded`
- Caminhos de assets: preferir caminhos relativos à raiz do site (`/assets/...`) e conferir se batem com a estrutura de pastas ao publicar (GitHub Pages, Netlify etc. podem mudar a raiz)
- `<script type="module">` já é `defer` por padrão e roda em modo estrito — cuidado com `this` no escopo global
- Cache agressivo do navegador durante o desenvolvimento pode esconder mudanças em CSS/JS — usar hard refresh ou parâmetro de versão no link do arquivo

## Git Commits

NEVER run Git commit directly. ALWAYS use the commit skill for every git commit in this project, regardless of how the user requested it.
This applies to:

Explicit requests: "faz o commit", "commita", commit das mudanças"
Implícito requests: "salva", "finaliza a feature", "pode subir"
Any situation where you would naturally run git commit

The commit skill enforces Conventional Commits specification and ansiares consistent commit history across the project.
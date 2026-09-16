# Portfólio — Douglas Fernandes

Site pessoal de um desenvolvedor front-end que atende negócios locais em
Iguaba Grande - RJ. Landing pages e cardápios digitais, com foco em
carregar rápido e levar o visitante até o WhatsApp.

**No ar:** <https://douglasfernandesdev.github.io/Portif-lio/>

## Stack

HTML5 semântico, CSS3 (Custom Properties, Flexbox, Grid) e JavaScript
ES6+ em módulos — **sem framework e sem etapa de build**. Os arquivos do
repositório são exatamente os que o GitHub Pages serve.

| Ferramenta | Para quê |
|---|---|
| [live-server](https://www.npmjs.com/package/live-server) | servidor local com recarga automática |
| [ESLint](https://eslint.org/) | lint do JavaScript (flat config) |
| [Stylelint](https://stylelint.io/) | lint do CSS |
| Google Analytics 4 | audiência — só carrega **após** o aceite no banner de cookies |
| Sentry | monitoramento de erros de JavaScript em produção |

## Estrutura

```
index.html                     página principal
404.html                       erro 404 (servido pelo GitHub Pages)
politica-de-privacidade/       política de privacidade (LGPD)

css/
  base.css                     tokens de design, reset, tipografia base
  layout.css                   estrutura de seção e divisores
  components/                  um arquivo por bloco de UI
  utilitarios.css              utilitários e preferência de movimento

js/
  main.js                      ponto de entrada (ES module)
  modules/                     um módulo por comportamento

assets/images/                 imagens, ícones e prints dos projetos
```

O CSS segue a ordem de camadas **tokens → reset → layout → componentes →
utilitários**, e cada página carrega apenas os componentes que usa. As
media queries ficam junto do componente que elas afetam, não num arquivo
separado — mobile-first, sempre com `min-width`.

## Rodando localmente

```bash
npm install     # só na primeira vez
npm run dev     # sobe o live-server
```

Abrir o `index.html` direto pelo explorador de arquivos (`file://`) não
funciona: módulos ES são bloqueados por CORS nesse protocolo. Use sempre
um servidor local.

## Qualidade

```bash
npm run lint         # JavaScript + CSS
npm run lint:js
npm run lint:css
```

## Publicação

Merge na `main` dispara o GitHub Pages automaticamente. Não há build:
o deploy publica os arquivos como estão.

## Licença

[MIT](LICENSE).

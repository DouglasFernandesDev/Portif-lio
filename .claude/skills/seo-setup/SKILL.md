---
name: seo-setup
description: >
  Configura o SEO técnico do site estático: meta tags e Open Graph/Twitter
  no <head> do HTML, imagem de compartilhamento, sitemap.xml, robots.txt e
  o cadastro no Google Search Console. Dispara em: "metadata", "SEO", "open
  graph", "OG image", "preview do link", "sitemap", "robots.txt", "search
  console", "indexar no Google", "meta tags".
---

# SEO Técnico (site estático)

## Objetivo

Fazer o site ser **indexável**, **compartilhável** (preview correto no
WhatsApp/Instagram/LinkedIn) e **monitorável** no Google Search Console.
Sem framework: tudo aqui é HTML/arquivo estático direto — nada é gerado em
build, porque este projeto não tem build step.

> **Idioma:** comunicação com o usuário em **PT-BR**. Conteúdo das meta
> tags em PT-BR (público brasileiro).

---

## Passo 0 — Confirmar a URL canônica

Este projeto já usa `https://douglasfernandesdev.github.io/Portif-lio/`
(ver `<link rel="canonical">` em `index.html`). Confirme com o usuário se
esse é o domínio definitivo antes de gerar sitemap/robots — se um domínio
próprio for configurado depois (custom domain no GitHub Pages), **todas**
as URLs absolutas do projeto (canonical, `og:url`, `og:image`, sitemap,
`dados-estruturados.json`) precisam ser atualizadas juntas, senão passam a
apontar para lugares diferentes.

## Passo 1 — Meta tags no `<head>`

Confira o que já existe antes de adicionar — não duplique:

```bash
grep -n "og:\|twitter:\|canonical\|<meta name=\"description\"" index.html
```

Este site já tem: `title`, `description`, `canonical`, Open Graph
(`og:type`, `og:title`, `og:description`, `og:image`, `og:locale`),
Twitter Card e um bloco JSON-LD (`Person`) em `dados-estruturados.json`
(carregado via `<script type="application/ld+json" src="...">`, fora do
HTML — ver decisão de CSP no histórico do projeto). Se alguma dessas
faltar numa página nova (ex.: uma página de caso de projeto separada),
replique o mesmo padrão — mantenha `og:locale` como `pt_BR` e a descrição
em português.

Se o site ganhar páginas novas além da home (`sobre/index.html`,
`contato/index.html`, conforme a arquitetura do CLAUDE.md), cada uma
precisa do próprio `<title>`, `description` e `og:url` apontando para o
caminho certo — **não reaproveite** as meta tags da home.

## Passo 2 — Imagem de compartilhamento (OG image)

Já existe `imagem/og-image.jpg`, referenciada em `og:image` e
`twitter:image`. Ao trocar:

- Mantenha 1200×630px (proporção 1.91:1) — é o tamanho que
  WhatsApp/LinkedIn/Facebook recortam sem cortar texto importante.
- Sem texto essencial nas bordas — alguns apps recortam para quadrado no
  preview.
- A URL em `og:image` precisa ser **absoluta** (`https://...`), nunca
  relativa — confirme com `grep -n "og:image" index.html`.

## Passo 3 — `sitemap.xml`

Arquivo estático na raiz (não é gerado em build). Uma entrada por página
real do site:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://douglasfernandesdev.github.io/Portif-lio/</loc>
    <lastmod>2026-09-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

Ao criar uma página nova (`sobre/index.html` etc.), adicione a entrada
correspondente aqui manualmente — como não há build, ninguém gera isso por
você. Não inclua `404.html` (não é uma página a indexar).

## Passo 4 — `robots.txt`

Arquivo estático na raiz:

```
User-agent: *
Allow: /

Sitemap: https://douglasfernandesdev.github.io/Portif-lio/sitemap.xml
```

Não há rota `/api/` nem painel administrativo a bloquear neste projeto —
se isso mudar, adicione `Disallow:` correspondente.

## Passo 5 — Verificar antes de publicar

```bash
npx live-server --no-browser &
curl -s http://127.0.0.1:8080/robots.txt
curl -s http://127.0.0.1:8080/sitemap.xml
curl -s http://127.0.0.1:8080/index.html | grep -Eo '<meta[^>]*(og:|twitter:|description)[^>]*>'
```

Confirme que nenhuma URL aponta para `localhost` e que `og:image` abre de
fato no navegador. Depois do deploy, valide o preview real: compartilhador
do Facebook (Sharing Debugger), Post Inspector do LinkedIn, e mandando o
link pra você mesmo no WhatsApp — o cache de preview é agressivo, revalide
por essas ferramentas sempre que trocar a imagem.

## Passo 6 — Google Search Console

Passos manuais do usuário; conduza um a um e **espere a confirmação de
cada um**:

1. Acessar <https://search.google.com/search-console> e adicionar
   propriedade — use **Prefixo de URL**
   (`https://douglasfernandesdev.github.io/Portif-lio/`), mais simples que
   verificação por domínio, já que o site está num subcaminho de
   `github.io` (sem controle de DNS).
2. Verificação por **arquivo HTML**: o Google fornece um arquivo
   `googleXXXXXXXX.html` — baixe e coloque na raiz do repositório (é só
   mais um arquivo estático). Alternativa: meta tag
   `google-site-verification` no `<head>` de `index.html`.
3. Deploy (push para a branch que publica no GitHub Pages) — a verificação
   lê o site publicado, não o local.
4. Clicar em "Verificar" no Search Console.
5. Em **Sitemaps**, enviar `sitemap.xml`.
6. Em **Inspeção de URL**, testar a home e pedir indexação.

Indexação leva de horas a dias. O arquivo/meta tag de verificação deve
**permanecer** no repositório.

---

## Checklist final

- [ ] Meta tags (title, description, canonical, OG, Twitter) presentes e sem URL relativa em `og:image`
- [ ] `sitemap.xml` na raiz, com uma entrada por página real
- [ ] `robots.txt` na raiz, apontando pro sitemap
- [ ] Preview validado numa rede social real após o deploy
- [ ] Propriedade verificada no Search Console e sitemap enviado

---
name: monitoramento
description: >
  Configura monitoramento de erros no cliente (Sentry via Loader Script,
  sem build step) e de disponibilidade (monitor de uptime externo apontando
  pro site estático). Dispara em: "Sentry", "monitorar erros", "error
  tracking", "uptime", "o site caiu", "health check", "alerta de queda",
  "observabilidade".
---

# Monitoramento de Erros e Disponibilidade — site estático

## Objetivo

Saber que algo quebrou **antes** do cliente avisar. Como este site não tem
servidor (só HTML/CSS/JS no GitHub Pages), "erro" aqui significa **erro de
JavaScript no navegador do visitante** — e "disponibilidade" significa o
GitHub Pages estar respondendo.

> **Idioma:** comunicação com o usuário em **PT-BR**.

---

## Passo 0 — Checar o que já existe antes de perguntar

```bash
grep -rn "sentry-cdn.com" *.html */*.html 2>/dev/null
```

Se já existir um `<script src="https://js.sentry-cdn.com/...">` em pelo
menos uma página, o Sentry **já está instalado** — não pergunte a chave de
novo. Se for adicionar a uma página nova que ainda não tem o script,
reaproveite a mesma chave já usada nas outras (copie a tag inteira,
`src` e `crossorigin` incluídos) e replique também os trechos de CSP
(`script-src`, `connect-src`, `worker-src`) dessa página — ver Parte A.

Se a chave alguma vez parar de funcionar (loader retorna 500, ou avisa no
console "isn't working anymore, check your configuration"), é sinal de
que ela foi regenerada no painel do Sentry — não é bug de CSP nem deste
código; peça a chave atual em Settings → Projects → [projeto] → Loader
Script e atualize em **todas** as páginas que a usam.

Só siga para o Passo 0.1 se nenhuma página tiver o script (Sentry nunca
foi instalado neste projeto).

## Passo 0.1 — Alinhar com o usuário

Pergunte e **espere resposta**:

1. Já existe conta no Sentry? Se sim, peça pra abrir o projeto (Browser
   JavaScript) e copiar o **Loader Script** pronto (Settings → Projects →
   [projeto] → Client Keys → Loader Script) — é mais simples que pedir só
   o DSN, porque a tag `<script>` já vem completa.
2. Para onde os alertas de queda devem ir (e-mail, WhatsApp)?

Sem o Loader Script não dá para concluir a parte de erros — faça a parte
de uptime e deixe a de Sentry pendente, dizendo isso claramente.

---

## Parte A — Sentry (erros no cliente)

Sem `npm install`: este projeto não tem build step em produção — GitHub
Pages serve os arquivos como estão no repositório. Use o **Loader
Script** (é o que já está instalado nas páginas existentes e foi testado
de ponta a ponta) — cole a tag inteira que o Sentry gerou, bem no topo do
`<head>`, antes dos outros recursos:

```html
<script src="https://js.sentry-cdn.com/<chave>.min.js" crossorigin="anonymous"></script>
```

Não escreva `Sentry.init()` manualmente — o Loader Script já se
autoconfigura com base no que está definido no painel do Sentry
(Settings → Projects → [projeto] → Loader Script: versão do SDK,
tracing, session replay). Mudar esses recursos é feito **na interface do
Sentry**, não no código.

**Duas etapas de rede, não uma.** O loader (`js.sentry-cdn.com`) é só um
stub pequeno — ele mesmo busca o SDK completo de um segundo domínio,
`browser.sentry-cdn.com`. A CSP precisa liberar os dois em `script-src`,
senão o segundo carregamento é bloqueado (isso só aparece testando de
verdade no navegador, não é óbvio lendo a doc do Sentry).

**Ajuste de CSP** (as 4 diretivas, todas necessárias — testadas uma a uma
nesta sessão, cada uma pega uma etapa diferente do fluxo):
- `script-src`: adicionar `https://js.sentry-cdn.com` e
  `https://browser.sentry-cdn.com`
- `connect-src`: adicionar o host de ingest — formato
  `https://<id>.ingest.us.sentry.io` ou `.ingest.de.sentry.io` conforme a
  região do projeto (não dá pra saber qual sem testar; ver Passo final)
- `worker-src`: precisa existir com `'self' blob:` — o SDK cria um Web
  Worker em segundo plano (provavelmente para compressão do session
  replay); sem essa diretiva, `worker-src` cai no fallback de
  `script-src`, que não libera `blob:`, e o worker é bloqueado
- `img-src`: geralmente não precisa mudar, mas confira se não há erro de
  imagem/pixel do Sentry no console

**O que este site não tem** (e por isso não existe equivalente aqui):
Server Components, Server Actions, Route Handlers, middleware, runtime
edge. **Não** crie `sentry.server.config.ts`, `sentry.edge.config.ts` nem
`instrumentation.ts` — não fazem sentido sem servidor. Também não crie
`js/vendor/sentry.min.js` nem um módulo de inicialização — o Loader
Script substitui os dois.

---

## Parte B — Disponibilidade (uptime)

Sem servidor, não existe rota de health check própria — o "health check"
de um site estático é a própria página respondendo. Aponte o monitor
direto para a home:

1. Criar conta num monitor com plano gratuito (UptimeRobot, Better Stack).
2. Novo monitor **HTTP(S)** apontando para
   `https://douglasfernandesdev.github.io/Portif-lio/`.
3. Intervalo de 5 minutos (suficiente no plano free).
4. Alerta esperando status **200**.
5. Destino do alerta conforme respondido no Passo 0.
6. Ativar monitor de expiração de **certificado SSL**, se a ferramenta
   oferecer — o GitHub Pages gerencia o certificado, mas vale ter o
   alerta como segunda camada.

### Alertas que não viram ruído

- Notificar só após **2 falhas consecutivas** (evita alarme por
  instabilidade de rede).
- No Sentry, criar alerta para **nova issue** e para **pico de erros**,
  não para toda ocorrência.
- Revisar semanalmente o que chegou. Alerta que todo mundo ignora é pior
  do que não ter alerta.

---

## Passo final — Verificar

Teste **local primeiro**, com um servidor limpo (não o `live-server` — o
client de live-reload dele injeta um script que gera falso-positivo de
CSP; use `npx http-server . -p <porta> -s`):

1. Abrir o site, esperar ~1,5s (o loader carrega o bundle completo de
   forma assíncrona), disparar um erro de teste via console:
   `try { throw new Error('teste-sentry') } catch(e) { window.Sentry.captureException(e) }`.
2. Conferir `list_network_requests` filtrando por `fetch`/`xhr` — precisa
   aparecer um `POST .../envelope/?...` pro host de ingest com status
   **200**. Isso é a prova real; o painel do Sentry pode levar alguns
   segundos a mais pra mostrar a issue.
3. Conferir `list_console_messages` — zero erros de CSP, e **nenhum**
   aviso do tipo "isn't working anymore, check your configuration" (esse
   aviso específico significa que a chave no código não bate mais com a
   configuração atual do projeto no painel — ver Passo 0).

Depois de publicar, repita o mesmo teste na **URL de produção** — não
assuma que "funcionou local" implica "funciona no ar". Duas pegadinhas
reais encontradas fazendo isso:
- **Propagação**: mudanças no painel do Sentry (Allowed Domains, chave
  regenerada) podem levar alguns minutos pra valer nos servidores deles.
  Se o teste falhar logo após mudar algo lá, espere e teste de novo antes
  de assumir que é bug de código.
- **Cache do navegador**: ao reabrir a URL de produção depois de um
  deploy nesta mesma aba/perfil de navegador, use reload com
  `ignoreCache: true` (ou `curl` direto) — uma navegação comum pode
  reaproveitar o HTML antigo em cache e fazer parecer que o deploy não
  pegou, quando na verdade só a aba está desatualizada.

Só declare que funciona depois de ver o `POST` com 200 — configuração
escrita, ou um aviso no console que sumiu, não é prova suficiente.

Pra disponibilidade: pausar/derrubar o monitor de teste (se a ferramenta
permitir simular queda) e confirmar que o alerta chegou ao destino
combinado.

---

## Checklist final

- [ ] Loader Script instalado no `<head>`, antes dos outros recursos, em todas as páginas que precisam
- [ ] CSP com as 4 diretivas ajustadas: `script-src` (js.sentry-cdn.com + browser.sentry-cdn.com), `connect-src` (host de ingest), `worker-src` ('self' blob:)
- [ ] Erro de teste confirmado via `POST .../envelope/` com 200 — local **e** em produção
- [ ] Nenhum aviso "isn't working anymore" no console
- [ ] Monitor externo ativo na home, com alerta testado
- [ ] Nenhum arquivo de config de servidor/edge criado (não se aplica a este projeto), nenhum SDK vendorizado nem `Sentry.init()` manual (o Loader Script cobre os dois)

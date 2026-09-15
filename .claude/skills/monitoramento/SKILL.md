---
name: monitoramento
description: >
  Configura monitoramento de erros no cliente (Sentry via SDK vendorizado,
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

## Passo 0 — Alinhar com o usuário

Pergunte e **espere resposta**:

1. Já existe conta no Sentry? Precisa do **DSN**.
2. Para onde os alertas de queda devem ir (e-mail, WhatsApp)?

Sem DSN não dá para concluir a parte de erros — faça a parte de uptime e
deixe a de Sentry pendente, dizendo isso claramente.

---

## Parte A — Sentry (erros no cliente)

Sem `npm install`: este projeto não tem build step em produção — GitHub
Pages serve os arquivos como estão no repositório. Duas opções:

**A. CDN direto** — mais simples, mas é um terceiro carregando de fora do
domínio; exige abrir a CSP para `browser.sentry-cdn.com`:
```html
<script src="https://browser.sentry-cdn.com/<versão>/bundle.tracing.min.js" crossorigin="anonymous"></script>
```

**B. Vendorizado (recomendado — mantém `script-src 'self'` na CSP)** —
baixe o bundle do Sentry Browser SDK e salve em `js/vendor/sentry.min.js`,
versionado no repositório:
```html
<script src="js/vendor/sentry.min.js"></script>
```

Em qualquer uma, inicialize num módulo próprio
(`js/modules/monitoramento-erros.js`), carregado **depois** do SDK:

```js
Sentry.init({
  dsn: 'SEU_DSN_AQUI',
  tracesSampleRate: 0.1,
  environment: location.hostname === 'localhost' ? 'development' : 'production',
});
```

O DSN de um projeto client-side não é segredo por natureza do SDK de
browser — mesmo assim, mantenha-o isolado num único módulo, fácil de
trocar se precisar rotacionar.

**Ajuste de CSP.** Adicione o host de ingest do Sentry (formato
`https://<id>.ingest.us.sentry.io` ou `.ingest.de.sentry.io`, conforme a
região do projeto) em `connect-src` no `<meta http-equiv="Content-Security-Policy">`
de `index.html` — sem isso, o SDK carrega mas as requisições de erro são
bloqueadas pela própria política já configurada no site.

**O que este site não tem** (e por isso não existe equivalente aqui):
Server Components, Server Actions, Route Handlers, middleware, runtime
edge. **Não** crie `sentry.server.config.ts`, `sentry.edge.config.ts` nem
`instrumentation.ts` — não fazem sentido sem servidor.

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

1. Criar um erro de teste temporário (`throw new Error('teste-sentry')`
   num `<script>` isolado), servir local com `npx live-server`, abrir no
   navegador e confirmar que a issue **apareceu no painel do Sentry**.
   Remover o script de teste depois.
2. `curl -I https://douglasfernandesdev.github.io/Portif-lio/` → confirmar
   status 200.
3. Conferir no console do navegador (`list_console_messages`) que a CSP
   não está bloqueando o SDK nem o envio de eventos ao host de ingest.
4. Pausar/derrubar o monitor de teste (se a ferramenta permitir simular
   queda) e confirmar que o alerta chegou ao destino combinado.

Só declare que funciona depois de ver a issue no painel e o alerta
chegando — configuração escrita não é monitoramento comprovado.

---

## Checklist final

- [ ] SDK do Sentry vendorizado em `js/vendor/` (ou CDN liberado explicitamente na CSP)
- [ ] `connect-src` da CSP inclui o host de ingest do Sentry
- [ ] Erro de teste visto no painel do Sentry, script de teste removido
- [ ] Monitor externo ativo na home, com alerta testado
- [ ] Nenhum arquivo de config de servidor/edge criado (não se aplica a este projeto)

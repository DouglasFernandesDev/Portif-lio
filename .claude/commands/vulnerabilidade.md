---
allowed-tools: Agent
description: Run security vulnerability scan
---

Invoque o agent `auditor-vulnerabilidades` (ferramenta `Agent`, `subagent_type: "auditor-vulnerabilidades"`) para varrer o site atrás de SQL injection, XSS, credenciais expostas e configurações inseguras. Repasse a ele qualquer contexto extra informado aqui: $ARGUMENTS

Não faça a varredura você mesmo neste comando — o agent é quem mantém o checklist completo e atualizado ao stack real do projeto.
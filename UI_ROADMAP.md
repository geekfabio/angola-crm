# Roteiro de UI — 15 fases

Enquanto o `ROADMAP.md` ordena o produto por fases de negócio (fundação, dados reais, Supabase), este ficheiro ordena a **construção da interface** dos módulos que já têm rota mas ainda são esqueleto visual — tabela de leitura, sem store, sem diálogos, sem painel de detalhe.

Cada fase leva um módulo ao mesmo nível de acabamento do módulo de referência, `components/companies/`: store Zustand próprio (`stores/`), toolbar com filtros, painel de detalhe em `Sheet`, diálogos de criação/edição, estados vazios tratados. Tudo com **dados fictícios em memória** — sem Supabase. Quando a Fase 1 do `ROADMAP.md` de produto ligar a base de dados, estes componentes trocam a fonte de dados (de `data/*.ts` para Supabase) sem mudar de forma; a UI não se refaz.

A ordem segue o fluxo de negócio descrito em `FEATURES.md`: Clientes → Contactos → Oportunidades → Atividades → Previsão/Relatórios → Campanhas (Email) → SMS → Automações → Definições → polimento transversal.

Estado: `✅ feito` · `🔨 em curso` · `⬜ por fazer`

---

## Fase 1 — Oportunidades: Funil completo `✅`

Módulo `FEATURES.md` §3. Fecha o ciclo comercial que o cabeçalho de Clientes já antecipa nos separadores Clientes/Oportunidades/Previsão.

- `data/opportunities.ts`: fases de negócio próprias (`OPPORTUNITY_STAGES` — Qualificação, Proposta, Negociação, Fechada‑Ganha, Fechada‑Perdida), distintas da fase de relação do cliente em `data/companies.ts`; motivos de perda tipificados; histórico de fase.
- `stores/opportunities-store.ts`: filtros, vista Kanban/Tabela, painel de detalhe, diálogos.
- Quadro Kanban arrastável por fase (HTML5 drag-and-drop nativo, sem biblioteca nova) + tabela alternativa.
- Painel de detalhe com histórico de fase em linha do tempo.
- Diálogo de nova oportunidade; diálogo de motivo de perda obrigatório ao mover para "Fechada - Perdida".

**Pronto quando:** um cartão se arrasta entre fases, perder uma oportunidade pede sempre um motivo, e uma oportunidade nova aparece no quadro e na tabela.

---

## Fase 2 — Contactos: Ficha completa `✅`

Módulo `FEATURES.md` §2. Pré-requisito de Email/SMS — nenhuma campanha poderá incluir um contacto sem consentimento no canal.

- `data/contacts.ts`: estado de contactabilidade (Válido, Inválido, Saiu da empresa, Pediu remoção) **separado** do consentimento por canal (e-mail, SMS, WhatsApp — cada um com data e origem).
- `stores/contacts-store.ts`: filtros, seleção, painel de detalhe, diálogo de novo contacto, diálogo de fusão.
- Tabela com indicador de consentimento por canal (não uma coluna única).
- Painel de detalhe com os 3 canais, estado de contactabilidade editável, cliente associado.
- Diálogo de fusão de duplicados: compara dois contactos campo a campo.

**Pronto quando:** a ficha de um contacto mostra o consentimento de cada canal com data e origem, e fundir dois contactos faz desaparecer o duplicado.

---

## Fase 3 — Atividades: Registo e Lista `⬜`

`FEATURES.md` §4. Toolbar com filtros (tipo, gestor, cliente, janela de datas), `stores/activities-store.ts`, diálogo de novo registo. A lista atual (`components/activities/`) passa a ler do store, não do array estático.

**Pronto quando:** um registo novo (visita, chamada, e-mail, reunião, entrega, reclamação) aparece na lista e é filtrável.

## Fase 4 — Atividades: Calendário e Rota do Dia `⬜`

Vista de calendário mensal/semanal sobre as mesmas atividades; tarefas com responsável, prazo e lembrete; vista "rota do dia" pensada para mobile (clientes a visitar, agrupados por zona).

**Pronto quando:** a mesma atividade aparece na lista e no calendário, e a rota do dia é utilizável a 360px.

## Fase 5 — Previsão: Painel de Direção `⬜`

`previsao/` troca os números fixos de `data/forecast.ts` por agregações reais de `data/opportunities.ts` (soma por gestor/zona/fase, ponderada por probabilidade). Metas (`quota`) tornam-se editáveis num diálogo, guardadas no store de Previsão.

**Pronto quando:** mudar a fase de uma oportunidade em `/oportunidades` muda o número em `/previsao`.

## Fase 6 — Relatórios: Desempenho e Clientes em Risco `⬜`

`FEATURES.md` §8. Painel por gestor/zona/equipa; lista de "clientes em risco" (sem compra há X dias, calculado a partir de `activityDays`); exportação CSV reaproveitando `lib/csv.ts`.

**Pronto quando:** a lista de clientes em risco reage ao mesmo filtro de janela de atividade usado em Clientes.

## Fase 7 — Campanhas: Editor e Biblioteca (Email) `⬜`

`FEATURES.md` §5. Editor de campanha por blocos (texto, imagem, botão), com pré-visualização desktop/mobile; biblioteca de modelos com a marca Alimenta Angola; variáveis de personalização com valor por omissão.

**Pronto quando:** um modelo da biblioteca abre no editor pronto a personalizar.

## Fase 8 — Campanhas: Segmentação e Envio (Email) `⬜`

Segmentos construídos sobre os filtros de Clientes/Contactos (zona, segmento, ABC, dias sem comprar); fluxo rascunho → revisão → agendamento; exclusão automática de quem não tem consentimento de e-mail (liga à Fase 2).

**Pronto quando:** um segmento sem consentimento mostra a contagem de exclusões antes de agendar.

## Fase 9 — Campanhas: Medição `⬜`

Métricas simuladas de entregues/aberturas/cliques/devoluções por campanha; essas métricas entram na linha do tempo do cliente (painel de detalhe de Clientes, ao lado de Atividades).

**Pronto quando:** abrir uma campanha enviada mostra números de abertura, e esses números também aparecem na ficha do cliente.

## Fase 10 — SMS: Composição e Custo `⬜`

`FEATURES.md` §6. Composição com contagem de caracteres/segmentos GSM-7 vs. Unicode (acentos avisam custo); estimativa de custo por operadora antes de confirmar; janela de envio respeitada (hora de Luanda).

**Pronto quando:** escrever um SMS com acentos mostra o aviso de custo extra em tempo real.

## Fase 11 — Automações: Motor de Regras `⬜`

`FEATURES.md` §7. Construtor visual gatilho → condição → ação (lista fixa de gatilhos e ações, sem motor genérico); sequências com espera entre passos; travão de frequência por contacto.

**Pronto quando:** criar uma regra simples (ex.: "N dias sem comprar → enviar SMS") aparece na lista de automações ativas.

## Fase 12 — Definições: Empresa e Modelos `⬜`

`FEATURES.md` §9. Dados da empresa, remetentes de e-mail/SMS, modelos de mensagem — formulários simples, sem ligação real a fornecedores (continua em modo sandbox conforme `AGENTS.md`).

**Pronto quando:** um modelo criado em Definições aparece na biblioteca da Fase 7.

## Fase 13 — Definições: Equipas, Zonas e Acessos `⬜`

Gestão de equipas comerciais e zonas (hoje só decorativas na sidebar — ver `components/_common/sidebar/sidebar-content.tsx`); perfis de acesso (Administrador, Gestor comercial, Comercial, Marketing, Leitura) como UI de permissões, sem RLS real ainda.

**Pronto quando:** as "Zonas" e "Equipas Comerciais" da sidebar deixam de ser texto fixo e vêm desta área de Definições.

## Fase 14 — Auditoria e Notificações Transversais `⬜`

Registo de auditoria (quem alterou o quê, com foco em dados de cliente e envios); o centro de notificações do cabeçalho (`components/companies/header/notifications/`) passa a agregar eventos dos módulos novos, não só de Clientes.

**Pronto quando:** criar uma oportunidade ou fundir um contacto gera uma notificação visível no sino do cabeçalho.

## Fase 15 — Polimento Transversal `⬜`

Revisão de acessibilidade (`.claude/skills/better-accessibility`) e de 360px em todos os módulos construídos nas Fases 1–14; micro-interações consistentes com os tokens `--ease-power*`.

**Pronto quando:** todos os módulos passam a mesma revisão que `AGENTS.md` já pede para mudanças de UI — ecrã estreito e largo, sem regressões.

---

## Notas transversais

- Cada fase nova store segue o padrão de `stores/companies-store.ts`; o estado só de chrome partilhado (abrir/fechar sidebar) vive em `stores/ui-store.ts`, não em stores de domínio.
- Nenhuma fase liga a Supabase — isso é a Fase 1 do `ROADMAP.md` de produto. Os stores desta lista são desenhados para trocar a fonte de dados sem mudar a UI quando essa fase acontecer.
- Nenhuma destas fases dispara envios reais de e-mail/SMS — essa linha vermelha está em `AGENTS.md` e mantém-se.

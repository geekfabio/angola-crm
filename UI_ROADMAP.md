# Roteiro de UI — 17 fases

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

## Fase 3 — Atividades: Registo e Lista `✅`

`FEATURES.md` §4. `stores/activities-store.ts` passou a ser a fonte de verdade (filtros de tipo, gestor, cliente e janela de datas; `lib/activities.ts` com `filterActivities`). `data/activities.ts` ganhou `companyId`, `zone` e dados até à data corrente; diálogo "Novo Registo" (`components/activities/new-activity/`) cria um registo que aparece de imediato na lista.

**Pronto quando:** um registo novo (visita, chamada, e-mail, reunião, entrega, reclamação) aparece na lista e é filtrável. ✅ Confirmado.

## Fase 4 — Atividades: Calendário e Rota do Dia `✅`

`components/activities/` ganhou separadores (Lista / Calendário / Tarefas / Rota do Dia, `components/activities/header/`). Calendário mensal navegável (`lib/activities.ts` → `buildMonthGrid`) mostra atividades e tarefas por dia. Tarefas com responsável, prazo e lembrete (`data/tasks.ts`, `stores/activities-store.ts`) ganharam quadro Kanban arrastável (Por Fazer / Em Curso / Feita, `components/activities/tasks/`, mesmo padrão de drag-and-drop nativo do Kanban de Oportunidades) e diálogo "Nova Tarefa". Vista "Rota do Dia" (`components/activities/route/`) agrupa as visitas e tarefas de hoje por zona, pensada mobile-first.

**Pronto quando:** a mesma atividade aparece na lista e no calendário, e a rota do dia é utilizável a 360px. ✅ Confirmado.

## Fase 5 — Previsão: Painel de Direção `✅`

`components/forecast/` passou a ler `useOpportunitiesStore` diretamente: figura principal (carteira ponderada), cartões de KPI (carteira aberta, oportunidades abertas, taxa de conversão, ticket médio), funil por fase, gráfico de tendência com tooltip ao passar o rato, e ranking por gestor/zona — tudo derivado em `lib/dashboard.ts` a partir de `data/opportunities.ts`. Entrada em cascata e gráficos desenhados com Motion (`components/forecast/charts/`). As metas (`quota`) do painel continuam a vir de `data/forecast.ts`; as metas por zona e por equipa passaram a ser editáveis em Definições (Fase 13), mas para já só o painel de Relatórios as usa.

**Pronto quando:** mudar a fase de uma oportunidade em `/oportunidades` muda o número em `/previsao`. ✅ Confirmado.

## Fase 6 — Relatórios: Desempenho e Clientes em Risco `✅`

`FEATURES.md` §8. Módulo novo (`/relatorios`, `components/reports/`) com KPIs do período (vendas, carteira aberta, taxa de conversão, clientes ativos), um painel de desempenho com alternador Gestor/Zona/Equipa (`lib/reports.ts`, `components/_common/ranked-bar-list.tsx`) e a lista de "clientes em risco" com o mesmo filtro de janela de atividade de Clientes — invertido para "sem compra há mais de X dias" (`data/companies.ts`:`ACTIVITY_WINDOWS`). Exportação CSV em ambos os painéis, reaproveitando `lib/csv.ts`.

`data/companies.ts` ganhou `zone` por cliente e `team`/`TEAMS` por gestor (liga às Zonas e Equipas Comerciais da sidebar); `data/forecast.ts` ganhou `TEAM_FORECAST`. Os componentes genéricos de `components/forecast/charts/` usados só pela Previsão (`stat-tile`, `ranked-bar-list`, `at-risk-list`, `animated-sparkline`) foram promovidos para `components/_common/`, já que agora servem dois módulos.

**Pronto quando:** a lista de clientes em risco reage ao mesmo filtro de janela de atividade usado em Clientes. ✅ Confirmado.

## Fase 7 — Campanhas: Editor e Biblioteca (Email) `✅`

`FEATURES.md` §5. `stores/campaigns-store.ts` passou a ser a fonte de verdade de `/campanhas`; clicar numa campanha de e-mail abre o editor (`components/campaigns/editor/`) em três passos — Conteúdo, Destinatários, Revisão e envio.

- Editor por blocos (`data/campaigns.ts`: Título, Texto, Destaque, Imagem, Botão, Separador), com reordenação e remoção, e pré-visualização ao vivo em computador/telemóvel (`email-preview.tsx`), desenhada só com os tokens de marca (`--brand`, `--brand-accent`, `--brand-ink`, `--brand-paper`).
- Biblioteca de modelos (`components/campaigns/library/`): promoção semanal, lista de preços, novo produto, aviso de rutura, boas-vindas, aniversário do cliente, e um modelo em branco.
- Variáveis `{{nome}}`, `{{empresa}}`, `{{gestor}}`, `{{zona}}`, `{{saldo}}` inseridas no cursor, cada uma com valor por omissão obrigatório; a pré-visualização pode ser vista "como" qualquer contacto ou só com os valores por omissão (`lib/campaigns.ts` → `renderVariables`).
- Fora de âmbito, por dependerem de infraestrutura: modo HTML, anexos (Supabase Storage), carregamento de imagens (só o logótipo está disponível) e teste A/B.

**Pronto quando:** um modelo da biblioteca abre no editor pronto a personalizar. ✅ Confirmado.

## Fase 8 — Campanhas: Segmentação e Envio (Email) `✅`

- Segmento dinâmico sobre os filtros de Clientes — zona, segmento, classe ABC (calculada por Pareto sobre o valor em carteira em `lib/campaigns.ts` → `abcClasses`) e dias sem comprar — com contagem de clientes, contactos, excluídos e destinatários elegíveis, e as duas listas lado a lado.
- Exclusão automática (`buildAudience`): contactos inválidos, que saíram da empresa ou pediram remoção, e quem não tem consentimento de e-mail. Lê `useContactsStore` e `useCompaniesStore`, por isso mudar o consentimento em Contactos muda a contagem na campanha aberta.
- Fluxo Rascunho → Em revisão (conteúdo bloqueado) → envio de teste registado → Agendada (data e hora de Luanda, sempre no futuro), com cancelamento de agendamento e regresso a rascunho.
- **Nada é enviado.** O teste e o agendamento só mudam o estado em memória; o ecrã diz isso explicitamente. O envio real continua dependente do fornecedor de e-mail, de `lib/messaging/` e de `MESSAGING_LIVE=true` (`ROADMAP.md` Fase 4, `AGENTS.md`).

**Pronto quando:** um segmento sem consentimento mostra a contagem de exclusões antes de agendar. ✅ Confirmado.

## Fase 9 — Campanhas: Medição `✅`

- Campanhas enviadas abrem diretamente no novo separador "4. Resultados" (`components/campaigns/editor/results-step.tsx`): taxas de entrega, abertura e cliques, percurso enviados → entregues → abertos → clicaram, devoluções permanentes/temporárias, remoções da subscrição e cliques por ligação. Para SMS: entregues, falhados e respostas PARAR.
- Métricas agregadas em `data/campaigns.ts` (`metrics`) e eventos por contacto em `data/campaign-events.ts` (Entregue, Aberto, Clicou, Devolvido, Falhou, Removeu subscrição); taxas em `lib/campaigns.ts` → `campaignRates`.
- A ficha do cliente (`components/companies/detail/client-timeline.tsx`) ganhou uma **Linha do tempo** que junta as atividades (`useActivitiesStore`) e os eventos de campanha dos contactos desse cliente.
- Métricas de exemplo — o ecrã diz isso. Com o fornecedor ligado chegam por webhook (`ROADMAP.md` Fase 4, ponto 6). Teste A/B continua fora de âmbito.

**Pronto quando:** abrir uma campanha enviada mostra números de abertura, e esses números também aparecem na ficha do cliente. ✅ Confirmado.

## Fase 10 — SMS: Composição e Custo `✅`

`FEATURES.md` §6. Campanhas SMS usam o mesmo editor, segmentos e variáveis do e-mail, com passo de conteúdo próprio (`sms-content-step.tsx`) e quatro modelos na biblioteca (alternador E-mail/SMS).

- `lib/sms.ts`: regra de contagem do fornecedor (Umoja Global / MIMOSMS) — cada 120 unidades contam como uma mensagem (121 = 2, 241 = 3…), letras simples contam 1 unidade e letras com acento (ã, ç, é…) e outros caracteres especiais contam 2. Inclui "Substituir acentos", validação do remetente (3–11 caracteres) e da janela de envio.
- `lib/phone.ts` (previsto no `CLAUDE.md`): normalização para E.164 (+244) e operadora pelo prefixo — Unitel 92/93/94/97, Movicel 91/99, Africell 95/96.
- Aviso em tempo real quando há acentos, com os caracteres que contam a dobrar e quantas mensagens (e Kz) se poupam sem eles; instrução de remoção «Resp. PARAR p/ sair» opcional e incluída na contagem.
- Audiência por canal: exclui quem não tem consentimento de SMS ou tem número inválido, e mostra telefone + operadora.
- Revisão e envio: custo estimado **antes de confirmar**, calculado por destinatário com as variáveis preenchidas (os nomes também podem trazer acentos), repartido por operadora, e quanto custam os acentos. Pacote único a 20 Kz por mensagem, igual para todas as operadoras.
- O agendamento recusa horas fora da janela de envio (hora de Luanda). Nada é enviado — sandbox, como no e-mail.
- Fora de âmbito: estados por mensagem via webhook, SMS transacional e `PARAR` a retirar o consentimento automaticamente (dependem do agregador).

**Pronto quando:** escrever um SMS com acentos mostra o aviso de custo extra em tempo real. ✅ Confirmado.

## Fase 11 — Automações: Motor de Regras `✅`

`FEATURES.md` §7. Módulo novo `/automacoes` (`components/automations/`, `stores/automations-store.ts`), com lista e construtor no mesmo padrão de Campanhas.

- Construtor visual **Quando → Se → Então**: lista fixa de gatilhos (cliente criado, oportunidade muda de fase, ganha ou perdida, N dias sem comprar, aniversário, dívida vencida, campanha aberta/clicada), condições sobre zona, segmento e classe ABC, e uma sequência de passos com espera em dias antes de cada ação.
- Ações: enviar e-mail ou SMS (com os modelos da biblioteca de Campanhas), criar tarefa para o gestor, mudar a fase do cliente, notificar o gestor, adicionar a um segmento.
- Resumo legível da regra e calendário da sequência (Dia 0, Dia 7…), validação antes de ativar (`lib/automations.ts` → `automationIssues`) e automações ativas só de leitura — é preciso pausar para editar.
- **Travão global** de mensagens por contacto por semana (por omissão 2), com aviso quando uma sequência envia mais do que isso na mesma semana (`maxMessagesInWeek`).
- **Simulação** para "N dias sem comprar": que clientes entrariam hoje, com as condições aplicadas.
- Quatro automações de exemplo: boas-vindas, reativação de cliente inativo, seguimento de proposta sem resposta, aniversário.
- Nada é executado: ativar só muda o estado (sandbox). "Aniversário" e "dívida vencida" dependem de dados que ainda não existem (data de início da relação; faturação/ERP) e o ecrã diz isso.

**Pronto quando:** criar uma regra simples (ex.: "N dias sem comprar → enviar SMS") aparece na lista de automações ativas. ✅ Confirmado.

## Fase 12 — Definições: Empresa e Modelos `✅`

`FEATURES.md` §9. Módulo novo (`/definicoes`, `components/settings/`, `stores/settings-store.ts`, dados de exemplo em `data/settings.ts`), aberto pelo item "Definições" no rodapé da sidebar, com separadores:

- **Empresa** — nome comercial, denominação social, NIF, contactos e morada, validados em `lib/settings.ts` (telefone via `lib/phone.ts`); alimentam o rodapé dos e-mails, com pré-visualização.
- **Remetentes** — nome e endereço de envio (só `@alimentaangola.co.ao`), endereço de resposta, identificador de SMS e janela de envio por omissão. Novas campanhas de SMS herdam estes valores; a pré-visualização de e-mail mostra o remetente e o rodapé configurados. Aviso de modo sandbox — o modo real não se liga a partir da UI.
- **Modelos** — modelos de e-mail (editor por blocos e pré-visualização reaproveitados da Fase 7) e de SMS (com o contador de unidades da Fase 10): novo, editar, duplicar, eliminar. Um modelo usado numa automação não pode ser eliminado. A biblioteca de Campanhas e os passos das Automações passaram a ler os modelos do store de Definições.

Tudo em memória — sem Supabase nem ligação real a fornecedores.

**Pronto quando:** um modelo criado em Definições aparece na biblioteca da Fase 7. ✅ Confirmado.

## Fase 13 — Definições: Equipas, Zonas e Acessos `✅`

- **Equipas** — nome, descrição, ícone, meta trimestral e "mostrar na barra lateral"; membros (cada gestor numa equipa). Uma equipa com membros não pode ser removida. O relatório por equipa (Fase 6) usa estas equipas, membros e metas.
- **Zonas** — nome, cor, meta e "mostrar na barra lateral", com contagem de clientes. Mudar o nome propaga-se a clientes, atividades, campanhas e automações (`stores/rename-zone.ts`); só se removem zonas sem clientes. Os seletores de zona (novo cliente, nova atividade, rota do dia, segmentação de campanhas, condições de automações) e o relatório por zona leem esta lista.
- **Acessos** — matriz de permissões por perfil (Administrador, Gestor comercial, Comercial, Marketing, Leitura) e âmbito de clientes visíveis; utilizadores com perfil editável (não o próprio) e convites pendentes. "Convidar Equipa" na sidebar abre este separador com o diálogo de convite. É a especificação das políticas — **sem RLS real ainda**, nada é aplicado até haver Supabase.

**Pronto quando:** as "Zonas" e "Equipas Comerciais" da sidebar deixam de ser texto fixo e vêm desta área de Definições. ✅ Confirmado.

## Fase 14 — Auditoria e Notificações Transversais `✅`

- **Registo de auditoria** (`/auditoria`, `components/audit/`, `stores/audit-store.ts`, `data/audit.ts`): quem fez o quê, em que registo, com as alterações campo a campo (valor antigo riscado → valor novo). Agrupado por dia ("Hoje", "Ontem"), com filtros por módulo e pessoa, pesquisa, "Só dados sensíveis" (consentimentos, fusões, envios, perfis de acesso) e exportação CSV. Clicar no registo abre-o no módulo certo.
- **`recordEvent()`** é o ponto único: os stores de Clientes, Contactos, Oportunidades, Atividades, Campanhas, Automações, Tickets e Definições chamam-no nas ações que contam (criar, mover de fase, fundir, consentimento, agendar, ativar, convites, perfis…). Escreve na auditoria, gera a notificação e, quando faz sentido, o aviso no ecrã.
- **Centro de notificações global** (`components/_common/notifications/`, `stores/notifications-store.ts`): o sino está em todos os cabeçalhos de módulo, com tempo relativo ("há 5 minutos"), "Não lidas", e ligação ao registo de auditoria. Clicar numa notificação abre o registo no módulo respetivo.
- **Avisos (toasts)** (`components/_ui/toaster.tsx`, `stores/toast-store.ts`): confirmação discreta com ação — "Abrir" depois de criar, **"Anular"** depois de mover uma oportunidade de fase, fundir contactos ou eliminar um modelo (a eliminação de modelos deixou de pedir confirmação, porque pode ser anulada). Avisos com ação ficam até serem fechados; os restantes desaparecem em 5 s e param enquanto o rato ou o foco estão por cima.

Sem Supabase: o registo vive em memória. Quando houver base de dados, `recordEvent()` passa a escrever numa tabela de auditoria só de inserção, com RLS.

**Pronto quando:** criar uma oportunidade ou fundir um contacto gera uma notificação visível no sino do cabeçalho. ✅ Confirmado.

## Fase 15 — Polimento Transversal `✅`

- **Paleta de comandos global** (⌘K / Ctrl K, ou o botão "Pesquisar…" em todos os cabeçalhos): pesquisa clientes, contactos, oportunidades, tickets e campanhas (sem acentos, por palavras), cria qualquer registo e navega para qualquer módulo. Substitui a paleta antiga que só existia em Clientes.
- **Atalhos de teclado**: `N` cria o registo principal do módulo atual, `/` foca a pesquisa da página, `G` seguido de uma letra navega (C Clientes, O Oportunidades, P Previsão, R Relatórios, A Atividades, N Contactos, M Campanhas, U Automações, T Tickets, L Auditoria, D Definições). Desligados enquanto se escreve ou com um diálogo aberto; listados na própria paleta.
- **Acessibilidade**: link "Saltar para o conteúdo" como primeira paragem do Tab e um `<main>` único; todas as pesquisas com `aria-label`; avisos numa região `aria-live="polite"`; estados de SLA e de auditoria com texto e ícone, nunca só cor; animações dos avisos reduzidas a opacidade com "reduzir movimento".
- **Micro-interações**: botões com `scale(0.96)` ao carregar (só com movimento permitido); cabeçalhos de Oportunidades, Atividades e Clientes passaram a usar o `ModuleHeader` partilhado.
- **360px**: revisão automática de todas as rotas — nenhum elemento cortado fora de áreas com scroll; as pesquisas ocupam a largura toda em ecrã estreito.

**Pronto quando:** todos os módulos passam a mesma revisão que `AGENTS.md` já pede para mudanças de UI — ecrã estreito e largo, sem regressões. ✅ Confirmado (11 rotas a 360px e 1440px, sem erros na consola).

---

## Fase 16 — Tickets: Suporte e SLA `✅`

Módulo novo, fora da lista original de `FEATURES.md` — pedido explícito do utilizador para abrir pedidos/incidentes de clientes com cronograma e comentários, a partir de "leitura de e-mails".

- `data/tickets.ts`: estados (Aberto, Em Curso, Em Espera, Resolvido, Fechado), prioridades (Baixa, Normal, Alta, Urgente), origem (E-mail, Telefone, WhatsApp, Manual); comentários e cronograma por ticket.
- `stores/tickets-store.ts`: filtros, painel de detalhe, diálogo de novo ticket, diálogo "criar a partir de e-mail", `addComment`/mudança de estado e prioridade (regista sempre no cronograma).
- Módulo novo na sidebar (`/tickets`), com tabela, painel de detalhe (estado/prioridade editáveis, cronograma, thread de comentários) e os dois diálogos de criação.
- **Sem ligação a uma caixa de entrada real.** O diálogo "Criar a partir de E-mail" pede campos explícitos (Remetente, Assunto, Mensagem) — não analisa texto livre nem liga a um fornecedor. Ler e-mails reais para abrir tickets automaticamente depende de Supabase (continua sem ligar nesta sessão) e de autenticação OAuth com um fornecedor de e-mail; fica para quando essas duas peças existirem.

**Pronto quando:** criar um ticket manual ou a partir de "e-mail" aparece na tabela, mudar o estado ou a prioridade regista um evento no cronograma, e adicionar um comentário aparece na thread.

### Reforço: SLA `✅`

O título prometia SLA e a primeira versão não o tinha. Agora:

- Política por prioridade (`data/tickets.ts`:`SLA_POLICIES`): Urgente 1 h / 8 h, Alta 4 h / 24 h, Normal 8 h / 72 h, Baixa 24 h / 120 h (primeira resposta / resolução), em horas corridas.
- `lib/sla.ts` calcula o relógio de cada ticket: no prazo, **em risco** (menos de 25% do prazo), **atrasado**, pausado ("Em Espera"), cumprido ou fora do prazo. A primeira resposta fica registada no primeiro comentário ou ao passar a "Em Curso"; a resolução ao passar a "Resolvido"/"Fechado".
- Faixa de indicadores no topo (Por resolver, Em risco, Atrasados, Cumprimento %) que também servem de filtro; coluna SLA na tabela, ordenada por urgência; secção SLA no detalhe com barra de progresso e prazo de cada marco.

Simplificações assumidas: horas corridas (sem horário de expediente nem feriados) e o tempo "Em Espera" não é descontado — o relógio só aparece como pausado.

**Pronto quando:** um ticket urgente sem resposta há mais de 1 h aparece como "Atrasado", conta no indicador e sobe para o topo da tabela. ✅ Confirmado.

---

## Fase 17 — Mensagens funcionais: saldo e crédito de SMS `⬜`

Pedido do utilizador, separado das campanhas: o envio de SMS é pré-pago. O fornecedor é a **Umoja Global**, que subcontrata a **MIMOSMS**, com **pacote único a 20 Kz por mensagem** (mesma regra de contagem da Fase 10: 120 unidades por mensagem, acentos contam 2).

- Saldo de SMS visível no CRM (em Kz e em mensagens disponíveis), com aviso quando uma campanha agendada custa mais do que o saldo.
- "Carregar crédito": compra de pacotes de SMS pagos à Umoja Global, com histórico de carregamentos.
- Envio real via o adaptador de SMS em `lib/messaging/`, com estados por mensagem por webhook, SMS transacional (encomenda, entrega, pagamento) e resposta `PARAR` a retirar o consentimento.
- Depende de Supabase (saldo e histórico persistidos) e das credenciais do fornecedor em Supabase secrets — nunca no repositório (`AGENTS.md`).

**Pronto quando:** carregar crédito aumenta o saldo, e agendar uma campanha mais cara do que o saldo é bloqueado com o valor em falta.

---

## Notas transversais

- Cada fase nova store segue o padrão de `stores/companies-store.ts`; o estado só de chrome partilhado (abrir/fechar sidebar) vive em `stores/ui-store.ts`, não em stores de domínio.
- Nenhuma fase liga a Supabase — isso é a Fase 1 do `ROADMAP.md` de produto. Os stores desta lista são desenhados para trocar a fonte de dados sem mudar a UI quando essa fase acontecer.
- Nenhuma destas fases dispara envios reais de e-mail/SMS — essa linha vermelha está em `AGENTS.md` e mantém-se.

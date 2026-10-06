# Funcionalidades — Alimenta Angola CRM

Especificação funcional por módulo. O que cada módulo faz, que dados tem, e o que conta como "pronto". A ordem de entrega está em `ROADMAP.md`; as regras de implementação em `CLAUDE.md`.

Estado: `✅ existe` · `🔨 parcial` · `⬜ por construir`

---

## Glossário — do template para o negócio

O template veio de um CRM de software B2B. A Alimenta Angola é um **Cash and Carry**: vende em grosso e a retalho a mercearias, restaurantes, hotéis, cantinas, escolas, instituições e revendedores. A tradução não é só de idioma, é de vocabulário.

| Template (EN)            | Alimenta Angola (pt-AO) | O que passa a significar                                   |
| ------------------------ | ----------------------- | ---------------------------------------------------------- |
| Companies                | Clientes                | Conta comercial: loja, restaurante, hotel, instituição     |
| Contacts                 | Contactos               | Pessoa dentro do cliente (dono, gerente, chefe de compras) |
| Deals / Deals Board      | Oportunidades / Funil   | Negociação em curso: proposta, encomenda grande, contrato  |
| Pipeline Value           | Valor em carteira (Kz)  | Soma das oportunidades abertas                             |
| Open Deals               | Oportunidades abertas   | —                                                          |
| Win Probability          | Probabilidade de fecho  | —                                                          |
| Account Owner            | Gestor de conta         | Comercial responsável pelo cliente                         |
| Segment (Enterprise…)    | Segmento                | Grossista · Retalho · HORECA · Institucional · Revendedor  |
| Stage (New Logo…)        | Fase                    | Novo cliente · Reactivação · Expansão · Renovação · Piloto |
| Last Interaction         | Último contacto         | —                                                          |
| Activities               | Atividades              | Visitas, chamadas, e-mails, entregas, reclamações          |
| Email Sequences          | Campanhas               | Email Marketing e SMS                                      |
| SDR Team / Strategic AEs | Equipas comerciais      | Equipa de rua, televendas, grandes contas                  |
| Forecast                 | Previsão                | Projeção de vendas do período                              |
| Pipelines (regiões)      | Zonas                   | Luanda · Benguela · Huíla · Huambo · resto do país         |

Os identificadores no código mantêm os nomes em inglês (`companies`, `pipelineValue`). Só muda o que aparece no ecrã — `CLAUDE.md`, regra 2.

---

## 1. Clientes — `components/companies/` 🔨

O módulo de referência. Já funciona com dados fictícios; falta traduzir, adaptar ao domínio e ligar ao Supabase.

**Já existe ✅**

- Tabela com seleção múltipla, ordenação e rodapé de totais — `table/`
- Barra de ferramentas com filtros (gestor de conta, fase, janela de atividade, ordenação) e versão mobile em sheet — `toolbar/`
- Painel de detalhe do cliente: cartões de pontuação, saúde do funil, tendência de atividade — `detail/`
- Diálogo de novo cliente com upload de logótipo — `new-company/`
- Paleta de comandos (`⌘K`) com pesquisa — `command-menu/`
- Centro de notificações no cabeçalho — `header/notifications/`
- Perfil do utilizador e de gestor de conta — `profile/`
- Exportação para CSV — `lib/csv.ts`
- Sidebar redimensionável com largura persistida em `localStorage` — `_common/sidebar/`

**Por fazer ⬜**

- Tradução integral para pt-AO e substituição do vocabulário pelo glossário acima
- Campos do negócio: NIF, alvará, morada, zona, província, limite de crédito, condições de pagamento, canal de entrega (levantamento / entrega própria / transportadora)
- Classificação ABC por volume de compras e indicador de risco (dívida vencida, quebra de recorrência)
- Importação em massa por CSV/Excel, com pré-visualização e deteção de duplicados por NIF e telefone
- Histórico de compras do cliente no painel de detalhe
- Persistência em Supabase com RLS por gestor de conta e por zona

**Pronto quando:** um comercial consegue criar, filtrar, abrir e editar um cliente real, tudo em português, com os dados a sobreviver a um refresh.

---

## 2. Contactos ⬜

Pessoas. Um cliente tem vários; uma pessoa pode mudar de cliente.

- Ficha: nome, cargo, telefone (+244, operadora detetada), e-mail, WhatsApp, idioma preferido, cliente associado
- **Consentimento por canal** — e-mail, SMS, WhatsApp — com data, origem e histórico. É o que alimenta as campanhas e o que protege a empresa.
- Estado de contactabilidade: válido, inválido, saiu da empresa, pediu remoção
- Fusão de duplicados
- Importação CSV com o mesmo pipeline de validação dos clientes

**Pronto quando:** nenhuma campanha consegue incluir um contacto sem consentimento no canal em questão.

---

## 3. Oportunidades e Funil ⬜

- Quadro Kanban por fase, com arrastar entre colunas, e vista em tabela alternativa
- Campos: cliente, contacto, valor em Kz, fase, probabilidade, data prevista de fecho, gestor, produtos/categorias envolvidos
- Motivos de perda, tipificados, obrigatórios ao marcar como perdida
- Previsão ponderada por probabilidade, por gestor, por zona e por período
- Histórico de alterações de fase com data e autor

**Pronto quando:** o valor em carteira do cabeçalho de Clientes vem daqui e não de um número fixo.

---

## 4. Atividades e Agenda ⬜

- Registo de visita, chamada, e-mail, reunião, entrega, reclamação
- Tarefas com responsável, prazo e lembrete
- Vista de calendário e vista de lista por cliente, por gestor e por dia
- Registo automático a partir de Email Marketing e SMS — aberturas, cliques e respostas entram na linha de tempo do cliente
- Vista "rota do dia" para a equipa de rua: clientes a visitar, agrupados por zona

**Pronto quando:** o campo "Último contacto" da tabela de Clientes é calculado a partir das atividades.

---

## 5. Email Marketing ⬜

Módulo central do pedido. Enviar campanhas a listas segmentadas de clientes e contactos, a partir do próprio CRM.

**Construção**

- Editor de campanha em blocos, com pré-visualização desktop e mobile, e modo HTML para quem quer controlo total
- Biblioteca de modelos com a marca Alimenta Angola (vermelho `#DF2828`, amarelo `#F9EB2A`, logótipo): promoção semanal, lista de preços, novo produto, aviso de rutura, boas-vindas, aniversário do cliente
- Variáveis de personalização: `{{nome}}`, `{{empresa}}`, `{{gestor}}`, `{{zona}}`, `{{saldo}}` — com valor por omissão obrigatório
- Anexos: lista de preços em PDF via Supabase Storage

**Destinatários**

- Segmentos guardados e dinâmicos, construídos sobre os mesmos filtros de Clientes (zona, segmento, classificação ABC, dias sem comprar, categoria comprada, valor acumulado)
- Pré-visualização do segmento com contagem e amostra antes de enviar
- Exclusão automática de quem não tem consentimento, de endereços inválidos e de quem já recebeu nos últimos N dias

**Envio**

- Rascunho → revisão → agendamento ou envio imediato
- Envio de teste para endereços internos, obrigatório antes do envio real
- Processamento em fila com limitação de ritmo, em Supabase Edge Functions
- Cancelamento de campanha agendada

**Medição**

- Entregues, aberturas, cliques por ligação, respostas, devoluções (hard/soft), remoções
- Webhooks do fornecedor a actualizar o estado e a escrever na linha de tempo do cliente
- Teste A/B de assunto
- Página de remoção da subscrição em português, com registo de data e motivo

**Pronto quando:** uma promoção semanal sai para um segmento real, e as aberturas aparecem na ficha de cada cliente.

---

## 6. SMS ⬜

Em Angola o SMS chega onde o e-mail não chega. Tratado como canal de primeira classe, não como extra.

- Composição com contagem de caracteres e de segmentos (GSM-7 vs Unicode — acentos custam dinheiro, o editor avisa)
- Mesmo motor de segmentos e de variáveis do Email Marketing
- Remetente alfanumérico (sender ID) configurável, com nota sobre o registo necessário junto da operadora
- Normalização de números para E.164 e deteção de operadora (Unitel / Africell / Movicel) — `lib/phone.ts`
- Agendamento com **janela de envio respeitada**: nada sai fora do horário definido, hora de Luanda
- Estimativa de custo antes de confirmar, por segmento e por operadora
- Estados por mensagem: enfileirada, enviada, entregue, falhada, com motivo
- SMS transacional além da campanha: confirmação de encomenda, aviso de entrega, lembrete de pagamento, código de acesso
- Resposta `PARAR` a dar baixa automática do consentimento

**Pronto quando:** o custo estimado aparece antes de confirmar e a janela de envio é respeitada.

---

## 7. Automações ⬜

Regras simples, do tipo gatilho → condição → ação. Não é um motor de workflows genérico.

Gatilhos: cliente criado, fase alterada, oportunidade ganha/perdida, N dias sem comprar, aniversário do cliente, dívida vencida, campanha aberta/clicada.

Ações: enviar e-mail, enviar SMS, criar tarefa, mudar fase, notificar gestor, adicionar a segmento.

- Sequências de vários passos com espera entre eles (boas-vindas, reativação de cliente inativo, seguimento de proposta sem resposta)
- Travão global: limite de mensagens por contacto por semana, em qualquer canal

---

## 8. Relatórios ⬜

- Painel de direção: vendas do período, carteira, taxa de conversão, clientes activos vs inactivos, ticket médio
- Desempenho por gestor de conta, por zona e por equipa
- Desempenho de campanhas: e-mail vs SMS, custo por canal, retorno estimado
- Clientes em risco: sem compra há X dias, em queda face à média
- Exportação CSV e PDF; agendamento de relatório por e-mail

Gráficos reaproveitam `components/_common/sparkline.tsx` e `components/_common/segment-bar.tsx`.

---

## 9. Acessos e definições ⬜

- Autenticação Supabase (e-mail/palavra-passe e link mágico), sessão persistida
- Perfis: **Administrador** (tudo), **Gestor comercial** (a sua equipa e zona), **Comercial** (os seus clientes), **Marketing** (campanhas e segmentos, sem dados financeiros), **Leitura** (consulta)
- RLS a reflectir exactamente estes perfis — a autorização vive na base de dados, não só na UI
- Registo de auditoria: quem alterou o quê e quando, com foco em envios e em dados de cliente
- Definições: dados da empresa, remetentes de e-mail e SMS, janelas de envio, modelos, equipas e zonas, integrações

---

## 10. Base transversal 🔨

- **Idioma** — tudo em pt-AO; `lib/i18n.ts` com um dicionário central para o que for dinâmico ⬜
- **Formatação** — `lib/format.ts`: Kz, datas `Africa/Luanda`, percentagens, números ⬜
- **Telefone** — `lib/phone.ts`: validação +244, E.164, operadora ⬜
- **Mensagens** — `lib/messaging/`: interface comum a Email e SMS, com adaptadores por fornecedor e modo sandbox ⬜
- **Design system** — primitivas em `components/_ui/` ✅, tokens de marca em `app/globals.css` ⬜
- **Acessibilidade** — navegação por teclado, foco visível, leitores de ecrã; skills `better-accessibility` em `.claude/skills/` 🔨
- **Mobile** — a equipa de rua usa telemóvel; cada ecrã é validado a 360px 🔨
- **Rede fraca** — degradação graciosa e novas tentativas nas escritas ⬜
- **SEO/metadata** — `lib/seo.ts` ✅ (falta traduzir conteúdos e trocar `SITE_NAME` / `SITE_URL`)

---

## Fora de âmbito, por agora

Facturação e emissão de documentos fiscais certificados (AGT), gestão de stock e armazém, contabilidade, app móvel nativa e loja online para o cliente final. O CRM integra com estes sistemas quando existirem, mas não os substitui.

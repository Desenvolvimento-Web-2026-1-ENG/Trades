# 📱 Especificação de Wireframes — Trades (Hub dos Colecionadores)

Documentação técnica dos protótipos de interface da aplicação **Trades**, detalhando a estrutura visual, elementos de UI, regras de negócio front-end e a integração com os endpoints da API REST.

---

## 🖼️ Tela 1: Meu Inventário (Dashboard do Acervo)

![Tela 1 - Meu Inventário](../assets/screen%201.jpg)

### 📝 Descrição
Painel principal de controle e exibição da coleção do usuário logado. A tela organiza os ativos em categorias, apresenta métricas consolidadas no topo, dispõe de uma barra lateral para filtros avançados e exibe os itens em formato de cards com badges de raridade e nota de graduação.

### ⚙️ Funcionalidades
* **Métricas por Categoria:** Cards superiores exibindo a quantidade total de ativos divididos em *Cartas* (Trading & CCG), *Moedas* (Numismática) e *Selos* (Filatelia).
* **Barra de Filtragem Avançada:**
  * **Raridade:** Checkboxes para filtrar por *Mítico*, *Lendário* ou *Épico*.
  * **Era:** Seleção por período (*Moderno 2020+*, *Dourado 1990-2010*, *Vintage <1990*).
  * **Condição:** Slider interativo variando da nota *Ruim* até *Mint 10*.
* **Grade de Ativos Digitalizados:** Cards com imagem do item, badge de raridade, indicador de graduação (ex: *PSA 10*, *MINT 9.5*, *GEMS 10*) e valor estimado em créditos/moeda local.
* **Ação de Cadastro:** Botão `+ ADICIONAR NOVO ITEM` para redirecionamento direto ao formulário de inclusão.
* **Integração com API:** Consome a rota `GET /api/itens` enviando o filtro do `colecionadorId` logado.

---

## 🖼️ Tela 2: Cadastrar Novo Ativo (Formulário de Item)

![Tela 2 - Cadastrar Ativo](../assets/screen%203.jpg)

### 📝 Descrição
Interface de cadastro para inclusão de novos itens colecionáveis no inventário do usuário. Apresenta uma divisão em duas colunas: o lado esquerdo é focado no upload de imagem/mídia com preview holográfico, e o lado direito é estruturado em formulários de identificação técnica e procedência financeira.

### ⚙️ Funcionalidades
* **Upload de Mídia:** Zona de *drag-and-drop* ("Arraste a imagem aqui") com suporte a PNG, JPG e GIF de alta resolução (máx. 20MB) e barra de progresso de digitalização.
* **Identidade do Ativo:**
  * Campo de texto para *Nome do Item*.
  * Menu drop-down para escolha da *Categoria* (ex: Cartas, Moedas, Selos).
  * Slider de conservação *Condição (Mint Grade)* variando de *POOR 1* a *GEM MINT 10*.
  * Seletores em formato de botões para *Raridade* (*Comum*, *Raro*, *Épico*, *Lendário*, *Mítico*).
* **Procedência & Mercado:**
  * Seletor de *Data de Aquisição*.
  * Campo numérico de *Valor Estimado (CR)*.
  * Área de texto para *Descrição Detalhada* das características únicas e história do item.
* **Integração com API:** Dispara a requisição `POST /api/itens` associando o payload ao `colecionadorId` ativo.

---

## 🖼️ Tela 3: Painel de Propostas de Troca (Gerenciador)

![Tela 3 - Painel de Propostas](../assets/screen%204.jpg)

### 📝 Descrição
Central de controle para acompanhamento de todas as propostas de troca recebidas e enviadas. Apresenta navegação por abas de status e exibe os acordos em cards comparativos mostrando o que está sendo oferecido em relação ao que está sendo solicitado.

### ⚙️ Funcionalidades
* **Navegação por Abas:** Filtros superiores por estado da proposta (*Todas*, *Pendentes*, *Concluídas*, *Canceladas*).
* **Cards Comparativos de Troca:**
  * Informações do proponente (nome do usuário, avatar e badge de reputação ex: *Elite Trader*, *Verificado*).
  * Exibição visual lado a lado dos itens da negociação (*Oferta Deles* vs *Seu Item*).
* **Cálculo de Vantagem Estimada:** Indicador visual que calcula automaticamente a diferença financeira estimada do acordo (ex: `+1.3 ETH` ou `-10 CR`).
* **Ações Rápidas:** Botões em destaque `Aceitar` e `Recusar` direto no card da proposta pendente.
* **Integração com API:** Consome a rota `GET /api/propostas` e dispara requisições para a rota `PATCH /api/propostas/:id/responder` para aceitar ou recusar a proposta.

---

## 🖼️ Tela 4: Detalhes e Negociação de Proposta (Smart Trade)

![Tela 4 - Negociação](../assets/screen%202.jpg)

### 📝 Descrição
Tela detalhada de negociação direta de uma proposta específica (ex: *Proposal #8821*). Apresenta a composição detalhada da oferta (itens + saldo financeiro em CR), discriminação de taxas, canal de chat em tempo real e checklist de verificação de segurança (*Escrow*).

### ⚙️ Funcionalidades
* **Painel da Oferta (Your Offer vs Their Request):** Visualização detalhada de todos os itens envolvidos e adição de créditos complementares na oferta.
* **Status de Segurança & Validação:** Checklist de garantia contendo verificação de custódia (*Escrow Ready*), autenticidade (*Identity Verified*) e status de assinatura final (*Final Authorization*).
* **Resumo Financeiro (Financials):** Discriminação do valor da oferta (*Offer Value*), taxa da plataforma (*Platform Fee 2%*) e taxa de rede (*Network Gas*), calculando o custo total.
* **Canal de Negociação Seguro (Chat):** Chat integrado com indicador de digitação do parceiro de troca para ajustes nos termos do acordo.
* **Botões de Decisão:** Botão principal `AUTHORIZE PROPOSAL` para efetivar a troca e `Cancel Trade` para desistência.
* **Integração com API:** Ao clicar em autorizar, dispara `PATCH /api/propostas/:id/responder` com o corpo `{"aceitar": true}`, acionando a regra de negócio do backend que inverte a propriedade dos itens envolvidos.
# Documentação de APIs RESTful com Swagger e OpenAPI — Trades

## 1. Visão Geral do Sistema

O **Trades** é uma plataforma e marketplace simplificado focado em gestão de ativos digitais e itens colecionáveis (cartas Pokémon/TCG, numismática, selos e itens raros). A API gerencia o cadastro de colecionadores, manutenção de acervos/inventários e um sistema automatizado de propostas de troca entre usuários com transferência instantânea de propriedade (`colecionadorId`).

### Perfis da Plataforma

* **Colecionador:** Usuários registrados que gerenciam seus próprios inventários, cadastram novos itens de acervo, exploram vitrines de outros usuários e criam/respondem a propostas de troca.
* **Administrador:** Perfil com permissões de gestão do sistema, visualização global de métricas e supervisão de transações.

---

## 2. Padrão Arquitetural (Clean Architecture)

A aplicação segue os princípios da **Arquitetura Limpa (Clean Architecture)**, mantendo a camada de negócio e domínio totalmente desacopladas da infraestrutura e dos detalhes do framework Express:

* **Domínio e Casos de Uso:** Entidades (*Colecionador*, *Item*, *PropostaTroca*) e interfaces de repositórios (*In-Memory Repository Pattern*) permanecem livres de dependências externas.
* **Infraestrutura HTTP:** A especificação OpenAPI e o roteamento com `swagger-ui-express` ficam isolados nas rotas HTTP da aplicação (`src/routes/`) e centralizados no configurador da documentação (`src/docs/swagger.ts`).

---

## 3. Estrutura das Rotas da API (`/api`)

| Categoria | Método | Rota | Descrição |
| :--- | :--- | :--- | :--- |
| **Servidor** | `GET` | `/api/status` | Retorna o status operacional do servidor |
| **Servidor** | `GET` | `/api/health` | Rota de health-check para monitoramento de integridade |
| **Colecionadores** | `POST` | `/api/colecionadores` | Cadastra um novo colecionador na plataforma |
| **Colecionadores** | `GET` | `/api/colecionadores` | Lista todos os colecionadores cadastrados |
| **Colecionadores** | `GET` | `/api/colecionadores/:id` | Busca perfil do colecionador por ID |
| **Colecionadores** | `DELETE` | `/api/colecionadores/:id` | Remove um colecionador da plataforma |
| **Itens** | `POST` | `/api/itens` | Cadastra um novo item de coleção no inventário |
| **Itens** | `GET` | `/api/itens` | Lista todos os itens cadastrados no marketplace |
| **Itens** | `GET` | `/api/itens/:id` | Busca detalhes completos de um item por ID |
| **Itens** | `DELETE` | `/api/itens/:id` | Remove um item do acervo pelo ID |
| **Propostas** | `POST` | `/api/propostas` | Cria uma nova proposta de troca entre colecionadores |
| **Propostas** | `GET` | `/api/propostas` | Lista todas as propostas de troca cadastradas |
| **Propostas** | `GET` | `/api/propostas/:id` | Busca detalhes de uma proposta específica por ID |
| **Propostas** | `PATCH` | `/api/propostas/:id/responder` | Aceita ou recusa uma proposta (troca automática de propriedade) |

---

## 4. Modelos de Dados e Payload (JSON)

### 4.1. Cadastro de Item (`POST /api/itens`)

```json
{
  "titulo": "Cyber-Dragon Mech PSA 10",
  "fotoUrl": "[https://assets.trades.com/items/cyber-dragon.jpg](https://assets.trades.com/items/cyber-dragon.jpg)",
  "estadoConservacao": "Novo",
  "raridade": "Lendário",
  "colecionadorId": 1
}
```

```json
{
  "solicitanteId": 1,
  "destinatarioId": 2,
  "itensSolicitanteIds": [10, 12],
  "itensDestinatarioIds": [5]
}
```

```json
{
  "aceitar": true
}
```

```json
{
  "mensagem": "Proposta aceita com sucesso! Os itens foram transferidos entre os colecionadores.",
  "proposta": {
    "id": 1,
    "solicitanteId": 1,
    "destinatarioId": 2,
    "itensSolicitanteIds": [10, 12],
    "itensDestinatarioIds": [5],
    "status": "ACEITA"
  }
}
```

```json
{
  "mensagem": "Proposta de troca não encontrada."
}
```

```json
{
  "mensagem": "Um ou mais itens informados não pertencem ao solicitante da proposta."
}
```

```json
{
  "mensagem": "O campo 'titulo' e 'colecionadorId' são de preenchimento obrigatório."
}
```

## 5. Endpoints de Documentação no Servidor

Após iniciar a aplicação (npm run dev), a documentação interativa e o arquivo de especificação bruta estarão acessíveis através dos seguintes caminhos:

**Swagger UI (Interface Interativa):** http://localhost:3000/docs

**Especificação JSON (Importação no Postman/Insomnia):** http://localhost:3000/docs/json

## 6. Como Executar o Projeto Localmente

**Clone o repositório:**

```bash
git clone <URL_DO_REPOSITORIO>
```

**Instale as dependências:**

```bash
npm install
```

**Inicie o servidor em modo de desenvolvimento:**

```bash
npm run dev
```

**Acesse a documentação no navegador:**

http://localhost:3000/docs


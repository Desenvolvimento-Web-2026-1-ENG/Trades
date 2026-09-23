# Fluxo completo da criação de uma proposta de troca

Este documento explica, em ordem, o que acontece quando um usuário escolhe um item de outro colecionador e cria uma proposta de troca.

## Exemplo usado

- Usuário logado: `1`
- Item oferecido pelo usuário: `5`
- Usuário dono do item desejado: `2`
- Item desejado: `8`

## Visão geral do caminho

```text
1. Usuário clica em "Oferecer proposta"
2. ItemCard.tsx chama uma função do App.tsx
3. App.tsx prepara os dados da proposta
4. Usuário envia o formulário
5. Axios envia POST /api/propostas
6. propostas.routes.ts encontra a rota
7. A rota chama PropostaTrocaController.criar()
8. O controller chama PropostaTrocaService.criarProposta()
9. O service verifica os itens no ItemRepositoryInMemory
10. O service chama PropostaTrocaRepositoryInMemory.criar()
11. O repositório cria a proposta com status PENDENTE
12. A resposta volta ao controller
13. O backend responde com HTTP 201
14. O frontend recarrega as propostas
15. A nova proposta aparece na tela
```

## 1. O backend é iniciado

Arquivo:

`Trades/backend/src/infrastructure/http/server.ts`

```ts
const PORTA = 3000;
const app = express();
```

- `PORTA` define que o servidor usará a porta `3000`.
- `express()` cria a aplicação do servidor.

```ts
app.use(express.json());
```

Permite que o Express leia dados JSON enviados pelo frontend. Sem essa configuração, `req.body` poderia não conter os dados da proposta.

```ts
app.use('/api', propostasRoutes);
```

Registra as rotas de propostas usando o prefixo `/api`. Por isso, uma rota definida como `/propostas` fica disponível em `/api/propostas`.

```ts
app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
```

Inicia o servidor e faz com que ele aceite requisições na porta `3000`.

## 2. A rota de propostas é carregada

Arquivo:

`Trades/backend/src/infrastructure/http/routes/propostas.routes.ts`

```ts
const router = Router();
```

Cria um agrupador de rotas do Express.

```ts
const controller = PropostaTrocaFactory.criarController() as any;
```

Chama a factory para criar um controller já configurado.

## 3. A Factory monta os objetos

Arquivo:

`Trades/backend/src/factories/PropostaTrocaFactory.ts`

```ts
const propostaRepo = new PropostaTrocaRepositoryInMemory();
```

Cria o repositório que armazena propostas na memória.

```ts
const itemRepo = new ItemRepositoryInMemory();
```

Cria o repositório usado para consultar e atualizar itens.

```ts
const service = new PropostaTrocaService(propostaRepo, itemRepo);
```

Cria o service e entrega os dois repositórios a ele. Isso é uma forma de injeção de dependência.

```ts
return new PropostaTrocaController(service);
```

Cria o controller, entrega o service para ele e retorna o controller pronto.

A estrutura fica assim:

```text
Controller
    usa
Service
    usa
Repositories
```

## 4. O frontend exibe os itens

Arquivo:

`Trades/frontend/src/App.tsx`

O frontend carrega os itens pela API:

```ts
const res = await axios.get(`${API_BASE}/itens`);
```

Como `API_BASE` vale `/api`, a requisição é:

```text
GET /api/itens
```

Depois os itens são armazenados no estado do React:

```ts
setItens(dados);
```

O React percorre a lista e cria um card para cada item:

```tsx
{itensFiltrados.map((item) => (
  <ItemCard
    key={item.id}
    item={item}
  />
))}
```

## 5. O `ItemCard` mostra o botão

Arquivo:

`Trades/frontend/src/components/ItemCard.tsx`

O `App.tsx` verifica se o item pertence a outra pessoa:

```tsx
onOferecerProposta={
  Number(item.colecionadorId) !== usuarioLogado.id
    ? () => handleOferecerProposta(item)
    : undefined
}
```

- Se o item pertence a outra pessoa, uma função é enviada ao card.
- Se o item pertence ao próprio usuário, o valor é `undefined` e o botão não aparece.

Dentro do `ItemCard`:

```tsx
{onOferecerProposta && (
  <button
    type="button"
    onClick={onOferecerProposta}
  >
    Oferecer proposta
  </button>
)}
```

- Verifica se existe uma função para oferecer proposta.
- Cria o botão.
- Quando o usuário clica, executa a função recebida.

## 6. O clique prepara o formulário

Arquivo:

`Trades/frontend/src/App.tsx`

A função executada é:

```ts
const handleOferecerProposta = (item: Item) => {
```

Ela recebe o item selecionado.

```ts
setFormProposta({
  solicitanteId: String(usuarioLogado?.id || ''),
  destinatarioId: String(item.colecionadorId || ''),
  itemSolicitanteId: '',
  itemDestinatarioId: String(item.id)
});
```

Com o exemplo, o estado fica:

```ts
{
  solicitanteId: "1",
  destinatarioId: "2",
  itemSolicitanteId: "",
  itemDestinatarioId: "8"
}
```

- `solicitanteId`: usuário que está propondo.
- `destinatarioId`: dono do item escolhido.
- `itemSolicitanteId`: item que o usuário ainda escolherá oferecer.
- `itemDestinatarioId`: item desejado do outro usuário.

```ts
setAbaAtiva('propostas');
```

Muda a tela para a aba de propostas.

## 7. O usuário escolhe o item que oferecerá

O usuário escolhe o item `5`. O estado passa a ser:

```ts
{
  solicitanteId: "1",
  destinatarioId: "2",
  itemSolicitanteId: "5",
  itemDestinatarioId: "8"
}
```

## 8. O formulário é enviado

A função executada é:

```ts
const handleCriarProposta = async (e: React.FormEvent) => {
```

- `async` permite aguardar a resposta da API.
- `e` representa o evento do formulário.

```ts
e.preventDefault();
```

Impede o navegador de recarregar a página.

```ts
const solId = Number(formProposta.solicitanteId);
const destId = Number(formProposta.destinatarioId);
const itemSolId = Number(formProposta.itemSolicitanteId);
const itemDestId = Number(formProposta.itemDestinatarioId);
```

Converte os IDs, que estavam como texto no formulário, para números:

```text
solId = 1
destId = 2
itemSolId = 5
itemDestId = 8
```

## 9. O frontend monta o payload

```ts
const payload = {
  solicitanteId: solId,
  destinatarioId: destId,
  itensSolicitanteIds: [itemSolId],
  itensDestinatarioIds: [itemDestId]
};
```

O objeto enviado será:

```json
{
  "solicitanteId": 1,
  "destinatarioId": 2,
  "itensSolicitanteIds": [5],
  "itensDestinatarioIds": [8]
}
```

Os campos representam:

- `solicitanteId`: quem propôs a troca.
- `destinatarioId`: quem receberá a proposta.
- `itensSolicitanteIds`: itens oferecidos.
- `itensDestinatarioIds`: itens desejados.

## 10. O Axios envia a requisição

```ts
await axios.post(`${API_BASE}/propostas`, payload);
```

A requisição completa é:

```text
POST http://localhost:3000/api/propostas
```

O caminho é:

```text
React -> Axios -> Express -> rota POST
```

## 11. A rota encontra o método do controller

Arquivo:

`Trades/backend/src/infrastructure/http/routes/propostas.routes.ts`

```ts
router.post('/propostas', (req: Request, res: Response) => {
  chamarMetodo(
    req,
    res,
    ['criar', 'cadastrar', 'salvar', 'executar', 'propor'],
    201,
    { mensagem: 'Proposta processada' }
  );
});
```

A rota completa é `/api/propostas`, porque o servidor adicionou o prefixo `/api`.

A função `chamarMetodo` procura no controller um método com um dos nomes informados.

```ts
for (const nome of nomes) {
```

Percorre os nomes possíveis.

```ts
if (typeof controller[nome] === 'function') {
```

Verifica se o método existe.

Neste caso, encontra o método `criar`.

```ts
return controller[nome](req, res);
```

Executa:

```ts
controller.criar(req, res);
```

## 12. O controller encaminha ao service

Arquivo:

`Trades/backend/src/interfaces/controllers/PropostaTrocaController.ts`

```ts
criar(req: Request, res: Response) {
```

O método recebe a requisição e a resposta.

```ts
try {
```

Inicia uma tentativa para tratar possíveis erros.

```ts
const proposta = this.propostaService.criarProposta(req.body);
```

Lê o JSON enviado pelo frontend em `req.body` e chama o service.

O caminho agora é:

```text
Rota -> Controller.criar() -> Service.criarProposta()
```

```ts
return res.status(201).json(proposta);
```

Se der certo, retorna status HTTP `201` e a proposta em JSON.

```ts
} catch (error: any) {
  return res.status(400).json({ mensagem: error.message });
}
```

Se acontecer um erro, retorna status `400` com a mensagem.

## 13. O service valida os dados

Arquivo:

`Trades/backend/src/services/PropostaTrocaService.ts`

```ts
const solId = Number(dados.solicitanteId);
```

Converte o ID do solicitante para número.

```ts
const itensSolicitanteIds =
  (dados.itensSolicitanteIds || []).map(Number);
```

Obtém a lista de itens oferecidos e converte cada ID para número.

Resultado:

```ts
itensSolicitanteIds = [5]
```

## 14. O service consulta o item

```ts
const itensSolicitante = itensSolicitanteIds.map(
  id => this.itemRepository.buscarPorId(id)
);
```

Para o item `5`, chama:

```ts
this.itemRepository.buscarPorId(5);
```

O caminho é:

```text
PropostaTrocaService -> ItemRepositoryInMemory
```

## 15. O repositório procura o item

Arquivo:

`Trades/backend/src/infrastructure/database/ItemRepositoryInMemory.ts`

```ts
buscarPorId(id: number): Item | undefined {
```

Recebe o ID do item.

```ts
return itens.find((i) => i.id === id);
```

Procura o item na lista em memória e retorna o objeto encontrado ou `undefined`.

Exemplo de retorno:

```json
{
  "id": 5,
  "titulo": "Carta Rara",
  "colecionadorId": 1
}
```

## 16. O service confere o dono do item

```ts
const pertenceAoSolicitante = itensSolicitante.every(
  item => item && Number(item.colecionadorId) === solId
);
```

Verifica se todos os itens oferecidos:

1. existem;
2. pertencem ao solicitante.

No exemplo:

```text
Dono do item: 1
Solicitante: 1
Resultado: true
```

Se a validação falhar:

```ts
if (!pertenceAoSolicitante) {
  throw new Error(
    'Algum item oferecido não pertence ao solicitante informado.'
  );
}
```

A execução é interrompida e o controller retorna erro `400`.

## 17. O service chama o repositório de propostas

Se a validação passar:

```ts
return this.propostaRepository.criar(dados);
```

O caminho passa a ser:

```text
Service -> PropostaTrocaRepository.criar()
```

## 18. O repositório cria a proposta

Arquivo:

`Trades/backend/src/infrastructure/database/PropostaTrocaRepositoryInMemory.ts`

```ts
const novaProposta: PropostaTroca = {
```

Começa a montar o objeto da nova proposta.

```ts
id: proximoId++,
```

Gera um ID automático. Na primeira proposta, o ID será `1`.

```ts
...dados,
```

Copia os dados recebidos pelo service.

```ts
status: 'PENDENTE'
```

Toda proposta começa como pendente.

O objeto final será:

```json
{
  "id": 1,
  "solicitanteId": 1,
  "destinatarioId": 2,
  "itensSolicitanteIds": [5],
  "itensDestinatarioIds": [8],
  "status": "PENDENTE"
}
```

## 19. A proposta é armazenada

```ts
propostas.push(novaProposta);
```

Adiciona a proposta à lista que está na memória.

```ts
return novaProposta;
```

Retorna a proposta ao service.

## 20. A resposta volta ao frontend

O controller recebe a proposta e executa:

```ts
return res.status(201).json(proposta);
```

O backend responde:

```text
HTTP 201 Created
```

Com o JSON da proposta criada.

O frontend termina a chamada:

```ts
await axios.post(`${API_BASE}/propostas`, payload);
```

Depois limpa o formulário:

```ts
setFormProposta({
  solicitanteId: '',
  destinatarioId: '',
  itemSolicitanteId: '',
  itemDestinatarioId: ''
});
```

E recarrega a lista:

```ts
await carregarPropostas();
```

Essa função faz:

```ts
axios.get('/api/propostas');
```

A rota GET chama o controller, que chama o service, que chama:

```ts
this.propostaRepository.listarTodas();
```

Por fim, o React atualiza o estado:

```ts
setPropostas(dados);
```

A nova proposta aparece na tela e o usuário recebe:

```ts
alert('Proposta criada com sucesso!');
```

# Fluxo resumido

```text
Usuário
  |
  v
ItemCard.tsx
  |
  v
App.tsx: handleOferecerProposta()
  |
  v
App.tsx: handleCriarProposta()
  |
  v
Axios: POST /api/propostas
  |
  v
propostas.routes.ts
  |
  v
PropostaTrocaController.criar()
  |
  v
PropostaTrocaService.criarProposta()
  |
  v
ItemRepositoryInMemory.buscarPorId()
  |
  v
PropostaTrocaRepositoryInMemory.criar()
  |
  v
HTTP 201
  |
  v
App.tsx atualiza a tela
```

# Quando a proposta é aceita

O frontend envia:

```ts
await axios.patch(
  `${API_BASE}/propostas/${id}/responder`,
  { aceitar: true }
);
```

A requisição é:

```text
PATCH /api/propostas/1/responder
```

A rota chama:

```ts
controller.responder(req, res);
```

O controller chama:

```ts
this.propostaService.responderProposta(Number(id), aceitar);
```

O service busca a proposta:

```ts
const proposta = this.propostaRepository.buscarPorId(propostaId);
```

Depois verifica se ela ainda está pendente:

```ts
if (proposta.status !== 'PENDENTE') {
  throw new Error('Proposta já finalizada.');
}
```

Se for aceita, troca o dono dos itens:

```ts
proposta.itensSolicitanteIds.forEach(itemId => {
  this.itemRepository.atualizar(
    itemId,
    { colecionadorId: proposta.destinatarioId }
  );
});
```

Os itens do solicitante passam para o destinatário.

```ts
proposta.itensDestinatarioIds.forEach(itemId => {
  this.itemRepository.atualizar(
    itemId,
    { colecionadorId: proposta.solicitanteId }
  );
});
```

Os itens do destinatário passam para o solicitante.

Finalmente, a proposta recebe o status:

```ts
status: 'ACEITA'
```

# Frase para explicar ao professor

> O fluxo começa no componente `ItemCard`, que chama uma função do `App.tsx`. O `App.tsx` monta os IDs dos usuários e dos itens e envia uma requisição POST para `/api/propostas`. A rota encaminha a requisição ao controller, que chama o service. O service valida as regras de negócio usando os repositórios. Depois da validação, o repositório cria a proposta com um novo ID e status `PENDENTE`. A resposta retorna ao frontend, que recarrega as propostas e atualiza a tela. Quando o destinatário aceita, o service altera o dono dos itens e muda o status da proposta para `ACEITA`.

# Observação técnica

Os repositórios utilizam listas em memória:

```ts
let propostas: PropostaTroca[] = [];
let itens: Item[] = [];
```

Portanto, os dados são perdidos quando o servidor é desligado. Em uma versão de produção, seria necessário utilizar um banco de dados persistente.

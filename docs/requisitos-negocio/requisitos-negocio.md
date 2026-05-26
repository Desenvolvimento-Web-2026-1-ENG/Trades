# Requisitos de Negócio — Trades Hub

## 1. Visão Geral do Sistema

O **Trades Hub** é uma plataforma web desenvolvida para permitir que colecionadores organizem seus itens, gerenciem inventários e realizem propostas de troca com outros usuários de forma prática, segura e organizada.

O sistema tem como objetivo facilitar a interação entre colecionadores de diferentes categorias, como:

- Cartas colecionáveis
- Moedas
- Selos
- Action figures
- Quadrinhos
- Outros itens de coleção

---

## 2. Problema de Negócio

Colecionadores frequentemente enfrentam dificuldades para:

- Organizar seus itens
- Encontrar pessoas interessadas em trocas
- Avaliar propostas
- Garantir segurança nas negociações
- Manter histórico das trocas realizadas

O sistema busca solucionar essas dificuldades através de uma plataforma centralizada.

---

## 3. Objetivos do Sistema

### Objetivo Geral
Criar uma plataforma digital para gerenciamento e troca de itens colecionáveis.

### Objetivos Específicos

- Permitir cadastro e autenticação de usuários
- Organizar inventários pessoais
- Facilitar propostas de troca
- Registrar histórico de negociações
- Garantir controle administrativo da plataforma

---

## 4. Perfis de Usuário

## 4.1 Colecionador

O colecionador poderá:

- Criar conta
- Fazer login
- Cadastrar itens
- Editar inventário
- Buscar itens de outros usuários
- Enviar propostas de troca
- Aceitar ou recusar propostas
- Visualizar histórico

---

## 4.2 Administrador

O administrador poderá:

- Gerenciar usuários
- Moderar anúncios
- Remover conteúdos inadequados
- Monitorar trocas
- Gerenciar categorias de itens
- Gerar relatórios do sistema

---

## 5. Regras de Negócio

### RN01
O usuário deve estar autenticado para cadastrar itens.

### RN02
Cada item deve possuir:

- Nome
- Categoria
- Descrição
- Raridade
- Estado de conservação
- Imagem

### RN03
Uma proposta de troca só pode ser enviada para itens disponíveis.

### RN04
Uma troca só será concluída após aceitação das duas partes.

### RN05
Itens envolvidos em trocas pendentes não poderão receber novas propostas.

### RN06
Administradores podem suspender usuários que violem as regras.

### RN07
Itens removidos pelo administrador devem ser registrados em log.

---

## 6. Requisitos Funcionais

### RF01
O sistema deve permitir cadastro de usuários.

### RF02
O sistema deve permitir autenticação.

### RF03
O sistema deve permitir recuperação de senha.

### RF04
O sistema deve permitir cadastro de itens.

### RF05
O sistema deve permitir edição e exclusão de itens.

### RF06
O sistema deve permitir busca de itens.

### RF07
O sistema deve permitir envio de propostas de troca.

### RF08
O sistema deve permitir aceitar ou recusar propostas.

### RF09
O sistema deve exibir histórico de negociações.

### RF10
O sistema deve permitir administração da plataforma.

---

## 7. Requisitos Não Funcionais

### RNF01
A interface deve ser responsiva.

### RNF02
O sistema deve possuir tempo de resposta inferior a 3 segundos.

### RNF03
Os dados devem ser armazenados com segurança.

### RNF04
O sistema deve possuir autenticação segura.

### RNF05
A plataforma deve estar disponível 24/7.

### RNF06
O sistema deve possuir boa usabilidade.

---

## 8. Restrições do Sistema

- A plataforma será acessada via navegador web
- Necessita conexão com internet
- O usuário deve possuir cadastro ativo

---

## 9. Benefícios Esperados

- Melhor organização de coleções
- Maior praticidade nas trocas
- Segurança nas negociações
- Facilidade de interação entre colecionadores
- Centralização das informações
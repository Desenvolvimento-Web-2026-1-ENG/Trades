import axios from 'axios';
import type { Item, Proposta } from '../types';

export interface Colecionador {
  id: number;
  nome: string;
  email: string;
}

// Altere para a porta em que seu server.ts está rodando (ex: 3000, 3333, 8080)
const API = axios.create({
  baseURL: 'http://localhost:3000',
});

// ================= COLECIONADORES =================
export const getColecionadores = async (): Promise<Colecionador[]> => {
  const { data } = await API.get('/colecionadores');
  return data;
};

export const criarColecionador = async (nome: string, email: string): Promise<Colecionador> => {
  const { data } = await API.post('/colecionadores', { nome, email });
  return data; // Retorna o usuário criado com o ID gerado pelo backend (id + 1)
};

// ================= ITENS =================
export const getItens = async (): Promise<Item[]> => {
  const { data } = await API.get('/itens');
  return data;
};

export const criarItem = async (item: Omit<Item, 'id'>): Promise<Item> => {
  const { data } = await API.post('/itens', item);
  return data; // O backend atribui o ID + 1 e vincula ao colecionadorId
};

// ================= PROPOSTAS =================
export const getPropostas = async (): Promise<Proposta[]> => {
  const { data } = await API.get('/propostas');
  return data;
};

export const criarProposta = async (dados: {
  solicitanteId: number;    // ID do usuário logado (ex: 1)
  destinatarioId: number;   // ID do usuário dono do item alvo (ex: 2)
  itensOferecidosIds: number[];
  itensDesejadosIds: number[];
}): Promise<Proposta> => {
  const { data } = await API.post('/propostas', dados);
  return data;
};

export const responderProposta = async (propostaId: number, aceitar: boolean) => {
  // Ajuste a rota para a rota exata do seu propostas.routes.ts (ex: PATCH /propostas/:id)
  const { data } = await API.patch(`/propostas/${propostaId}`, { status: aceitar ? 'ACEITA' : 'RECUSADA' });
  return data;
};
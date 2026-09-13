import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = '/api';

// Interfaces de Tipo
interface Colecionador {
  id: number;
  nome: string;
  email: string;
  perfil: string;
}

interface Item {
  id: number;
  titulo: string;
  fotoUrl: string;
  estadoConservacao: string;
  raridade: string;
  colecionadorId: number;
}

interface Proposta {
  id: number;
  solicitanteId: number;
  destinatarioId: number;
  status: string;
}

export default function App() {
  const [abaAtiva, setAbaAtiva] = useState<'colecionadores' | 'itens' | 'propostas'>('colecionadores');

  // Estados de Dados
  const [colecionadores, setColecionadores] = useState<Colecionador[]>([]);
  const [itens, setItens] = useState<Item[]>([]);
  const [propostas, setPropostas] = useState<Proposta[]>([]);

  // Formulários
  const [formColecionador, setFormColecionador] = useState({ nome: '', email: '', perfil: 'COLECIONADOR' });
  const [formItem, setFormItem] = useState({ titulo: '', fotoUrl: '', estadoConservacao: 'Novo', raridade: 'Raro', colecionadorId: '' });
  const [formProposta, setFormProposta] = useState({ solicitanteId: '', destinatarioId: '', itemSolicitanteId: '', itemDestinatarioId: '' });

  // Carregar dados ao iniciar ou mudar de aba
  useEffect(() => {
    carregarColecionadores();
    carregarItens();
    carregarPropostas();
  }, []);

 const carregarColecionadores = async () => {
    try {
      const res = await axios.get(`${API_BASE}/colecionadores`);
      // Trata caso a API retorne um array direto ou dentro de um objeto { data: [...] } ou { colecionadores: [...] }
      const dados = Array.isArray(res.data) 
        ? res.data 
        : (res.data.colecionadores || res.data.data || []);
      
      setColecionadores(dados);
    } catch (e) {
      console.error('Erro ao buscar colecionadores:', e);
    }
  };

  const carregarItens = async () => {
    try {
      const res = await axios.get(`${API_BASE}/itens`);
      setItens(res.data);
    } catch (e) { console.error('Erro ao buscar itens:', e); }
  };

  const carregarPropostas = async () => {
    try {
      const res = await axios.get(`${API_BASE}/propostas`);
      setPropostas(res.data);
    } catch (e) { console.error('Erro ao buscar propostas:', e); }
  };

  // Submissões de Formulários
 const handleCadastrarColecionador = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resposta = await axios.post(`${API_BASE}/colecionadores`, formColecionador);
      console.log('Colecionador cadastrado com sucesso:', resposta.data);
      
      // Limpa o formulário
      setFormColecionador({ nome: '', email: '', perfil: 'COLECIONADOR' });
      
      // Recarrega a lista
      await carregarColecionadores();
    } catch (e: any) {
      console.error('Erro ao cadastrar colecionador:', e);
      alert(`Erro ao cadastrar: ${e.response?.data?.mensagem || e.message}`);
    }
  };

  const handleCadastrarItem = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post(`${API_BASE}/itens`, {
      ...formItem,
      colecionadorId: Number(formItem.colecionadorId)
    });
    setFormItem({ titulo: '', fotoUrl: '', estadoConservacao: 'Novo', raridade: 'Raro', colecionadorId: '' });
    carregarItens();
  };

  const handleCriarProposta = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post(`${API_BASE}/propostas`, {
      solicitanteId: Number(formProposta.solicitanteId),
      destinatarioId: Number(formProposta.destinatarioId),
      itensSolicitanteIds: [Number(formProposta.itemSolicitanteId)],
      itensDestinatarioIds: [Number(formProposta.itemDestinatarioId)]
    });
    setFormProposta({ solicitanteId: '', destinatarioId: '', itemSolicitanteId: '', itemDestinatarioId: '' });
    carregarPropostas();
  };

  const handleAceitarProposta = async (id: number) => {
    await axios.patch(`${API_BASE}/propostas/${id}/responder`, { aceitar: true });
    carregarPropostas();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header / Navbar */}
        <header className="flex flex-col md:flex-row justify-between items-center pb-6 border-b border-slate-700 gap-4">
          <h1 className="text-2xl font-bold tracking-wide text-indigo-400">⚡ Trade Hub P2</h1>
          <nav className="flex space-x-2 bg-slate-800 p-1.5 rounded-lg border border-slate-700">
            {(['colecionadores', 'itens', 'propostas'] as const).map((aba) => (
              <button
                key={aba}
                onClick={() => setAbaAtiva(aba)}
                className={`px-4 py-2 rounded-md font-medium text-sm capitalize transition ${
                  abaAtiva === aba ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {aba}
              </button>
            ))}
          </nav>
        </header>

        {/* Conteúdo Principal */}
        <main className="mt-8">
          {/* Aba Colecionadores */}
          {abaAtiva === 'colecionadores' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <form onSubmit={handleCadastrarColecionador} className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-4">
                <h2 className="text-lg font-semibold text-indigo-300">Novo Colecionador</h2>
                <input
                  type="text"
                  placeholder="Nome"
                  value={formColecionador.nome}
                  onChange={(e) => setFormColecionador({ ...formColecionador, nome: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm focus:outline-none focus:border-indigo-500"
                  required
                />
                <input
                  type="email"
                  placeholder="E-mail"
                  value={formColecionador.email}
                  onChange={(e) => setFormColecionador({ ...formColecionador, email: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm focus:outline-none focus:border-indigo-500"
                  required
                />
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 font-semibold p-2.5 rounded-lg text-sm transition">
                  Cadastrar
                </button>
              </form>

              <div className="md:col-span-2 bg-slate-800 p-6 rounded-xl border border-slate-700">
                <h2 className="text-lg font-semibold text-indigo-300 mb-4">Lista de Colecionadores</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-900 text-slate-400 uppercase text-xs">
                      <tr>
                        <th className="p-3">ID</th>
                        <th className="p-3">Nome</th>
                        <th className="p-3">E-mail</th>
                      </tr>
                    </thead>
                    <tbody>
                      {colecionadores.map((c) => (
                        <tr key={c.id} className="border-b border-slate-700/50 hover:bg-slate-750">
                          <td className="p-3 font-mono text-indigo-400">#{c.id}</td>
                          <td className="p-3 font-medium text-slate-100">{c.nome}</td>
                          <td className="p-3">{c.email}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Aba Itens */}
          {abaAtiva === 'itens' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <form onSubmit={handleCadastrarItem} className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-4">
                <h2 className="text-lg font-semibold text-indigo-300">Novo Item</h2>
                <input
                  type="text"
                  placeholder="Título do Item"
                  value={formItem.titulo}
                  onChange={(e) => setFormItem({ ...formItem, titulo: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm"
                  required
                />
                <input
                  type="text"
                  placeholder="URL da Foto"
                  value={formItem.fotoUrl}
                  onChange={(e) => setFormItem({ ...formItem, fotoUrl: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm"
                />
                <input
                  type="number"
                  placeholder="ID do Colecionador Dono"
                  value={formItem.colecionadorId}
                  onChange={(e) => setFormItem({ ...formItem, colecionadorId: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm"
                  required
                />
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 font-semibold p-2.5 rounded-lg text-sm transition">
                  Cadastrar Item
                </button>
              </form>

              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {itens.map((i) => (
                  <div key={i.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex space-x-4">
                    {i.fotoUrl && <img src={i.fotoUrl} alt={i.titulo} className="w-16 h-16 object-cover rounded-lg bg-slate-900" />}
                    <div>
                      <span className="text-xs text-indigo-400 font-mono">Item #{i.id} (Dono #{i.colecionadorId})</span>
                      <h3 className="font-bold text-slate-100">{i.titulo}</h3>
                      <p className="text-xs text-slate-400 mt-1">{i.estadoConservacao} • {i.raridade}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Aba Propostas */}
          {abaAtiva === 'propostas' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <form onSubmit={handleCriarProposta} className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-4">
                <h2 className="text-lg font-semibold text-indigo-300">Criar Proposta de Troca</h2>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="ID Solicitante"
                    value={formProposta.solicitanteId}
                    onChange={(e) => setFormProposta({ ...formProposta, solicitanteId: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm"
                    required
                  />
                  <input
                    type="number"
                    placeholder="ID Destinatário"
                    value={formProposta.destinatarioId}
                    onChange={(e) => setFormProposta({ ...formProposta, destinatarioId: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="ID Item Ofertado"
                    value={formProposta.itemSolicitanteId}
                    onChange={(e) => setFormProposta({ ...formProposta, itemSolicitanteId: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm"
                    required
                  />
                  <input
                    type="number"
                    placeholder="ID Item Desejado"
                    value={formProposta.itemDestinatarioId}
                    onChange={(e) => setFormProposta({ ...formProposta, itemDestinatarioId: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm"
                    required
                  />
                </div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 font-semibold p-2.5 rounded-lg text-sm transition">
                  Enviar Proposta
                </button>
              </form>

              <div className="md:col-span-2 bg-slate-800 p-6 rounded-xl border border-slate-700">
                <h2 className="text-lg font-semibold text-indigo-300 mb-4">Propostas Registradas</h2>
                <div className="space-y-3">
                  {propostas.map((p) => (
                    <div key={p.id} className="flex justify-between items-center bg-slate-900 p-4 rounded-lg border border-slate-700/50">
                      <div>
                        <span className="text-xs text-indigo-400 font-mono">Proposta #{p.id}</span>
                        <p className="text-sm font-medium">Solicitante #{p.solicitanteId} ➔ Destinatário #{p.destinatarioId}</p>
                        <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded mt-1 ${
                          p.status === 'ACEITA' || p.status === 'CONCLUIDA' ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-700' : 'bg-amber-900/50 text-amber-400 border border-amber-700'
                        }`}>
                          {p.status || 'PENDENTE'}
                        </span>
                      </div>
                      {p.status !== 'ACEITA' && p.status !== 'CONCLUIDA' && (
                        <button
                          onClick={() => handleAceitarProposta(p.id)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-xs font-bold px-3 py-2 rounded-md transition"
                        >
                          Aceitar Troca
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
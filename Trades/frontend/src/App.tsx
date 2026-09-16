import { useState, useEffect } from 'react';
import axios from 'axios';
import { LoginForm } from './components/LoginForm';
import { NovoItemForm } from './components/NovoItemForm';
import { MeuInventario } from './components/MeuInventario';

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
  solicitanteId?: number;
  destinatarioId?: number;
  idSolicitante?: number;
  idDestinatario?: number;
  status: string;
}

export default function App() {
  const [usuarioLogado, setUsuarioLogado] = useState<Colecionador | null>(null);
  const [abaAtiva, setAbaAtiva] = useState<'painel' | 'propostas' | 'novoItem' | 'inventario'>('painel');

  // Estados de Dados
  const [colecionadores, setColecionadores] = useState<Colecionador[]>([]);
  const [itens, setItens] = useState<Item[]>([]);
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [busca, setBusca] = useState('');
  const [filtroPropostas, setFiltroPropostas] = useState<'todas' | 'pendentes' | 'concluidas' | 'canceladas'>('todas');

  // Formulário Proposta
  const [formProposta, setFormProposta] = useState({ 
    solicitanteId: '', 
    destinatarioId: '', 
    itemSolicitanteId: '', 
    itemDestinatarioId: '' 
  });

  // Carregar dados ao iniciar
  useEffect(() => {
    carregarColecionadores();
    carregarItens();
    carregarPropostas();
  }, []);

  const carregarColecionadores = async (): Promise<Colecionador[]> => {
    try {
      const res = await axios.get(`${API_BASE}/colecionadores`);
      const dados: Colecionador[] = Array.isArray(res.data) 
        ? res.data 
        : (res.data.colecionadores || res.data.data || []);
      setColecionadores(dados);
      return dados;
    } catch (e) {
      console.error('Erro ao buscar colecionadores:', e);
      return [];
    }
  };

  const carregarItens = async () => {
    try {
      const res = await axios.get(`${API_BASE}/itens`);
      const dados = Array.isArray(res.data) 
        ? res.data 
        : (res.data.itens || res.data.data || []);
      setItens(dados);
    } catch (e) { 
      console.error('Erro ao buscar itens:', e); 
    }
  };

  const carregarPropostas = async () => {
    try {
      const res = await axios.get(`${API_BASE}/propostas`);
      const dados = Array.isArray(res.data) 
        ? res.data 
        : (res.data.propostas || res.data.data || res.data.rows || res.data.content || []);
      setPropostas(dados);
    } catch (e) { 
      console.error('Erro ao buscar propostas:', e); 
    }
  };

  const handleLogin = async (email: string) => {
    const listaAtualizada = await carregarColecionadores();
    const encontrado = listaAtualizada.find(
      (c) => c.email.trim().toLowerCase() === email.trim().toLowerCase()
    );

    if (encontrado) {
      setUsuarioLogado(encontrado);
    } else {
      alert('Conta não encontrada! Verifique o e-mail cadastrado.');
    }
  };

  // Callback chamado após salvar no NovoItemForm
  const handleSucessoCadastroItem = async () => {
    await carregarItens();
    setAbaAtiva('painel');
    alert('Item cadastrado e registrado com sucesso!');
  };

  const handleCriarProposta = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const solId = Number(formProposta.solicitanteId || usuarioLogado?.id);
      const destId = Number(formProposta.destinatarioId);
      const itemSolId = Number(formProposta.itemSolicitanteId);
      const itemDestId = Number(formProposta.itemDestinatarioId);

      const payload = {
        solicitanteId: solId,
        destinatarioId: destId,
        itensSolicitanteIds: [itemSolId],
        itensDestinatarioIds: [itemDestId],
        idSolicitante: solId,
        idDestinatario: destId,
        itemSolicitanteId: itemSolId,
        itemDestinatarioId: itemDestId
      };

      await axios.post(`${API_BASE}/propostas`, payload);
      setFormProposta({ solicitanteId: '', destinatarioId: '', itemSolicitanteId: '', itemDestinatarioId: '' });
      await carregarPropostas();
      alert('Proposta criada com sucesso!');
    } catch (e: any) {
      alert(`Erro ao criar proposta: ${e.response?.data?.mensagem || e.message}`);
    }
  };

  const handleOferecerProposta = (item: Item) => {
    setFormProposta({
      solicitanteId: String(usuarioLogado?.id || ''),
      destinatarioId: String(item.colecionadorId || ''),
      itemSolicitanteId: '',
      itemDestinatarioId: String(item.id)
    });
    setAbaAtiva('propostas');
  };

  const handleAceitarProposta = async (id: number) => {
    const proposta = propostas.find((item) => item.id === id);
    if (!proposta || Number(proposta.destinatarioId || proposta.idDestinatario) !== usuarioLogado?.id) {
      alert('Apenas o destinatário pode aceitar esta proposta.');
      return;
    }

    try {
      await axios.patch(`${API_BASE}/propostas/${id}/responder`, { 
        aceitar: true, 
        aceito: true, 
        status: 'ACEITA' 
      });
      alert('Troca aceita com sucesso!');
      await carregarPropostas();
      await carregarItens();
    } catch (e: any) {
      alert(`Erro ao aceitar proposta: ${e.response?.data?.mensagem || e.message}`);
    }
  };

  if (!usuarioLogado) {
    return <LoginForm onLogin={handleLogin} />;
  }

  const itensFiltrados = itens.filter(i => 
    i.titulo.toLowerCase().includes(busca.toLowerCase())
  );

  const itensDoUsuario = itens.filter((item) => Number(item.colecionadorId) === usuarioLogado.id);
  const itensDoDestinatario = itens.filter((item) => Number(item.colecionadorId) === Number(formProposta.destinatarioId));
  const propostasFiltradas = propostas.filter((proposta) => {
    if (filtroPropostas === 'pendentes') return proposta.status === 'PENDENTE';
    if (filtroPropostas === 'concluidas') return proposta.status === 'ACEITA';
    if (filtroPropostas === 'canceladas') return proposta.status === 'RECUSADA';
    return true;
  });

  return (
    <div className="flex h-screen bg-[#090d14] text-slate-200 font-sans overflow-hidden">
      
      {/* BARRA LATERAL ESQUERDA (SIDEBAR) */}
      <aside className="w-64 bg-[#0d121d] border-r border-slate-800/80 flex flex-col justify-between p-5">
        <div className="space-y-6">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 font-bold">
              ⚡
            </div>
            <div>
              <h1 className="font-bold text-white text-base tracking-wide">Trader Pro</h1>
              <span className="text-[10px] text-cyan-400 font-mono uppercase tracking-wider">Nível {usuarioLogado.id}</span>
            </div>
          </div>

          {/* Botão Nova Proposta */}
          <button 
            onClick={() => setAbaAtiva('propostas')}
            className="w-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/10 transition cursor-pointer"
          >
            <span>+</span> Nova Proposta
          </button>

          {/* Menu de Navegação */}
          <nav className="space-y-1 text-sm">
            <button
              onClick={() => setAbaAtiva('painel')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg font-medium transition ${
                abaAtiva === 'painel' ? 'bg-indigo-600/20 text-indigo-400 border-l-2 border-indigo-500' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <span>📊</span>
              <span>Painel</span>
            </button>
            <button
              onClick={() => setAbaAtiva('propostas')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg font-medium transition ${
                abaAtiva === 'propostas' ? 'bg-indigo-600/20 text-indigo-400 border-l-2 border-indigo-500' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <span>🔄</span>
              <span>Propostas Ativas</span>
            </button>
            <button
              onClick={() => setAbaAtiva('inventario')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg font-medium transition ${
                abaAtiva === 'inventario' ? 'bg-indigo-600/20 text-indigo-400 border-l-2 border-indigo-500' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <span>🗃️</span>
              <span>Meu Inventário</span>
            </button>
            <button
              onClick={() => setAbaAtiva('novoItem')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg font-medium transition ${
                abaAtiva === 'novoItem' ? 'bg-indigo-600/20 text-indigo-400 border-l-2 border-indigo-500' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <span>📦</span>
              <span>Cadastrar Item</span>
            </button>
          </nav>
        </div>

        {/* Rodapé da Sidebar */}
        <div className="pt-4 border-t border-slate-800/60 space-y-2 text-xs text-slate-400">
          <button 
            onClick={() => setUsuarioLogado(null)} 
            className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
          >
            <span>🚪</span>
            <span>SAIR</span>
          </button>
        </div>
      </aside>

      {/* ÁREA CENTRAL PRINCIPAL */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        
        {/* Header Superior */}
        <header className="h-16 border-b border-slate-800/80 px-8 flex items-center justify-between bg-[#0b0f19]/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="w-96 relative">
            <input
              type="text"
              placeholder="Pesquisar no mercado..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full bg-[#121824] border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
            <span className="absolute left-3 top-2 text-xs text-slate-500">🔍</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-2 text-xs bg-[#121824] border border-slate-800 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-400">AO VIVO</span>
            </span>
            
            <div className="text-right">
              <div className="text-xs font-bold text-slate-100">{usuarioLogado.nome}</div>
              <div className="text-[10px] text-cyan-400 font-mono">TRADER PRO #{usuarioLogado.id}</div>
            </div>
          </div>
        </header>

        {/* Conteúdo Dinâmico */}
        <div className="p-8 space-y-8 flex-1">
          <div>
            <span className="text-xs font-mono uppercase text-cyan-400 tracking-wider">MERCADO GLOBAL</span>
            <h2 className="text-2xl font-bold text-white tracking-tight">Painel Terminal</h2>
          </div>

          {/* Cards de Métricas */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#121824] border border-slate-800/80 p-5 rounded-xl space-y-1">
              <span className="text-xs text-slate-400 font-medium">Total de Itens</span>
              <div className="text-2xl font-bold text-white font-mono">{itens.length}</div>
            </div>
            <div className="bg-[#121824] border border-slate-800/80 p-5 rounded-xl space-y-1">
              <span className="text-xs text-slate-400 font-medium">Trocas Ativas</span>
              <div className="text-2xl font-bold text-white font-mono">{propostas.length}</div>
            </div>
            <div className="bg-[#121824] border border-slate-800/80 p-5 rounded-xl space-y-1">
              <span className="text-xs text-slate-400 font-medium">Colecionadores</span>
              <div className="text-2xl font-bold text-cyan-400 font-mono">{colecionadores.length}</div>
            </div>
          </div>

          {/* ABA PAINEL */}
          {abaAtiva === 'painel' && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-slate-200">Tendências Agora</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {itensFiltrados.map((item) => (
                  <div key={item.id} className="bg-[#121824] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition space-y-3">
                    <div className="w-full h-40 rounded-lg bg-[#090d14] overflow-hidden flex items-center justify-center border border-slate-800/50">
                      {item.fotoUrl ? (
                        <img src={item.fotoUrl} alt={item.titulo} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-3xl">📦</span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-cyan-400 font-mono mb-1">
                        <span>#{item.raridade?.toUpperCase() || 'ITEM'}</span>
                        <span>DONO #{item.colecionadorId}</span>
                      </div>
                      <h4 className="font-bold text-slate-100 text-sm truncate">{item.titulo}</h4>
                      <p className="text-xs text-slate-400">{item.estadoConservacao || 'Conservado'}</p>
                      {item.colecionadorId !== usuarioLogado.id && (
                        <button
                          type="button"
                          onClick={() => handleOferecerProposta(item)}
                          className="w-full mt-3 bg-cyan-400/10 hover:bg-cyan-400/20 text-cyan-400 border border-cyan-400/30 text-xs font-bold px-3 py-2 rounded-lg transition cursor-pointer"
                        >
                          Oferecer proposta
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ABA INVENTÁRIO */}
          {abaAtiva === 'inventario' && (
            <MeuInventario itens={itensDoUsuario} nomeUsuario={usuarioLogado.nome} />
          )}

          {/* ABA PROPOSTAS */}
          {abaAtiva === 'propostas' && (
            <div className="space-y-6">
              <div className="flex flex-col gap-5 border-b border-slate-800/80 pb-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <span className="text-xs font-mono uppercase text-cyan-400 tracking-wider">CENTRAL DE NEGOCIAÇÕES</span>
                  <h2 className="text-2xl font-bold text-white tracking-tight">Propostas de troca</h2>
                  <p className="text-xs text-slate-400 mt-2 max-w-xl">Gerencie suas negociações ativas, avalie ofertas da comunidade e expanda seu portfólio.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    ['todas', 'Todas'],
                    ['pendentes', 'Pendentes'],
                    ['concluidas', 'Concluídas'],
                    ['canceladas', 'Canceladas']
                  ].map(([valor, texto]) => (
                    <button
                      key={valor}
                      type="button"
                      onClick={() => setFiltroPropostas(valor as typeof filtroPropostas)}
                      className={`rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
                        filtroPropostas === valor
                          ? 'bg-cyan-400 text-slate-950'
                          : 'bg-[#121824] text-slate-400 border border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {texto}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <form onSubmit={handleCriarProposta} className="bg-[#121824] border border-slate-800/80 p-5 rounded-xl space-y-4 h-fit">
                  <div>
                    <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider">Nova proposta</h3>
                    <p className="text-xs text-slate-500 mt-1">Escolha os itens envolvidos na troca.</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Colecionador</label>
                    <select
                      value={formProposta.destinatarioId}
                      onChange={(e) => setFormProposta({ ...formProposta, destinatarioId: e.target.value, itemDestinatarioId: '' })}
                      className="w-full bg-[#090d14] border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200"
                      required
                    >
                      <option value="">Selecione quem receberá a oferta</option>
                      {colecionadores.filter((c) => c.id !== usuarioLogado.id).map((colecionador) => (
                        <option key={colecionador.id} value={colecionador.id}>{colecionador.nome}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Seu item</label>
                    <select
                      value={formProposta.itemSolicitanteId}
                      onChange={(e) => setFormProposta({ ...formProposta, itemSolicitanteId: e.target.value })}
                      className="w-full bg-[#090d14] border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200"
                      required
                    >
                      <option value="">Selecione o item que você oferece</option>
                      {itensDoUsuario.map((item) => <option key={item.id} value={item.id}>{item.titulo}</option>)}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Item desejado</label>
                    <select
                      value={formProposta.itemDestinatarioId}
                      onChange={(e) => setFormProposta({ ...formProposta, itemDestinatarioId: e.target.value })}
                      className="w-full bg-[#090d14] border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200"
                      required
                    >
                      <option value="">Selecione o item desejado</option>
                      {itensDoDestinatario.map((item) => <option key={item.id} value={item.id}>{item.titulo}</option>)}
                    </select>
                  </div>

                  <button type="submit" className="w-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold p-2.5 rounded-lg text-xs transition cursor-pointer">
                    Enviar proposta
                  </button>
                </form>

                <div className="xl:col-span-2 space-y-3">
                  {propostasFiltradas.length === 0 && (
                    <div className="bg-[#121824] border border-slate-800/80 rounded-xl p-8 text-center text-sm text-slate-500">
                      Nenhuma proposta encontrada nessa categoria.
                    </div>
                  )}
                  {propostasFiltradas.map((p, idx) => {
                    const solicitante = colecionadores.find((c) => c.id === (p.solicitanteId || p.idSolicitante));
                    const destinatario = colecionadores.find((c) => c.id === (p.destinatarioId || p.idDestinatario));
                    const status = p.status || 'PENDENTE';
                    const propostaRecebida = Number(p.destinatarioId || p.idDestinatario) === usuarioLogado.id;
                    const statusClass = status === 'ACEITA'
                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                      : status === 'RECUSADA'
                        ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                        : 'text-amber-400 bg-amber-500/10 border-amber-500/20';

                    return (
                      <div key={p.id || idx} className="bg-[#121824] border border-slate-800/80 p-5 rounded-xl flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-[10px] text-cyan-400 font-mono uppercase">Proposta #{p.id || idx + 1}</span>
                            <span className={`rounded-full border px-2 py-1 text-[9px] font-bold uppercase ${statusClass}`}>{status}</span>
                          </div>
                          <p className="text-sm font-semibold text-slate-200">
                            {solicitante?.nome || 'Colecionador'} <span className="text-slate-600">ofereceu uma troca para</span> {destinatario?.nome || 'você'}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">Avalie a oferta e responda quando estiver pronto.</p>
                        </div>
                        {status === 'PENDENTE' && propostaRecebida && (
                          <div className="flex gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleAceitarProposta(p.id || idx + 1)}
                              className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 text-xs font-bold px-4 py-2 rounded-lg transition cursor-pointer"
                            >
                              Aceitar
                            </button>
                          </div>
                        )}
                        {status === 'PENDENTE' && !propostaRecebida && (
                          <span className="text-xs text-slate-500 shrink-0">Aguardando resposta</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ABA CADASTRAR ITEM (REPLAYED BY NovoItemForm) */}
          {abaAtiva === 'novoItem' && (
            <NovoItemForm
              usuarioLogadoId={usuarioLogado.id}
              onSubmit={handleSucessoCadastroItem}
              onCancel={() => setAbaAtiva('painel')}
            />
          )}
        </div>
      </div>

      {/* PAINEL LATERAL DIREITO (COLECIONADORES) */}
      <aside className="w-80 bg-[#0d121d] border-l border-slate-800/80 p-6 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800/60">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Colecionadores</h3>
            <span className="text-[10px] bg-slate-800 text-cyan-400 px-2 py-0.5 rounded-full font-mono">{colecionadores.length}</span>
          </div>

          <div className="space-y-3">
            {colecionadores.map((c) => (
              <div 
                key={c.id} 
                className="bg-[#121824] border border-slate-800/60 p-3 rounded-xl flex items-center space-x-3 hover:border-slate-700 transition"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-xs font-bold text-indigo-400 shrink-0">
                  {c.nome.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-100 truncate">{c.nome}</span>
                    <span className="text-[10px] text-cyan-400 font-mono">#{c.id}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{c.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

    </div>
  );
}
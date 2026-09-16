import { ItemCard } from './ItemCard';

interface ItemInventario {
  id: number;
  titulo: string;
  fotoUrl: string;
  estadoConservacao: string;
  raridade: string;
  colecionadorId: number;
}

interface MeuInventarioProps {
  itens: ItemInventario[];
  nomeUsuario: string;
}

export function MeuInventario({ itens, nomeUsuario }: MeuInventarioProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-slate-800/80 pb-5">
        <div>
          <span className="text-xs font-mono uppercase text-cyan-400 tracking-wider">COLEÇÃO PESSOAL</span>
          <h2 className="text-2xl font-bold text-white tracking-tight">Meu Inventário</h2>
          <p className="text-xs text-slate-400 mt-2">Todos os itens que pertencem ao usuário {nomeUsuario}.</p>
        </div>
        <div className="bg-[#121824] border border-slate-800 rounded-xl px-4 py-3">
          <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Itens na coleção</span>
          <strong className="text-xl text-cyan-400 font-mono">{itens.length}</strong>
        </div>
      </div>

      {itens.length === 0 ? (
        <div className="bg-[#121824] border border-slate-800/80 rounded-xl p-10 text-center">
          <div className="text-4xl mb-3">📦</div>
          <h3 className="text-base font-semibold text-slate-200">Seu inventário está vazio</h3>
          <p className="text-xs text-slate-500 mt-2">Cadastre um item para ele aparecer nesta área.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {itens.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

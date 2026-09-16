interface ItemInventario {
  id: number;
  titulo: string;
  fotoUrl: string;
  estadoConservacao: string;
  raridade: string;
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
            <div key={item.id} className="bg-[#121824] border border-slate-800/80 rounded-xl p-4 flex flex-col gap-4 hover:border-cyan-500/40 transition">
              <div className="w-full h-48 rounded-lg bg-[#090d14] overflow-hidden flex items-center justify-center border border-slate-800/50">
                {item.fotoUrl ? (
                  <img src={item.fotoUrl} alt={item.titulo} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl">📦</span>
                )}
              </div>
              <div>
                <div className="flex items-center justify-between text-[10px] text-cyan-400 font-mono mb-1">
                  <span>#{item.raridade?.toUpperCase() || 'ITEM'}</span>
                  <span>SEU ITEM</span>
                </div>
                <h3 className="font-bold text-slate-100 truncate">{item.titulo}</h3>
                <p className="text-xs text-slate-400 mt-1">{item.estadoConservacao || 'Conservado'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

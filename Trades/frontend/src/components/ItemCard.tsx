import { Ripple } from './canvasui/Ripple';

interface ItemCardData {
  id: number;
  titulo: string;
  fotoUrl: string;
  estadoConservacao: string;
  raridade: string;
  colecionadorId: number;
}

interface ItemCardProps {
  item: ItemCardData;
  mostrarDono?: boolean;
  onOferecerProposta?: () => void;
}

const estilosRaridade: Record<string, string> = {
  comum: 'bg-slate-700/90 text-slate-200 border-slate-500/60',
  raro: 'bg-blue-500/90 text-white border-blue-300/70',
  épico: 'bg-violet-500/90 text-white border-violet-300/70',
  lendário: 'bg-amber-400/90 text-slate-950 border-amber-200/80',
  mítico: 'bg-cyan-400/90 text-slate-950 border-cyan-200/80'
};

export function ItemCard({ item, mostrarDono = false, onOferecerProposta }: ItemCardProps) {
  const raridade = item.raridade?.trim() || 'Item';
  const estiloRaridade = estilosRaridade[raridade.toLowerCase()] || 'bg-cyan-400/90 text-slate-950 border-cyan-200/80';

  return (
    <Ripple
      className="canvas-ripple-card w-full rounded-xl"
      trigger="hover"
      amplitude={0.2}
      speed={0.7}
      wavelength={90}
      rings={1}
      decay={1.4}
      refraction={20}
      dispersion={0.12}
      shine={0.35}
    >
    <article className="item-card-motion bg-[#121824] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between gap-4 hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:-translate-y-1 transition-all duration-300 ease-out">
      <div className="item-card-image relative w-full h-64 rounded-lg bg-[#090d14] overflow-hidden flex items-center justify-center border border-slate-800/50">
        {item.fotoUrl ? (
          <img src={item.fotoUrl} alt={item.titulo} className="w-full h-full object-cover" />
        ) : (
          <span className="text-4xl">📦</span>
        )}
        <span className={`item-rarity-badge absolute top-2 left-2 rounded border px-2 py-1 text-[9px] font-black uppercase tracking-wider ${estiloRaridade}`}>
          {raridade}
        </span>
      </div>

      <div>
        <div className="flex items-center justify-between text-[10px] text-cyan-400 font-mono mb-1">
          <span>#{raridade.toUpperCase()}</span>
          {mostrarDono && <span>DONO #{item.colecionadorId}</span>}
        </div>
        <h3 className="font-bold text-slate-100 text-sm truncate">{item.titulo}</h3>
        <p className="text-xs text-slate-400 mt-1">{item.estadoConservacao || 'Conservado'}</p>
        {onOferecerProposta && (
          <button
            type="button"
            onClick={onOferecerProposta}
            className="w-full mt-3 bg-cyan-400/10 hover:bg-cyan-400/20 active:scale-[0.97] text-cyan-400 border border-cyan-400/30 text-xs font-bold px-3 py-2 rounded-lg transition-all duration-150 cursor-pointer"
          >
            Oferecer proposta
          </button>
        )}
      </div>
    </article>
    </Ripple>
  );
}
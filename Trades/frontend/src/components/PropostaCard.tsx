import React from 'react';

interface PropostaCardProps {
  proposta: {
    id: number;
    solicitanteId: number;
    destinatarioId: number;
    status: string;
  };
  onResponder: (id: number, aceitar: boolean) => void;
}

export const PropostaCard = ({ proposta, onResponder }: PropostaCardProps) => (
  <div className="bg-[#0e1626] border border-slate-700 rounded-xl p-4 flex flex-col justify-between">
    <div>
      <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded uppercase">
        Proposta #{proposta.id}
      </span>
      <p className="text-sm font-bold text-white mt-2">
        Solicitante #{proposta.solicitanteId} ➔ Destinatário #{proposta.destinatarioId}
      </p>
      <p className="text-xs text-slate-400 mt-1">
        Status: <span className="text-yellow-400 font-bold">{proposta.status}</span>
      </p>
    </div>

    {proposta.status === 'PENDENTE' ? (
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onResponder(proposta.id, true)}
          className="flex-1 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.97] text-black font-bold py-1.5 rounded text-xs transition-all duration-150"
        >
          ACEITAR
        </button>
        <button
          onClick={() => onResponder(proposta.id, false)}
          className="flex-1 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 active:scale-[0.97] font-bold py-1.5 rounded text-xs transition-all duration-150"
        >
          RECUSAR
        </button>
      </div>
    ) : (
      <span className="mt-4 block text-center text-xs font-bold text-emerald-400 bg-emerald-500/10 py-1.5 rounded">
        TROCA FINALIZADA
      </span>
    )}
  </div>
);
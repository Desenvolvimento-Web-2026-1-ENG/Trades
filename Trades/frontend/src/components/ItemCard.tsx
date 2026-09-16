import React from 'react';

interface ItemCardProps {
  titulo: string;
  raridade: string;
  imagem: string;
  grade: string;
  valor: string;
}

export const ItemCard = ({ titulo, raridade, imagem, grade, valor }: ItemCardProps) => (
  <div className="bg-[#0e1626] border border-cyan-500/40 rounded-xl p-3 relative flex flex-col justify-between hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition">
    <div>
      <div className="relative rounded-lg overflow-hidden border border-slate-800 mb-3 bg-slate-900 h-48 flex items-center justify-center">
        <span className="absolute top-2 left-2 text-[10px] font-black bg-cyan-500 text-black px-2 py-0.5 rounded uppercase">
          {raridade}
        </span>
        <img src={imagem} alt={titulo} className="w-full h-full object-cover" />
        <span className="absolute bottom-2 right-2 text-[10px] font-bold bg-cyan-400 text-black px-2 py-0.5 rounded">
          {grade}
        </span>
      </div>
      <h3 className="font-bold text-white text-base">{titulo}</h3>
      <p className="text-xs text-slate-500 font-mono">{valor}</p>
    </div>
  </div>
);
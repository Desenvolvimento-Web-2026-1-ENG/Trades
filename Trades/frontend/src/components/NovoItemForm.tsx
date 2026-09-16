import React, { useState } from 'react';
import axios from 'axios';
import { Upload, Zap, Image as ImageIcon, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

const API_BASE = '/api';
const MAX_IMAGE_DATA_URL_SIZE = 70 * 1024;

const compressImage = (file: File): Promise<string> => new Promise((resolve, reject) => {
  const reader = new FileReader();

  reader.onerror = () => reject(new Error('Não foi possível ler a imagem.'));
  reader.onload = () => {
    const image = new Image();

    image.onerror = () => reject(new Error('Não foi possível carregar a imagem.'));
    image.onload = () => {
      const canvas = document.createElement('canvas');
      let escala = Math.min(1, 1200 / Math.max(image.naturalWidth, image.naturalHeight));

      while (escala >= 0.35) {
        canvas.width = Math.max(1, Math.round(image.naturalWidth * escala));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * escala));
        const contexto = canvas.getContext('2d');

        if (!contexto) {
          reject(new Error('Não foi possível preparar a imagem.'));
          return;
        }

        contexto.drawImage(image, 0, 0, canvas.width, canvas.height);

        for (let qualidade = 0.75; qualidade >= 0.35; qualidade -= 0.1) {
          const imagemComprimida = canvas.toDataURL('image/jpeg', qualidade);
          if (imagemComprimida.length <= MAX_IMAGE_DATA_URL_SIZE) {
            resolve(imagemComprimida);
            return;
          }
        }

        escala *= 0.8;
      }

      reject(new Error('A imagem é muito grande. Escolha uma imagem menor.'));
    };

    image.src = reader.result as string;
  };

  reader.readAsDataURL(file);
});

interface FormProps {
  usuarioLogadoId?: number | string;
  onSubmit?: () => void;
  onCancel?: () => void;
}

export const NovoItemForm: React.FC<FormProps> = ({ usuarioLogadoId, onSubmit, onCancel }) => {
  // Campos consumidos pelo backend existente
  const [titulo, setTitulo] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const [colecionadorId, setColecionadorId] = useState('');

  // Metadados visuais extras da interface
  const [categoria, setCategoria] = useState('Cartas');
  const [condicao, setCondicao] = useState(10);
  const [raridade, setRaridade] = useState('Lendário');
  const [descricao, setDescricao] = useState('');

  const [carregando, setCarregando] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setFotoUrl(await compressImage(file));
        setStatusMsg(null);
      } catch (err: any) {
        setStatusMsg({ tipo: 'erro', texto: err.message });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);
    setCarregando(true);

    const idFinal = colecionadorId.trim() ? colecionadorId.trim() : usuarioLogadoId;

    try {
      await axios.post(`${API_BASE}/itens`, {
        titulo: titulo.trim(),
        fotoUrl: fotoUrl.trim(),
        colecionadorId: idFinal ? Number(idFinal) : undefined
      });

      setStatusMsg({ tipo: 'sucesso', texto: 'Item cadastrado com sucesso!' });
      setTitulo('');
      setFotoUrl('');
      setColecionadorId('');
      setDescricao('');

      if (onSubmit) onSubmit();
    } catch (err: any) {
      console.error('Erro ao cadastrar item:', err);
      setStatusMsg({
        tipo: 'erro',
        texto: err.response?.data?.mensagem || 'Erro ao comunicar com o servidor.'
      });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="w-full max-w-5xl bg-[#0a0f1d] border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
      <div className="border-b border-slate-800/80 pb-4">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" /> CADASTRAR NOVO ATIVO
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Preencha as informações do item para registrar na plataforma.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUNA ESQUERDA: PREVIEW / UPLOAD */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <label className="block text-[11px] font-mono font-bold tracking-widest text-slate-400 uppercase">
            Mídia do Ativo
          </label>
          
          <div className="relative border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-[#060913]/60 transition min-h-[300px] group">
            {fotoUrl ? (
              <div className="w-full flex flex-col items-center space-y-3">
                <img
                  src={fotoUrl}
                  alt="Preview do Ativo"
                  className="max-h-52 max-w-full object-contain rounded-xl drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300?text=URL+Invalida';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setFotoUrl('')}
                  className="text-xs text-rose-400 hover:underline cursor-pointer font-mono"
                >
                  Remover Foto
                </button>
              </div>
            ) : (
              <>
                <div className="w-14 h-14 rounded-2xl bg-slate-800/50 border border-slate-700/80 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-110 transition duration-300">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-xs font-semibold text-white mb-1">Selecione ou Arraste a Imagem</p>
                <p className="text-[10px] text-slate-500 max-w-[180px] mb-4">PNG, JPG ou GIF</p>
                
                <label className="bg-[#131d31] hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl border border-slate-700 text-xs cursor-pointer transition">
                  Buscar Arquivo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase">
              URL Direta da Foto
            </label>
            <div className="relative flex items-center">
              <ImageIcon className="w-4 h-4 text-slate-500 absolute left-3" />
              <input
                type="url"
                required
                placeholder="https://..."
                value={fotoUrl}
                onChange={(e) => setFotoUrl(e.target.value)}
                className="w-full bg-[#060913] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:border-cyan-400 outline-none transition font-mono"
              />
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: FORMULÁRIO */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
            <Zap className="w-4 h-4" /> Detalhes da Coleção
          </div>

          {/* TÍTULO */}
          <div className="space-y-1">
            <label className="block text-[11px] font-mono font-bold tracking-widest text-slate-400 uppercase">
              Título do Item
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Black Lotus 1st Edition"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full bg-[#060913] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-cyan-400 outline-none transition"
            />
          </div>

          {/* CATEGORIA E CONDIÇÃO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[11px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                Categoria
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full bg-[#060913] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:border-cyan-400 outline-none transition cursor-pointer"
              >
                <option value="Cartas">Cartas</option>
                <option value="Moedas">Moedas</option>
                <option value="Selos">Selos</option>
                <option value="Colecionáveis">Colecionáveis</option>
              </select>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                <span>Condição</span>
                <span className="text-cyan-400">GRADE {condicao}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={condicao}
                onChange={(e) => setCondicao(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer mt-2"
              />
            </div>
          </div>

          {/* RARIDADE */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono font-bold tracking-widest text-slate-400 uppercase">
              Raridade
            </label>
            <div className="flex flex-wrap gap-2">
              {['Comum', 'Raro', 'Épico', 'Lendário', 'Mítico'].map((rar) => (
                <button
                  key={rar}
                  type="button"
                  onClick={() => setRaridade(rar)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                    raridade === rar
                      ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400'
                      : 'border-slate-800 bg-[#060913] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {rar}
                </button>
              ))}
            </div>
          </div>

          {/* ID DO COLECIONADOR */}
          <div className="space-y-1">
            <label className="block text-[11px] font-mono font-bold tracking-widest text-slate-400 uppercase">
              ID do Colecionador (Opcional)
            </label>
            <input
              type="text"
              placeholder="Opcional se for você"
              value={colecionadorId}
              onChange={(e) => setColecionadorId(e.target.value)}
              className="w-full bg-[#060913] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-300 placeholder-slate-600 focus:border-cyan-400 outline-none transition font-mono"
            />
          </div>

          {/* DESCRIÇÃO */}
          <div className="space-y-1">
            <label className="block text-[11px] font-mono font-bold tracking-widest text-slate-400 uppercase">
              Descrição Detalhada
            </label>
            <textarea
              rows={2}
              placeholder="Observações do item..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full bg-[#060913] border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:border-cyan-400 outline-none transition resize-none"
            />
          </div>

          {/* MENSAGEM DE ERRO/SUCESSO */}
          {statusMsg && (
            <div className={`p-3 rounded-xl flex items-center gap-2 text-xs font-mono border ${
              statusMsg.tipo === 'sucesso'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}>
              {statusMsg.tipo === 'sucesso' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{statusMsg.texto}</span>
            </div>
          )}

          {/* BOTÃO ENVIAR */}
          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-slate-950 font-black py-3.5 rounded-xl text-xs uppercase tracking-widest transition shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer mt-2"
          >
            {carregando ? 'Cadastrando...' : 'Cadastrar Item'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full text-xs text-slate-400 hover:text-slate-200 transition cursor-pointer"
            >
              Cancelar
            </button>
          )}
        </div>

      </form>
    </div>
  );
};
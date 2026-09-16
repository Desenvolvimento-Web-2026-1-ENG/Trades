import React, { useState } from 'react';
import axios from 'axios';
import { AtSign, Lock, Eye, EyeOff, UserPlus, LogIn } from 'lucide-react';
import { ForceField } from './canvasui/ForceField';
import tradesLogo from '../../../../docs/assets/tradeslogo2.png';

const API_BASE = '/api';

interface LoginFormProps {
  onLogin: (email: string) => void;
}

export const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [modo, setModo] = useState<'login' | 'registro'>('login');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      if (modo === 'registro') {
        // Consulta prévia dos cadastros existentes para travar duplicidade
        const res = await axios.get(`${API_BASE}/colecionadores`);
        const lista: any[] = Array.isArray(res.data)
          ? res.data
          : (res.data?.colecionadores || res.data?.data || []);

        const emailExiste = lista.some(
          (c) => c.email?.trim().toLowerCase() === email.trim().toLowerCase()
        );
        const nomeExiste = lista.some(
          (c) => c.nome?.trim().toLowerCase() === nome.trim().toLowerCase()
        );

        if (emailExiste) {
          setErro('Este e-mail já está cadastrado no sistema.');
          setCarregando(false);
          return;
        }

        if (nomeExiste) {
          setErro('Este nome de colecionador já está em uso.');
          setCarregando(false);
          return;
        }

        // Envia o novo colecionador se passar na verificação
        await axios.post(`${API_BASE}/colecionadores`, {
          nome: nome.trim(),
          email: email.trim(),
          perfil: 'COLECIONADOR'
        });

        // Loga o colecionador recém-criado automaticamente
        onLogin(email);
      } else {
        // Modo Login normal
        if (email) onLogin(email);
      }
    } catch (err: any) {
      console.error('Erro na autenticação:', err);
      setErro(err.response?.data?.mensagem || 'Erro ao comunicar com o servidor.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <ForceField
      className="min-h-screen"
      shape="hexagon"
      cellScale={16}
      lineWidth={0.03}
      gridOpacity={0.12}
      gridReveal="both"
      gridRevealStrength={1.2}
      gridRevealRadius={240}
      gridFade={0.4}
      flowIntensity={0.15}
      flowSpeed={0.35}
      flashIntensity={0.08}
      edgeGlow={0.25}
      hoverGlow={0.3}
      hoverRadius={300}
      hoverCharge={1.4}
      rippleIntensity={0.12}
      rippleSpeed={0.5}
      rippleBlend={1}
      refraction={20}
      aberration={1.5}
      haze={0.2}
      tint={0.05}
      bloom={0.8}
      grain={0.12}
    >
    <div className="min-h-screen bg-[#060812] text-slate-300 flex flex-col justify-between items-center p-6 font-sans relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full max-w-lg my-auto flex flex-col items-center z-10 space-y-6">
        <div className="w-full flex items-center justify-center py-2">
          <img 
            src={tradesLogo} 
            alt="Trades Logo" 
            className="w-80 max-w-full h-auto object-contain filter drop-shadow-[0_0_25px_rgba(6,182,212,0.4)]" 
          />
        </div>

        {/* CARD DO FORMULÁRIO */}
        <div className="w-full bg-[#0a0f1d]/90 border border-slate-800 rounded-3xl p-8 shadow-3xl backdrop-blur-md space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* CAMPO NOME (EXIBIDO APENAS NO MODO REGISTRO) */}
            {modo === 'registro' && (
              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
                  Nome do Colecionador
                </label>
                <div className="relative flex items-center">
                  <UserPlus className="w-5 h-5 text-slate-500 absolute left-4" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Ash Ketchum"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full bg-[#060913] border-2 border-slate-800 rounded-2xl pl-12 pr-6 py-3.5 text-sm text-white placeholder-slate-600 focus:border-cyan-400 outline-none transition font-mono"
                  />
                </div>
              </div>
            )}

            {/* CAMPO EMAIL */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
                Identity / Email
              </label>
              <div className="relative flex items-center">
                <AtSign className="w-5 h-5 text-slate-500 absolute left-4" />
                <input
                  type="email"
                  required
                  placeholder="user@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#060913] border-2 border-slate-800 rounded-2xl pl-12 pr-6 py-3.5 text-sm text-white placeholder-slate-600 focus:border-cyan-400 outline-none transition font-mono"
                />
              </div>
            </div>

            {/* CAMPO SENHA */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
                  Encryption Key
                </label>
                {modo === 'login' && (
                  <button
                    type="button"
                    className="text-[10px] font-mono text-slate-500 hover:text-cyan-400 active:scale-[0.97] uppercase transition-all duration-150"
                  >
                    RECUPERAR ACESSO
                  </button>
                )}
              </div>
              <div className="relative flex items-center">
                <Lock className="w-5 h-5 text-slate-500 absolute left-4" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#060913] border-2 border-slate-800 rounded-2xl pl-12 pr-14 py-3.5 text-sm text-white placeholder-slate-600 focus:border-cyan-400 outline-none transition font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-slate-500 hover:text-slate-300 active:scale-[0.97] transition-all duration-150"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {erro && <p className="text-xs font-mono text-rose-400 text-center pt-1">{erro}</p>}

            {/* BOTÃO SUBMIT */}
            <button
              type="submit"
              disabled={carregando}
              className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 active:scale-[0.97] text-slate-950 font-black py-4 rounded-2xl text-xs uppercase tracking-widest transition-all duration-150 shadow-[0_0_25px_rgba(6,182,212,0.5)] cursor-pointer mt-2 flex items-center justify-center gap-2"
            >
              {modo === 'login' ? (
                <>
                  <LogIn className="w-4 h-4" /> Authorize Login Protocol
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" /> Cadastrar Colecionador
                </>
              )}
            </button>
          </form>

          {/* ALTERNADOR DE MODO LOGIN / REGISTRO */}
          <div className="pt-2 text-center text-xs text-slate-400 font-mono before:block before:h-px before:w-full before:bg-gradient-to-r before:from-transparent before:via-slate-800 before:to-transparent">
            {modo === 'login' ? (
              <span>
                Novo na plataforma?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setModo('registro');
                    setErro('');
                  }}
                  className="text-cyan-400 font-bold hover:underline active:scale-[0.97] transition-all duration-150 cursor-pointer"
                >
                  Inicializar Conta
                </button>
              </span>
            ) : (
              <span>
                Já tem cadastro?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setModo('login');
                    setErro('');
                  }}
                  className="text-cyan-400 font-bold hover:underline active:scale-[0.97] transition-all duration-150 cursor-pointer"
                >
                  Fazer Login
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
    </ForceField>
  );
};
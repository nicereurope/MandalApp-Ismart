import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ScreenCompletion: React.FC = () => {
  const navigate = useNavigate();
  const [isAfter, setIsAfter] = useState(true);

  return (
    <div className="bg-g-dark text-g-paper font-hand min-h-screen flex flex-col selection:bg-g-pink selection:text-white overflow-x-hidden relative">
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_10%_20%,rgba(255,255,255,0.03)_0%,transparent_20%),radial-gradient(circle_at_90%_80%,rgba(255,210,63,0.05)_0%,transparent_25%)] opacity-60"></div>

      <header className="w-full bg-g-dark/80 backdrop-blur-md sticky top-0 z-50 border-b border-white/5">
        <div className="max-w-[1280px] mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 text-white group cursor-pointer">
            <div className="size-10 bg-g-pink text-white flex items-center justify-center rounded-full organic-border shadow-lg group-hover:rotate-12 transition-transform">
              <span className="material-symbols-outlined text-2xl">draw</span>
            </div>
            <h2 className="text-white text-2xl font-marker tracking-wide hidden sm:block pt-1">Andrés Gudiño</h2>
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/" className="text-white/70 hover:text-g-yellow transition-colors font-marker text-lg">Galería</Link>
            <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 ring-2 ring-white/20 cursor-pointer hover:ring-g-yellow transition-colors" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDzKeBK2QBGs3lE67bs0rTxIlOWwFzLEyGFzaoXWN_HELQqcDzYmxi67sJBj0neLtX-ElrDEaB7woWMjqYnI4JLuTXj1SUJlyI8134WZXzlpbILUMgRzbovE9HnmnKuFwDbdBedsQA35izqXnmXZUkBf1MQYs7FgamjTVvM9TliarRAyo2m9E5XnPesyaBnujkvaIEMloxhgNcRtUhQuKFk_0grULkTfthEXbKvWgveSqIjJEJkaHtf87xy8j8n5IvZu7cD9ZYFMRc')" }}></div>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-start pt-10 pb-16 px-4 sm:px-6 w-full max-w-6xl mx-auto z-10 relative">
        <div className="text-center mb-10 max-w-3xl mx-auto space-y-4 animate-fade-in relative">
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-2 rounded-full border border-g-yellow/30 bg-g-yellow/10">
            <span className="text-g-yellow text-sm font-bold uppercase tracking-widest font-sans">Obra Completada</span>
          </div>
          <h1 className="text-white text-4xl md:text-6xl font-marker leading-tight tracking-wide drop-shadow-lg">
            Has creado un momento <br />
            <span className="text-g-yellow relative inline-block">
              de paz
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-g-yellow" preserveAspectRatio="none" viewBox="0 0 100 10">
                <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="3"></path>
              </svg>
            </span>
          </h1>
          <p className="text-white/80 text-xl md:text-2xl font-hand leading-relaxed max-w-lg mx-auto">"Respira profundo, el arte sana lo que el alma calla."</p>
        </div>

        <div className="w-full max-w-4xl mb-12 animate-slide-up relative" style={{ animationDelay: "0.1s" }}>
          <div className="relative w-full p-3 bg-white shadow-2xl transform rotate-1 transition-transform duration-500 hover:rotate-0 rounded-sm">
            <div className="relative w-full aspect-video sm:aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-gray-100 border-2 border-gray-100">
              <div className="absolute inset-0 bg-center bg-cover transform transition-transform duration-1000 ease-out hover:scale-105"
                style={{
                  backgroundImage: isAfter
                    ? "url('https://lh3.googleusercontent.com/aida-public/AB6AXuACvdCAtx5ItHbreBrHFX85tnvqYgeM2Bl1a2M_wsg9dYMHPlpaIcGmAa-pkdgs7SgdGj61Bpjq2dPiF4bjTxOz6aC-Iradv4P6HNHlvM7-XzcC4Lvj6Te7PI_TtxSOyPxEjEPcJl8AeaDqSZS4QuEZ0YptoDJuw7vc6Dl7Co-uUJOtmVRZuG_KnolgcUcOsDaDK44OOHohZO9kIMCyyaD6txQqw28NWhLnTyYbRiB5X66cU8DnDZyEIIYwGy5xUQTEJie4hwz7bGY')"
                    : "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCEXJ4OVDuokNUPzg2Mdmd83ix4HLACOmaDpAf4uFpeXynBanikCp7pLo1P0my-T0Jxrf5_TTZcFUmgVm4S115YtKVxn-Aow6galenp08BmjcM6Y5qnxaDGtWT7dxfNeszlapE40UwePeN8OESBTOXlrWPEq1tO1ay3y2oLE3kOk9zLp0tpBtzW-Z-frAFQU51atyIrCSM5R142hC9rgs6LAc5hB3Mfl8cplLncP-r9q-_OmQUllAyszHZKHZt2gSbTNMYfoOKgbMY')",
                  filter: isAfter ? 'none' : 'grayscale(100%) contrast(1.2)'
                }}>
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <label className="inline-flex items-center cursor-pointer gap-4 group select-none relative">
              <span className="text-white/70 text-lg font-marker group-hover:text-g-yellow transition-colors transform group-hover:-rotate-2">Antes</span>
              <div className="relative">
                <input type="checkbox" className="sr-only peer" checked={isAfter} onChange={() => setIsAfter(!isAfter)} />
                <div className="h-8 w-14 rounded-full bg-white/10 border-2 border-white/20 peer-checked:bg-g-pink/80 peer-checked:border-g-pink transition-all shadow-inner"></div>
                <div className="absolute top-1.5 left-1.5 bg-white h-5 w-5 rounded-full transition-all peer-checked:translate-x-6 shadow-sm"></div>
              </div>
              <span className="text-white/70 text-lg font-marker group-hover:text-g-pink transition-colors transform group-hover:rotate-2">Después</span>
            </label>
          </div>
        </div>

        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 animate-slide-up px-4" style={{ animationDelay: "0.3s" }}>
          <button className="group relative flex flex-col items-center justify-center gap-4 p-8 min-h-[180px] rounded-3xl bg-[#1B2A4E] text-white border-2 border-white/10 hover:border-g-yellow/50 hover:-translate-y-2 transition-all duration-300 shadow-xl overflow-hidden focus:outline-none focus:ring-4 focus:ring-g-blue/50">
            <div className="p-4 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors z-10 ring-1 ring-white/20">
              <span className="material-symbols-outlined text-4xl">download</span>
            </div>
            <div className="text-center z-10">
              <span className="block text-2xl font-marker mb-1">Descargar</span>
            </div>
          </button>
          <button className="group relative flex flex-col items-center justify-center gap-4 p-8 min-h-[200px] md:-mt-4 rounded-[2rem] bg-g-yellow text-g-dark organic-border-2 hover:scale-105 transition-all duration-300 shadow-[0_0_30px_-5px_rgba(255,210,63,0.4)] z-10 focus:outline-none focus:ring-4 focus:ring-g-yellow/50">
            <div className="p-4 rounded-full bg-black/10 group-hover:bg-black/20 transition-colors z-10">
              <span className="material-symbols-outlined text-4xl text-g-dark">share</span>
            </div>
            <div className="text-center z-10">
              <span className="block text-3xl font-marker mb-1">Compartir</span>
              <span className="block text-lg font-bold font-hand opacity-80">¡Contagia tu luz!</span>
            </div>
          </button>
          <button className="group relative flex flex-col items-center justify-center gap-4 p-8 min-h-[180px] rounded-3xl bg-gradient-to-br from-g-pink to-[#D6336C] text-white border-2 border-transparent hover:border-white/30 hover:-translate-y-2 transition-all duration-300 shadow-xl overflow-hidden focus:outline-none focus:ring-4 focus:ring-g-pink/50">
            <div className="p-4 rounded-full bg-black/20 group-hover:bg-black/30 transition-colors z-10 ring-1 ring-white/10">
              <span className="material-symbols-outlined text-4xl">print</span>
            </div>
            <div className="text-center z-10">
              <span className="block text-2xl font-marker mb-1">Hacerlo Real</span>
            </div>
          </button>
        </div>

        <div className="animate-slide-up relative group" style={{ animationDelay: "0.4s" }}>
          <Link to="/" className="relative inline-flex items-center gap-3 px-8 py-4 text-xl font-marker text-white hover:text-g-yellow transition-colors focus:outline-none">
            <span className="material-symbols-outlined group-hover:rotate-180 transition-transform duration-500">grid_view</span>
            <span>Ver más obras de Andrés</span>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default ScreenCompletion;
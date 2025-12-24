import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const ScreenSettings: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useTheme();

  return (
    <div className="bg-s4-background-light dark:bg-s4-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen flex flex-col transition-colors duration-200 selection:bg-s4-primary selection:text-white">
      <header className="sticky top-0 z-50 w-full border-b-2 border-slate-200 dark:border-slate-800 bg-s4-background-light/95 dark:bg-s4-background-dark/95 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            <div className="flex items-center gap-5">
              <div aria-hidden="true" className="flex items-center justify-center size-14 rounded-[20px_10px_18px_12px] bg-s4-secondary/10 dark:bg-s4-secondary/20 text-s4-secondary dark:text-blue-300 border-2 border-s4-secondary/20 dark:border-s4-secondary/30">
                <span className="material-symbols-outlined text-[36px]">accessibility_new</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Accesibilidad</h1>
            </div>
            <button onClick={() => navigate(-1)} aria-label="Cerrar ajustes" className="group flex items-center justify-center size-14 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-slate-700 dark:text-slate-200">
              <span className="material-symbols-outlined text-[36px] group-hover:scale-110 transition-transform">close</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Personaliza tu experiencia</h2>
          <p className="text-slate-700 dark:text-slate-300 text-xl leading-relaxed max-w-2xl font-medium">
            Ajusta la aplicación a tus necesidades visuales y motoras para una sesión de arte terapia sin fricciones.
          </p>
        </div>

        <section className="space-y-6">
          <h3 className="text-2xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
            <span className="material-symbols-outlined text-s4-secondary text-[32px]">visibility</span> Visual
          </h3>
          <div className="bg-white dark:bg-s4-surface-dark rounded-3xl border-2 border-slate-200 dark:border-slate-700 overflow-hidden shadow-hand-drawn dark:shadow-hand-drawn-dark">
            <div className="p-8 border-b-2 border-slate-100 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <span className="font-bold text-xl text-slate-900 dark:text-white">Modo de Color</span>
                <span className="inline-flex items-center text-base font-bold text-s4-secondary dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-4 py-1.5 rounded-full border border-blue-100 dark:border-blue-800/50">
                  <span className="material-symbols-outlined text-[20px] mr-2">spa</span> Reduce la fatiga visual
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <label className="cursor-pointer group relative">
                  <input
                    className="peer sr-only"
                    name="theme"
                    type="radio"
                    value="light"
                    checked={!darkMode}
                    onChange={() => setDarkMode(false)}
                  />
                  <div className="absolute -inset-1 rounded-2xl border-4 border-transparent peer-checked:border-s4-primary/50 dark:peer-checked:border-s4-primary/50 transition-colors pointer-events-none"></div>
                  <div className="flex flex-col items-center justify-center gap-3 h-32 rounded-xl transition-all duration-200 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 peer-checked:bg-white peer-checked:border-s4-primary peer-checked:text-s4-primary-dark peer-checked:shadow-md group-hover:border-slate-300 dark:group-hover:border-slate-600">
                    <span className="material-symbols-outlined text-[40px]">light_mode</span>
                    <span className="text-lg font-bold">Claro</span>
                  </div>
                </label>
                <label className="cursor-pointer group relative">
                  <input
                    className="peer sr-only"
                    name="theme"
                    type="radio"
                    value="dark"
                    checked={darkMode}
                    onChange={() => setDarkMode(true)}
                  />
                  <div className="absolute -inset-1 rounded-2xl border-4 border-transparent peer-checked:border-s4-primary/50 dark:peer-checked:border-s4-primary/50 transition-colors pointer-events-none"></div>
                  <div className="flex flex-col items-center justify-center gap-3 h-32 rounded-xl transition-all duration-200 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 dark:peer-checked:bg-slate-800 peer-checked:border-s4-primary dark:peer-checked:text-s4-primary peer-checked:shadow-md group-hover:border-slate-300 dark:group-hover:border-slate-600">
                    <span className="material-symbols-outlined text-[40px]">dark_mode</span>
                    <span className="text-lg font-bold">Oscuro</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </section>

        <div className="pt-8 flex flex-col items-center gap-6 pb-16">
          <button className="w-full sm:w-auto px-12 h-16 bg-white dark:bg-s4-surface-dark border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:text-s4-primary-dark dark:hover:text-s4-primary hover:border-s4-primary dark:hover:border-s4-primary hover:shadow-lg dark:hover:shadow-lg rounded-2xl font-bold transition-all text-xl shadow-sm focus:ring-4 focus:ring-s4-primary/20 dark:focus:ring-s4-primary/20 rounded-[20px_10px_18px_12px]">
            Restablecer valores predeterminados
          </button>
        </div>
      </main>
    </div>
  );
};

export default ScreenSettings;
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ArtCard from '../components/ArtCard';

const GalleryHeader: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 dark:border-slate-800/50 bg-art-paper/90 dark:bg-art-night/90 backdrop-blur-xl transition-colors duration-300">
      <div className="px-4 md:px-8 py-3 flex items-center justify-between max-w-[1440px] mx-auto min-h-[80px]">
        <Link to="/" className="flex items-center gap-3 group cursor-pointer p-2 -ml-2 rounded-2xl hover:bg-orange-50 dark:hover:bg-white/5 transition-colors">
          <div className="size-12 text-vibrant-orange dark:text-vibrant-yellow transform group-hover:rotate-12 transition-transform duration-300">
            <svg className="w-full h-full drop-shadow-sm" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z" fill="currentColor"></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold leading-none tracking-wide text-art-ink dark:text-white pt-1 font-hand">
            Ismael Gudiño
            <span className="block text-sm font-sans font-normal text-slate-500 dark:text-slate-400 -mt-1 tracking-normal opacity-80">Art Therapy</span>
          </h1>
        </Link>
        <nav className="flex items-center gap-4">
          <Link to="/settings" className="hidden md:flex items-center justify-center h-12 px-6 rounded-full bg-white dark:bg-white/5 border-2 border-slate-200 dark:border-white/10 hover:border-vibrant-blue dark:hover:border-vibrant-blue text-slate-700 dark:text-slate-200 font-medium transition-all text-base shadow-sm hover:shadow-md gap-2">
            <span className="material-symbols-outlined">settings</span>
            Ajustes
          </Link>
          <button aria-label="Menu" className="size-14 flex items-center justify-center rounded-full text-slate-700 dark:text-slate-200 bg-white dark:bg-white/5 border-2 border-slate-100 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors md:hidden">
            <span className="material-symbols-outlined text-3xl">menu</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

const ScreenHome: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-art-paper dark:bg-art-night min-h-screen flex flex-col text-art-ink dark:text-slate-100 transition-colors duration-300 font-sans">
      <GalleryHeader />
      <main className="flex-grow flex flex-col w-full max-w-[1440px] mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="flex flex-col items-center justify-center py-10 md:py-16 space-y-6 max-w-4xl mx-auto text-center relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-vibrant-blue/5 via-vibrant-pink/5 to-vibrant-yellow/5 dark:from-vibrant-blue/10 dark:via-vibrant-pink/10 dark:to-vibrant-yellow/10 blur-3xl -z-10 rounded-full"></div>
          <h2 className="text-art-ink dark:text-white text-5xl md:text-7xl font-bold leading-[1.1] tracking-wide drop-shadow-sm font-hand">
            Galería de <span className="text-transparent bg-clip-text bg-gradient-to-r from-vibrant-blue to-vibrant-pink">Arte Zen</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-xl md:text-2xl font-light leading-relaxed max-w-2xl font-hand">
            "Encuentra tu centro. El color es el lugar donde nuestro cerebro y el universo se encuentran."
          </p>
        </div>

        {/* Filters */}
        <div className="sticky top-[85px] z-40 py-6 -mx-4 px-4 md:-mx-8 md:px-8 transition-all duration-300 bg-art-paper/95 dark:bg-art-night/95 backdrop-blur-md border-b border-transparent">
          <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center w-full max-w-[1440px] mx-auto">
            <div className="relative group w-full lg:w-96">
              <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-3xl group-focus-within:text-vibrant-blue transition-colors">search</span>
              <input aria-label="Search artworks" className="w-full h-16 bg-white dark:bg-art-surface-dark border-2 border-slate-200 dark:border-slate-700 rounded-full py-3 pl-14 pr-6 text-lg text-art-ink dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-vibrant-blue/20 focus:border-vibrant-blue transition-all shadow-sm" placeholder="Buscar por tema..." type="text" />
            </div>
            <div className="flex flex-col sm:flex-row gap-6 flex-1 w-full lg:w-auto overflow-x-auto pb-4 sm:pb-0 no-scrollbar items-start sm:items-center justify-end">
              <div className="flex flex-col gap-3 shrink-0">
                <span className="text-sm font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-2">Dificultad</span>
                <div className="flex gap-2">
                  <button className="h-12 px-6 rounded-full text-base font-hand font-bold bg-vibrant-teal/10 text-teal-800 dark:text-teal-300 border-2 border-vibrant-teal hover:bg-vibrant-teal hover:text-white transition-all focus:ring-4 ring-teal-500/30">Inicial</button>
                  <button className="h-12 px-6 rounded-full text-base font-hand font-bold bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-700 hover:border-vibrant-teal hover:text-vibrant-teal dark:hover:text-vibrant-teal transition-all">Intermedio</button>
                </div>
              </div>
              <div className="hidden sm:block w-px h-12 bg-slate-200 dark:bg-slate-700 mx-2"></div>
              <div className="flex flex-col gap-3 shrink-0">
                <span className="text-sm font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-2">Ánimo</span>
                <div className="flex gap-2">
                  <button className="flex items-center justify-center gap-2 h-12 px-5 rounded-full bg-white dark:bg-white/5 border-2 border-slate-200 dark:border-slate-700 hover:border-vibrant-blue hover:bg-vibrant-blue/5 transition-all group active:scale-95">
                    <span className="material-symbols-outlined text-2xl text-vibrant-blue group-hover:scale-110 transition-transform">nights_stay</span>
                    <span className="text-base font-hand font-bold text-slate-600 dark:text-slate-300 group-hover:text-vibrant-blue">Calma</span>
                  </button>
                  <button className="flex items-center justify-center gap-2 h-12 px-5 rounded-full bg-white dark:bg-white/5 border-2 border-slate-200 dark:border-slate-700 hover:border-vibrant-orange hover:bg-vibrant-orange/5 transition-all group active:scale-95">
                    <span className="material-symbols-outlined text-2xl text-vibrant-orange group-hover:scale-110 transition-transform">wb_sunny</span>
                    <span className="text-base font-hand font-bold text-slate-600 dark:text-slate-300 group-hover:text-vibrant-orange">Foco</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-6 pb-32">
          <ArtCard
            title="Mandala Solar" level="INICIAL" category="Patrones Geométricos"
            svgContent='<svg class="w-full h-full stroke-slate-400 dark:stroke-slate-500 artwork-line" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="100" r="80"></circle><path d="M100 20 L100 180 M20 100 L180 100 M43 43 L157 157 M157 43 L43 157"></path><circle cx="100" cy="100" r="40"></circle></svg>'
          />
          <ArtCard
            title="Hoja de Vida" level="INTERMEDIO" category="Naturaleza"
            svgContent='<svg class="w-full h-full stroke-slate-400 dark:stroke-slate-500 artwork-line" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M100 180 Q140 120 100 60 Q60 120 100 180 Z"></path><path d="M100 180 Q160 140 140 80"></path><path d="M100 180 Q40 140 60 80"></path><path d="M100 120 L140 100 M100 140 L60 120"></path></svg>'
          />
          <ArtCard
            title="Búho Nocturno" level="INICIAL" category="Animales"
            svgContent='<svg class="w-full h-full stroke-slate-400 dark:stroke-slate-500 artwork-line" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><circle cx="60" cy="80" r="20"></circle><circle cx="140" cy="80" r="20"></circle><path d="M60 80 L60 82 M140 80 L140 82" stroke-width="4"></path><path d="M100 120 L90 140 L110 140 Z"></path><path d="M40 40 Q20 80 40 140 Q100 180 160 140 Q180 80 160 40 Q100 10 40 40"></path></svg>'
          />
          <ArtCard
            title="Cumbres Andinas" level="AVANZADO" category="Paisajes"
            svgContent='<svg class="w-full h-full stroke-slate-400 dark:stroke-slate-500 artwork-line" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M20 150 L60 80 L100 150 L140 60 L180 150"></path><circle cx="160" cy="40" r="15"></circle><path d="M20 150 H180"></path><path d="M40 150 L60 180 L140 180 L160 150"></path></svg>'
          />
        </div>
      </main>
      <button onClick={() => navigate('/coloring')} className="fixed bottom-10 right-10 z-50 bg-gradient-to-r from-vibrant-blue to-vibrant-pink hover:from-blue-600 hover:to-pink-600 text-white p-5 rounded-full shadow-glow-lg shadow-vibrant-blue/50 hover:scale-105 transition-all duration-300 group flex items-center gap-3 pr-8 focus:ring-4 ring-offset-2 ring-vibrant-blue">
        <span className="material-symbols-outlined text-3xl animate-pulse">casino</span>
        <span className="text-xl font-hand font-bold">¡Sorpréndeme!</span>
      </button>
      <footer className="border-t border-slate-200 dark:border-white/10 bg-art-paper dark:bg-art-night py-12 px-8">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            © 2023 Ismael Gudiño Art Therapy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ScreenHome;
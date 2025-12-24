import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ArtCardProps {
  title: string;
  level: string;
  category: string;
  svgContent: string;
}

const ArtCard: React.FC<ArtCardProps> = ({ title, level, category, svgContent }) => {
  const navigate = useNavigate();

  let borderColor = "hover:border-vibrant-blue dark:hover:border-vibrant-yellow";
  let shadowColor = "hover:shadow-vibrant-blue/30 dark:hover:shadow-vibrant-yellow/20";
  let textColor = "group-hover:text-vibrant-blue dark:group-hover:text-vibrant-yellow";
  let badgeColor = "bg-vibrant-teal";

  if (level === "INTERMEDIO") {
    borderColor = "hover:border-vibrant-orange dark:hover:border-vibrant-orange";
    shadowColor = "hover:shadow-vibrant-orange/30 dark:hover:shadow-vibrant-orange/20";
    textColor = "group-hover:text-vibrant-orange dark:group-hover:text-vibrant-orange";
    badgeColor = "bg-vibrant-orange";
  } else if (level === "AVANZADO") {
    borderColor = "hover:border-vibrant-pink dark:hover:border-vibrant-pink";
    shadowColor = "hover:shadow-vibrant-pink/30 dark:hover:shadow-vibrant-pink/20";
    textColor = "group-hover:text-vibrant-pink dark:group-hover:text-vibrant-pink";
    badgeColor = "bg-vibrant-pink";
  }

  return (
    <article
      onClick={() => navigate('/coloring')}
      className={`group card-hover relative flex flex-col rounded-4xl bg-white dark:bg-art-surface-dark shadow-sm hover:shadow-glow ${shadowColor} transition-all duration-300 cursor-pointer overflow-hidden border-2 border-slate-100 dark:border-white/5 ${borderColor}`}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          navigate('/coloring');
        }
      }}
    >
      <div className="relative w-full aspect-square p-8 flex items-center justify-center bg-slate-50 dark:bg-black/20">
        <div
          className="w-full h-full opacity-70 group-hover:opacity-100 transition-opacity"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
        <div className={`absolute top-5 right-5 ${badgeColor} text-white text-xs tracking-wider font-bold px-4 py-2 rounded-full shadow-lg transform group-hover:scale-105 transition-transform`}>
          {level}
        </div>
      </div>
      <div className="p-6 flex flex-col gap-1 relative">
        <div className={`absolute -top-6 right-8 ${level === 'INICIAL' ? 'bg-vibrant-blue' : level === 'INTERMEDIO' ? 'bg-vibrant-orange' : 'bg-vibrant-pink'} size-12 rounded-full flex items-center justify-center text-white shadow-lg opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-300`}>
          <span className="material-symbols-outlined text-2xl">brush</span>
        </div>
        <h3 className={`text-art-ink dark:text-white text-2xl font-bold font-hand ${textColor} transition-colors`}>{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium tracking-wide">{category}</p>
      </div>
    </article>
  );
};

export default ArtCard;
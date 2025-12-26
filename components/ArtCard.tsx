import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeartIcon from './HeartIcon';
import { useAuth } from '../context/AuthContext';
import '../src/styles/minimal.css';

interface ArtCardProps {
  id: string;
  title: string;
  level: string;
  category: string;
  svgContent: string;
  shadowContent?: string;
  backgroundColor?: string;
  isFavorited?: boolean;
  onFavoriteToggle?: () => void;
}

const ArtCard: React.FC<ArtCardProps> = ({
  id,
  title,
  level,
  category,
  svgContent,
  shadowContent,
  backgroundColor = '#FAFAFA',
  isFavorited = false,
  onFavoriteToggle
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Minimal badge color based on difficulty
  const getBadgeColor = () => {
    switch (level) {
      case 'PRINCIPIANTE':
      case 'INICIAL':
        return '#10B981'; // green
      case 'INTERMEDIO':
        return '#F59E0B'; // amber
      case 'AVANZADO':
        return '#EF4444'; // red
      default:
        return 'var(--color-accent-primary)';
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      if (confirm('¿Quieres guardar este lienzo en tus favoritos? Regístrate gratis para organizar tu colección artística.')) {
        navigate(`/auth?redirect=${window.location.pathname}`);
      }
      return;
    }
    if (onFavoriteToggle) onFavoriteToggle();
  };

  return (
    <article
      onClick={() => navigate(`/coloring?template=${id}`)}
      className="minimal-card"
      style={{
        cursor: 'pointer',
        overflow: 'hidden',
        padding: 0
      }}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          navigate(`/coloring?template=${id}`);
        }
      }}
    >
      {/* Image Container */}
      <div
        className="art-card-preview"
        style={{
          width: '100%',
          aspectRatio: '1/1',
          padding: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor,
          position: 'relative'
        }}
      >
        <div
          dangerouslySetInnerHTML={{ __html: svgContent }}
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        />

        {shadowContent && (
          <div
            className="svg-shadow-overlay"
            dangerouslySetInnerHTML={{ __html: shadowContent }}
            style={{
              position: 'absolute',
              top: '32px',
              left: '32px',
              right: '32px',
              bottom: '32px',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          />
        )}

        {/* Favorite Heart */}
        <div
          onClick={handleFavoriteClick}
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            zIndex: 10,
            transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
          className="favorite-heart-container"
        >
          <HeartIcon
            filled={isFavorited}
            size={36}
          />
        </div>

        {/* Difficulty Badge */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backgroundColor: getBadgeColor(),
            color: 'white',
            fontSize: '11px',
            fontWeight: 600,
            padding: '6px 12px',
            borderRadius: 'var(--radius-md)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          {level === 'PRINCIPIANTE' ? 'INICIAL' : level}
        </div>
      </div>

      {/* Card Info */}
      <div style={{ padding: '16px' }}>
        <h3
          className="text-h3"
          style={{
            marginBottom: '4px',
            fontSize: '18px',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {title}
        </h3>
        <p
          className="text-small"
          style={{
            color: 'var(--color-text-secondary)',
            fontSize: '14px'
          }}
        >
          {category}
        </p>
      </div>
    </article>
  );
};

export default ArtCard;
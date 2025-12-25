import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/minimal.css';

interface ArtCardProps {
  id: string;
  title: string;
  level: string;
  category: string;
  svgContent: string;
  backgroundColor?: string;
}

const ArtCard: React.FC<ArtCardProps> = ({
  id,
  title,
  level,
  category,
  svgContent,
  backgroundColor = '#FAFAFA'
}) => {
  const navigate = useNavigate();

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
        style={{
          width: '100%',
          aspectRatio: '1/1',
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor,
          position: 'relative'
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            opacity: 0.85,
            transition: 'opacity 0.3s'
          }}
          dangerouslySetInnerHTML={{ __html: svgContent }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.85'}
        />

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
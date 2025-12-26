import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from '../components/Logo';
import '../src/styles/minimal.css';

const ScreenCompletion: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAfter, setIsAfter] = useState(true);

  const artworkImage = location.state?.artworkImage as string | undefined;

  const handleDownload = () => {
    if (!artworkImage) {
      alert('No hay imagen para descargar');
      return;
    }

    const link = document.createElement('a');
    link.href = artworkImage;
    link.download = `mandala-art-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (!artworkImage) {
      alert('No hay imagen para compartir');
      return;
    }

    const response = await fetch(artworkImage);
    const blob = await response.blob();
    const file = new File([blob], `mandala-art-${Date.now()}.png`, { type: 'image/png' });

    if (navigator.share && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: 'Mi Arte Mandala',
          text: '¡Mira el arte que he creado!',
          files: [file],
        });
      } catch (error) {
        console.log('Error al compartir:', error);
      }
    } else {
      try {
        const clipboardItem = new ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([clipboardItem]);
        alert('¡Imagen copiada al portapapeles!');
      } catch (error) {
        alert('Tu navegador no soporta compartir. Usa el botón Descargar.');
      }
    }
  };

  const handlePrint = () => {
    if (!artworkImage) {
      alert('No hay imagen para imprimir');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Mandala Art - Imprimir</title>
            <style>
              body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
              img { max-width: 100%; max-height: 100vh; object-fit: contain; }
              @media print {
                body { margin: 0; }
                img { max-width: 100%; height: auto; page-break-inside: avoid; }
              }
            </style>
          </head>
          <body>
            <img src="${artworkImage}" alt="Mandala Art" />
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.focus();
        setTimeout(() => printWindow.print(), 250);
      };
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg-secondary)',
      fontFamily: 'var(--font-primary)'
    }}>
      {/* Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'var(--color-bg-primary)',
        borderBottom: '1px solid var(--color-border-light)',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
            color: 'inherit'
          }}>
            <div style={{ width: '40px', height: '40px' }}>
              <Logo size={40} />
            </div>
            <h1 style={{
              fontSize: '24px',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              margin: 0
            }}>
              Ismael Gudiño
            </h1>
          </Link>

          <Link to="/gallery" className="minimal-button-primary">
            Ver Mis Obras
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>
        {/* Success Badge */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: '#D1FAE5',
            color: '#065F46',
            borderRadius: 'var(--radius-md)',
            fontSize: '14px',
            fontWeight: 600,
            border: '1px solid #6EE7B7'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>check_circle</span>
            Obra Completada
          </span>
        </div>

        {/* Hero Text */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 className="text-hero" style={{
            marginBottom: '16px',
            color: 'var(--color-text-primary)'
          }}>
            Has creado un momento de{' '}
            <span style={{ color: 'var(--color-accent-primary)' }}>paz</span>
          </h1>
          <p className="text-h3" style={{
            color: 'var(--color-text-secondary)',
            fontStyle: 'italic',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            "Respira profundo, el arte sana lo que el alma calla."
          </p>
        </div>

        {/* Artwork Display */}
        <div className="minimal-card" style={{
          padding: '24px',
          marginBottom: '32px',
          maxWidth: '800px',
          margin: '0 auto 32px'
        }}>
          <div style={{
            aspectRatio: '16/9',
            background: 'var(--color-bg-tertiary)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            position: 'relative'
          }}>
            {artworkImage ? (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url('${artworkImage}')`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  filter: isAfter ? 'none' : 'grayscale(100%)',
                  transition: 'filter 0.3s'
                }}
              />
            ) : (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: 'var(--color-text-tertiary)'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '64px', display: 'block', marginBottom: '8px' }}>image</span>
                  <p>No hay imagen disponible</p>
                </div>
              </div>
            )}
          </div>

          {/* Before/After Toggle */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '24px',
            alignItems: 'center',
            gap: '16px'
          }}>
            <span className="text-small" style={{ color: 'var(--color-text-secondary)' }}>
              Antes
            </span>
            <button
              onClick={() => setIsAfter(!isAfter)}
              style={{
                position: 'relative',
                width: '52px',
                height: '28px',
                borderRadius: '14px',
                background: isAfter ? 'var(--color-accent-primary)' : '#D1D5DB',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
            >
              <span style={{
                position: 'absolute',
                top: '3px',
                left: isAfter ? '26px' : '3px',
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                transition: 'left 0.2s'
              }} />
            </button>
            <span className="text-small" style={{ color: 'var(--color-text-secondary)' }}>
              Después
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          maxWidth: '900px',
          margin: '0 auto 48px'
        }}>
          <button
            onClick={handleDownload}
            disabled={!artworkImage}
            className="minimal-card"
            style={{
              padding: '32px',
              cursor: artworkImage ? 'pointer' : 'not-allowed',
              opacity: artworkImage ? 1 : 0.5,
              border: '2px solid var(--color-border)',
              transition: 'all 0.2s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px'
            }}
            onMouseEnter={(e) => artworkImage && (e.currentTarget.style.borderColor = 'var(--color-accent-primary)')}
            onMouseLeave={(e) => artworkImage && (e.currentTarget.style.borderColor = 'var(--color-border)')}
          >
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--color-bg-tertiary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'var(--color-accent-primary)' }}>download</span>
            </div>
            <span className="text-h3" style={{ margin: 0 }}>Descargar</span>
          </button>

          <button
            onClick={handleShare}
            disabled={!artworkImage}
            className="minimal-card"
            style={{
              padding: '32px',
              cursor: artworkImage ? 'pointer' : 'not-allowed',
              opacity: artworkImage ? 1 : 0.5,
              border: '2px solid var(--color-accent-primary)',
              background: 'var(--color-accent-primary)',
              color: 'white',
              transition: 'all 0.2s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px'
            }}
            onMouseEnter={(e) => artworkImage && (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => artworkImage && (e.currentTarget.style.transform = 'scale(1)')}
          >
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'white' }}>share</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <span className="text-h3" style={{ margin: 0, display: 'block' }}>Compartir</span>
              <span className="text-small" style={{ opacity: 0.9 }}>¡Contagia tu luz!</span>
            </div>
          </button>

          <button
            onClick={handlePrint}
            disabled={!artworkImage}
            className="minimal-card"
            style={{
              padding: '32px',
              cursor: artworkImage ? 'pointer' : 'not-allowed',
              opacity: artworkImage ? 1 : 0.5,
              border: '2px solid var(--color-border)',
              transition: 'all 0.2s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px'
            }}
            onMouseEnter={(e) => artworkImage && (e.currentTarget.style.borderColor = 'var(--color-accent-primary)')}
            onMouseLeave={(e) => artworkImage && (e.currentTarget.style.borderColor = 'var(--color-border)')}
          >
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--color-bg-tertiary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'var(--color-accent-primary)' }}>print</span>
            </div>
            <span className="text-h3" style={{ margin: 0 }}>Imprimir</span>
          </button>
        </div>

        {/* Back to Gallery */}
        <div style={{ textAlign: 'center' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--color-text-secondary)',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: 500,
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-accent-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Ver más obras de Ismael
          </Link>
        </div>
      </main>
    </div>
  );
};

export default ScreenCompletion;
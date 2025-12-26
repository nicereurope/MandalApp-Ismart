import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { supabase, UserCreation } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../components/Logo';
import '../src/styles/minimal.css';

const MinimalHeader: React.FC = () => {
  const { user, isAdmin, signOut } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'var(--color-bg-primary)',
      borderBottom: '1px solid var(--color-border-light)',
    }}>
      <div className="header-container" style={{
        position: 'relative',
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Logo */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none',
          color: 'inherit',
          gap: '8px'
        }}>
          <span style={{
            fontWeight: 800,
            fontSize: '14px',
            letterSpacing: '0.5px',
            color: 'var(--color-text-primary)'
          }}>YO PINTO con</span>
          <Logo size={80} />
        </Link>

        {/* Desktop Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Mobile Menu Button - Always visible on mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-only minimal-button-secondary"
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>

          {/* Desktop buttons for ALL users */}
          <button
            onClick={toggleTheme}
            className="desktop-only minimal-button-secondary"
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px'
            }}
            title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
              {darkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {user ? (
            <>
              <button
                onClick={() => navigate('/')}
                className="desktop-only minimal-button-secondary"
                style={{ alignItems: 'center', gap: '8px' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>home</span>
                <span>Inicio</span>
              </button>

              {isAdmin && (
                <button
                  onClick={() => navigate('/admin')}
                  className="desktop-only minimal-button-primary"
                  style={{ alignItems: 'center', gap: '8px' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>admin_panel_settings</span>
                  <span>Admin</span>
                </button>
              )}

              <button
                onClick={() => signOut()}
                className="desktop-only minimal-button-secondary"
                style={{ alignItems: 'center', gap: '8px' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>logout</span>
                <span>Salir</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/auth')}
                className="desktop-only minimal-button-primary"
                style={{ alignItems: 'center', gap: '8px' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>login</span>
                <span>Login</span>
              </button>
            </>
          )}
        </nav>
      </div>

      {/* Mobile Menu - For all users */}
      {mobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          width: '100%',
          maxWidth: '100vw',
          borderTop: '1px solid var(--color-border)',
          padding: '16px',
          background: 'var(--color-bg-primary)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          zIndex: 40
        }}>
          {/* Theme toggle in mobile menu */}
          <button
            onClick={() => {
              toggleTheme();
              setMobileMenuOpen(false);
            }}
            className="minimal-button-secondary"
            style={{ width: '100%', justifyContent: 'flex-start', gap: '12px', display: 'flex', alignItems: 'center' }}
          >
            <span className="material-symbols-outlined">
              {darkMode ? 'light_mode' : 'dark_mode'}
            </span>
            {darkMode ? 'Modo Claro' : 'Modo Oscuro'}
          </button>

          {user ? (
            <>
              <button
                onClick={() => {
                  navigate('/');
                  setMobileMenuOpen(false);
                }}
                className="minimal-button-secondary"
                style={{ width: '100%', justifyContent: 'flex-start', gap: '12px', display: 'flex', alignItems: 'center' }}
              >
                <span className="material-symbols-outlined">home</span>
                Inicio
              </button>
              {isAdmin && (
                <button
                  onClick={() => {
                    navigate('/admin');
                    setMobileMenuOpen(false);
                  }}
                  className="minimal-button-primary"
                  style={{ width: '100%', justifyContent: 'flex-start', gap: '12px', display: 'flex', alignItems: 'center' }}
                >
                  <span className="material-symbols-outlined">admin_panel_settings</span>
                  Admin
                </button>
              )}
              <button
                onClick={() => {
                  signOut();
                  setMobileMenuOpen(false);
                }}
                className="minimal-button-secondary"
                style={{ width: '100%', justifyContent: 'flex-start', gap: '12px', color: '#DC2626', display: 'flex', alignItems: 'center' }}
              >
                <span className="material-symbols-outlined">logout</span>
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  navigate('/auth');
                  setMobileMenuOpen(false);
                }}
                className="minimal-button-primary"
                style={{ width: '100%', justifyContent: 'flex-start', gap: '12px', display: 'flex', alignItems: 'center' }}
              >
                <span className="material-symbols-outlined">login</span>
                Iniciar Sesión
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

const ScreenGallery: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [creations, setCreations] = useState<UserCreation[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [selectedCreation, setSelectedCreation] = useState<UserCreation | null>(null);

  useEffect(() => {
    // Wait for auth to finish loading before redirecting
    if (authLoading) return;

    if (!user) {
      navigate('/auth');
      return;
    }
    loadCreations();
  }, [user, authLoading, navigate]);

  const loadCreations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_creations')
        .select('*, svg_templates(shadow_content)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCreations(data || []);
    } catch (error: any) {
      console.error('Error loading creations:', error);
      setMessage('Error al cargar tus creaciones');
    } finally {
      setLoading(false);
    }
  };

  const deleteCreation = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta creación?')) return;

    try {
      const { error } = await supabase
        .from('user_creations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setMessage('Creación eliminada exitosamente');
      await loadCreations();
    } catch (error: any) {
      setMessage('Error al eliminar: ' + error.message);
    }
  };

  const compositeShadow = async (dataUrl: string, shadowContent?: string): Promise<string> => {
    if (!shadowContent) return dataUrl;

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }

        // Draw base
        ctx.drawImage(img, 0, 0);

        // Draw shadow
        const shadowImg = new Image();
        const svgBlob = new Blob([shadowContent], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        shadowImg.onload = () => {
          // Calculate same aspect ratio logic as used in Coloring.tsx loadBlankTemplate
          const aspectRatio = shadowImg.width / shadowImg.height;
          let drawWidth = canvas.width;
          let drawHeight = canvas.height;

          if (aspectRatio > 1) {
            drawHeight = canvas.width / aspectRatio;
          } else {
            drawWidth = canvas.height * aspectRatio;
          }

          const x = (canvas.width - drawWidth) / 2;
          const y = (canvas.height - drawHeight) / 2;

          ctx.drawImage(shadowImg, x, y, drawWidth, drawHeight);
          URL.revokeObjectURL(url);
          resolve(canvas.toDataURL('image/png'));
        };
        shadowImg.onerror = () => {
          URL.revokeObjectURL(url);
          resolve(dataUrl);
        };
        shadowImg.src = url;
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  };

  const downloadArtwork = async (dataUrl: string, title: string, shadowContent?: string) => {
    if (dataUrl.startsWith('data:')) {
      const finalUrl = await compositeShadow(dataUrl, shadowContent);
      const link = document.createElement('a');
      link.href = finalUrl;
      link.download = `${title || 'artwork'}.png`;
      link.click();
    } else {
      const blob = new Blob([dataUrl], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title || 'artwork'}.svg`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleShare = async (dataUrl: string, title: string, shadowContent?: string) => {
    try {
      const finalUrl = await compositeShadow(dataUrl, shadowContent);
      const response = await fetch(finalUrl);
      const blob = await response.blob();
      const file = new File([blob], `${title || 'artwork'}.png`, { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `Mi obra: ${title}`,
          text: 'Mira mi creación artística 🎨',
          files: [file]
        });
      } else {
        alert('Tu navegador no soporta compartir archivos.\n¡La imagen se descargará en su lugar!');
        downloadArtwork(finalUrl, title); // Already composited
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Error sharing:', error);
        alert('Error al compartir. La imagen se descargará en su lugar.');
        downloadArtwork(dataUrl, title, shadowContent);
      }
    }
  };

  const handleEdit = (templateId: string | null, creationId: string) => {
    if (templateId) {
      navigate(`/coloring?template=${templateId}&creation=${creationId}`);
    } else {
      alert('No se puede editar esta obra porque no tiene template asociado.');
    }
  };

  const handlePublish = async (creationId: string, makePublic: boolean, showAuthor: boolean = false) => {
    try {
      const { error } = await supabase
        .from('user_creations')
        .update({
          is_public: makePublic,
          show_author: showAuthor
        })
        .eq('id', creationId);

      if (error) throw error;

      setMessage(makePublic ? '¡Obra publicada exitosamente!' : 'Obra removida de la galería pública');
      setPublishModalOpen(false);
      setSelectedCreation(null);
      await loadCreations();
    } catch (error: any) {
      setMessage('Error al publicar: ' + error.message);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg-secondary)',
      fontFamily: 'var(--font-primary)'
    }}>
      <MinimalHeader />

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px', paddingBottom: '80px' }}>
        {/* Hero Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '48px'
        }}>
          <h1 className="text-hero" style={{
            marginBottom: '12px',
            color: 'var(--color-text-primary)'
          }}>
            Mis <span style={{ color: 'var(--color-accent-primary)' }}>Obras</span>
          </h1>
          <p className="text-body" style={{
            color: 'var(--color-text-secondary)',
            fontSize: '16px'
          }}>
            Tu galería personal de creaciones artísticas
          </p>
        </div>

        {/* Message */}
        {message && (
          <div style={{
            padding: '16px 24px',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '24px',
            background: message.includes('Error') ? '#FEE2E2' : '#D1FAE5',
            color: message.includes('Error') ? '#991B1B' : '#065F46',
            border: `1px solid ${message.includes('Error') ? '#FCA5A5' : '#6EE7B7'}`,
            fontSize: '14px',
            fontWeight: 500
          }}>
            {message}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 0',
            color: 'var(--color-text-secondary)'
          }}>
            Cargando tus creaciones...
          </div>
        ) : creations.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 24px',
            background: 'var(--color-bg-primary)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-border-light)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <h2 className="text-h2" style={{ marginBottom: '12px' }}>
              No tienes creaciones guardadas
            </h2>
            <p className="text-body" style={{
              color: 'var(--color-text-secondary)',
              marginBottom: '32px'
            }}>
              Comienza a pintar y guarda tus obras de arte
            </p>
            <button
              onClick={() => navigate('/')}
              className="minimal-button-primary"
            >
              Empezar a Pintar
            </button>
          </div>
        ) : (
          <div className="gallery-grid">
            {creations.map((creation) => (
              <div key={creation.id} className="minimal-card" style={{ padding: 0, overflow: 'hidden' }}>
                {/* Image */}
                <div style={{
                  width: '100%',
                  minHeight: '200px',
                  background: 'var(--color-bg-tertiary)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
                  onClick={() => setSelectedCreation(creation)}>
                  <img
                    src={creation.colored_svg}
                    alt={creation.title || 'Artwork'}
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '400px',
                      objectFit: 'contain',
                      transition: 'transform 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                  {creation.svg_templates?.shadow_content && (
                    <div
                      className="svg-shadow-overlay"
                      dangerouslySetInnerHTML={{ __html: creation.svg_templates.shadow_content }}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        pointerEvents: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    />
                  )}
                </div>

                {/* Info */}
                <div style={{ padding: '16px' }}>
                  <h3 className="text-h3" style={{
                    marginBottom: '4px',
                    fontSize: '16px',
                    fontWeight: 600,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {creation.title || 'Sin título'}
                  </h3>
                  <p className="text-small" style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: '12px',
                    marginBottom: '16px'
                  }}>
                    {new Date(creation.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>

                  {/* Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {/* Public/Private Toggle */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px',
                      background: 'var(--color-bg-secondary)',
                      borderRadius: 'var(--radius-md)'
                    }}>
                      <span style={{
                        fontSize: '13px',
                        fontWeight: 500,
                        color: 'var(--color-text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        {creation.is_public ? (
                          <>
                            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#10B981' }}>public</span>
                            Público
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>lock</span>
                            Privado
                          </>
                        )}
                      </span>
                      <button
                        onClick={() => {
                          if (creation.is_public) {
                            handlePublish(creation.id, false);
                          } else {
                            setSelectedCreation(creation);
                            setPublishModalOpen(true);
                          }
                        }}
                        style={{
                          position: 'relative',
                          display: 'inline-flex',
                          height: '24px',
                          width: '44px',
                          alignItems: 'center',
                          borderRadius: '12px',
                          transition: 'background-color 0.2s',
                          background: creation.is_public ? '#10B981' : '#D1D5DB',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <span style={{
                          display: 'inline-block',
                          height: '18px',
                          width: '18px',
                          transform: creation.is_public ? 'translateX(22px)' : 'translateX(3px)',
                          borderRadius: '50%',
                          background: 'white',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                          transition: 'transform 0.2s'
                        }} />
                      </button>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                      <button
                        onClick={() => handleEdit(creation.template_id, creation.id)}
                        className="minimal-button-secondary"
                        style={{
                          padding: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="Editar"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>edit</span>
                      </button>
                      <button
                        onClick={() => handleShare(creation.colored_svg, creation.title || 'artwork', creation.svg_templates?.shadow_content)}
                        className="minimal-button-secondary"
                        style={{
                          padding: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="Compartir"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>share</span>
                      </button>
                      <button
                        onClick={() => downloadArtwork(creation.colored_svg, creation.title || 'artwork', creation.svg_templates?.shadow_content)}
                        className="minimal-button-secondary"
                        style={{
                          padding: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="Descargar"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>download</span>
                      </button>
                      <button
                        onClick={() => deleteCreation(creation.id)}
                        className="minimal-button-secondary"
                        style={{
                          padding: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#DC2626',
                          borderColor: '#FCA5A5'
                        }}
                        title="Eliminar"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Publish Modal */}
      {publishModalOpen && selectedCreation && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
          onClick={() => setPublishModalOpen(false)}
        >
          <div
            className="minimal-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '500px',
              width: '100%',
              padding: '32px'
            }}
          >
            <h2 className="text-h2" style={{ marginBottom: '12px' }}>
              Publicar en Galería
            </h2>
            <p className="text-body" style={{
              color: 'var(--color-text-secondary)',
              marginBottom: '24px'
            }}>
              ¿Cómo quieres que aparezca tu obra en la galería pública?
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <button
                onClick={() => handlePublish(selectedCreation.id, true, true)}
                className="minimal-button-secondary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  justifyContent: 'flex-start'
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>person</span>
                <div style={{ textAlign: 'left' }}>
                  <strong style={{ display: 'block', fontSize: '15px' }}>Con mi nombre</strong>
                  <small style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Mostrará tu usuario</small>
                </div>
              </button>

              <button
                onClick={() => handlePublish(selectedCreation.id, true, false)}
                className="minimal-button-secondary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  justifyContent: 'flex-start'
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>visibility_off</span>
                <div style={{ textAlign: 'left' }}>
                  <strong style={{ display: 'block', fontSize: '15px' }}>Anónimo</strong>
                  <small style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Sin autor visible</small>
                </div>
              </button>
            </div>

            <button
              onClick={() => setPublishModalOpen(false)}
              className="minimal-button-secondary"
              style={{ width: '100%' }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScreenGallery;

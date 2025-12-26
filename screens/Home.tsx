import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ArtCard from '../components/ArtCard';
import Logo from '../components/Logo';
import HeartIcon from '../components/HeartIcon';
import { useAuth } from '../context/AuthContext';
import { supabase, SvgTemplate } from '../lib/supabase';
import '../src/styles/minimal.css';

const MinimalHeader: React.FC = () => {
  const { user, isAdmin, signOut } = useAuth();
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
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Logo */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none',
          color: 'inherit'
        }}>
          <Logo size={120} />
        </Link>

        {/* Desktop Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {user ? (
            <>
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{
                  display: 'none',
                  '@media (max-width: 640px)': {
                    display: 'flex'
                  }
                }}
                className="sm:hidden minimal-button-secondary"
              >
                <span className="material-symbols-outlined">
                  {mobileMenuOpen ? 'close' : 'menu'}
                </span>
              </button>

              {/* Desktop Buttons */}
              <button
                onClick={() => navigate('/gallery')}
                className="hidden sm:flex minimal-button-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>photo_library</span>
                <span>Mis Obras</span>
              </button>

              {isAdmin && (
                <button
                  onClick={() => navigate('/admin')}
                  className="hidden sm:flex minimal-button-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>admin_panel_settings</span>
                  <span>Admin</span>
                </button>
              )}

              <button
                onClick={() => signOut()}
                className="hidden sm:flex minimal-button-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>logout</span>
                <span>Salir</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/auth')}
              className="minimal-button-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>login</span>
              <span>Login</span>
            </button>
          )}
        </nav>
      </div>

      {/* Mobile Menu */}
      {user && mobileMenuOpen && (
        <div className="sm:hidden" style={{
          borderTop: '1px solid var(--color-border)',
          padding: '16px',
          background: 'var(--color-bg-primary)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <button
            onClick={() => {
              navigate('/gallery');
              setMobileMenuOpen(false);
            }}
            className="minimal-button-secondary"
            style={{ width: '100%', justifyContent: 'flex-start', gap: '12px' }}
          >
            <span className="material-symbols-outlined">photo_library</span>
            Mis Obras
          </button>
          {isAdmin && (
            <button
              onClick={() => {
                navigate('/admin');
                setMobileMenuOpen(false);
              }}
              className="minimal-button-primary"
              style={{ width: '100%', justifyContent: 'flex-start', gap: '12px' }}
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
            style={{ width: '100%', justifyContent: 'flex-start', gap: '12px', color: '#DC2626' }}
          >
            <span className="material-symbols-outlined">logout</span>
            Cerrar Sesión
          </button>
        </div>
      )}
    </header>
  );
};

const ScreenHome: React.FC = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<SvgTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [publicWorks, setPublicWorks] = useState<any[]>([]);
  const [publicWorksLoading, setPublicWorksLoading] = useState(true);
  const [selectedWork, setSelectedWork] = useState<any | null>(null);
  const [userLikes, setUserLikes] = useState<Set<string>>(new Set());
  const { user } = useAuth();

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const { data, error } = await supabase
          .from('svg_templates')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setTemplates(data || []);
      } catch (error) {
        console.error('Error loading templates:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTemplates();
  }, []);

  // Load public works
  useEffect(() => {
    const loadPublicWorks = async () => {
      try {
        const { data, error } = await supabase
          .from('user_creations')
          .select('*')
          .eq('is_public', true)
          .order('created_at', { ascending: false })
          .limit(12);

        if (error) throw error;
        setPublicWorks(data || []);
      } catch (error) {
        console.error('Error loading public works:', error);
      } finally {
        setPublicWorksLoading(false);
      }
    };

    loadPublicWorks();
  }, []);

  // Load user's likes
  useEffect(() => {
    const loadUserLikes = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('artwork_likes')
          .select('creation_id')
          .eq('user_id', user.id);

        if (error) throw error;

        const likedIds = new Set(data?.map(like => like.creation_id) || []);
        setUserLikes(likedIds);
      } catch (error) {
        console.error('Error loading user likes:', error);
      }
    };

    loadUserLikes();
  }, [user]);

  // Get unique categories from templates
  const categories = Array.from(new Set(templates.map(t => t.category))).sort();

  // Apply filters
  const filteredTemplates = templates.filter(template => {
    if (searchTerm && !template.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (selectedDifficulty && template.difficulty !== selectedDifficulty) {
      return false;
    }
    if (selectedCategory && template.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  const handleLike = async (creationId: string) => {
    if (!user) {
      alert('Debes iniciar sesión para dar like');
      return;
    }

    try {
      const isLiked = userLikes.has(creationId);

      if (isLiked) {
        const newLikes = new Set(userLikes);
        newLikes.delete(creationId);
        setUserLikes(newLikes);

        await supabase
          .from('artwork_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('creation_id', creationId);

        await supabase.rpc('decrement_likes', { creation_id: creationId });
      } else {
        const newLikes = new Set(userLikes);
        newLikes.add(creationId);
        setUserLikes(newLikes);

        await supabase
          .from('artwork_likes')
          .insert({ user_id: user.id, creation_id: creationId });

        await supabase.rpc('increment_likes', { creation_id: creationId });
      }

      const { data } = await supabase
        .from('user_creations')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(12);

      setPublicWorks(data || []);

      if (selectedWork && selectedWork.id === creationId) {
        const updated = data?.find(w => w.id === creationId);
        if (updated) setSelectedWork(updated);
      }
    } catch (error) {
      console.error('Error liking work:', error);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg-secondary)',
      fontFamily: 'var(--font-primary)'
    }}>
      <MinimalHeader />

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>
        {/* Hero Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '64px',
          maxWidth: '800px',
          margin: '0 auto 64px'
        }}>
          <h1 className="text-hero" style={{
            marginBottom: '24px',
            color: 'var(--color-text-primary)'
          }}>
            Galería de <span style={{ color: 'var(--color-accent-primary)' }}>Arte Zen</span>
          </h1>
          <p className="text-body" style={{
            color: 'var(--color-text-secondary)',
            fontSize: '18px',
            lineHeight: '1.6'
          }}>
            Encuentra tu centro. El color es el lugar donde nuestro cerebro y el universo se encuentran.
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px' }}>
          <input
            type="text"
            placeholder="Buscar plantillas..."
            className="minimal-input"
            style={{ width: '100%' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div style={{
          marginBottom: '48px',
          display: 'flex',
          gap: '24px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <div>
            <p className="text-small" style={{
              marginBottom: '12px',
              fontWeight: 600,
              color: 'var(--color-text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontSize: '12px'
            }}>
              Dificultad
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setSelectedDifficulty(selectedDifficulty === 'Principiante' ? null : 'Principiante')}
                className={selectedDifficulty === 'Principiante' ? 'minimal-button-primary' : 'minimal-button-secondary'}
              >
                Inicial
              </button>
              <button
                onClick={() => setSelectedDifficulty(selectedDifficulty === 'Intermedio' ? null : 'Intermedio')}
                className={selectedDifficulty === 'Intermedio' ? 'minimal-button-primary' : 'minimal-button-secondary'}
              >
                Intermedio
              </button>
              <button
                onClick={() => setSelectedDifficulty(selectedDifficulty === 'Avanzado' ? null : 'Avanzado')}
                className={selectedDifficulty === 'Avanzado' ? 'minimal-button-primary' : 'minimal-button-secondary'}
              >
                Avanzado
              </button>
            </div>
          </div>

          <div>
            <p className="text-small" style={{
              marginBottom: '12px',
              fontWeight: 600,
              color: 'var(--color-text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontSize: '12px'
            }}>
              Categorías
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setSelectedCategory(null)}
                className={selectedCategory === null ? 'minimal-button-primary' : 'minimal-button-secondary'}
              >
                Todas
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                  className={selectedCategory === category ? 'minimal-button-primary' : 'minimal-button-secondary'}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Templates Grid - Masonry */}
        <div className="masonry-grid" style={{ marginBottom: '80px' }}>
          {loading ? (
            <div style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '80px 0',
              color: 'var(--color-text-secondary)'
            }}>
              Cargando plantillas...
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '80px 0',
              color: 'var(--color-text-secondary)'
            }}>
              No se encontraron resultados
            </div>
          ) : (
            filteredTemplates.map((template) => (
              <div key={template.id} className="masonry-item">
                <ArtCard
                  id={template.id}
                  title={template.title}
                  level={template.difficulty.toUpperCase()}
                  category={template.category}
                  svgContent={template.svg_content}
                  backgroundColor={template.background_color}
                />
              </div>
            ))
          )}
        </div>

        {/* Community Gallery */}
        {publicWorks.length > 0 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 className="text-h1" style={{ marginBottom: '16px' }}>
                🎨 Galería Comunitaria
              </h2>
              <p className="text-body" style={{ color: 'var(--color-text-secondary)' }}>
                Descubre las increíbles obras creadas por nuestra comunidad
              </p>
            </div>

            <div className="instagram-grid">
              {publicWorksLoading ? (
                <div style={{
                  gridColumn: '1 / -1',
                  textAlign: 'center',
                  padding: '48px 0',
                  color: 'var(--color-text-secondary)'
                }}>
                  Cargando obras...
                </div>
              ) : (
                publicWorks.map((work) => (
                  <div
                    key={work.id}
                    className="minimal-card animate-fade-in"
                    onClick={() => setSelectedWork(work)}
                    style={{
                      cursor: 'pointer',
                      overflow: 'hidden',
                      padding: 0
                    }}
                  >
                    <div style={{
                      aspectRatio: '1/1',
                      background: 'var(--color-bg-tertiary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden'
                    }}>
                      <img
                        src={work.colored_svg}
                        alt={work.title || 'Community artwork'}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.3s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      />
                    </div>
                    <div style={{ padding: '16px' }}>
                      <h3 className="text-h3" style={{
                        marginBottom: '4px',
                        fontSize: '16px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {work.title || 'Sin título'}
                      </h3>
                      <p className="text-small" style={{ color: 'var(--color-text-secondary)' }}>
                        {work.show_author ? 'Por autor' : 'Anónimo'}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* Artwork Detail Modal */}
      {selectedWork && (
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
          onClick={() => setSelectedWork(null)}
        >
          <div
            className="minimal-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative'
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedWork(null)}
              className="minimal-button-secondary"
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                zIndex: 10,
                width: '40px',
                height: '40px',
                padding: 0,
                borderRadius: '50%'
              }}
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            {/* Image */}
            <div style={{
              background: 'var(--color-bg-tertiary)',
              padding: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img
                src={selectedWork.colored_svg}
                alt={selectedWork.title || 'Artwork'}
                style={{
                  maxWidth: '100%',
                  maxHeight: '500px',
                  objectFit: 'contain',
                  borderRadius: 'var(--radius-lg)'
                }}
              />
            </div>

            {/* Details */}
            <div style={{ padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                  <h2 className="text-h2" style={{ marginBottom: '8px' }}>
                    {selectedWork.title || 'Sin título'}
                  </h2>
                  <p className="text-body" style={{ color: 'var(--color-text-secondary)' }}>
                    {selectedWork.show_author ? 'Por autor' : 'Artista anónimo'}
                  </p>
                  <p className="text-small" style={{ color: 'var(--color-text-tertiary)', marginTop: '8px' }}>
                    {new Date(selectedWork.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                {/* Like Button */}
                <button
                  onClick={() => handleLike(selectedWork.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <HeartIcon
                    filled={userLikes.has(selectedWork.id)}
                    size={48}
                  />
                  <span style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: 'var(--color-accent-primary)'
                  }}>
                    {selectedWork.likes_count || 0}
                  </span>
                </button>
              </div>

              {/* Action Button */}
              {selectedWork.template_id && (
                <button
                  onClick={() => {
                    setSelectedWork(null);
                    navigate(`/coloring?template=${selectedWork.template_id}`);
                  }}
                  className="minimal-button-primary"
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px'
                  }}
                >
                  <span className="material-symbols-outlined">palette</span>
                  Colorear este diseño
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Version Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '24px',
        marginTop: '64px',
        borderTop: '1px solid var(--color-border)',
        color: 'var(--color-text-tertiary)',
        fontSize: '12px'
      }}>
        <p style={{ margin: 0 }}>
          © 2024 Ismael Gudiño. Art Therapy.
        </p>
        <p style={{ margin: '8px 0 0 0', fontFamily: 'monospace' }}>
          Deploy: <strong>v20f59fd</strong> | Build: 2025-12-25 13:55
        </p>
        <p style={{ margin: '4px 0 0 0', fontFamily: 'monospace', fontSize: '11px' }}>
          Theme: {document.documentElement.classList.contains('dark') ? 'Dark 🌙' : 'Light ☀️'}
        </p>
      </footer>
    </div>
  );
};

export default ScreenHome;
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ArtCard from '../components/ArtCard';
import HeartIcon from '../components/HeartIcon';
import Tour from '../components/Tour';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { supabase, SvgTemplate, UserCreation } from '../lib/supabase';
import Logo from '../components/Logo';
import '../src/styles/minimal.css';

const MinimalHeader: React.FC = () => {
  const { user, isAdmin, isLoading, signOut } = useAuth();
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
          <Logo size={100} />
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
                onClick={() => navigate('/gallery')}
                className="desktop-only minimal-button-secondary"
                style={{ alignItems: 'center', gap: '8px' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>photo_library</span>
                <span>Mis Obras</span>
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
          ) : !isLoading ? (
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
          ) : (
            <div style={{ width: '40px' }}></div> // Spacer while loading
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
          {user ? (
            <>
              {/* Logged user options */}
              <button
                onClick={() => {
                  navigate('/gallery');
                  setMobileMenuOpen(false);
                }}
                className="minimal-button-secondary"
                style={{ width: '100%', justifyContent: 'flex-start', gap: '12px', display: 'flex', alignItems: 'center' }}
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
                  style={{ width: '100%', justifyContent: 'flex-start', gap: '12px', display: 'flex', alignItems: 'center' }}
                >
                  <span className="material-symbols-outlined">admin_panel_settings</span>
                  Admin
                </button>
              )}
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
              {/* Non-logged user options */}
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

const ScreenHome: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [templates, setTemplates] = useState<SvgTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [publicWorks, setPublicWorks] = useState<any[]>([]);
  const [publicWorksLoading, setPublicWorksLoading] = useState(true);
  const [selectedWork, setSelectedWork] = useState<any | null>(null);
  const [userLikes, setUserLikes] = useState<Set<string>>(new Set());
  const [userFavorites, setUserFavorites] = useState<Set<string>>(new Set());
  const [showTour, setShowTour] = useState(false);
  const { user } = useAuth();

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableDifficulties, setAvailableDifficulties] = useState<any[]>([]);

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

    const loadMetadata = async () => {
      const { data: catData } = await supabase.from('app_categories').select('name').order('name');
      if (catData) setAvailableCategories(catData.map(c => c.name));

      const { data: diffData } = await supabase.from('app_difficulties').select('*').order('order');
      if (diffData) setAvailableDifficulties(diffData);
    };

    loadTemplates();
    loadMetadata();
  }, []);

  // Load public works
  useEffect(() => {
    const loadPublicWorks = async () => {
      try {
        const { data, error } = await supabase
          .from('user_creations')
          .select('*, svg_templates(shadow_content)')
          .eq('is_public', true)
          .order('created_at', { ascending: false })
          .limit(9);

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

  // Load user's favorites
  useEffect(() => {
    const loadUserFavorites = async () => {
      if (!user) {
        setUserFavorites(new Set());
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_favorites')
          .select('template_id')
          .eq('user_id', user.id);

        if (error) throw error;

        const favoriteIds = new Set(data?.map(fav => fav.template_id) || []);
        setUserFavorites(favoriteIds);
      } catch (error) {
        console.error('Error loading user favorites:', error);
      }
    };

    loadUserFavorites();
  }, [user]);

  // Applying filters
  const filteredTemplates = templates.filter(template => {
    if (searchTerm && !template.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (selectedDifficulty && template.difficulty !== selectedDifficulty) {
      return false;
    }
    if (selectedCategory && selectedCategory !== 'Favoritos' && template.category !== selectedCategory) {
      return false;
    }
    if (selectedCategory === 'Favoritos' && !userFavorites.has(template.id)) {
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
        .limit(9);

      setPublicWorks(data || []);

      if (selectedWork && selectedWork.id === creationId) {
        const updated = data?.find(w => w.id === creationId);
        if (updated) setSelectedWork(updated);
      }
    } catch (error) {
      console.error('Error liking work:', error);
    }
  };

  const handleFavoriteToggle = async (templateId: string) => {
    if (!user) return; // Prompt is handled in ArtCard

    try {
      const isFavorited = userFavorites.has(templateId);
      const newFavorites = new Set(userFavorites);

      if (isFavorited) {
        newFavorites.delete(templateId);
        setUserFavorites(newFavorites);

        await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('template_id', templateId);
      } else {
        newFavorites.add(templateId);
        setUserFavorites(newFavorites);

        await supabase
          .from('user_favorites')
          .insert({ user_id: user.id, template_id: templateId });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
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
        <div id="tour-hero" style={{
          textAlign: 'center',
          marginBottom: '64px',
          maxWidth: '800px',
          margin: '0 auto 64px'
        }}>
          <h1 className="text-hero" style={{
            marginBottom: '24px',
            color: 'var(--color-text-primary)',
            textTransform: 'uppercase',
            letterSpacing: '4px',
            fontSize: 'clamp(32px, 8vw, 64px)',
            fontWeight: 800
          }}>
            Arte <span style={{ color: 'var(--color-accent-primary)' }}>colaborativo</span>
          </h1>
          <p className="text-body" style={{
            color: 'var(--color-text-secondary)',
            fontSize: '20px',
            lineHeight: '1.6',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Personaliza las obras de tu artista preferido para relajar e inspirar
          </p>
        </div>

        {/* Community Gallery - Featured First */}
        {publicWorks.length > 0 && (
          <div id="tour-community" style={{ marginBottom: '80px' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 className="text-h1" style={{ marginBottom: '16px', color: 'var(--color-text-primary)' }}>
                ✨ Inspiración de la Comunidad
              </h2>
              <p className="text-body" style={{ color: 'var(--color-text-secondary)' }}>
                Mira lo que otros han creado y haz clic en cualquiera para usarlo como inspiración
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
                      overflow: 'hidden',
                      position: 'relative'
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
                      {work.svg_templates?.shadow_content && (
                        <div
                          className="svg-shadow-overlay"
                          dangerouslySetInnerHTML={{ __html: work.svg_templates.shadow_content }}
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
                  </div>
                ))
              )}
            </div>
            {publicWorks.length >= 9 && (
              <div style={{ textAlign: 'center', marginTop: '32px' }}>
                <p className="text-small" style={{ color: 'var(--color-text-tertiary)' }}>
                  Mostrando las creaciones más recientes
                </p>
              </div>
            )}
          </div>
        )}

        <div style={{
          textAlign: 'center',
          padding: '40px 0 0',
          borderTop: '1px solid var(--color-border-light)'
        }}>
        </div>

        {/* Ultra-Condensed Seamless Filter Bar */}
        <div id="tour-filters" style={{
          marginBottom: '64px',
          display: 'flex',
          gap: '20px',
          alignItems: 'center',
          flexWrap: 'wrap',
          background: 'var(--color-bg-primary)',
          padding: '8px 20px',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border-light)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          {/* Label inside the bar */}
          <span className="text-small" style={{
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            whiteSpace: 'nowrap',
            marginRight: '12px'
          }}>
            Elige tu lienzo
          </span>

          {/* Search */}
          <div style={{ flex: '2', minWidth: '180px', position: 'relative' }}>
            <span className="material-symbols-outlined" style={{
              position: 'absolute',
              left: '0',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '18px',
              color: 'var(--color-text-tertiary)'
            }}>search</span>
            <input
              type="text"
              placeholder="Buscar..."
              className="minimal-input"
              style={{
                width: '100%',
                paddingLeft: '28px',
                height: '40px',
                border: 'none',
                background: 'transparent',
                boxShadow: 'none'
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Difficulty Dropdown */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <select
              className="minimal-input"
              style={{
                height: '40px',
                cursor: 'pointer',
                border: 'none',
                background: 'transparent',
                boxShadow: 'none',
                paddingRight: '24px',
                appearance: 'none',
                fontWeight: 600,
                fontSize: '14px',
                color: 'var(--color-text-secondary)'
              }}
              value={selectedDifficulty || ''}
              onChange={(e) => setSelectedDifficulty(e.target.value as any || null)}
            >
              <option value="">Todas (Dificultad)</option>
              {availableDifficulties.map(diff => (
                <option key={diff.id} value={diff.name}>{diff.label}</option>
              ))}
            </select>
            <span className="material-symbols-outlined" style={{
              position: 'absolute',
              right: '0',
              pointerEvents: 'none',
              fontSize: '18px',
              color: 'var(--color-text-tertiary)'
            }}>expand_more</span>
          </div>

          {/* Category Dropdown */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <select
              className="minimal-input"
              style={{
                height: '40px',
                cursor: 'pointer',
                border: 'none',
                background: 'transparent',
                boxShadow: 'none',
                paddingRight: '24px',
                appearance: 'none',
                fontWeight: 600,
                fontSize: '14px',
                color: 'var(--color-text-secondary)'
              }}
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
            >
              <option value="">Todas (Categorías)</option>
              {user && <option value="Favoritos">❤️ Favoritos</option>}
              {availableCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <span className="material-symbols-outlined" style={{
              position: 'absolute',
              right: '0',
              pointerEvents: 'none',
              fontSize: '18px',
              color: 'var(--color-text-tertiary)'
            }}>expand_more</span>
          </div>
        </div>

        {/* Templates Grid - Masonry */}
        <div id="tour-templates" className="masonry-grid" style={{ marginBottom: '80px' }}>
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
                  shadowContent={template.shadow_content}
                  backgroundColor={template.background_color}
                  isFavorited={userFavorites.has(template.id)}
                  onFavoriteToggle={() => handleFavoriteToggle(template.id)}
                />
              </div>
            ))
          )}
        </div>
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
              justifyContent: 'center',
              position: 'relative'
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
              {selectedWork.svg_templates?.shadow_content && (
                <div
                  className="svg-shadow-overlay"
                  dangerouslySetInnerHTML={{ __html: selectedWork.svg_templates.shadow_content }}
                  style={{
                    position: 'absolute',
                    top: '48px',
                    left: '48px',
                    right: '48px',
                    bottom: '48px',
                    pointerEvents: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                />
              )}
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
          Theme: {darkMode ? 'Dark 🌙' : 'Light ☀️'}
        </p>
      </footer>
      {/* Floating Help Button */}
      <button
        onClick={() => {
          setShowTour(false);
          setTimeout(() => setShowTour(true), 100);
        }}
        className="minimal-button-secondary"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 90,
          padding: 0
        }}
        title="Ver tour educativo de nuevo"
      >
        <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>help</span>
      </button>

      {/* Onboarding Tour */}
      <Tour
        tourKey="home_onboarding"
        forceShow={showTour}
        onComplete={() => setShowTour(false)}
        steps={[
          {
            targetId: 'tour-hero',
            title: '¡Bienvenido al Atelier!',
            content: 'Aquí el arte de Gudiño se encuentra con tu creatividad. Un espacio para relajarte e inspirar.'
          },
          {
            targetId: 'tour-community',
            title: 'Inspiración de la Comunidad',
            content: 'Mira lo que otros han creado. Haz clic en cualquier obra para usarla como base y crear tu propia versión (Remix).'
          },
          {
            targetId: 'tour-filters',
            title: 'Encuentra tu próximo desafío',
            content: '¿Buscas algo específico? Filtra por categoría o nivel de dificultad para encontrar el lienzo perfecto.'
          },
          {
            targetId: 'tour-templates',
            title: 'Plantillas Originales',
            content: 'O si prefieres, empieza desde cero con uno de nuestros diseños exclusivos cuidadosamente seleccionados.'
          }
        ]}
      />
    </div>
  );
};

export default ScreenHome;
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { supabase, SvgTemplate } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import Logo from '../components/Logo';
import '../src/styles/minimal.css';

const MinimalAdminHeader: React.FC = () => {
  const { user, signOut } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

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
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
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

        <nav style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Theme toggle for admin too */}
          <button
            onClick={toggleTheme}
            className="minimal-button-secondary"
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

          <button
            onClick={() => navigate('/')}
            className="desktop-only minimal-button-secondary"
            style={{ alignItems: 'center', gap: '8px' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>home</span>
            <span>Inicio</span>
          </button>

          <button
            onClick={() => navigate('/gallery')}
            className="desktop-only minimal-button-secondary"
            style={{ alignItems: 'center', gap: '8px' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>photo_library</span>
            <span>Mis Obras</span>
          </button>

          <button
            onClick={() => signOut()}
            className="desktop-only minimal-button-secondary"
            style={{ alignItems: 'center', gap: '8px' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>logout</span>
            <span>Salir</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

const ScreenAdmin: React.FC = () => {
  const { isAdmin, user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<SvgTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    svgContent: '',
    shadowContent: '',
    difficulty: 'Intermedio' as 'Principiante' | 'Intermedio' | 'Avanzado',
    category: 'Mandala',
    backgroundColor: '#ffffff',
  });
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'artworks' | 'users' | 'settings'>('dashboard');
  const [stats, setStats] = useState({ templates: 0, users: 0, creations: 0 });
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [difficulties, setDifficulties] = useState<any[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [editingUser, setEditingUser] = useState<any | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Templates
      const { data: tData } = await supabase.from('svg_templates').select('*').order('created_at', { ascending: false });
      setTemplates(tData || []);

      // 2. Stats
      const { count: tCount } = await supabase.from('svg_templates').select('*', { count: 'exact', head: true });
      const { count: uCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { count: cCount } = await supabase.from('user_creations').select('*', { count: 'exact', head: true });
      setStats({ templates: tCount || 0, users: uCount || 0, creations: cCount || 0 });

      // 3. User lists
      const { data: uData } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      setAllUsers(uData || []);

      // 4. Categories & Difficulties
      const { data: catData } = await supabase.from('app_categories').select('*').order('name');
      setCategories(catData || []);
      const { data: diffData } = await supabase.from('app_difficulties').select('*').order('order');
      setDifficulties(diffData || []);

    } catch (error: any) {
      console.error('Error loading data:', error);
      setMessage('Error al cargar datos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoading) return; // Wait for auth to load before checking permissions

    if (!isAdmin) {
      navigate('/');
      return;
    }
    loadData();
  }, [isAdmin, navigate, isLoading]);

  const loadTemplates = async () => {
    const { data } = await supabase.from('svg_templates').select('*').order('created_at', { ascending: false });
    setTemplates(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setMessage('');

    try {
      const sanitizedSvg = DOMPurify.sanitize(formData.svgContent, {
        USE_PROFILES: { svg: true, svgFilters: true },
        ADD_TAGS: ['use'],
        ADD_ATTR: ['target', 'xlink:href']
      });

      if (!sanitizedSvg || sanitizedSvg.trim() === '') {
        throw new Error('El contenido SVG no es válido o contiene código malicioso');
      }

      let sanitizedShadow = '';
      if (formData.shadowContent && formData.shadowContent.trim() !== '') {
        sanitizedShadow = DOMPurify.sanitize(formData.shadowContent, {
          USE_PROFILES: { svg: true, svgFilters: true },
          ADD_TAGS: ['use'],
          ADD_ATTR: ['target', 'xlink:href']
        });
      }

      if (editingId) {
        const { error } = await supabase
          .from('svg_templates')
          .update({
            title: formData.title,
            description: formData.description,
            svg_content: sanitizedSvg,
            shadow_content: sanitizedShadow || null,
            difficulty: formData.difficulty,
            category: formData.category,
            background_color: formData.backgroundColor,
          })
          .eq('id', editingId);

        if (error) throw error;
        setMessage('¡Plantilla actualizada exitosamente!');
      } else {
        const { error } = await supabase.from('svg_templates').insert({
          title: formData.title,
          description: formData.description,
          svg_content: sanitizedSvg,
          shadow_content: sanitizedShadow || null,
          difficulty: formData.difficulty,
          category: formData.category,
          background_color: formData.backgroundColor,
          created_by: user?.id,
          is_active: true,
        });

        if (error) throw error;
        setMessage('¡Plantilla subida exitosamente!');
      }

      setFormData({ title: '', description: '', svgContent: '', shadowContent: '', difficulty: 'Intermedio', category: 'Mandala', backgroundColor: '#ffffff' });
      setEditingId(null);
      await loadTemplates();
    } catch (error: any) {
      setMessage(`Error al ${editingId ? 'actualizar' : 'subir'} plantilla: ` + error.message);
    } finally {
      setUploading(false);
    }
  };

  const toggleTemplateStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('svg_templates')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      await loadTemplates();
    } catch (error: any) {
      setMessage('Error al actualizar estado: ' + error.message);
    }
  };

  const deleteTemplate = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta plantilla?')) return;

    try {
      const { error } = await supabase
        .from('svg_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setMessage('Plantilla eliminada exitosamente');
      await loadTemplates();
    } catch (error: any) {
      setMessage('Error al eliminar: ' + error.message);
    }
  };

  const handleEdit = (template: SvgTemplate) => {
    setFormData({
      title: template.title,
      description: template.description || '',
      svgContent: template.svg_content,
      shadowContent: template.shadow_content || '',
      difficulty: template.difficulty,
      category: template.category,
      backgroundColor: template.background_color || '#ffffff',
    });
    setEditingId(template.id);
    setMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setFormData({ title: '', description: '', svgContent: '', shadowContent: '', difficulty: 'Intermedio', category: 'Mandala', backgroundColor: '#ffffff' });
    setEditingId(null);
    setMessage('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.svg')) {
      setMessage('Error: Solo se permiten archivos .svg');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setFormData({ ...formData, svgContent: content });
      setMessage('');
    };
    reader.onerror = () => {
      setMessage('Error al leer el archivo');
    };
    reader.readAsText(file);
  };

  const handleShadowUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.svg')) {
      setMessage('Error: Solo se permiten archivos .svg para sombras');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setFormData({ ...formData, shadowContent: content });
      setMessage('');
    };
    reader.onerror = () => {
      setMessage('Error al leer el archivo de sombras');
    };
    reader.readAsText(file);
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '48px', animation: 'spin 2s linear infinite' }}>sync</span>
          <span className="text-h3">Validando accesos...</span>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg-secondary)',
      fontFamily: 'var(--font-primary)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <MinimalAdminHeader />

      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        {/* Sidebar */}
        <aside style={{
          width: '240px',
          background: 'var(--color-bg-primary)',
          borderRight: '1px solid var(--color-border-light)',
          padding: '24px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          position: 'sticky',
          top: '80px',
          height: 'calc(100vh - 80px)',
          overflowY: 'auto'
        }} className="hidden-mobile">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={activeTab === 'dashboard' ? 'minimal-button-primary' : 'minimal-button-secondary'}
            style={{ width: '100%', justifyContent: 'flex-start', gap: '12px' }}
          >
            <span className="material-symbols-outlined">dashboard</span>
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('artworks')}
            className={activeTab === 'artworks' ? 'minimal-button-primary' : 'minimal-button-secondary'}
            style={{ width: '100%', justifyContent: 'flex-start', gap: '12px' }}
          >
            <span className="material-symbols-outlined">palette</span>
            Obras (Plantillas)
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={activeTab === 'users' ? 'minimal-button-primary' : 'minimal-button-secondary'}
            style={{ width: '100%', justifyContent: 'flex-start', gap: '12px' }}
          >
            <span className="material-symbols-outlined">group</span>
            Usuarios
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={activeTab === 'settings' ? 'minimal-button-primary' : 'minimal-button-secondary'}
            style={{ width: '100%', justifyContent: 'flex-start', gap: '12px' }}
          >
            <span className="material-symbols-outlined">settings</span>
            Configuración
          </button>
        </aside>

        {/* Mobile Navigation (Floating Icons) */}
        <div className="mobile-only" style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--color-bg-primary)',
          padding: '8px 16px',
          borderRadius: '100px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          display: 'flex',
          gap: '16px',
          zIndex: 100,
          border: '1px solid var(--color-border)'
        }}>
          <button
            onClick={() => setActiveTab('dashboard')}
            style={{ background: 'none', border: 'none', color: activeTab === 'dashboard' ? 'var(--color-accent-primary)' : 'var(--color-text-tertiary)', padding: '8px' }}
          >
            <span className="material-symbols-outlined">dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('artworks')}
            style={{ background: 'none', border: 'none', color: activeTab === 'artworks' ? 'var(--color-accent-primary)' : 'var(--color-text-tertiary)', padding: '8px' }}
          >
            <span className="material-symbols-outlined">palette</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            style={{ background: 'none', border: 'none', color: activeTab === 'users' ? 'var(--color-accent-primary)' : 'var(--color-text-tertiary)', padding: '8px' }}
          >
            <span className="material-symbols-outlined">group</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            style={{ background: 'none', border: 'none', color: activeTab === 'settings' ? 'var(--color-accent-primary)' : 'var(--color-text-tertiary)', padding: '8px' }}
          >
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>

        {/* Content Area */}
        <main style={{ flex: 1, padding: '24px 32px' }}>

          {/* Dashboard View */}
          {activeTab === 'dashboard' && (
            <div style={{ maxWidth: '1200px' }}>
              <h2 className="text-h2" style={{ marginBottom: '32px' }}>Panel de Control</h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px'
              }}>
                <div className="minimal-card" style={{ padding: '32px', textAlign: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--color-accent-primary)', marginBottom: '16px' }}>palette</span>
                  <div style={{ fontSize: '36px', fontWeight: 800, marginBottom: '4px', color: 'var(--color-text-primary)' }}>{stats.templates}</div>
                  <div className="text-body" style={{ color: 'var(--color-text-secondary)' }}>Plantillas Base</div>
                </div>
                <div className="minimal-card" style={{ padding: '32px', textAlign: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#10B981', marginBottom: '16px' }}>brush</span>
                  <div style={{ fontSize: '36px', fontWeight: 800, marginBottom: '4px', color: 'var(--color-text-primary)' }}>{stats.creations}</div>
                  <div className="text-body" style={{ color: 'var(--color-text-secondary)' }}>Obras Coloreadas</div>
                </div>
                <div className="minimal-card" style={{ padding: '32px', textAlign: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#6366F1', marginBottom: '16px' }}>group</span>
                  <div style={{ fontSize: '36px', fontWeight: 800, marginBottom: '4px', color: 'var(--color-text-primary)' }}>{stats.users}</div>
                  <div className="text-body" style={{ color: 'var(--color-text-secondary)' }}>Usuarios Registrados</div>
                </div>
              </div>

              <div className="minimal-card" style={{ marginTop: '32px', padding: '32px' }}>
                <h3 className="text-h3" style={{ marginBottom: '16px' }}>Acciones Rápidas</h3>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <button onClick={() => setActiveTab('artworks')} className="minimal-button-primary" style={{ gap: '8px' }}>
                    <span className="material-symbols-outlined">add</span> Subir Nueva Plantilla
                  </button>
                  <button onClick={() => setActiveTab('users')} className="minimal-button-secondary" style={{ gap: '8px' }}>
                    <span className="material-symbols-outlined">manage_accounts</span> Administrar Usuarios
                  </button>
                  <button onClick={() => setActiveTab('settings')} className="minimal-button-secondary" style={{ gap: '8px' }}>
                    <span className="material-symbols-outlined">category</span> Ajustar Categorías
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Artworks View */}
          {activeTab === 'artworks' && (
            <div style={{ maxWidth: '1400px' }}>
              <section className="minimal-card" style={{ marginBottom: '48px', padding: '32px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '32px'
                }}>
                  <h2 className="text-h2" style={{ margin: 0 }}>
                    {editingId ? 'Editar Plantilla' : 'Nueva Plantilla'}
                  </h2>
                  {editingId && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="minimal-button-secondary"
                      style={{ background: '#FEF3C7', color: '#92400E', borderColor: '#FCD34D' }}
                    >
                      Cancelar Edición
                    </button>
                  )}
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Title */}
                  <div>
                    <label htmlFor="title" className="text-small" style={{
                      display: 'block',
                      fontWeight: 600,
                      marginBottom: '8px',
                      color: 'var(--color-text-primary)'
                    }}>
                      Título *
                    </label>
                    <input
                      id="title"
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      placeholder="Mandala de Flores"
                      disabled={uploading}
                      className="minimal-input"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="text-small" style={{
                      display: 'block',
                      fontWeight: 600,
                      marginBottom: '8px',
                      color: 'var(--color-text-primary)'
                    }}>
                      Descripción
                    </label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Una hermosa mandala con patrones florales"
                      disabled={uploading}
                      rows={3}
                      className="minimal-input"
                      style={{ resize: 'vertical', minHeight: '80px' }}
                    />
                  </div>

                  {/* Difficulty & Category Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <div>
                      <label htmlFor="difficulty" className="text-small" style={{
                        display: 'block',
                        fontWeight: 600,
                        marginBottom: '8px',
                        color: 'var(--color-text-primary)'
                      }}>
                        Dificultad *
                      </label>
                      <select
                        id="difficulty"
                        value={formData.difficulty}
                        onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                        required
                        disabled={uploading}
                        className="minimal-input"
                      >
                        {difficulties.map(diff => (
                          <option key={diff.id} value={diff.name}>{diff.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="category" className="text-small" style={{
                        display: 'block',
                        fontWeight: 600,
                        marginBottom: '8px',
                        color: 'var(--color-text-primary)'
                      }}>
                        Categoría
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {!isAddingCategory ? (
                          <>
                            <select
                              id="category"
                              value={formData.category}
                              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                              disabled={uploading}
                              className="minimal-input"
                              style={{ flex: 1 }}
                            >
                              <option value="">Seleccionar...</option>
                              {categories.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() => setIsAddingCategory(true)}
                              className="minimal-button-secondary"
                              style={{ padding: '0 12px' }}
                              title="Nueva Categoría"
                            >
                              <span className="material-symbols-outlined">add</span>
                            </button>
                          </>
                        ) : (
                          <>
                            <input
                              type="text"
                              value={newCatName}
                              onChange={(e) => setNewCatName(e.target.value)}
                              placeholder="Nombre de nueva categoría"
                              className="minimal-input"
                              style={{ flex: 1 }}
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={async () => {
                                if (!newCatName.trim()) {
                                  setIsAddingCategory(false);
                                  return;
                                }
                                try {
                                  const { data, error } = await supabase.from('app_categories').insert({ name: newCatName.trim() }).select().single();
                                  if (error) throw error;
                                  setCategories([...categories, data].sort((a, b) => a.name.localeCompare(b.name)));
                                  setFormData({ ...formData, category: data.name });
                                  setNewCatName('');
                                  setIsAddingCategory(false);
                                } catch (err: any) {
                                  alert('Error al crear categoría: ' + err.message);
                                }
                              }}
                              className="minimal-button-primary"
                              style={{ padding: '0 12px' }}
                            >
                              <span className="material-symbols-outlined">check</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsAddingCategory(false);
                                setNewCatName('');
                              }}
                              className="minimal-button-secondary"
                              style={{ padding: '0 12px' }}
                            >
                              <span className="material-symbols-outlined">close</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Background Color */}
                  <div>
                    <label htmlFor="backgroundColor" className="text-small" style={{
                      display: 'block',
                      fontWeight: 600,
                      marginBottom: '8px',
                      color: 'var(--color-text-primary)'
                    }}>
                      Color de Fondo (Preview)
                    </label>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <input
                        id="backgroundColor"
                        type="color"
                        value={formData.backgroundColor}
                        onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                        disabled={uploading}
                        style={{
                          width: '80px',
                          height: '44px',
                          borderRadius: 'var(--radius-md)',
                          border: '2px solid var(--color-border)',
                          cursor: 'pointer'
                        }}
                      />
                      <input
                        type="text"
                        value={formData.backgroundColor}
                        onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                        placeholder="#ffffff"
                        disabled={uploading}
                        className="minimal-input"
                        style={{ flex: 1 }}
                      />
                    </div>
                    <p className="text-tiny" style={{
                      color: 'var(--color-text-tertiary)',
                      marginTop: '4px'
                    }}>
                      Color de fondo para la vista previa en las tarjetas
                    </p>
                  </div>

                  {/* SECCION CAPA BASE (ARCHIVO A) */}
                  <div style={{ padding: '24px', background: 'var(--color-bg-primary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                      <span className="material-symbols-outlined" style={{ color: 'var(--color-accent-primary)' }}>image</span>
                      <h3 className="text-h2" style={{ margin: 0, fontSize: '20px' }}>Capa Base (Archivo A) *</h3>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <input
                        id="svgFile"
                        type="file"
                        accept=".svg"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        style={{ display: 'none' }}
                      />
                      <label
                        htmlFor="svgFile"
                        className="minimal-button-primary"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '12px',
                          cursor: 'pointer',
                          width: '100%',
                          justifyContent: 'center',
                          padding: '14px'
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>upload_file</span>
                        <span style={{ fontSize: '16px', fontWeight: 600 }}>
                          {formData.svgContent ? 'CAMBIAR ARCHIVO BASE (.SVG)' : 'SUBIR ARCHIVO BASE (.SVG)'}
                        </span>
                      </label>
                    </div>

                    <label htmlFor="svgContent" className="text-small" style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>
                      Código SVG Base (Para control manual)
                    </label>
                    <textarea
                      id="svgContent"
                      value={formData.svgContent}
                      onChange={(e) => setFormData({ ...formData, svgContent: e.target.value })}
                      required
                      placeholder='El código aparecerá aquí al seleccionar el archivo...'
                      disabled={uploading}
                      rows={5}
                      className="minimal-input"
                      style={{ resize: 'vertical', fontFamily: 'monospace', fontSize: '12px', background: 'var(--color-bg-tertiary)' }}
                    />
                  </div>

                  {/* SECCION CAPA SOMBRAS (ARCHIVO B) */}
                  <div style={{ padding: '24px', background: 'var(--color-bg-primary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                      <span className="material-symbols-outlined" style={{ color: 'var(--color-accent-primary)' }}>layers</span>
                      <h3 className="text-h2" style={{ margin: 0, fontSize: '20px' }}>Capa de Sombras (Archivo B)</h3>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <input
                        id="shadowFile"
                        type="file"
                        accept=".svg"
                        onChange={handleShadowUpload}
                        disabled={uploading}
                        style={{ display: 'none' }}
                      />
                      <label
                        htmlFor="shadowFile"
                        className="minimal-button-primary"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '12px',
                          cursor: 'pointer',
                          width: '100%',
                          justifyContent: 'center',
                          padding: '14px',
                          background: '#1A535C',
                          borderColor: '#1A535C'
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>layers</span>
                        <span style={{ fontSize: '16px', fontWeight: 600 }}>
                          {formData.shadowContent ? 'CAMBIAR ARCHIVO DE SOMBRAS (.SVG)' : 'SUBIR ARCHIVO DE SOMBRAS (.SVG)'}
                        </span>
                      </label>
                    </div>

                    <label htmlFor="shadowContent" className="text-small" style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>
                      Código SVG Sombras (Opcional)
                    </label>
                    <textarea
                      id="shadowContent"
                      value={formData.shadowContent}
                      onChange={(e) => setFormData({ ...formData, shadowContent: e.target.value })}
                      placeholder='Los detalles de sombras aparecerán aquí al subir...'
                      disabled={uploading}
                      rows={5}
                      className="minimal-input"
                      style={{ resize: 'vertical', fontFamily: 'monospace', fontSize: '12px', background: 'var(--color-bg-tertiary)' }}
                    />
                  </div>

                  {/* SVG Preview Combined */}
                  {formData.svgContent && (
                    <div style={{
                      padding: '24px',
                      background: 'var(--color-bg-tertiary)',
                      borderRadius: 'var(--radius-md)',
                      border: '2px dashed var(--color-border)'
                    }}>
                      <h3 className="text-h3" style={{
                        margin: '0 0 16px 0',
                        color: 'var(--color-text-secondary)'
                      }}>
                        Vista Previa {formData.shadowContent ? '(Combinada)' : ''}
                      </h3>
                      <div
                        style={{
                          maxWidth: '100%',
                          display: 'flex',
                          justifyContent: 'center',
                          position: 'relative',
                          aspectRatio: '1/1',
                          maxHeight: '400px'
                        }}
                      >
                        <div
                          dangerouslySetInnerHTML={{ __html: formData.svgContent }}
                          style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        />
                        {formData.shadowContent && (
                          <div
                            className="svg-shadow-overlay"
                            dangerouslySetInnerHTML={{ __html: formData.shadowContent }}
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              pointerEvents: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Message */}
                  {message && (
                    <div style={{
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '14px',
                      fontWeight: 500,
                      background: message.includes('Error') ? '#FEE2E2' : '#D1FAE5',
                      color: message.includes('Error') ? '#991B1B' : '#065F46',
                      border: `1px solid ${message.includes('Error') ? '#FCA5A5' : '#6EE7B7'}`
                    }}>
                      {message}
                    </div>
                  )}

                  <button type="submit" className="minimal-button-primary" disabled={uploading} style={{ width: '100%' }}>
                    {uploading ? (editingId ? 'Actualizando...' : 'Subiendo...') : (editingId ? 'Actualizar Plantilla' : 'Subir Plantilla')}
                  </button>
                </form>
              </section>

              {/* Templates List */}
              <section>
                <div style={{ marginBottom: '24px' }}>
                  <h2 className="text-h2" style={{ margin: 0 }}>
                    Plantillas Existentes ({templates.length})
                  </h2>
                </div>

                {loading ? (
                  <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--color-text-secondary)' }}>Cargando...</div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '24px'
                  }}>
                    {templates.map((template) => (
                      <div key={template.id} className="minimal-card" style={{ padding: 0, overflow: 'hidden' }}>
                        <div style={{ background: 'var(--color-bg-tertiary)', padding: '24px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div dangerouslySetInnerHTML={{ __html: template.svg_content }} style={{ maxWidth: '100%', maxHeight: '100%' }} />
                        </div>
                        <div style={{ padding: '16px' }}>
                          <h3 className="text-h3" style={{ margin: '0 0 8px 0', fontSize: '16px' }}>{template.title}</h3>
                          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                            <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '4px', background: 'var(--color-bg-secondary)' }}>{template.category}</span>
                            <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '4px', background: '#E0E7FF' }}>{template.difficulty}</span>
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => handleEdit(template)} className="minimal-button-secondary" style={{ flex: 1, padding: '8px 4px', fontSize: '13px' }}>Editar</button>
                            <button onClick={() => toggleTemplateStatus(template.id, template.is_active)} className="minimal-button-secondary" style={{ flex: 1, padding: '8px 4px', fontSize: '13px' }}>{template.is_active ? 'Desactivar' : 'Activar'}</button>
                            <button onClick={() => deleteTemplate(template.id)} className="minimal-button-secondary" style={{ flex: '0 0 40px', padding: '8px 4px', color: '#EF4444' }}>
                              <span className="material-symbols-outlined">delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}

          {/* Users View */}
          {activeTab === 'users' && (
            <div style={{ maxWidth: '1200px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 className="text-h2" style={{ margin: 0 }}>Gestión de Usuarios</h2>
                <div style={{ position: 'relative', width: '300px' }}>
                  <span className="material-symbols-outlined" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)', fontSize: '20px' }}>search</span>
                  <input
                    type="text"
                    placeholder="Buscar por email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="minimal-input"
                    style={{ paddingLeft: '40px' }}
                  />
                </div>
              </div>

              {editingUser && (
                <div className="minimal-card" style={{ marginBottom: '24px', padding: '24px', borderLeft: '4px solid var(--color-accent-primary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h3 className="text-h3" style={{ margin: 0 }}>Editar Usuario: {editingUser.email}</h3>
                    <button onClick={() => setEditingUser(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                    <div style={{ minWidth: '200px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Rol</label>
                      <select
                        value={editingUser.role}
                        onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                        className="minimal-input"
                      >
                        <option value="user">Usuario (Normal)</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '20px' }}>
                      <input
                        type="checkbox"
                        id="user-active-toggle"
                        checked={editingUser.is_active !== false}
                        onChange={(e) => setEditingUser({ ...editingUser, is_active: e.target.checked })}
                        style={{ width: '20px', height: '20px' }}
                      />
                      <label htmlFor="user-active-toggle" style={{ fontWeight: 600 }}>Usuario Activo</label>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', flex: 1 }}>
                      <button
                        className="minimal-button-primary"
                        style={{ width: '100%', padding: '10px' }}
                        onClick={async () => {
                          const { error } = await supabase.from('profiles').update({
                            role: editingUser.role,
                            is_active: editingUser.is_active
                          }).eq('id', editingUser.id);

                          if (error) alert(error.message);
                          else {
                            setEditingUser(null);
                            await loadData();
                            setMessage('Usuario actualizado correctamente');
                          }
                        }}
                      >
                        Guardar Cambios
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="minimal-card" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--color-border)' }}>
                      <th style={{ padding: '16px' }}>Email</th>
                      <th style={{ padding: '16px' }}>Rol</th>
                      <th style={{ padding: '16px' }}>Estado</th>
                      <th style={{ padding: '16px' }}>Fecha Registro</th>
                      <th style={{ padding: '16px', textAlign: 'right' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers
                      .filter(u => u.email.toLowerCase().includes(userSearch.toLowerCase()))
                      .map(u => (
                        <tr key={u.id} style={{ borderBottom: '1px solid var(--color-border)', opacity: u.is_active === false ? 0.6 : 1 }}>
                          <td style={{ padding: '16px' }}>{u.email}</td>
                          <td style={{ padding: '16px' }}>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '100px',
                              fontSize: '11px',
                              fontWeight: 700,
                              background: u.role === 'admin' ? '#FEE2E2' : '#E0E7FF',
                              color: u.role === 'admin' ? '#991B1B' : '#4338CA',
                              letterSpacing: '0.5px'
                            }}>
                              {u.role?.toUpperCase() || 'USER'}
                            </span>
                          </td>
                          <td style={{ padding: '16px' }}>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '100px',
                              fontSize: '11px',
                              fontWeight: 700,
                              background: u.is_active !== false ? '#D1FAE5' : '#F3F4F6',
                              color: u.is_active !== false ? '#065F46' : '#6B7280'
                            }}>
                              {u.is_active !== false ? 'ACTIVO' : 'INACTIVO'}
                            </span>
                          </td>
                          <td style={{ padding: '16px', color: 'var(--color-text-tertiary)', fontSize: '13px' }}>
                            {new Date(u.created_at).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '16px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                              <button
                                className="minimal-button-secondary"
                                style={{ fontSize: '12px', padding: '6px 12px', height: 'auto' }}
                                onClick={() => setEditingUser(u)}
                              >
                                Editar
                              </button>
                              <button
                                className="minimal-button-secondary"
                                style={{
                                  fontSize: '12px',
                                  padding: '6px 12px',
                                  height: 'auto',
                                  color: u.is_active !== false ? '#DC2626' : '#059669',
                                  borderColor: u.is_active !== false ? '#FCA5A5' : '#6EE7B7'
                                }}
                                onClick={async () => {
                                  const { error } = await supabase.from('profiles').update({ is_active: !(u.is_active !== false) }).eq('id', u.id);
                                  if (error) alert(error.message);
                                  else await loadData();
                                }}
                              >
                                {u.is_active !== false ? 'Desactivar' : 'Activar'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Settings View */}
          {activeTab === 'settings' && (
            <div style={{ maxWidth: '1200px' }}>
              <h2 className="text-h2" style={{ marginBottom: '24px' }}>Configuración del Sistema</h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>
                {/* Categories Management */}
                <div className="minimal-card" style={{ padding: '32px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h3 className="text-h3" style={{ margin: 0 }}>Categorías</h3>
                    <button
                      className="minimal-button-primary"
                      style={{ padding: '8px 16px', fontSize: '13px' }}
                      onClick={() => {
                        const name = prompt('Nombre de la nueva categoría:');
                        if (name) {
                          supabase.from('app_categories').insert({ name }).then(() => loadData());
                        }
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span> Nueva
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    {categories.map(cat => (
                      <div key={cat.id} style={{
                        padding: '8px 16px',
                        background: 'var(--color-bg-secondary)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '100px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <span>{cat.name}</span>
                        <button
                          onClick={() => {
                            if (confirm('¿Eliminar categoría?'))
                              supabase.from('app_categories').delete().eq('id', cat.id).then(() => loadData());
                          }}
                          style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: 0, display: 'flex' }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Difficulties Management */}
                <div className="minimal-card" style={{ padding: '32px', opacity: 0.7 }}>
                  <h3 className="text-h3" style={{ marginBottom: '16px' }}>Niveles de Dificultad</h3>
                  <p className="text-small" style={{ marginBottom: '20px' }}>Los niveles están predefinidos para asegurar la consistencia visual del sistema.</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {difficulties.map(diff => (
                      <div key={diff.id} style={{
                        padding: '12px 16px',
                        background: 'var(--color-bg-secondary)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: diff.color }}></div>
                          <span style={{ fontWeight: 600 }}>{diff.label}</span>
                        </div>
                        <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>Orden: {diff.order}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default ScreenAdmin;

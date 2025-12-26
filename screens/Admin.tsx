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
  const { isAdmin, user } = useAuth();
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

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    loadTemplates();
  }, [isAdmin, navigate]);

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('svg_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error: any) {
      console.error('Error loading templates:', error);
      setMessage('Error al cargar plantillas: ' + error.message);
    } finally {
      setLoading(false);
    }
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

  if (!isAdmin) {
    return null;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg-secondary)',
      fontFamily: 'var(--font-primary)'
    }}>
      <MinimalAdminHeader />

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px 16px' }}>
        {/* Upload Form */}
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
                  <option value="Principiante">Principiante</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
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
                <input
                  id="category"
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Mandala"
                  disabled={uploading}
                  className="minimal-input"
                />
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
            <div style={{ padding: '24px', background: 'var(--color-bg-primary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', marginBottom: '24px' }}>
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
            </div>

            <div style={{ padding: '24px', background: 'var(--color-bg-primary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', marginBottom: '24px', marginTop: '-24px' }}>
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
            <div style={{ padding: '24px', background: 'var(--color-bg-primary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', marginBottom: '24px' }}>
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

              <div>
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

            {/* Submit Button */}
            <button
              type="submit"
              className="minimal-button-primary"
              disabled={uploading}
              style={{ width: '100%' }}
            >
              {uploading ? (
                editingId ? 'Actualizando...' : 'Subiendo...'
              ) : (
                editingId ? 'Actualizar Plantilla' : 'Subir Plantilla'
              )}
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
            <div style={{
              textAlign: 'center',
              padding: '80px 0',
              color: 'var(--color-text-secondary)'
            }}>
              Cargando plantillas...
            </div>
          ) : templates.length === 0 ? (
            <div className="minimal-card" style={{
              textAlign: 'center',
              padding: '80px 24px'
            }}>
              <p className="text-body" style={{ color: 'var(--color-text-secondary)' }}>
                No hay plantillas aún
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '24px'
            }}>
              {templates.map((template) => (
                <div key={template.id} className="minimal-card" style={{ padding: 0, overflow: 'hidden' }}>
                  {/* Preview */}
                  <div style={{
                    background: 'var(--color-bg-tertiary)',
                    padding: '24px',
                    height: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div
                      dangerouslySetInnerHTML={{ __html: template.svg_content }}
                      style={{ maxWidth: '100%', maxHeight: '100%' }}
                    />
                  </div>

                  {/* Info */}
                  <div style={{ padding: '16px' }}>
                    <h3 className="text-h3" style={{
                      margin: '0 0 8px 0',
                      fontSize: '16px',
                      fontWeight: 600
                    }}>
                      {template.title}
                    </h3>
                    {template.description && (
                      <p className="text-small" style={{
                        margin: '0 0 12px 0',
                        color: 'var(--color-text-secondary)',
                        lineHeight: 1.4
                      }}>
                        {template.description}
                      </p>
                    )}

                    {/* Meta */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '12px',
                      fontSize: '13px',
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: 'var(--radius-md)',
                          fontWeight: 600,
                          background: template.is_active ? '#D1FAE5' : '#FEE2E2',
                          color: template.is_active ? '#065F46' : '#991B1B'
                        }}>
                          {template.is_active ? 'Activa' : 'Inactiva'}
                        </span>
                        {template.shadow_content && (
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: 600,
                            background: '#E0E7FF',
                            color: '#4338CA'
                          }}>
                            Sombras
                          </span>
                        )}
                      </div>
                      <span style={{ color: 'var(--color-text-tertiary)' }}>
                        {new Date(template.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleEdit(template)}
                        className="minimal-button-secondary"
                        style={{
                          flex: 1,
                          fontSize: '13px',
                          padding: '8px',
                          background: '#ECFDF5',
                          color: '#047857',
                          borderColor: '#6EE7B7'
                        }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => toggleTemplateStatus(template.id, template.is_active)}
                        className="minimal-button-secondary"
                        style={{
                          flex: 1,
                          fontSize: '13px',
                          padding: '8px'
                        }}
                      >
                        {template.is_active ? 'Desactivar' : 'Activar'}
                      </button>
                      <button
                        onClick={() => deleteTemplate(template.id)}
                        className="minimal-button-secondary"
                        style={{
                          flex: 1,
                          fontSize: '13px',
                          padding: '8px',
                          background: '#FEE2E2',
                          color: '#DC2626',
                          borderColor: '#FCA5A5'
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div >
  );
};

export default ScreenAdmin;

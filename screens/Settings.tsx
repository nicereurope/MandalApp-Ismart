import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Logo from '../components/Logo';
import '../src/styles/minimal.css';

const ScreenSettings: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useTheme();

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
          maxWidth: '800px',
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
              Configuración
            </h1>
          </Link>

          <button
            onClick={() => navigate(-1)}
            className="minimal-button-secondary"
            aria-label="Cerrar"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 className="text-hero" style={{
            marginBottom: '12px',
            color: 'var(--color-text-primary)'
          }}>
            Personaliza tu <span style={{ color: 'var(--color-accent-primary)' }}>Experiencia</span>
          </h2>
          <p className="text-body" style={{
            color: 'var(--color-text-secondary)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Ajusta la aplicación a tus preferencias para una mejor experiencia
          </p>
        </div>

        {/* Theme Section */}
        <section className="minimal-card" style={{ padding: '32px', marginBottom: '24px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className="material-symbols-outlined" style={{
                fontSize: '28px',
                color: 'var(--color-accent-primary)'
              }}>
                palette
              </span>
              <h3 className="text-h2" style={{ margin: 0 }}>
                Tema de Color
              </h3>
            </div>
            <span style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--color-text-secondary)',
              background: 'var(--color-bg-tertiary)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)'
            }}>
              Reduce la fatiga visual
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            {/* Light Mode */}
            <label style={{ cursor: 'pointer', position: 'relative' }}>
              <input
                type="radio"
                name="theme"
                value="light"
                checked={!darkMode}
                onChange={() => setDarkMode(false)}
                style={{
                  position: 'absolute',
                  opacity: 0,
                  width: 0,
                  height: 0
                }}
              />
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                height: '140px',
                borderRadius: 'var(--radius-lg)',
                border: !darkMode ? '2px solid var(--color-accent-primary)' : '2px solid var(--color-border)',
                background: !darkMode ? 'var(--color-bg-primary)' : 'var(--color-bg-tertiary)',
                boxShadow: !darkMode ? 'var(--shadow-md)' : 'none',
                transition: 'all 0.2s',
                color: !darkMode ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)'
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '40px' }}>
                  light_mode
                </span>
                <span style={{ fontSize: '16px', fontWeight: 600 }}>
                  Claro
                </span>
                {!darkMode && (
                  <span className="material-symbols-outlined" style={{
                    fontSize: '20px',
                    color: 'var(--color-accent-primary)'
                  }}>
                    check_circle
                  </span>
                )}
              </div>
            </label>

            {/* Dark Mode */}
            <label style={{ cursor: 'pointer', position: 'relative' }}>
              <input
                type="radio"
                name="theme"
                value="dark"
                checked={darkMode}
                onChange={() => setDarkMode(true)}
                style={{
                  position: 'absolute',
                  opacity: 0,
                  width: 0,
                  height: 0
                }}
              />
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                height: '140px',
                borderRadius: 'var(--radius-lg)',
                border: darkMode ? '2px solid var(--color-accent-primary)' : '2px solid var(--color-border)',
                background: darkMode ? 'var(--color-bg-primary)' : 'var(--color-bg-tertiary)',
                boxShadow: darkMode ? 'var(--shadow-md)' : 'none',
                transition: 'all 0.2s',
                color: darkMode ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)'
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '40px' }}>
                  dark_mode
                </span>
                <span style={{ fontSize: '16px', fontWeight: 600 }}>
                  Oscuro
                </span>
                {darkMode && (
                  <span className="material-symbols-outlined" style={{
                    fontSize: '20px',
                    color: 'var(--color-accent-primary)'
                  }}>
                    check_circle
                  </span>
                )}
              </div>
            </label>
          </div>
        </section>

        {/* Reset Button */}
        <div style={{ textAlign: 'center', paddingTop: '24px' }}>
          <button
            onClick={() => setDarkMode(false)}
            className="minimal-button-secondary"
            style={{ minWidth: '250px' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>refresh</span>
            <span>Restablecer valores</span>
          </button>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '48px',
          paddingTop: '24px',
          borderTop: '1px solid var(--color-border)'
        }}>
          <p className="text-tiny" style={{
            color: 'var(--color-text-tertiary)',
            margin: 0
          }}>
            © 2024 Ismael Gudiño. Art Therapy.
          </p>
        </div>
      </main>
    </div>
  );
};

export default ScreenSettings;
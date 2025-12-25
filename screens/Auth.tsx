import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import HeartIcon from '../components/HeartIcon';
import '../styles/minimal.css';

const ScreenAuth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = isLogin
        ? await signIn(email, password)
        : await signUp(email, password);

      if (error) {
        setError(error.message);
      } else {
        if (!isLogin) {
          setError('¡Registro exitoso! Por favor verifica tu email.');
        } else {
          navigate('/');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-bg-secondary)',
      padding: '24px',
      fontFamily: 'var(--font-primary)'
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo & Back to Home */}
        <div style={{
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <HeartIcon filled={true} size={48} />
            <h1 style={{
              fontSize: '32px',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              margin: 0
            }}>
              Ismael Gudiño
            </h1>
          </Link>
        </div>

        {/* Auth Card */}
        <div className="minimal-card" style={{ padding: '48px 40px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 className="text-h1" style={{ marginBottom: '8px' }}>
              {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </h2>
            <p className="text-body" style={{ color: 'var(--color-text-secondary)' }}>
              {isLogin
                ? 'Bienvenido de vuelta'
                : 'Únete a nuestra comunidad artística'
              }
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Email */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label
                htmlFor="email"
                className="text-small"
                style={{
                  fontWeight: 600,
                  color: 'var(--color-text-primary)'
                }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
                disabled={loading}
                className="minimal-input"
              />
            </div>

            {/* Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label
                htmlFor="password"
                className="text-small"
                style={{
                  fontWeight: 600,
                  color: 'var(--color-text-primary)'
                }}
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={6}
                disabled={loading}
                className="minimal-input"
              />
            </div>

            {/* Error/Success Message */}
            {error && (
              <div style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                fontWeight: 500,
                background: error.includes('exitoso') ? '#D1FAE5' : '#FEE2E2',
                color: error.includes('exitoso') ? '#065F46' : '#991B1B',
                border: `1px solid ${error.includes('exitoso') ? '#6EE7B7' : '#FCA5A5'}`
              }}>
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="minimal-button-primary"
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>sync</span>
                  Cargando...
                </span>
              ) : (
                isLogin ? 'Iniciar Sesión' : 'Registrarse'
              )}
            </button>
          </form>

          {/* Switch Login/Register */}
          <div style={{
            textAlign: 'center',
            marginTop: '24px',
            paddingTop: '24px',
            borderTop: '1px solid var(--color-border)'
          }}>
            <p className="text-small" style={{
              margin: 0,
              color: 'var(--color-text-secondary)'
            }}>
              {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
              {' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                disabled={loading}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-accent-primary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontSize: '14px',
                  opacity: loading ? 0.6 : 1
                }}
              >
                {isLogin ? 'Regístrate' : 'Inicia sesión'}
              </button>
            </p>
          </div>

          {/* Guest Button */}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="minimal-button-secondary"
            disabled={loading}
            style={{
              width: '100%',
              marginTop: '16px'
            }}
          >
            Continuar como invitado
          </button>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '24px'
        }}>
          <p className="text-tiny" style={{
            color: 'var(--color-text-tertiary)',
            margin: 0
          }}>
            © 2024 Ismael Gudiño. Art Therapy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScreenAuth;

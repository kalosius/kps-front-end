import React, { useState, useContext } from 'react';
import { AuthContext } from '../auth/AuthProvider';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(username, password, remember);
      navigate('/dashboard');
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.response?.data?.message || err?.message || 'Invalid username or password';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ maxWidth: 960 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', alignItems: 'center', marginTop: '3.5rem' }}>
        <section className="site-card" style={{ display: 'flex', gap: '1.25rem', padding: '1.25rem' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 260 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
              <div className="brand-tile" aria-hidden>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 12h16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 4v16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="brand-text">
                <div className="brand-title">KPS</div>
                <div className="brand-sub">School Portal</div>
              </div>
            </div>

            <h2 style={{ marginTop: '1.2rem', marginBottom: '0.25rem', fontSize: '1.35rem' }}>Welcome back</h2>
            <p className="muted" style={{ marginBottom: '1rem' }}>Sign in to access the dashboard, manage students, grades and attendance.</p>

            <div style={{ marginTop: 'auto', display: 'none' }}>
              {/* optional marketing / illustration area - hidden for now to keep focus */}
            </div>
          </div>

          <div style={{ width: 420, maxWidth: '48%' }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.05rem' }}>Sign in</h3>
                <div className="small muted">Need an account? <a href="/register">Register</a></div>
              </div>

              {error && (
                <div role="alert" aria-live="assertive" style={{ background: '#fff1f0', color: '#9f3a38', padding: '0.65rem 0.75rem', borderRadius: 8, marginBottom: '0.75rem', border: '1px solid rgba(159,58,56,0.08)' }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.9rem' }}>
                <div className="form-row">
                  <label className="form-label" htmlFor="login-username">Username</label>
                  <input
                    id="login-username"
                    className="form-input"
                    placeholder="Enter username or email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    aria-label="Username"
                  />
                </div>

                <div className="form-row">
                  <label className="form-label" htmlFor="login-password">Password</label>
                  <input
                    id="login-password"
                    className="form-input"
                    type="password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    aria-label="Password"
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.35rem' }}>
                  <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', cursor: 'pointer' }}>
                    <input aria-label="Remember me" type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                    <span className="small muted">Remember me</span>
                  </label>
                  <Link className="small" to="/forgot-password">Forgot password?</Link>
                </div>

                <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.25rem' }}>
                  <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 1 }}>
                    {loading ? 'Signing in...' : 'Sign in'}
                  </button>
                  <button type="button" className="btn-ghost" onClick={() => { setUsername(''); setPassword(''); }}>
                    Clear
                  </button>
                </div>
              </form>

              <div style={{ textAlign: 'center', marginTop: '0.9rem' }}>
                <small className="muted">By signing in you agree to our <Link to="/terms">Terms</Link> and <Link to="/privacy">Privacy</Link>.</small>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

import React, { useState, useContext } from 'react';
import { AuthContext } from '../auth/AuthProvider';
import { useNavigate, Link } from 'react-router-dom';
import bg from '../assets/schoolbackground.jpg';
import logo from '../assets/Logo.png';

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
    <div className="login-page" style={{ padding: '2.5rem 1rem' }}>
      <style>{`
        /* center the card in the viewport */
        .login-page{display:flex;align-items:center;justify-content:center;min-height:100vh;background:#f7fafc}
        .login-card{display:flex;width:100%;max-width:980px;border-radius:12px;overflow:hidden;box-shadow:0 10px 30px rgba(15,23,42,0.06);} 
        .login-left{flex:1;padding:32px 36px;background:linear-gradient(180deg,#0ea5a5 0%,#06b6d4 100%);color:white;display:flex;flex-direction:column;justify-content:center;min-width:280px}
        .brand-title-large{font-weight:700;font-size:1.25rem}
        .brand-sub-small{opacity:0.9;font-size:0.95rem}
        .login-hero{margin-top:18px;font-size:1.5rem;font-weight:700}
        .login-left p{opacity:0.95;margin-top:8px;color:rgba(255,255,255,0.92)}
        .login-right{width:420px;padding:28px 28px;background:white}
        .form-input{width:100%;padding:12px 14px;border:1px solid #e6e9ee;border-radius:10px;font-size:0.95rem}
        .form-label{display:block;margin-bottom:6px;font-weight:600;color:#0f172a}
        .btn-primary{background:#0b9447;color:white;padding:12px 16px;border-radius:10px;border:none;font-weight:700}
        .btn-ghost{background:transparent;border:1px solid #e6e9ee;padding:10px 14px;border-radius:10px}
        .muted{color:#6b7280}
        @media (max-width:840px){.login-card{flex-direction:column}.login-left{display:none}.login-right{width:100%}}
      `}</style>

      <div className="login-card site-card">
        <div className="login-left" style={{backgroundImage: `linear-gradient(180deg, rgba(14,165,165,0.92) 0%, rgba(6,182,212,0.85) 100%), url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <div className="brand-tile" aria-hidden style={{width:44,height:44,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:8,background:'rgba(255,255,255,0.12)'}}>
              <img src={logo} alt="KPS" style={{width:28,height:28,objectFit:'contain'}} />
            </div>
            <div>
              <div className="brand-title-large">KPS School</div>
              <div className="brand-sub-small">Learner management</div>
            </div>
          </div>

          <div className="login-hero">Welcome back</div>
          <p className="muted" style={{maxWidth:420}}>Sign in to access the dashboard, manage students, grades and attendance. Secure and private.</p>
        </div>

        <div className="login-right">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
            <h3 style={{margin:0}}>Sign in</h3>
            <div className="small muted">Need an account? <Link to="/register">Register</Link></div>
          </div>

          {error && (
            <div role="alert" aria-live="assertive" style={{ background: '#fff1f0', color: '#9f3a38', padding: '0.65rem 0.75rem', borderRadius: 8, marginBottom: '0.75rem', border: '1px solid rgba(159,58,56,0.08)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{display:'grid',gap:12}}>
            <div>
              <label className="form-label" htmlFor="login-username">Username</label>
              <input id="login-username" className="form-input" placeholder="Enter username or email" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" aria-label="Username" />
            </div>

            <div>
              <label className="form-label" htmlFor="login-password">Password</label>
              <input id="login-password" className="form-input" type="password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" aria-label="Password" />
            </div>

            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <label style={{display:'flex',gap:10,alignItems:'center',cursor:'pointer'}}>
                <input aria-label="Remember me" type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                <span className="muted">Remember me</span>
              </label>
              <Link className="small" to="/forgot-password">Forgot password?</Link>
            </div>

            <div style={{display:'flex',gap:10}}>
              <button type="submit" className="btn-primary" disabled={loading} style={{flex:1}}>{loading ? 'Signing in...' : 'Sign in'}</button>
              <button type="button" className="btn-ghost" onClick={() => { setUsername(''); setPassword(''); }}>Clear</button>
            </div>
          </form>

          <div style={{textAlign:'center',marginTop:12}}>
            <small className="muted">By signing in you agree to our <Link to="/terms">Terms</Link> and <Link to="/privacy">Privacy</Link>.</small>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useContext } from 'react';
import { AuthContext } from '../auth/AuthProvider';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
    first_name: '',
    last_name: '',
    role: 'parent'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (key, value) => setForm((s) => ({ ...s, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});
    try {
      await register(form);
      // navigate to login so user can sign in
      navigate('/login');
    } catch (err) {
      console.error(err);
      const resp = err?.response?.data;
      // DRF validation errors are often an object mapping field -> [errors]
      if (resp && typeof resp === 'object') {
        // collect non-field errors
        const nonField = resp.non_field_errors || resp.detail;
        if (nonField) {
          setError(Array.isArray(nonField) ? nonField.join(' ') : String(nonField));
        }

        // map field errors to single strings
        const fErrs = {};
        Object.keys(resp).forEach((k) => {
          if (k === 'non_field_errors' || k === 'detail') return;
          const val = resp[k];
          if (Array.isArray(val)) fErrs[k] = val.join(' ');
          else fErrs[k] = String(val);
        });
        setFieldErrors(fErrs);
        if (!nonField && Object.keys(fErrs).length === 0) {
          setError('Registration failed');
        }
      } else {
        const msg = err?.message || 'Registration failed';
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page" style={{ padding: '2.5rem 1rem' }}>
      <style>{`
        .login-page{display:flex;align-items:center;justify-content:center;min-height:100vh;background:#f7fafc}
        .login-card{display:flex;width:100%;max-width:980px;border-radius:12px;overflow:hidden;box-shadow:0 10px 30px rgba(15,23,42,0.06);} 
        .login-left{flex:1;padding:32px 36px;background:linear-gradient(180deg,#0ea5a5 0%,#06b6d4 100%);color:white;display:flex;flex-direction:column;justify-content:center;min-width:280px}
        .brand-title-large{font-weight:700;font-size:1.25rem}
        .brand-sub-small{opacity:0.9;font-size:0.95rem}
        .login-hero{margin-top:18px;font-size:1.5rem;font-weight:700}
        .login-left p{opacity:0.95;margin-top:8px;color:rgba(255,255,255,0.92)}
        .login-right{width:520px;padding:28px 36px;background:white}
        .form-input{width:100%;padding:12px 14px;height:44px;border:1px solid #e6e9ee;border-radius:10px;font-size:0.95rem;box-sizing:border-box}
        .form-label{display:block;margin-bottom:6px;font-weight:600;color:#0f172a;font-size:0.95rem}
        .btn-primary{background:#0b9447;color:white;padding:12px 16px;border-radius:10px;border:none;font-weight:700}
        .btn-ghost{background:transparent;border:1px solid #e6e9ee;padding:10px 14px;border-radius:10px}
        .muted{color:#6b7280}
        .two-col{display:grid;grid-template-columns:1fr 1fr;gap:18px;align-items:start}
        .two-col > div{display:flex;flex-direction:column;gap:8px}
        .form-help{font-size:0.85rem;margin-top:6px}
        .form-actions{display:flex;gap:12px;align-items:center}
        @media (max-width:840px){.login-card{flex-direction:column}.login-left{display:none}.login-right{width:100%;padding:22px}}
      `}</style>

      <div className="login-card site-card">
        <div className="login-left">
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <div className="brand-tile" aria-hidden style={{width:44,height:44,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:8,background:'rgba(255,255,255,0.12)'}}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 12h16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 4v16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <div className="brand-title-large">KPS School</div>
              <div className="brand-sub-small">Learner management</div>
            </div>
          </div>

          <div className="login-hero">Create an account</div>
          <p className="muted" style={{maxWidth:420}}>Register to manage students, track attendance and enter grades.</p>
        </div>

        <div className="login-right">
          {error && (
            <div role="alert" style={{ background: '#fff1f0', color: '#9f3a38', padding: '0.65rem 0.75rem', borderRadius: 8, marginBottom: '0.75rem', border: '1px solid rgba(159,58,56,0.08)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{display:'grid',gap:12}}>
            <div className="two-col">
              <div>
                <label className="form-label" htmlFor="reg-username">Username</label>
                <input id="reg-username" className="form-input" value={form.username} onChange={(e) => handleChange('username', e.target.value)} placeholder="Choose a username" />
                {fieldErrors.username && <div className="form-help" style={{ color: '#9f3a38' }}>{fieldErrors.username}</div>}
              </div>
              <div>
                <label className="form-label" htmlFor="reg-email">Email</label>
                <input id="reg-email" className="form-input" value={form.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="you@example.com" />
                {fieldErrors.email && <div className="form-help" style={{ color: '#9f3a38' }}>{fieldErrors.email}</div>}
              </div>
            </div>

            <div className="two-col">
              <div>
                <label className="form-label" htmlFor="reg-first">First name</label>
                <input id="reg-first" className="form-input" value={form.first_name} onChange={(e) => handleChange('first_name', e.target.value)} placeholder="First name" />
                {fieldErrors.first_name && <div className="form-help" style={{ color: '#9f3a38' }}>{fieldErrors.first_name}</div>}
              </div>
              <div>
                <label className="form-label" htmlFor="reg-last">Last name</label>
                <input id="reg-last" className="form-input" value={form.last_name} onChange={(e) => handleChange('last_name', e.target.value)} placeholder="Last name" />
                {fieldErrors.last_name && <div className="form-help" style={{ color: '#9f3a38' }}>{fieldErrors.last_name}</div>}
              </div>
            </div>

            <div className="two-col">
              <div>
                <label className="form-label" htmlFor="reg-role">Role</label>
                <select id="reg-role" className="form-input" value={form.role} onChange={(e) => handleChange('role', e.target.value)}>
                  <option value="parent">Parent</option>
                  <option value="teacher">Teacher</option>
                  <option value="staff">Staff</option>
                </select>
                {fieldErrors.role && <div className="form-help" style={{ color: '#9f3a38' }}>{fieldErrors.role}</div>}
              </div>
              <div>
                <label className="form-label" htmlFor="reg-password">Password</label>
                <input id="reg-password" className="form-input" type="password" value={form.password} onChange={(e) => handleChange('password', e.target.value)} placeholder="Create a password" />
                {fieldErrors.password && <div className="form-help" style={{ color: '#9f3a38' }}>{fieldErrors.password}</div>}
              </div>
            </div>

            <div style={{display:'flex',gap:12,marginTop:6}}>
              <button type="submit" className="btn-primary" style={{flex:1}} disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
              <button type="button" className="btn-ghost" onClick={() => setForm({ username: '', password: '', email: '', first_name: '', last_name: '', role: 'parent' })}>Clear</button>
            </div>
          </form>

          <div style={{ marginTop: '0.9rem', textAlign: 'center' }}>
            <small className="muted">Already have an account? <Link to="/login">Sign in</Link></small>
          </div>
        </div>
      </div>
    </div>
  );
}

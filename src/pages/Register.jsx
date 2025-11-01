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

  const handleChange = (key, value) => setForm((s) => ({ ...s, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await register(form);
      // navigate to login so user can sign in
      navigate('/login');
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.detail || err?.message || 'Registration failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ maxWidth: 900 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginTop: '3rem' }}>
        <section className="site-card" style={{ padding: '1.25rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', marginBottom: '0.75rem' }}>Create an account</h2>
          <p className="muted" style={{ marginBottom: '1rem' }}>Register to manage students, track attendance and enter grades.</p>

          {error && (
            <div role="alert" style={{ background: '#fff1f0', color: '#9f3a38', padding: '0.65rem 0.75rem', borderRadius: 8, marginBottom: '0.75rem', border: '1px solid rgba(159,58,56,0.08)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-row">
              <label className="form-label" htmlFor="reg-username">Username</label>
              <input id="reg-username" className="form-input" value={form.username} onChange={(e) => handleChange('username', e.target.value)} placeholder="Choose a username" />
            </div>

            <div className="form-row">
              <label className="form-label" htmlFor="reg-email">Email</label>
              <input id="reg-email" className="form-input" value={form.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="you@example.com" />
            </div>

            <div className="form-row">
              <label className="form-label" htmlFor="reg-first">First name</label>
              <input id="reg-first" className="form-input" value={form.first_name} onChange={(e) => handleChange('first_name', e.target.value)} placeholder="First name" />
            </div>

            <div className="form-row">
              <label className="form-label" htmlFor="reg-last">Last name</label>
              <input id="reg-last" className="form-input" value={form.last_name} onChange={(e) => handleChange('last_name', e.target.value)} placeholder="Last name" />
            </div>

            <div className="form-row">
              <label className="form-label" htmlFor="reg-role">Role</label>
              <select id="reg-role" className="form-input" value={form.role} onChange={(e) => handleChange('role', e.target.value)}>
                <option value="parent">Parent</option>
                <option value="teacher">Teacher</option>
                <option value="staff">Staff</option>
              </select>
            </div>

            <div className="form-row">
              <label className="form-label" htmlFor="reg-password">Password</label>
              <input id="reg-password" className="form-input" type="password" value={form.password} onChange={(e) => handleChange('password', e.target.value)} placeholder="Create a password" />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.6rem', marginTop: '0.25rem' }}>
              <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
              <button type="button" className="btn-ghost" onClick={() => setForm({ username: '', password: '', email: '', first_name: '', last_name: '', role: 'parent' })}>Clear</button>
            </div>
          </form>

          <div style={{ marginTop: '0.9rem', textAlign: 'center' }}>
            <small className="muted">Already have an account? <Link to="/login">Sign in</Link></small>
          </div>
        </section>
      </div>
    </div>
  );
}

import React, { useState, useContext } from 'react';
import { AuthContext } from '../auth/AuthProvider';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(username, password);
      // navigate to dashboard after successful login
      navigate('/dashboard');
    } catch (err) {
      // try to show a meaningful message from server
      const msg = err?.response?.data?.detail || err?.response?.data?.message || err?.message || 'Invalid username or password';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ maxWidth: 480, marginTop: '3rem' }}>
      <section className="site-card" style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Sign in to your account</h2>
        {error && <div style={{ color: '#d03a3a', marginBottom: '0.75rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.75rem' }}>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ padding: '0.6rem 0.75rem', borderRadius: 8, border: '1px solid #e6e9ee' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '0.6rem 0.75rem', borderRadius: 8, border: '1px solid #e6e9ee' }}
          />

          <button disabled={loading} style={{ background: '#0b63ff', color: 'white', padding: '0.6rem', borderRadius: 8, border: 'none' }}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </section>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/api';
import { useMessages } from '../notifications/MessageProvider';

export default function Terms() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [yearId, setYearId] = useState('');
  const [years, setYears] = useState([]);
  const msgs = useMessages();

  const load = async () => {
    try {
      const [tRes, yRes] = await Promise.all([api.get('terms/'), api.get('academic-years/')]);
      setItems(Array.isArray(tRes.data) ? tRes.data : (tRes.data.results || []));
      setYears(Array.isArray(yRes.data) ? yRes.data : (yRes.data.results || []));
    } catch (e) {
      console.error(e);
      msgs?.addMessage?.('Failed to load terms', 'error');
    }
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('terms/', { name, academic_year: yearId });
      msgs?.addMessage?.('Term created', 'success');
      setName(''); setYearId('');
      load();
    } catch (err) {
      console.error(err);
      msgs?.addMessage?.('Failed to create term', 'error');
    }
  };

  return (
    <>
      <Navbar />
      <main className="content-area">
        <div className="app-container">
          <section className="site-card">
            <h1 className="text-2xl font-bold">Terms</h1>
            <p className="muted">Manage academic terms within academic years.</p>

            <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
              <div>
                <h3>Existing terms</h3>
                <ul style={{ marginTop: 8 }}>
                  {items.map(it => (
                    <li key={it.id} style={{ padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
                      <div style={{ fontWeight: 700 }}>{it.name}</div>
                      <div style={{ fontSize: 13, color: '#6b7280' }}>{it.academic_year?.name || it.academic_year || ''}</div>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3>Create term</h3>
                <form onSubmit={handleAdd} style={{ display: 'grid', gap: 8, marginTop: 8 }}>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Term name (e.g. Term 1)" className="form-input" required />
                  <select value={yearId} onChange={(e) => setYearId(e.target.value)} className="form-input" required>
                    <option value="">Select academic year</option>
                    {years.map(y => <option key={y.id} value={y.id}>{y.name}</option>)}
                  </select>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-primary" type="submit">Create</button>
                    <button type="button" className="btn btn-outline" onClick={() => { setName(''); setYearId(''); }}>Clear</button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

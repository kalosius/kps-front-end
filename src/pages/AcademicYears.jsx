import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/api';
import { useMessages } from '../notifications/MessageProvider';

export default function AcademicYears() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const msgs = useMessages();

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('academic-years/');
      setItems(Array.isArray(res.data) ? res.data : (res.data.results || []));
    } catch (e) {
      console.error(e);
      msgs?.addMessage?.('Failed to load academic years', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const payload = { name, start_date: start, end_date: end };
      await api.post('academic-years/', payload);
      msgs?.addMessage?.('Academic year created', 'success');
      setName(''); setStart(''); setEnd('');
      load();
    } catch (err) {
      console.error(err);
      msgs?.addMessage?.('Failed to create academic year', 'error');
    }
  };

  return (
    <>
      <Navbar />
      <main className="content-area">
        <div className="app-container">
          <section className="site-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1 className="text-2xl font-bold">Academic years</h1>
                <p className="muted">Create and manage academic years and their ranges.</p>
              </div>
            </div>

            <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
              <div>
                <h3>Existing years</h3>
                {loading ? <div>Loading…</div> : (
                  <ul style={{ marginTop: 8 }}>
                    {items.map(it => (
                      <li key={it.id} style={{ padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
                        <div style={{ fontWeight: 700 }}>{it.name}</div>
                        <div style={{ fontSize: 13, color: '#6b7280' }}>{it.start_date} — {it.end_date}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <h3>Create academic year</h3>
                <form onSubmit={handleAdd} style={{ display: 'grid', gap: 8, marginTop: 8 }}>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name (e.g. 2025/2026)" className="form-input" required />
                  <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="form-input" required />
                  <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="form-input" required />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-primary" type="submit">Create</button>
                    <button type="button" className="btn btn-outline" onClick={() => { setName(''); setStart(''); setEnd(''); }}>Clear</button>
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

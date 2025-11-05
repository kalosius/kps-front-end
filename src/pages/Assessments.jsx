import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/api';
import { useMessages } from '../notifications/MessageProvider';

export default function Assessments() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const msgs = useMessages();

  const load = async () => {
    try {
      const res = await api.get('assessments/');
      setItems(Array.isArray(res.data) ? res.data : (res.data.results || []));
    } catch (e) {
      console.error(e);
      msgs?.addMessage?.('Failed to load assessments', 'error');
    }
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('assessments/', { title, date });
      msgs?.addMessage?.('Assessment created', 'success');
      setTitle(''); setDate('');
      load();
    } catch (err) {
      console.error(err);
      msgs?.addMessage?.('Failed to create assessment', 'error');
    }
  };

  return (
    <>
      <Navbar />
      <main className="content-area">
        <div className="app-container">
          <section className="site-card">
            <h1 className="text-2xl font-bold">Assessments</h1>
            <p className="muted">Create and manage assessments (exams, tests, assignments).</p>

            <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
              <div>
                <h3>Existing assessments</h3>
                <ul style={{ marginTop: 8 }}>
                  {items.map(it => (
                    <li key={it.id} style={{ padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
                      <div style={{ fontWeight: 700 }}>{it.title || it.name}</div>
                      <div style={{ fontSize: 13, color: '#6b7280' }}>{it.date || it.scheduled_at || ''}</div>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3>Create assessment</h3>
                <form onSubmit={handleAdd} style={{ display: 'grid', gap: 8, marginTop: 8 }}>
                  <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="form-input" required />
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="form-input" />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-primary" type="submit">Create</button>
                    <button type="button" className="btn btn-outline" onClick={() => { setTitle(''); setDate(''); }}>Clear</button>
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

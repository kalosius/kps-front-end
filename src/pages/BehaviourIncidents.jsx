import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/api';
import { useMessages } from '../notifications/MessageProvider';

export default function BehaviourIncidents() {
  const [items, setItems] = useState([]);
  const [student, setStudent] = useState('');
  const [severity, setSeverity] = useState('low');
  const [description, setDescription] = useState('');
  const msgs = useMessages();

  const load = async () => {
    try {
      const res = await api.get('behaviour-incidents/');
      setItems(Array.isArray(res.data) ? res.data : (res.data.results || []));
    } catch (e) {
      console.error(e);
      msgs?.addMessage?.('Failed to load incidents', 'error');
    }
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('behaviour-incidents/', { student, severity, description });
      msgs?.addMessage?.('Incident logged', 'success');
      setStudent(''); setSeverity('low'); setDescription('');
      load();
    } catch (err) {
      console.error(err);
      msgs?.addMessage?.('Failed to log incident', 'error');
    }
  };

  return (
    <>
      <Navbar />
      <main className="content-area">
        <div className="app-container">
          <section className="site-card">
            <h1 className="text-2xl font-bold">Behaviour incidents</h1>
            <p className="muted">Log and review behaviour incidents for students.</p>

            <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16 }}>
              <div>
                <h3>Recent incidents</h3>
                <ul style={{ marginTop: 8 }}>
                  {items.map(it => (
                    <li key={it.id} style={{ padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
                      <div style={{ fontWeight: 700 }}>{it.student?.name || it.student || 'Student'}</div>
                      <div style={{ fontSize: 13, color: '#6b7280' }}>{it.date || it.created_at} • {it.severity}</div>
                      <div style={{ marginTop: 6 }}>{it.description}</div>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3>Log incident</h3>
                <form onSubmit={handleAdd} style={{ display: 'grid', gap: 8, marginTop: 8 }}>
                  <input value={student} onChange={(e) => setStudent(e.target.value)} placeholder="Student id or name" className="form-input" required />
                  <select value={severity} onChange={(e) => setSeverity(e.target.value)} className="form-input">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="form-input" rows={4} />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-primary" type="submit">Log</button>
                    <button type="button" className="btn btn-outline" onClick={() => { setStudent(''); setSeverity('low'); setDescription(''); }}>Clear</button>
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

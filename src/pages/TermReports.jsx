import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/api';
import { useMessages } from '../notifications/MessageProvider';

export default function TermReports() {
  const [reports, setReports] = useState([]);
  const [terms, setTerms] = useState([]);
  const [termId, setTermId] = useState('');
  const msgs = useMessages();

  const load = async () => {
    try {
      const [rRes, tRes] = await Promise.all([api.get('term-reports/'), api.get('terms/')]);
      setReports(Array.isArray(rRes.data) ? rRes.data : (rRes.data.results || []));
      setTerms(Array.isArray(tRes.data) ? tRes.data : (tRes.data.results || []));
    } catch (e) {
      console.error(e);
      msgs?.addMessage?.('Failed to load reports', 'error');
    }
  };

  useEffect(() => { load(); }, []);

  const handleGenerate = async () => {
    if (!termId) return msgs?.addMessage?.('Select a term', 'error');
    try {
      const res = await api.post('term-reports/', { term: termId });
      msgs?.addMessage?.('Report generation started', 'success');
      load();
      // if API returns download url, open it
      if (res.data?.download_url) window.open(res.data.download_url, '_blank');
    } catch (err) {
      console.error(err);
      msgs?.addMessage?.('Failed to generate report', 'error');
    }
  };

  return (
    <>
      <Navbar />
      <main className="content-area">
        <div className="app-container">
          <section className="site-card">
            <h1 className="text-2xl font-bold">Term reports</h1>
            <p className="muted">Generate and download term report snapshots (PDF exports).</p>

            <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
              <div>
                <h3>Available reports</h3>
                <ul style={{ marginTop: 8 }}>
                  {reports.map(r => (
                    <li key={r.id} style={{ padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
                      <div style={{ fontWeight: 700 }}>{r.title || `${r.term?.name || 'Term'} report`}</div>
                      <div style={{ fontSize: 13, color: '#6b7280' }}>{r.created_at}</div>
                      {r.download_url && (
                        <div style={{ marginTop: 8 }}><a href={r.download_url} target="_blank" rel="noreferrer" className="btn btn-outline">Download</a></div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3>Generate report</h3>
                <div style={{ display: 'grid', gap: 8, marginTop: 8 }}>
                  <select value={termId} onChange={(e) => setTermId(e.target.value)} className="form-input">
                    <option value="">Select term</option>
                    {terms.map(t => <option key={t.id} value={t.id}>{t.name} — {t.academic_year?.name || ''}</option>)}
                  </select>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-primary" onClick={handleGenerate}>Generate</button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

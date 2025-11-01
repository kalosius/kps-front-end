import React, { useState, useContext, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/api';

import { AuthContext } from '../auth/AuthProvider';

export default function GradeEntry({assessmentId}) {
  const [studentId, setStudentId] = useState('');
  const [score, setScore] = useState('');
  const [remarks, setRemarks] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const { user } = useContext(AuthContext);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('grades/', {
        student: studentId,
        assessment: assessmentId,
        score: parseFloat(score),
        remarks
      });
      setStatusMsg('Grade saved successfully.');
      // clear small fields but keep selection
      setScore('');
      setRemarks('');
      setTimeout(() => setStatusMsg(''), 3000);
    } catch (err) {
      console.error(err);
      setStatusMsg('Failed to save grade. See console.');
      setTimeout(() => setStatusMsg(''), 4000);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get('students/');
        const data = res.data;
        const items = Array.isArray(data) ? data : (data.results || data);
        setStudents(items || []);
      } catch (e) {
        console.error('Failed to load students', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <>
      <Navbar />
      <main className="content-area">
        <div className="app-container">
          <div className="site-card">
            <h1 className="text-2xl font-bold mb-4">Enter Grade</h1>
            <form onSubmit={submit} className="form-grid max-w-xl">
              <div className="form-row">
                <label className="form-label">Student</label>
                <select value={studentId} onChange={e=>setStudentId(e.target.value)} className="form-input">
                  <option value="">{loading ? 'Loading students...' : 'Select a student'}</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{`${s.first_name} ${s.last_name} — ${s.admission_number}`}</option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <label className="form-label">Score</label>
                <input value={score} onChange={e=>setScore(e.target.value)} placeholder="0" className="form-input" />
              </div>

              <div className="form-row" style={{gridColumn: '1 / -1'}}>
                <label className="form-label">Remarks</label>
                <textarea value={remarks} onChange={e=>setRemarks(e.target.value)} placeholder="Optional remarks" className="form-textarea" />
              </div>

              <div style={{gridColumn: '1 / -1'}} className="flex gap-2">
                <button type="submit" className="btn-primary">Save grade</button>
                <button type="button" className="btn-ghost" onClick={() => { setStudentId(''); setScore(''); setRemarks(''); }}>Reset</button>
                {statusMsg && <div className="muted small" style={{marginLeft: '0.5rem'}}>{statusMsg}</div>}
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}

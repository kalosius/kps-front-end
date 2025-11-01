import React, { useEffect, useState, useContext } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/api';
import { AuthContext } from '../auth/AuthProvider';

export default function Students() {
  const { user } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // form state
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ first_name: '', last_name: '', admission_number: '', dob: '', current_class: '' });

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await api.get('students/');
      // DRF may return paginated data { results: [...] } or a plain list
      const data = res.data;
      const items = Array.isArray(data) ? data : (data.results || data);
      setStudents(items || []);
    } catch (e) {
      console.error(e);
      setError('Failed to load students.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ first_name: '', last_name: '', admission_number: '', dob: '', current_class: '' });
    setShowForm(true);
  };

  const openEdit = (s) => {
    setEditing(s.id);
    setForm({ first_name: s.first_name || '', last_name: s.last_name || '', admission_number: s.admission_number || '', dob: s.dob || '', current_class: s.current_class || '' });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`students/${editing}/`, form);
      } else {
        await api.post('students/', form);
      }
      setShowForm(false);
      fetchStudents();
    } catch (err) {
      console.error(err);
      alert('Save failed. See console for details.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this student?')) return;
    try {
      await api.delete(`students/${id}/`);
      fetchStudents();
    } catch (err) {
      console.error(err);
      alert('Delete failed.');
    }
  };

  return (
    <>
      <Navbar />
      <main className="content-area">
        <div className="app-container">
          <div className="site-card">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold mb-4">Students</h1>
              {user?.role === 'admin' && (
                <div>
                  <button onClick={openCreate} className="btn-primary">+ Add student</button>
                </div>
              )}
            </div>

            {loading && <div>Loading...</div>}
            {error && <div className="text-red-600">{error}</div>}

            {!loading && students.length === 0 && <div className="text-gray-600">No students yet.</div>}

            {students.length > 0 && (
                <div className="table-responsive">
                  <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Admission #</th>
                    <th>Class</th>
                    <th>Active</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.id}>
                      <td>
                          <div className="name-cell">
                            <div className="avatar-initials">{`${(s.first_name||'').charAt(0)}${(s.last_name||'').charAt(0)}`.toUpperCase()}</div>
                            <div>
                              <div className="font-semibold">{s.first_name} {s.last_name}</div>
                              <div className="muted small">{s.dob ? new Date(s.dob).toLocaleDateString() : ''}</div>
                            </div>
                          </div>
                      </td>
                      <td className="small">{s.admission_number}</td>
                      <td className="small">{(s.current_class && (s.current_class.name || s.current_class)) || '-'}</td>
                      <td className="small">{s.is_active ? 'Yes' : 'No'}</td>
                        <td className="action-cell">
                          <button onClick={() => openEdit(s)} className="btn-text-blue mr-2">Edit</button>
                          <button onClick={() => handleDelete(s.id)} className="btn-text-blue">Delete</button>
                        </td>
                    </tr>
                  ))}
                </tbody>
                  </table>
                </div>
            )}

            {/* Simple modal/form area */}
            {showForm && (
              <div className="mt-6">
                <h2 className="font-semibold">{editing ? 'Edit student' : 'Add student'}</h2>
                <form onSubmit={handleSubmit} className="mt-3 grid grid-cols-1 gap-3 max-w-xl">
                  <input placeholder="First name" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} required />
                  <input placeholder="Last name" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} required />
                  <input placeholder="Admission number" value={form.admission_number} onChange={(e) => setForm({ ...form, admission_number: e.target.value })} required />
                  <input type="date" placeholder="Date of birth" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} />
                  <input placeholder="Class id (optional)" value={form.current_class} onChange={(e) => setForm({ ...form, current_class: e.target.value })} />
                  <div className="flex gap-2">
                    <button type="submit" className="btn-primary">Save</button>
                    <button type="button" className="btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

import React, { useEffect, useState } from 'react'
import api from '../api/api'

function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', password: '', role: 'teacher' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get('/users/')
      // DRF may return paginated responses { count, next, previous, results: [...] }
      const data = res.data
      if (data && Array.isArray(data)) {
        setUsers(data)
      } else if (data && Array.isArray(data.results)) {
        setUsers(data.results)
      } else if (data && typeof data === 'object' && data.results === undefined) {
        // fallback: maybe object keyed by users
        // try to find array values on the object
        const arr = Object.values(data).find(v => Array.isArray(v))
        setUsers(arr || [])
      } else {
        setUsers([])
      }
    } catch (err) {
      console.error('Failed to load users', err)
      setError(err.response ? err.response.data : 'Network error')
    } finally {
      setLoading(false)
    }
  }

  function openForm() {
    setForm({ first_name: '', last_name: '', email: '', password: '', role: 'teacher' })
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
  }

  async function submitForm(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      // API expects fields depending on backend; adjust if needed
      const payload = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        password: form.password,
        role: form.role
      }
      const res = await api.post('/users/', payload)
      // success
      alert('User created')
      closeForm()
      fetchUsers()
    } catch (err) {
      console.error('Create user failed', err)
      const msg = err.response && err.response.data ? JSON.stringify(err.response.data) : 'Network error'
      alert('Failed: ' + msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page">
      <div className="site-card" style={{ padding: 24 }}>
        <h1 style={{ margin: 0, fontSize: 34 }}>Users</h1>
        <p style={{ color: '#6b7280', marginTop: 8 }}>Manage application users (create, edit, assign roles).</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
        <h2 style={{ margin: 0 }}>All users</h2>
        <button className="btn primary" onClick={openForm}>+ Add User</button>
      </div>

      <div style={{ marginTop: 12 }}>
        {loading && <div>Loading users...</div>}
        {error && <div style={{ color: 'red' }}>Error loading users: {String(error)}</div>}

        {!loading && !error && (
          <div style={{ marginTop: 12, overflowX: 'auto' }}>
            <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: '12px 8px' }}>Name</th>
                  <th style={{ padding: '12px 8px' }}>Email</th>
                  <th style={{ padding: '12px 8px' }}>Role</th>
                  <th style={{ padding: '12px 8px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users && users.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ padding: 12 }}>No users yet.</td>
                  </tr>
                )}
                {users && users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: 12 }}>{(u.first_name || '') + ' ' + (u.last_name || '')}</td>
                    <td style={{ padding: 12 }}>{u.email}</td>
                    <td style={{ padding: 12 }}>{u.role || u.user_role || '—'}</td>
                    <td style={{ padding: 12 }}>
                      <button className="btn" onClick={() => alert('Edit not implemented yet')}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal" role="dialog" aria-modal="true" style={{ maxWidth: 540 }}>
            <h3 style={{ marginTop: 0 }}>Create user</h3>
            <form onSubmit={submitForm}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <input value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} placeholder="First name" required />
                <input value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} placeholder="Last name" required />
              </div>
              <div style={{ marginTop: 8 }}>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email" required />
              </div>
              <div style={{ marginTop: 8 }}>
                <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Password" required />
              </div>
              <div style={{ marginTop: 8 }}>
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                  <option value="admin">admin</option>
                  <option value="teacher">teacher</option>
                  <option value="parent">parent</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
                <button type="button" className="btn" onClick={closeForm} disabled={submitting}>Cancel</button>
                <button type="submit" className="btn primary" disabled={submitting}>{submitting ? 'Creating...' : 'Create user'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Users

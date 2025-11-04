import React, { useContext, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../auth/AuthProvider';
import api from '../api/api';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!user) return;
      // admin/teacher dashboard (treat superusers as admin)
      if (user.role === 'admin' || user.role === 'teacher' || user.is_superuser) {
        setLoading(true);
        setError(null);
        try {
          const res = await api.get('dashboard/');
          if (!mounted) return;
          setData(res.data);
        } catch (err) {
          console.error(err);
          if (!mounted) return;
          setError('Failed to load dashboard data');
        } finally {
          if (mounted) setLoading(false);
        }
      }
      // parent view: prefer the backend aggregated dashboard (we added a parent branch)
      if (user.role === 'parent') {
        setLoading(true);
        setError(null);
        try {
          // prefer calling the dashboard parent branch which returns { students, attendance_today, recent_incidents }
          const res = await api.get('dashboard/');
          if (!mounted) return;
          if (res.data && Array.isArray(res.data.students)) {
            setData(res.data);
            return;
          }

          // fallback: call students/ and filter client-side (keeps compatibility with older setups)
          const res2 = await api.get('students/');
          if (!mounted) return;
          const raw = res2.data;
          const items = Array.isArray(raw) ? raw : (raw.results || raw);

          const matchesParent = (s) => {
            try {
              if (!s) return false;

              // serializer in backend exposes 'guardian' as an array of user objects
              if (Array.isArray(s.guardian) && s.guardian.some(p => p.id === user.id || p.email === user.email)) return true;

              // also check common alternative shapes
              if (s.parent && (s.parent.id === user.id || s.parent.email === user.email)) return true;
              if (s.guardian && (s.guardian.id === user.id || s.guardian.email === user.email)) return true;
              if (Array.isArray(s.parents) && s.parents.some(p => p.id === user.id || p.email === user.email)) return true;

              if (s.parent_id && user.id && s.parent_id === user.id) return true;
              if (s.guardian_id && user.id && s.guardian_id === user.id) return true;

              if (Array.isArray(s.parent_ids) && s.parent_ids.includes(user.id)) return true;
              if (Array.isArray(s.guardian_ids) && s.guardian_ids.includes(user.id)) return true;

              if (Array.isArray(s.relationships) && s.relationships.some(r => (r.type === 'guardian' || r.role === 'guardian') && (r.user_id === user.id || r.user?.id === user.id || r.user?.email === user.email))) return true;

              if (s.parent_email && user.email && s.parent_email === user.email) return true;
              if (s.guardian_email && user.email && s.guardian_email === user.email) return true;
            } catch (e) {
              // ignore
            }
            return false;
          };

          const filtered = (items || []).filter(matchesParent);
          setData({ students: filtered });
        } catch (err) {
          console.error(err);
          if (!mounted) return;
          setError('Failed to load your students');
        } finally {
          if (mounted) setLoading(false);
        }
      }
    };
    load();
    return () => { mounted = false; };
  }, [user]);

  // show loading if admin/teacher/superuser but still fetching
  if (user && (user.role === 'admin' || user.role === 'teacher' || user.is_superuser) && loading) {
    return (
      <>
        <Navbar />
        <main className="content-area">
          <div className="app-container">
            <div className="site-card">Loading dashboard…</div>
          </div>
        </main>
      </>
    );
  }

  // Admin/Teacher/Superuser dashboard (rich view)
  if (user && (user.role === 'admin' || user.role === 'teacher' || user.is_superuser)) {
    return (
      <>
        <Navbar />
        <main className="content-area">
          <div className="app-container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              <div className="site-card">
                <h3 style={{ margin: 0 }}>Total students</h3>
                <div style={{ fontSize: 28, fontWeight: 700, marginTop: 8 }}>{data?.total_students ?? '-'}</div>
              </div>
              <div className="site-card">
                <h3 style={{ margin: 0 }}>Total parents</h3>
                <div style={{ fontSize: 28, fontWeight: 700, marginTop: 8 }}>{data?.total_parents ?? '-'}</div>
              </div>
              <div className="site-card">
                <h3 style={{ margin: 0 }}>Total teachers</h3>
                <div style={{ fontSize: 28, fontWeight: 700, marginTop: 8 }}>{data?.total_teachers ?? '-'}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginTop: 16 }}>
              <div className="site-card">
                <h3>Recent students</h3>
                <ul style={{ marginTop: 8 }}>
                  {data?.recent_students?.map((s) => (
                    <li key={s.id} style={{ padding: '8px 0', borderBottom: '1px solid #f1f1f1' }}>
                      <div style={{ fontWeight: 700 }}>{s.first_name} {s.last_name}</div>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>{s.admission_number} — {s.class ?? 'No class'}</div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="site-card">
                <h3>Today</h3>
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontSize: 18 }}>Attendance records today</div>
                  <div style={{ fontSize: 24, fontWeight: 700, marginTop: 6 }}>{data?.attendance_today ?? 0}</div>
                </div>
                <h4 style={{ marginTop: 12 }}>Recent incidents</h4>
                <ul style={{ marginTop: 8 }}>
                  {data?.recent_incidents?.map((i) => (
                    <li key={i.id} style={{ padding: '6px 0', borderBottom: '1px dashed #eee' }}>
                      <div style={{ fontWeight: 600 }}>{i.student?.name ?? 'Unknown'}</div>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>{i.date} • {i.severity}</div>
                      <div style={{ marginTop: 6, fontSize: 13 }}>{i.description}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  // parent/other minimal view is unchanged
  if (user && user.role === 'parent') {
    return (
      <>
        <Navbar />
        <main className="content-area">
          <div className="app-container">
            <div className="site-card">
              <h1 className="text-2xl font-bold">Welcome, {user?.first_name || user?.username}!</h1>
              <p className="mt-2 text-gray-600">You are logged in as {user?.role ?? 'parent'}.</p>
            </div>

            <div className="site-card" style={{ marginTop: 16 }}>
              <h2 className="text-lg font-semibold">Your students</h2>
              {loading && <div className="mt-4">Loading your students…</div>}
              {error && <div className="text-red-600 mt-4">{error}</div>}
              {!loading && !error && (!data?.students || data.students.length === 0) && (
                <div className="mt-4 text-gray-600">We couldn't find any students linked to your account.</div>
              )}

              {!loading && data?.students && data.students.length > 0 && (
                <ul style={{ marginTop: 12 }}>
                  {data.students.map((s) => (
                    <li key={s.id} style={{ padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 700 }}>{s.first_name} {s.last_name}</div>
                          <div style={{ fontSize: 12, color: '#6b7280' }}>{s.admission_number || '-'} — {s.current_class?.name || s.current_class || 'No class'}</div>
                        </div>
                        <div>
                          <NavLink to={`/students/${s.id}`} className="btn btn-outline">View profile</NavLink>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </main>
      </>
    );
  }

  // fallback for other roles
  return (
    <>
      <Navbar />
      <main className="content-area">
        <div className="app-container">
          <div className="site-card">
            <h1 className="text-2xl font-bold">Welcome, {user?.first_name || user?.username}!</h1>
            <p className="mt-2 text-gray-600">You are logged in as {user?.role ?? user?.email ?? user?.username ?? 'user'}.</p>
          </div>
        </div>
      </main>
    </>
  );
}

import React, { useContext, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
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

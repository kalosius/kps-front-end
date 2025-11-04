import React, { useContext, useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthProvider';
import NotificationsBell from './NotificationsBell';
import Logo from '../assets/Logo.png';
import './Navbar.css';

export default function Navbar() {
  const { logout, user } = useContext(AuthContext);
  const role = user?.role || (user?.is_superuser ? 'admin' : '');
  const isParent = role === 'parent';
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  // control collapsing of long sections so users can reach the bottom
  const [adminOpen, setAdminOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // profile dropdown for topbar
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const hoverTimeout = useRef(null);
  useEffect(() => {
    const onDoc = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  // clear any pending hover timeout on unmount
  useEffect(() => {
    return () => { if (hoverTimeout.current) clearTimeout(hoverTimeout.current); };
  }, []);

  return (
    <>
      <aside className={`side-nav ${open ? 'open' : ''}`} aria-hidden={!open && window.innerWidth < 768}>
          <div className="side-brand" role="banner">
          <div style={{display: 'flex', gap: '0.75rem', alignItems: 'center'}}>
            <div className="brand-tile">
              <img src={Logo} alt="KPS logo" style={{ width: 36, height: 36, objectFit: 'contain' }} />
            </div>
            <div className="brand-text">
              <div className="brand-title">KPS School</div>
              <div className="brand-sub">Learner management</div>
            </div>
          </div>

          {/* avatar / notification square on the right */}
          <div className="brand-avatar" aria-hidden="false">
            {/* render compact notifications bell inside the avatar square */}
            <div className="brand-notice">
              <NotificationsBell />
            </div>
          </div>
        </div>

  <nav className="side-links" style={{ overflowY: 'auto', height: 'calc(100vh - 180px)', paddingRight: 8 }}>
          <NavLink to="/dashboard" className="side-link">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor"><path d="M3 13h4V7H3v6zM3 5h4V3H3v2zM9 13h8V3H9v10zM9 17h8v-2H9v2z"/></svg>
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/students" className="side-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11c1.657 0 3-1.567 3-3.5S17.657 4 16 4s-3 1.567-3 3.5S14.343 11 16 11zM8 11c1.657 0 3-1.567 3-3.5S9.657 4 8 4 5 5.567 5 7.5 6.343 11 8 11z"/><path strokeLinecap="round" strokeLinejoin="round" d="M21 20a4 4 0 00-4-4H7a4 4 0 00-4 4"/></svg>
            <span>Students</span>
          </NavLink>

          <NavLink to="/attendance" className="side-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3M16 7V3M3 11h18M5 21h14a2 2 0 002-2V11H3v8a2 2 0 002 2z"/></svg>
            <span>Attendance</span>
          </NavLink>

          <NavLink to="/grades" className="side-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c1.657 0 3-1.567 3-3.5S13.657 1 12 1 9 2.567 9 4.5 10.343 8 12 8zM21 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2"/><path strokeLinecap="round" strokeLinejoin="round" d="M3 11h18"/></svg>
            <span>Grades</span>
          </NavLink>

          {/* Admin links: render only for non-parent users */}
          {!isParent && (
            <>
              <button
                onClick={() => setAdminOpen(!adminOpen)}
                aria-expanded={adminOpen}
                style={{
                  marginTop: '0.5rem',
                  padding: '0 0.5rem',
                  color: '#6b7280',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                <span style={{ display: 'inline-block', marginRight: 8 }}>{adminOpen ? '▾' : '▸'}</span>
                Admin
              </button>
              <div style={{ display: adminOpen ? 'block' : 'none' }}>
                <NavLink to="/admin/users" className="side-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M16 11c1.657 0 3-1.567 3-3.5S17.657 4 16 4s-3 1.567-3 3.5S14.343 11 16 11zM8 11c1.657 0 3-1.567 3-3.5S9.657 4 8 4 5 5.567 5 7.5 6.343 11 8 11z"/><path d="M21 20a4 4 0 00-4-4H7a4 4 0 00-4 4"/></svg>
                <span>Users</span>
              </NavLink>
              <NavLink to="/admin/academic-years" className="side-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M3 7h18M3 12h18M3 17h18"/></svg>
                <span>Academic years</span>
              </NavLink>
              <NavLink to="/admin/terms" className="side-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M7 8h10M7 12h10M7 16h10"/></svg>
                <span>Terms</span>
              </NavLink>
              <NavLink to="/admin/classes" className="side-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M4 7h16v10H4z"/></svg>
                <span>School classes</span>
              </NavLink>
              <NavLink to="/admin/subjects" className="side-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/></svg>
                <span>Subjects</span>
              </NavLink>
              <NavLink to="/admin/assessments" className="side-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M3 6h18M3 12h18M3 18h18"/></svg>
                <span>Assessments</span>
              </NavLink>
              <NavLink to="/admin/behaviour" className="side-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/></svg>
                <span>Behaviour incidents</span>
              </NavLink>
              <NavLink to="/admin/messages" className="side-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                <span>Messages</span>
              </NavLink>
              <NavLink to="/admin/threads" className="side-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                <span>Message threads</span>
              </NavLink>
              <NavLink to="/admin/notifications" className="side-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118.6 14H5.4c-.67 0-1.255.27-1.695.695L2.3 17H7"/></svg>
                <span>Notifications</span>
              </NavLink>
              <NavLink to="/admin/reports" className="side-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M19 21H5a2 2 0 01-2-2V7a2 2 0 012-2h4l2-3h2l2 3h4a2 2 0 012 2v12a2 2 0 01-2 2z"/></svg>
                <span>Term reports</span>
              </NavLink>
              </div>
            </>
          )}
        </nav>

        <div className="side-footer">
            <div className="user-info">
            <div className="user-name">{user?.first_name || user?.username || 'User'}</div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>{user?.role || (user?.is_superuser ? 'admin' : '')}</div>
            <button onClick={handleLogout} className="logout-btn" aria-label="Logout">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.5} style={{ flex: '0 0 16px' }}>
                <path d="M16 17l5-5-5-5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 19H5a2 2 0 01-2-2V7a2 2 0 012-2h4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* top navigation shown on medium+ screens */}
      <header className="topbar hidden md:flex upper-nav">
        <div className="topbar-left">
          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle sidebar"
            className="hamburger-btn"
          >
            ☰
          </button>

          <div className="brand-inline">
            <div className="brand-tile-small">
              <img src={Logo} alt="KPS logo" style={{ width: 28, height: 28, objectFit: 'contain' }} />
            </div>
            <div className="brand-text-small">
              <div className="brand-title">KPS School</div>
              <div className="brand-sub">Learner management</div>
            </div>
          </div>
        </div>

        <div className="topbar-center">
          <div className="topbar-search">
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth={1.5}><path d="M21 21l-4.35-4.35"/><circle cx="11" cy="11" r="6"/></svg>
            <input aria-label="Search" placeholder="Search task" className="search-input" />
          </div>
        </div>

        <div className="topbar-right">
          <div className="action-buttons">
            <button className="btn btn-primary">+ Add Project</button>
            <button className="btn btn-outline">Import Data</button>
          </div>

          <div className="icons-inline">
            {/* mail icon */}
            <button className="icon-btn" aria-label="Messages">✉️</button>

            {/* notifications bell (component renders badge) */}
            <NotificationsBell />

            {/* small dark square removed (cleaner layout) */}
          </div>

          <div
            ref={profileRef}
            className="profile-wrap"
            onMouseEnter={() => {
              if (hoverTimeout.current) { clearTimeout(hoverTimeout.current); hoverTimeout.current = null; }
              setProfileOpen(true);
            }}
            onMouseLeave={() => {
              // small delay so the user can move the mouse into the popover
              hoverTimeout.current = setTimeout(() => setProfileOpen(false), 200);
            }}
          >
            <button onClick={() => setProfileOpen((s) => !s)} className="profile-btn" aria-haspopup="true" aria-expanded={profileOpen}>
              <div className="avatar-circle">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0b5fff" strokeWidth={1.2}><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM4 20v-1c0-2.21 3.58-4 8-4s8 1.79 8 4v1"/></svg>
              </div>
              <div className="profile-info">
                <div className="profile-name">{user?.first_name || user?.username || 'admin'}</div>
                <div className="profile-email">{user?.email || (user?.role ?? (user?.is_superuser ? 'admin' : ''))}</div>
              </div>
            </button>

            {profileOpen && (
              <div className="profile-popover" onMouseEnter={() => { if (hoverTimeout.current) { clearTimeout(hoverTimeout.current); hoverTimeout.current = null; } }} onMouseLeave={() => { hoverTimeout.current = setTimeout(() => setProfileOpen(false), 200); }}>
                <NavLink to="/profile" className="popover-item">
                  <svg className="item-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"/><path d="M4 20v-1c0-2.21 3.58-4 8-4s8 1.79 8 4v1"/></svg>
                  <span className="item-text">Profile</span>
                </NavLink>

                <NavLink to="/settings" className="popover-item">
                  <svg className="item-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M12 15.5A3.5 3.5 0 1012 8.5a3.5 3.5 0 000 7z"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V20a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06A2 2 0 015.27 17.4l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H4a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82L5.27 5.27A2 2 0 017.1 2.44l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V2a2 2 0 014 0v.09c.07.6.5 1.09 1 1.51h.02c.61.4 1.4.2 1.82-.33l.06-.06A2 2 0 0118.73 5.6l-.06.06c-.4.61-.2 1.4.33 1.82.44.29 1.02.38 1.51 1V11a2 2 0 010 4h-.09c-.5.97-1.08 1.3-1.51 1z"/></svg>
                  <span className="item-text">Settings</span>
                </NavLink>

                <button onClick={handleLogout} className="popover-item popover-logout">
                  <svg className="item-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/><path d="M9 19H5a2 2 0 01-2-2V7a2 2 0 012-2h4"/></svg>
                  <span className="item-text">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* mobile top bar with hamburger */}
      <div className="mobile-topbar md:hidden">
        <button onClick={() => setOpen(!open)} aria-label="Open menu" className="hamburger">☰</button>
        <div className="mobile-brand">KP School</div>
        <div className="mobile-actions">
          <NotificationsBell />
        </div>
      </div>
    </>
  );
}

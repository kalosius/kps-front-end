import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthProvider';
import NotificationsBell from './NotificationsBell';

export default function Navbar() {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <aside className={`side-nav ${open ? 'open' : ''}`} aria-hidden={!open && window.innerWidth < 768}>
        <div className="side-brand" role="banner">
          <div style={{display: 'flex', gap: '0.75rem', alignItems: 'center'}}>
            <div className="brand-tile">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.5}><path d="M3 13h4V7H3v6zM3 5h4V3H3v2zM9 13h8V3H9v10zM9 17h8v-2H9v2z"/></svg>
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

        <nav className="side-links">
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
        </nav>

        <div className="side-footer">
          <div className="user-info">
            <div className="user-name">{user?.first_name || user?.username || 'User'}</div>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </aside>

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

import React from 'react';
import Navbar from '../components/Navbar';

export default function Notifications() {
  return (
    <>
      <Navbar />
      <main className="content-area">
        <div className="app-container">
          <section className="site-card">
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="muted">System notifications and user-specific notices.</p>
          </section>
        </div>
      </main>
    </>
  );
}

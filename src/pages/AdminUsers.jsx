import React from 'react';
import Navbar from '../components/Navbar';

export default function AdminUsers() {
  return (
    <>
      <Navbar />
      <main className="content-area">
        <div className="app-container">
          <section className="site-card">
            <h1 className="text-2xl font-bold">Users</h1>
            <p className="muted">Manage application users (create, edit, assign roles).</p>
          </section>
        </div>
      </main>
    </>
  );
}

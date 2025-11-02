import React from 'react';
import Navbar from '../components/Navbar';

export default function Terms() {
  return (
    <>
      <Navbar />
      <main className="content-area">
        <div className="app-container">
          <section className="site-card">
            <h1 className="text-2xl font-bold">Terms</h1>
            <p className="muted">Manage academic terms within academic years.</p>
          </section>
        </div>
      </main>
    </>
  );
}

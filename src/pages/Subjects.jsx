import React from 'react';
import Navbar from '../components/Navbar';

export default function Subjects() {
  return (
    <>
      <Navbar />
      <main className="content-area">
        <div className="app-container">
          <section className="site-card">
            <h1 className="text-2xl font-bold">Subjects</h1>
            <p className="muted">Create and manage subjects taught at the school.</p>
          </section>
        </div>
      </main>
    </>
  );
}

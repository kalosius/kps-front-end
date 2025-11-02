import React from 'react';
import Navbar from '../components/Navbar';

export default function ClassSubjects() {
  return (
    <>
      <Navbar />
      <main className="content-area">
        <div className="app-container">
          <section className="site-card">
            <h1 className="text-2xl font-bold">Class subjects</h1>
            <p className="muted">Assign subjects to classes and link teachers.</p>
          </section>
        </div>
      </main>
    </>
  );
}

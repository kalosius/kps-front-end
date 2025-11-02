import React from 'react';
import Navbar from '../components/Navbar';

export default function AcademicYears() {
  return (
    <>
      <Navbar />
      <main className="content-area">
        <div className="app-container">
          <section className="site-card">
            <h1 className="text-2xl font-bold">Academic years</h1>
            <p className="muted">Create and manage academic years and their ranges.</p>
          </section>
        </div>
      </main>
    </>
  );
}

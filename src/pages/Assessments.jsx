import React from 'react';
import Navbar from '../components/Navbar';

export default function Assessments() {
  return (
    <>
      <Navbar />
      <main className="content-area">
        <div className="app-container">
          <section className="site-card">
            <h1 className="text-2xl font-bold">Assessments</h1>
            <p className="muted">Create and manage assessments (exams, tests, assignments).</p>
          </section>
        </div>
      </main>
    </>
  );
}

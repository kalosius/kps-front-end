import React from 'react';
import Navbar from '../components/Navbar';

export default function TermReports() {
  return (
    <>
      <Navbar />
      <main className="content-area">
        <div className="app-container">
          <section className="site-card">
            <h1 className="text-2xl font-bold">Term reports</h1>
            <p className="muted">Generate and download term report snapshots (PDF exports).</p>
          </section>
        </div>
      </main>
    </>
  );
}

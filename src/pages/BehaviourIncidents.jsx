import React from 'react';
import Navbar from '../components/Navbar';

export default function BehaviourIncidents() {
  return (
    <>
      <Navbar />
      <main className="content-area">
        <div className="app-container">
          <section className="site-card">
            <h1 className="text-2xl font-bold">Behaviour incidents</h1>
            <p className="muted">Log and review behaviour incidents for students.</p>
          </section>
        </div>
      </main>
    </>
  );
}

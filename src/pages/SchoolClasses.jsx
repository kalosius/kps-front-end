import React from 'react';
import Navbar from '../components/Navbar';

export default function SchoolClasses() {
  return (
    <>
      <Navbar />
      <main className="content-area">
        <div className="app-container">
          <section className="site-card">
            <h1 className="text-2xl font-bold">School classes</h1>
            <p className="muted">Manage school classes/streams and assign class teachers.</p>
          </section>
        </div>
      </main>
    </>
  );
}

import React from 'react';
import Navbar from '../components/Navbar';

export default function MessageThreads() {
  return (
    <>
      <Navbar />
      <main className="content-area">
        <div className="app-container">
          <section className="site-card">
            <h1 className="text-2xl font-bold">Message threads</h1>
            <p className="muted">Manage communication threads between users.</p>
          </section>
        </div>
      </main>
    </>
  );
}

import React from 'react';
import Navbar from '../components/Navbar';

export default function Students() {
  return (
    <>
      <Navbar />
      <main className="content-area">
        <div className="app-container">
          <div className="site-card">
            <h1 className="text-2xl font-bold mb-4">Students</h1>
            <p className="text-gray-600">This is the Students page. You can list or manage student profiles here.</p>
          </div>
        </div>
      </main>
    </>
  );
}

import React, { useContext } from 'react';
import Navbar from '../components/Navbar';
import { AuthContext } from '../auth/AuthProvider';

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Navbar />
      <main className="content-area">
        <div className="app-container">
          <div className="site-card">
            <h1 className="text-2xl font-bold">Welcome, {user?.first_name || user?.username}!</h1>
            <p className="mt-2 text-gray-600">You are logged in as {user?.role}.</p>
          </div>
        </div>
      </main>
    </>
  );
}

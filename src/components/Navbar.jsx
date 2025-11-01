import React, { useContext } from 'react';
import { AuthContext } from '../auth/AuthProvider';

export default function Navbar() {
  const { logout } = useContext(AuthContext);
  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center">
      <h1 className="font-bold text-lg">KP School</h1>
      <button onClick={logout} className="bg-white text-blue-600 px-3 py-1 rounded">Logout</button>
    </nav>
  );
}

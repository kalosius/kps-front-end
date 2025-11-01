import React, { useState, useContext } from 'react';
import { AuthContext } from '../auth/AuthProvider';

export default function Register() {
  const { register } = useContext(AuthContext);
  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
    first_name: '',
    last_name: '',
    role: 'parent'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      alert('Registration successful! You can now log in.');
    } catch (err) {
      alert('Registration failed. Check console for details.');
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Register</h2>

        <input
          className="border p-2 w-full mb-3"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          className="border p-2 w-full mb-3"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="border p-2 w-full mb-3"
          placeholder="First Name"
          value={form.first_name}
          onChange={(e) => setForm({ ...form, first_name: e.target.value })}
        />
        <input
          className="border p-2 w-full mb-3"
          placeholder="Last Name"
          value={form.last_name}
          onChange={(e) => setForm({ ...form, last_name: e.target.value })}
        />
        <select
          className="border p-2 w-full mb-3"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="parent">Parent</option>
          <option value="teacher">Teacher</option>
          <option value="staff">Staff</option>
        </select>
        <input
          className="border p-2 w-full mb-3"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="bg-green-600 text-white w-full py-2 rounded">Register</button>
      </form>
    </div>
  );
}

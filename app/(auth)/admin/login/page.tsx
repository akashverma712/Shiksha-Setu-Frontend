// src/app/(auth)/admin/login/page.tsx
'use client';
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [form, setForm] = useState({ employeeId: '', password: '' });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/admin/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      toast.success('Login Successful!');
      router.push('/admin');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex items-center justify-center p-6 text-white">

      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-10 animate-fadeIn">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Admin Login</h1>
          <p className="text-gray-300 mt-2">Secure access portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          <input
            type="text"
            placeholder="Employee ID"
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:ring-4 focus:ring-indigo-400/40 focus:outline-none placeholder-gray-300"
            value={form.employeeId}
            onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:ring-4 focus:ring-indigo-400/40 focus:outline-none placeholder-gray-300"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 py-4 rounded-xl font-bold text-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
          >
            Login as Admin
          </button>
        </form>

        <p className="text-center mt-6 text-gray-400">
          First time?
          <a href="/admin/register" className="text-purple-400 font-semibold hover:underline ml-1">
            Register Here
          </a>
        </p>

      </div>
    </div>
  );
}

// src/app/(auth)/admin/register/page.tsx
'use client';
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Shield, Sparkles } from 'lucide-react';

export default function AdminRegister() {
	const [form, setForm] = useState({
		employeeId: '',
		name: '',
		email: '',
		password: '',
		department: '',
	});

	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await axios.post('http://localhost:5000/api/auth/admin/register', form);
			toast.success('First Admin created successfully! Redirecting to login...');
			setTimeout(() => router.push('/admin/login'), 1500);
		} catch (err: any) {
			toast.error(err.response?.data?.message || 'Registration failed');
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex items-center justify-center p-6">
			<div className="w-full max-w-2xl">
				{/* Hero Header */}
				<div className="text-center mb-12">
					<div className="flex justify-center mb-6">
						<div className="p-6 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl shadow-2xl ring-8 ring-purple-500/30">
							<Shield
								size={64}
								className="text-white drop-shadow-2xl"
							/>
						</div>
					</div>
					<h1 className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">Dropout AI</h1>
					<p className="text-2xl text-gray-300 mt-4 font-light">First Admin Registration</p>
					<div className="flex justify-center mt-4">
						<Sparkles
							className="text-yellow-400"
							size={32}
						/>
					</div>
				</div>

				{/* Registration Card */}
				<div
					className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl
                        ring-4 ring-purple-500/20 hover:ring-purple-500/40 transition-all duration-500">
					<h2 className="text-4xl font-bold text-center mb-8 text-purple-300">Create Master Admin Account</h2>
					<p className="text-center text-gray-400 mb-10">This will be the highest privilege account in the system</p>

					<form
						onSubmit={handleSubmit}
						className="space-y-7">
						<input
							type="text"
							placeholder="Employee ID (e.g. ADMIN001)"
							className="w-full px-6 py-5 rounded-2xl bg-white/10 border border-white/20 text-white text-lg
                         placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-500/50
                         focus:border-purple-400 transition-all duration-300"
							value={form.employeeId}
							onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
							required
						/>

						<input
							type="text"
							placeholder="Full Name"
							className="w-full px-6 py-5 rounded-2xl bg-white/10 border border-white/20 text-white text-lg
                         placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-500/50
                         focus:border-purple-400 transition-all duration-300"
							value={form.name}
							onChange={(e) => setForm({ ...form, name: e.target.value })}
							required
						/>

						<input
							type="email"
							placeholder="Email Address"
							className="w-full px-6 py-5 rounded-2xl bg-white/10 border border-white/20 text-white text-lg
                         placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-500/50
                         focus:border-purple-400 transition-all duration-300"
							value={form.email}
							onChange={(e) => setForm({ ...form, email: e.target.value })}
							required
						/>

						<input
							type="password"
							placeholder="Create Strong Password"
							className="w-full px-6 py-5 rounded-2xl bg-white/10 border border-white/20 text-white text-lg
                         placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-500/50
                         focus:border-purple-400 transition-all duration-300"
							value={form.password}
							onChange={(e) => setForm({ ...form, password: e.target.value })}
							required
						/>

						<input
							type="text"
							placeholder="Department / Designation"
							className="w-full px-6 py-5 rounded-2xl bg-white/10 border border-white/20 text-white text-lg
                         placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-500/50
                         focus:border-purple-400 transition-all duration-300"
							value={form.department}
							onChange={(e) => setForm({ ...form, department: e.target.value })}
							required
						/>

						<button
							type="submit"
							className="w-full py-6 rounded-2xl font-bold text-xl
                         bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600
                         hover:from-purple-500 hover:via-pink-500 hover:to-cyan-500
                         shadow-2xl hover:shadow-purple-500/50 transform hover:scale-[1.02]
                         transition-all duration-500 relative overflow-hidden group">
							<span className="relative z-10">Create Master Admin Account</span>
							<div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
						</button>
					</form>

					<p className="text-center text-gray-500 mt-8 text-sm">This action creates the first super admin. Use it wisely.</p>
				</div>

				{/* Decorative Orbs */}
				<div className="absolute inset-0 pointer-events-none overflow-hidden">
					<div className="absolute top-20 left-10 w-96 h-96 bg-purple-600 rounded-full filter blur-3xl opacity-10 animate-pulse" />
					<div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-600 rounded-full filter blur-3xl opacity-10 animate-pulse delay-1000" />
				</div>
			</div>
		</div>
	);
}

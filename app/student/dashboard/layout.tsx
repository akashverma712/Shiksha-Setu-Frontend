'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { GraduationCap, Home, FileText, Clock, DollarSign, Calendar, BookOpen, Users, LogOut, Menu, X, ChevronLeft, ChevronRight, Bell } from 'lucide-react';

const menuItems = [
	{ href: '/student/dashboard', label: 'Overview', icon: Home },
	{ href: '/student/dashboard/marks', label: 'Marks', icon: FileText },
	{ href: '/student/dashboard/attendance', label: 'Attendance', icon: Clock },
	{ href: '/student/dashboard/fees', label: 'Fee Details', icon: DollarSign },
	{ href: '/student/dashboard/routine', label: 'Routine', icon: Calendar },
	{ href: '/student/dashboard/assignments', label: 'Assignments', icon: BookOpen },
	{ href: '/student/dashboard/connect', label: 'Student Connect', icon: Users },
	{ href: '/student/dashboard/Ai', label: 'Siksha Help', icon: Users },
	{ href: '/student/dashboard/Scholarship', label: 'Scholarship', icon: Users },
	{ href: '/student/dashboard/counsellor', label: 'counsellor Connect', icon: Users },
];

export default function StudentDashboardLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const router = useRouter();

	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const isActive = (href: string) => pathname === href;

	// 🚨 BLOCK ACCESS IF NOT LOGGED IN
	useEffect(() => {
		const token = localStorage.getItem('token');
		if (!token) router.replace('/login');
	}, [router]);

	// 🚨 LOGOUT FUNCTION
	const handleLogout = () => {
		localStorage.removeItem('token'); // remove auth token
		router.replace('/login'); // redirect
	};

	return (
		<>
			<div className="min-h-screen bg-slate-950 text-white flex">
				{/* Desktop Sidebar */}
				<aside className={`fixed inset-y-0 left-0 z-50 bg-slate-900/95 backdrop-blur-xl border-r border-white/10 transition-all duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? 'w-64' : 'w-20'} ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
					<div className="flex flex-col h-full">
						{/* Header */}
						<div className="p-4 border-b border-white/10">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="p-2 bg-cyan-500/20 rounded-xl">
										<GraduationCap
											size={28}
											className="text-cyan-400"
										/>
									</div>
									{sidebarOpen && (
										<div>
											<h1 className=" font-bold">DropoutGuard</h1>
											<p className="text-xs text-gray-400">Student Portal</p>
										</div>
									)}
								</div>

								{/* Collapse Button */}
								<button
									onClick={() => setSidebarOpen(!sidebarOpen)}
									className="hidden lg:block p-1 ml-1 bg-slate-500 hover:bg-white/10 rounded-lg transition">
									{sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
								</button>
							</div>
						</div>

						{/* Navigation */}
						<nav className="flex-1 px-4 py-6 space-y-2">
							{menuItems.map((item) => {
								const Icon = item.icon;
								const active = isActive(item.href);

								return (
									<Link
										key={item.href}
										href={item.href}
										onClick={() => setMobileMenuOpen(false)}
										className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${active ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-lg shadow-cyan-500/10' : 'hover:bg-white/10 text-gray-300'}`}>
										<Icon size={22} />
										{sidebarOpen && <span className="font-medium">{item.label}</span>}
									</Link>
								);
							})}
						</nav>

						{/* Logout */}
						<div className="p-4 border-t border-white/10">
							<button
								onClick={handleLogout}
								className="flex items-center gap-4 w-full px-4 py-3 rounded-xl hover:bg-red-500/20 text-red-400 transition">
								<LogOut size={22} />
								{sidebarOpen && <span className="font-medium">Logout</span>}
							</button>
						</div>
					</div>
				</aside>

				{/* Main Content */}
				<div className="flex-1 flex flex-col">
					{/* Top Bar */}
					<header className="bg-slate-900/50 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40">
						<div className="flex items-center justify-between px-6 py-4">
							<button
								onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
								className="lg:hidden p-2 hover:bg-white/10 rounded-lg">
								{mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
							</button>

							<h2 className="text-2xl font-bold capitalize">{menuItems.find((item) => item.href === pathname)?.label || 'Dashboard'}</h2>

							<div className="flex items-center gap-4">
								<button className="p-2 hover:bg-white/10 rounded-lg relative">
									<Bell size={22} />
									<span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
								</button>

								<div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center font-bold">R</div>
							</div>
						</div>
					</header>

					{/* Page Content */}
					<main>{children}</main>
				</div>
			</div>

			{/* Mobile Overlay */}
			{mobileMenuOpen && (
				<div
					className="fixed inset-0 bg-black/50 z-40 lg:hidden"
					onClick={() => setMobileMenuOpen(false)}
				/>
			)}
		</>
	);
}

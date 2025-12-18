// app/teacher/dashboard/layout.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Users, Clock, CalendarCheck, BookOpen, AlertTriangle, LogOut, Menu, X, ChevronLeft, ChevronRight, Bell, Loader2, Sun, Moon } from 'lucide-react';
import { ThemeProvider, useTheme } from '@/app/ThemeProvider';

const teacherMenuItems = [
	{ href: '/teacher/dashboard', label: 'Dashboard', icon: Home },
	{ href: '/teacher/dashboard/attendance', label: 'Attendance', icon: Clock },
	{ href: '/teacher/dashboard/student', label: 'All Students', icon: Users },
	{ href: '/teacher/dashboard/marks', label: 'Upload Marks', icon: AlertTriangle },
	{ href: '/teacher/dashboard/timetable', label: 'My Timetable', icon: CalendarCheck },
	{ href: '/teacher/dashboard/assignments', label: 'Assignments', icon: BookOpen },
	// { href: '/teacher/dashboard/sms', label: 'Send Sms', icon: BookOpen },
];

// Theme Toggle Component (safe inside provider)
function ThemeToggle() {
	const { theme, toggleTheme } = useTheme();
	const isDark = theme === 'dark';

	return (
		<button
			onClick={toggleTheme}
			className={`p-2.5 rounded-lg transition-all ${isDark ? 'bg-white/10 hover:bg-white/20 text-yellow-300' : 'bg-gray-200 hover:bg-gray-300 text-orange-600'}`}
			aria-label="Toggle dark mode">
			{isDark ? <Moon size={20} /> : <Sun size={20} />}
		</button>
	);
}

// Child component that uses the theme (must be inside ThemeProvider)
function LayoutContent({ children }: { children: React.ReactNode }) {
	const { theme } = useTheme();
	const isDark = theme === 'dark';

	const router = useRouter();
	const pathname = usePathname();
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const isActive = (href: string) => pathname === href;

	return (
		<div className={`font-montserrat min-h-screen flex transition-colors duration-300 ${isDark ? 'bg-slate-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
			{/* Sidebar */}
			<aside className={`fixed inset-y-0 left-0 z-50 backdrop-blur-xl border-r transition-all duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? 'w-64' : 'w-20'} ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} ${isDark ? 'bg-slate-900/95 border-white/10' : 'bg-white/95 border-gray-200'}`}>
				<div className="flex flex-col h-full">
					{/* Sidebar Header */}
					<div className={`p-4 border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-purple-500/20 rounded-xl">
									<Users
										size={28}
										className="text-purple-400"
									/>
								</div>
								{sidebarOpen && (
									<div>
										<h1 className="font-bold text-xl">DropoutGuard</h1>
										<p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Faculty Portal</p>
									</div>
								)}
							</div>
							<button
								onClick={() => setSidebarOpen(!sidebarOpen)}
								className={`hidden lg:block p-1 rounded-lg transition ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
								{sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
							</button>
						</div>
					</div>

					{/* Navigation */}
					<nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
						{teacherMenuItems.map((item) => {
							const Icon = item.icon;
							const active = isActive(item.href);
							return (
								<Link
									key={item.href}
									href={item.href}
									onClick={() => setMobileMenuOpen(false)}
									className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group relative ${active ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 shadow-lg shadow-purple-500/10' : isDark ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>
									<Icon size={22} />
									{sidebarOpen && <span className="font-medium">{item.label}</span>}
									{!sidebarOpen && <span className={`absolute left-full ml-4 px-3 py-1 text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 text-white ${isDark ? 'bg-slate-800' : 'bg-gray-700'}`}>{item.label}</span>}
								</Link>
							);
						})}
					</nav>

					{/* Logout */}
					<div className={`p-4 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
						<button
							onClick={() => {
								localStorage.removeItem('token');
								localStorage.removeItem('user');
								router.push('/login');
							}}
							className={`flex items-center gap-4 w-full px-4 py-3 rounded-xl transition ${isDark ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-50 text-red-600'}`}>
							<LogOut size={22} />
							{sidebarOpen && <span className="font-medium">Logout</span>}
						</button>
					</div>
				</div>
			</aside>

			{/* Main Content */}
			<div className="flex-1 flex flex-col">
				{/* Header */}
				<header className={`backdrop-blur-xl border-b sticky top-0 z-40 transition-all ${isDark ? 'bg-slate-900/50 border-white/10' : 'bg-white/80 border-gray-200'}`}>
					<div className="flex items-center justify-between px-6 py-4">
						{/* Mobile Menu Toggle */}
						<button
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
							className={`lg:hidden p-2 rounded-lg transition ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
							{mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
						</button>

						{/* Page Title */}
						<h2 className="text-2xl font-bold capitalize">{teacherMenuItems.find((i) => i.href === pathname)?.label || 'Dashboard'}</h2>

						{/* Right Actions */}
						<div className="flex items-center gap-4">
							<ThemeToggle />
							<button className={`p-2 rounded-lg relative transition ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
								<Bell size={22} />
								<span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
							</button>
							<div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center font-bold text-white">{JSON.parse(localStorage.getItem('user') || '{}').name?.[0]?.toUpperCase() || 'T'}</div>
						</div>
					</div>
				</header>

				{/* Page Content */}
				<main className="flex-1 overflow-y-auto">{children}</main>
			</div>

			{/* Mobile Overlay */}
			{mobileMenuOpen && (
				<div
					className="fixed inset-0 bg-black/50 z-40 lg:hidden"
					onClick={() => setMobileMenuOpen(false)}
				/>
			)}
		</div>
	);
}

// Main Layout Component
export default function TeacherDashboardLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const pathname = usePathname();
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

	// Authentication check
	useEffect(() => {
		const checkAuth = () => {
			const token = localStorage.getItem('token');
			const user = localStorage.getItem('user');
			if (!token || !user) {
				router.replace('/login');
				return;
			}
			try {
				const parsedUser = JSON.parse(user);
				if (parsedUser.role !== 'Teacher' && parsedUser.role !== 'HOD') {
					router.replace('/login');
					return;
				}
				setIsAuthenticated(true);
			} catch (err) {
				localStorage.removeItem('token');
				localStorage.removeItem('user');
				router.replace('/login');
			}
		};
		checkAuth();
	}, [router, pathname]);

	// Loading state
	if (isAuthenticated === null) {
		return (
			<div className="min-h-screen bg-slate-950 flex items-center justify-center">
				<div className="text-center">
					<Loader2
						className="animate-spin text-purple-400 mx-auto"
						size={48}
					/>
					<p className="text-xl text-gray-400 mt-4">Verifying access...</p>
				</div>
			</div>
		);
	}

	if (!isAuthenticated) return null;

	return (
		<ThemeProvider>
			<LayoutContent>{children}</LayoutContent>
		</ThemeProvider>
	);
}

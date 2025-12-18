'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useTheme } from '@/app/ThemeProvider'; // Make sure path is correct
import { Users, Calendar, AlertTriangle, CheckCircle, BookOpen, Clock, TrendingUp, Trophy, MessageSquare, ChevronRight, Sparkles } from 'lucide-react';
import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend } from 'recharts';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function TeacherDashboard() {
	const { theme } = useTheme();
	const isDark = theme === 'dark';

	const [data, setData] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const token = localStorage.getItem('token');
				const res = await axios.get(`${API_URL}/api/teachers/me`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				setData(res.data.teacher);
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	if (loading || !data) {
		return (
			<div className={`min-h-screen flex items-center justify-center transition-colors ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`}>
				<div className={`text-xl animate-pulse ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Loading dashboard...</div>
			</div>
		);
	}

	// Attendance trend data
	const attendanceTrend = [
		{ day: 'Mon', attendance: 85 },
		{ day: 'Tue', attendance: 88 },
		{ day: 'Wed', attendance: 82 },
		{ day: 'Thu', attendance: 90 },
		{ day: 'Fri', attendance: 87 },
		{ day: 'Sat', attendance: 85 },
	];

	const radarData = [
		{ metric: 'Total Students', value: data.totalStudents || 0 },
		{ metric: 'Classes Today', value: data.classesToday || 0 },
		{ metric: 'Marked Today', value: data.markedToday || 0 },
		{ metric: 'Low Attendance', value: data.lowAttendanceCount || 0 },
		{ metric: 'Subjects', value: data.subjects?.length || 1 },
	];

	return (
		<div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
			{/* Top Banner */}
			<div className={`rounded-2xl mx-3 mt-4 p-6 relative overflow-hidden transition-all ${isDark ? 'bg-gradient-to-r from-orange-500/0 to-orange-600/30' : 'bg-gradient-to-r from-orange-400/20 to-orange-500/40'}`}>
				<Sparkles className={`absolute right-4 top-4 h-12 w-12 ${isDark ? 'text-white/40' : 'text-orange-600/50'}`} />
				<h1 className="text-3xl font-bold">Welcome back, {data.name || 'Teacher'}</h1>
				<p className={`text-sm ${isDark ? 'text-white/90' : 'text-gray-700'}`}>Teaching is a superpower—use it wisely today.</p>
			</div>

			{/* Main Content */}
			<div className="px-3 mt-6 pb-16 space-y-6">
				{/* Stats Grid */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
					<StatCard
						icon={<Users className="h-6 w-6 text-blue-400" />}
						title="Total Students"
						value={data.totalStudents}
						isDark={isDark}
					/>
					<StatCard
						icon={<Calendar className="h-6 w-6 text-emerald-400" />}
						title="Classes Today"
						value={data.classesToday}
						isDark={isDark}
					/>
					<StatCard
						icon={<AlertTriangle className="h-6 w-6 text-orange-400" />}
						title="At-Risk"
						value={data.lowAttendanceCount}
						isDark={isDark}
					/>
					<StatCard
						icon={<CheckCircle className="h-6 w-6 text-purple-400" />}
						title="Marked Today"
						value={data.markedToday}
						isDark={isDark}
					/>
				</div>

				{/* Charts Row */}
				<div className="grid md:grid-cols-2 gap-4">
					{/* Attendance Trend Chart */}
					<div className={`rounded-2xl p-4 border transition-all ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
						<h2 className="text-lg font-semibold mb-2">Weekly Attendance Trend</h2>
						<div className="w-full h-64">
							<ResponsiveContainer
								width="100%"
								height="100%">
								<AreaChart data={attendanceTrend}>
									<CartesianGrid
										strokeDasharray="3 3"
										stroke={isDark ? '#334155' : '#e2e8f0'}
									/>
									<XAxis
										dataKey="day"
										stroke={isDark ? '#94a3b8' : '#64748b'}
									/>
									<YAxis stroke={isDark ? '#94a3b8' : '#64748b'} />
									<Tooltip
										contentStyle={{
											backgroundColor: isDark ? '#1e293b' : '#ffffff',
											border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
											borderRadius: '8px',
											color: isDark ? '#e2e8f0' : '#1e293b',
										}}
									/>
									<Area
										type="monotone"
										dataKey="attendance"
										stroke="#f97316"
										fill="#f97316"
										fillOpacity={0.3}
										name="Attendance %"
									/>
								</AreaChart>
							</ResponsiveContainer>
						</div>
					</div>

					{/* Radar Chart */}
					<div className={`rounded-2xl p-4 border transition-all ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
						<h2 className="text-lg font-semibold mb-2">Radar Risk</h2>
						<div className="w-full h-64">
							<ResponsiveContainer
								width="100%"
								height="100%">
								<RadarChart data={radarData}>
									<PolarGrid stroke={isDark ? '#334155' : '#e2e8f0'} />
									<PolarAngleAxis
										dataKey="metric"
										stroke={isDark ? '#cbd5e1' : '#475569'}
									/>
									<PolarRadiusAxis stroke={isDark ? '#475569' : '#94a3b8'} />
									<Radar
										name="Metrics"
										dataKey="value"
										stroke="#f97316"
										fill="#f97316"
										fillOpacity={0.5}
									/>
									<Legend />
								</RadarChart>
							</ResponsiveContainer>
						</div>
					</div>
				</div>

				{/* My Subjects */}
				<div className={`rounded-2xl p-4 border transition-all ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
					<h2 className="text-xl font-semibold mb-4">My Subjects</h2>
					<div className="space-y-3">
						{data.subjects?.map((subject: any, index: number) => (
							<div
								key={index}
								className={`flex items-center justify-between p-3 rounded-xl transition-all ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
								<div className="flex items-center gap-3">
									<div className="p-2 rounded-lg bg-orange-500/20">
										<BookOpen className="h-5 w-5 text-orange-400" />
									</div>
									<div>
										<p className="font-semibold">
											{subject.subjectName} ({subject.subjectCode})
										</p>
										<p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
											Semester {subject.semester} • Section {subject.section} • {subject.program}
										</p>
									</div>
								</div>
								<div className="text-right">
									<p className="text-lg font-bold">{subject.totalStudents || 0} students</p>
									<p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Batch: {subject.batch}</p>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Quick Actions */}
				<div className={`rounded-2xl p-4 border transition-all ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
					<h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
					<div className="space-y-3">
						<QAItem
							icon={<BookOpen className="h-6 w-6 text-blue-400" />}
							title="Mark Attendance"
							subtitle="Quick access"
							isDark={isDark}
						/>
						<QAItem
							icon={<Users className="h-6 w-6 text-emerald-400" />}
							title="View All Students"
							subtitle="Manage records"
							isDark={isDark}
						/>
						<QAItem
							icon={<Clock className="h-6 w-6 text-purple-400" />}
							title="My Timetable"
							subtitle="Check schedule"
							isDark={isDark}
						/>
						<QAItem
							icon={<AlertTriangle className="h-6 w-6 text-orange-400" />}
							title="At-Risk Report"
							subtitle="View details"
							isDark={isDark}
						/>
					</div>
				</div>

				{/* Recent Activity */}
				<div className={`rounded-2xl p-4 border transition-all ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
					<h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
					<div className="space-y-3">
						<ActivityItem
							icon={<Trophy className="h-6 w-6 text-yellow-400" />}
							title="100% Attendance Achieved"
							subtitle={`${data.subjects?.[0]?.subjectName || 'ED'} - ${data.subjects?.[0]?.subjectCode || 'CS501'}`}
							badge="+50 XP"
							isDark={isDark}
						/>
						<ActivityItem
							icon={<MessageSquare className="h-6 w-6 text-blue-400" />}
							title="New Message from HOD"
							subtitle="Semester Planning"
							badge="NEW"
							isDark={isDark}
						/>
						<ActivityItem
							icon={<CheckCircle className="h-6 w-6 text-emerald-400" />}
							title="Attendance Completed"
							subtitle="Yesterday"
							badge="DONE"
							isDark={isDark}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

/* --- THEME-AWARE SMALL COMPONENTS --- */
function StatCard({ icon, title, value, isDark }: any) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			className={`rounded-xl p-4 border transition-all ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
			<div className="flex items-center justify-between">
				<div className={`p-2 rounded-lg ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>{icon}</div>
				<TrendingUp className={`${isDark ? 'text-green-400' : 'text-green-600'} h-5 w-5`} />
			</div>
			<p className="text-3xl font-bold mt-2">{value}</p>
			<p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>{title}</p>
		</motion.div>
	);
}

function QAItem({ icon, title, subtitle, isDark }: any) {
	return (
		<button className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'}`}>
			<div className="flex items-center gap-3">
				<div className={`p-2 rounded-lg ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>{icon}</div>
				<div>
					<p className="font-semibold text-left">{title}</p>
					<p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>{subtitle}</p>
				</div>
			</div>
			<ChevronRight className={`${isDark ? 'text-slate-500' : 'text-gray-500'} h-4 w-4`} />
		</button>
	);
}

function ActivityItem({ icon, title, subtitle, badge, isDark }: any) {
	return (
		<div className={`flex items-center justify-between p-3 rounded-xl transition-all ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'}`}>
			<div className="flex items-center gap-3">
				<div className={`p-2 rounded-lg ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>{icon}</div>
				<div>
					<p className="font-semibold">{title}</p>
					<p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>{subtitle}</p>
				</div>
			</div>
			<span className={`px-2 py-1 text-xs rounded-lg ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>{badge}</span>
		</div>
	);
}

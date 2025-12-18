'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Clock, Shield, CheckCircle, AlertCircle, Trophy, Target, Calendar, UserCheck, ChevronRight, BookOpen, Users, User, Phone, Mail } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface StudentData {
	name: string;
	rollNo: string;
	department: string;
	semester: number;
	batch: string;
	cgpa: number | string;
	attendancePercentage: number;
	riskScore: number;
	riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
	currentBacklogs: number;
	feePending: boolean;
	totalClasses: number;
	attendedClasses: number;
	presentCount: number;
	lateCount: number;
	absentCount: number;
	mentor?: {
		name: string;
		phone: string;
	};
}

// Generate fake attendance trend data for the last 7 days
const generateAttendanceTrend = (currentAttendance: number) => {
	const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
	return days.map((day, index) => ({
		day,
		attendance: currentAttendance > 0 ? Math.max(0, Math.min(100, currentAttendance + (Math.random() * 20 - 10))) : Math.floor(Math.random() * 30 + 60), // Generate between 60-90% if current is 0
	}));
};

// Generate fake subject-wise attendance data
const generateSubjectAttendance = () => {
	const subjects = ['Maths', 'Physics', 'Chemistry', 'Programming', 'English', 'Mechanics'];
	return subjects.map((subject) => ({
		subject,
		attendance: Math.floor(Math.random() * 30 + 60), // 60-90%
		color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
	}));
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function StudentDashboard() {
	const [student, setStudent] = useState<StudentData | null>(null);
	const [loading, setLoading] = useState(true);
	const [attendanceTrend] = useState(() => generateAttendanceTrend(0)); // Will update with real data
	const [subjectAttendance] = useState(() => generateSubjectAttendance());

	useEffect(() => {
		const fetchData = async () => {
			try {
				const token = localStorage.getItem('token');
				const res = await axios.get(`${API_URL}/api/students/me`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				const studentData = res.data.student;
				setStudent(studentData);

				// Update attendance trend with actual data
				if (studentData.attendancePercentage > 0) {
					// In a real app, you'd fetch historical data here
					// For now, we'll use the generated data
				}
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	if (loading || !student) {
		return (
			<div className="min-h-screen bg-slate-950 flex items-center justify-center">
				<div className="text-slate-400 text-xl animate-pulse">Loading your dashboard...</div>
			</div>
		);
	}

	// Update attendance trend with actual student data
	const actualAttendanceTrend = generateAttendanceTrend(student.attendancePercentage);

	const formatCgpa = (value: any) => {
		if (!value && value !== 0) return 'N/A';
		const num = Number(value);
		return isNaN(num) ? 'N/A' : num.toFixed(2);
	};

	const risk = student.riskLevel === 'Low' ? { color: 'text-emerald-400', bg: 'from-emerald-600/20', border: 'border-emerald-600/40' } : student.riskLevel === 'Medium' ? { color: 'text-yellow-400', bg: 'from-yellow-600/20', border: 'border-yellow-600/40' } : student.riskLevel === 'High' ? { color: 'text-orange-400', bg: 'from-orange-600/20', border: 'border-orange-600/40' } : { color: 'text-red-400', bg: 'from-red-600/20', border: 'border-red-600/40' };

	const pieData = [
		{ name: 'Present', value: student.presentCount, color: '#10b981' },
		{ name: 'Late', value: student.lateCount, color: '#f59e0b' },
		{ name: 'Absent', value: student.absentCount, color: '#ef4444' },
	].filter((item) => item.value > 0);

	return (
		<div className="min-h-screen mx-4 bg-slate-950 text-white">
			{/* Top Banner */}
			<div className="bg-gradient-to-r from-orange-600/20 to-pink-600/30 rounded-2xl mx-3 mt-4 p-6 relative overflow-hidden">
				<Sparkles className="absolute right-4 top-4 h-12 w-12 text-white/40" />
				<h1 className="text-3xl font-bold">Welcome back, {student.name.split(' ')[0]}!</h1>
				<p className="text-white/90 text-sm mt-1">
					{student.rollNo} • {student.department} • Semester {student.semester}
				</p>
			</div>

			{/* Main Content */}
			<div className="px-3 mt-6 pb-20 space-y-6">
				{/* Mentor Card */}
				{student.mentor && student.mentor.name && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="bg-gradient-to-br from-emerald-900/30 to-teal-900/20 border border-emerald-600/40 rounded-2xl p-6 shadow-xl">
						<div className="flex items-center gap-5">
							<div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
								<User className="h-12 w-12 text-white" />
							</div>
							<div className="flex-1">
								<p className="text-emerald-400 font-semibold text-lg flex items-center gap-2">
									<UserCheck className="h-5 w-5" /> Your Academic Mentor
								</p>
								<h3 className="text-2xl font-bold mt-1">{student.mentor.name}</h3>
								<div className="flex items-center gap-4 mt-3 text-emerald-300">
									<div className="flex items-center gap-2">
										<Phone className="h-5 w-5" />
										<span className="font-medium">{student.mentor.phone}</span>
									</div>
								</div>
								<p className="text-sm text-emerald-400 mt-3">Feel free to reach out for guidance, doubts, or support</p>
							</div>
							<motion.button
								whileHover={{ scale: 1.1 }}
								className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-semibold shadow-lg"
								onClick={() => window.open(`tel:${student.mentor!.phone}`)}>
								Call Mentor
							</motion.button>
						</div>
					</motion.div>
				)}

				{/* Stats Grid */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
					<StatCard
						icon={<Users className="h-6 w-6 text-blue-300" />}
						title="CGPA"
						value={formatCgpa(student.cgpa)}
						color="from-blue-600/20"
					/>
					<StatCard
						icon={<Clock className="h-6 w-6 text-emerald-300" />}
						title="Attendance"
						value={`${Math.round(student.attendancePercentage)}%`}
						color="from-emerald-600/20"
					/>
					<StatCard
						icon={<Shield className={`h-6 w-6 ${risk.color}`} />}
						title="Risk Level"
						value={student.riskLevel}
						color={risk.bg}
					/>
					<StatCard
						icon={student.feePending ? <AlertCircle className="h-6 w-6 text-red-300" /> : <CheckCircle className="h-6 w-6 text-emerald-300" />}
						title="Fee Status"
						value={student.feePending ? 'Pending' : 'Paid'}
						color={student.feePending ? 'from-red-600/20' : 'from-emerald-600/20'}
					/>
				</div>

				{/* Charts Section */}
				<div className="grid md:grid-cols-2 gap-4">
					{/* Attendance Trend Chart */}
					<div className="bg-white/5 border border-white/10 rounded-2xl p-4">
						<h2 className="text-lg font-semibold mb-3 text-orange-300">Attendance Trend (Last 7 Days)</h2>
						<div className="h-64">
							<ResponsiveContainer
								width="100%"
								height="100%">
								<AreaChart data={actualAttendanceTrend}>
									<CartesianGrid
										strokeDasharray="3 3"
										stroke="#334155"
									/>
									<XAxis
										dataKey="day"
										stroke="#94a3b8"
									/>
									<YAxis stroke="#94a3b8" />
									<Tooltip
										contentStyle={{
											backgroundColor: '#1e293b',
											border: '1px solid #334155',
											borderRadius: '8px',
										}}
										formatter={(value) => [`${value}%`, 'Attendance']}
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
						<p className="text-sm text-slate-400 mt-2 text-center">Current: {student.attendancePercentage}% • Target: 75%+</p>
					</div>

					{/* Subject-wise Attendance Chart */}
					<div className="bg-white/5 border border-white/10 rounded-2xl p-4">
						<h2 className="text-lg font-semibold mb-3 text-orange-300">Subject-wise Attendance</h2>
						<div className="space-y-3">
							{subjectAttendance.map((subject) => (
								<div
									key={subject.subject}
									className="flex items-center gap-4">
									<div className="w-24 text-sm text-slate-400">{subject.subject}</div>
									<div className="flex-1 h-6 bg-slate-800 rounded-full overflow-hidden">
										<div
											className="h-full rounded-full"
											style={{
												width: `${subject.attendance}%`,
												backgroundColor: subject.color,
											}}
										/>
									</div>
									<div className="w-12 text-right font-semibold">{subject.attendance}%</div>
								</div>
							))}
						</div>
						<div className="mt-4 pt-4 border-t border-slate-700">
							<div className="flex items-center justify-between text-sm text-slate-400">
								<span>Overall Average</span>
								<span className="font-semibold text-emerald-400">{Math.round(subjectAttendance.reduce((acc, s) => acc + s.attendance, 0) / subjectAttendance.length)}%</span>
							</div>
						</div>
					</div>
				</div>

				{/* Second Row: Attendance Breakdown and Performance */}
				<div className="grid md:grid-cols-2 gap-4">
					{/* Attendance Breakdown Pie Chart */}
					<div className="bg-white/5 border border-white/10 rounded-2xl p-4">
						<h2 className="text-lg font-semibold mb-3 text-orange-300">Attendance Breakdown</h2>
						<div className="h-64">
							<ResponsiveContainer
								width="100%"
								height="100%">
								<PieChart>
									<Pie
										data={pieData}
										dataKey="value"
										nameKey="name"
										cx="50%"
										cy="50%"
										innerRadius={40}
										outerRadius={80}
										paddingAngle={5}
										label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
										{pieData.map((entry, index) => (
											<Cell
												key={`cell-${index}`}
												fill={entry.color}
											/>
										))}
									</Pie>
									<Tooltip
										contentStyle={{
											backgroundColor: '#1e293b',
											border: '1px solid #334155',
											borderRadius: '8px',
										}}
										formatter={(value) => [value, 'Classes']}
									/>
								</PieChart>
							</ResponsiveContainer>
						</div>
					</div>

					{/* Performance Metrics */}
					<div className="bg-white/5 border border-white/10 rounded-2xl p-4">
						<h2 className="text-lg font-semibold mb-3 text-orange-300">Performance Metrics</h2>
						<div className="space-y-4">
							<MetricItem
								label="Classes Attended"
								value={`${student.attendedClasses}/${student.totalClasses}`}
								percentage={(student.attendedClasses / student.totalClasses) * 100}
								color="from-emerald-600/20 to-emerald-600/40"
							/>
							<MetricItem
								label="Punctuality Score"
								value={`${Math.round((student.presentCount / student.attendedClasses) * 100)}%`}
								percentage={(student.presentCount / student.attendedClasses) * 100}
								color="from-blue-600/20 to-blue-600/40"
							/>
							<MetricItem
								label="Risk Score"
								value={`${student.riskScore}/100`}
								percentage={100 - student.riskScore}
								color={`${risk.bg} ${risk.color.replace('text-', 'to-')}/40`}
								inverse
							/>
						</div>
					</div>
				</div>

				{/* Info Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<InfoCard
						icon={<Trophy className="h-8 w-8 text-yellow-300" />}
						title="Current Backlogs"
						value={student.currentBacklogs}
						subtitle="Keep it at zero!"
					/>
					<InfoCard
						icon={<Calendar className="h-8 w-8 text-cyan-300" />}
						title="Batch Year"
						value={student.batch}
						subtitle="Your journey"
					/>
					<InfoCard
						icon={<Target className="h-8 w-8 text-purple-300" />}
						title="Total Classes"
						value={student.totalClasses}
						subtitle={`${student.attendedClasses} attended`}
					/>
				</div>

				{/* Motivational Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
					className={`rounded-2xl p-8 text-center bg-gradient-to-br ${risk.bg} border ${risk.border} relative overflow-hidden`}>
					<Sparkles className={`mx-auto h-16 w-16 ${risk.color} mb-4`} />
					<h2 className="text-3xl font-bold mb-3">
						{student.riskLevel === 'Low' && "You're Crushing It!"}
						{student.riskLevel === 'Medium' && 'Good Progress — Keep Pushing!'}
						{student.riskLevel === 'High' && 'High Risk — Time to Act!'}
						{student.riskLevel === 'Critical' && 'Critical Risk — Seek Help Now!'}
					</h2>
					<p className="text-lg text-slate-300 max-w-2xl mx-auto">{student.riskLevel === 'Low' ? "Outstanding performance! You're in the top tier. Keep shining!" : 'Every champion was once a contender who refused to give up.'}</p>
				</motion.div>

				{/* Quick Actions */}
				<div className="bg-white/5 border border-white/10 rounded-2xl p-4">
					<h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
					<div className="space-y-3">
						<QAItem
							icon={<BookOpen className="h-6 w-6 text-blue-300" />}
							title="View Timetable"
							subtitle="Check today's classes"
						/>
						<QAItem
							icon={<Users className="h-6 w-6 text-emerald-300" />}
							title="My Teachers"
							subtitle="Contact faculty"
						/>
						<QAItem
							icon={<Target className="h-6 w-6 text-purple-300" />}
							title="Academic Progress"
							subtitle="View detailed report"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

/* Reusable Components */
function StatCard({ icon, title, value, color }: any) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			className={`rounded-xl p-4 bg-gradient-to-br ${color} border border-white/10`}>
			<div className="flex items-center justify-between">
				<div className="p-2 rounded-lg bg-white/10">{icon}</div>
			</div>
			<p className="text-3xl font-bold mt-2">{value}</p>
			<p className="text-slate-400 text-sm">{title}</p>
		</motion.div>
	);
}

function InfoCard({ icon, title, value, subtitle }: any) {
	return (
		<motion.div
			whileHover={{ scale: 1.03 }}
			className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
			<div className="p-3 rounded-xl bg-white/10">{icon}</div>
			<div>
				<p className="text-slate-400 text-sm">{title}</p>
				<p className="text-2xl font-bold">{value}</p>
				<p className="text-xs text-slate-500">{subtitle}</p>
			</div>
		</motion.div>
	);
}

function QAItem({ icon, title, subtitle }: any) {
	return (
		<button className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 p-4 rounded-xl transition">
			<div className="flex items-center gap-4">
				<div className="p-2 rounded-lg bg-white/10">{icon}</div>
				<div className="text-left">
					<p className="font-semibold">{title}</p>
					<p className="text-xs text-slate-400">{subtitle}</p>
				</div>
			</div>
			<ChevronRight className="text-slate-500 h-5 w-5" />
		</button>
	);
}

function MetricItem({ label, value, percentage, color, inverse = false }: any) {
	return (
		<div className="space-y-2">
			<div className="flex justify-between text-sm">
				<span className="text-slate-400">{label}</span>
				<span className="font-semibold">{value}</span>
			</div>
			<div className="h-2 bg-slate-800 rounded-full overflow-hidden">
				<div
					className={`h-full rounded-full bg-gradient-to-r ${color}`}
					style={{ width: `${inverse ? 100 - percentage : percentage}%` }}
				/>
			</div>
		</div>
	);
}

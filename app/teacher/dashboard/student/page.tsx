'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useTheme } from '@/app/ThemeProvider'; // Adjust path if needed
import { Search, Download, ChevronLeft, ChevronRight, Users, GraduationCap, Hash, BookOpen, Mail, Calendar, AlertCircle, Award, Eye, X, UserPlus, Phone, User, Check, TrendingUp, Clock, Target } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface BasicStudent {
	_id: string;
	name: string;
	email: string;
	rollNo: string;
	department: string;
	program: string;
	batch: string;
	semester: number;
	section: string;
	attendancePercentage: number;
	cgpa: number;
	currentBacklogs: number;
	riskScore?: number;
	riskLevel: 'Low' | 'Medium' | 'High';
	isAtRisk: boolean;
	feePending: boolean;
	mentor?: { name: string; phone: string };
}

interface FullStudent extends BasicStudent {
	phone?: string;
	familyIncome?: number;
	distanceFromCollege?: number;
	scholarship?: boolean;
	totalClasses: number;
	attendedClasses: number;
	presentCount: number;
	lateCount: number;
	absentCount: number;
	warnings: Array<{ reason: string; givenBy: { name: string } }>;
	attendanceSummary: { present: number; absent: number; late: number; total: number };
	riskScore: number;
}

export default function AllStudentsPage() {
	const { theme } = useTheme();
	const isDark = theme === 'dark';

	const [students, setStudents] = useState<BasicStudent[]>([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState('');
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalStudents, setTotalStudents] = useState(0);

	// Modal state
	const [selectedStudent, setSelectedStudent] = useState<FullStudent | null>(null);
	const [loadingDetails, setLoadingDetails] = useState(false);
	const [mentorName, setMentorName] = useState('');
	const [mentorPhone, setMentorPhone] = useState('');
	const [assigning, setAssigning] = useState(false);
	const [successMsg, setSuccessMsg] = useState('');
	const [sendingSMS, setSendingSMS] = useState(false);
	const [smsMessage, setSmsMessage] = useState('');

	useEffect(() => {
		fetchStudents();
	}, [page, search]);

	const fetchStudents = async () => {
		setLoading(true);
		try {
			const token = localStorage.getItem('token');
			if (!token) throw new Error('Please login');
			const params = { page, limit: 20, search: search || undefined };
			const res = await axios.get(`${API_URL}/api/students/all`, {
				params,
				headers: { Authorization: `Bearer ${token}` },
			});
			if (res.data.success) {
				setStudents(res.data.data.students);
				setTotalPages(res.data.data.pagination.pages || 1);
				setTotalStudents(res.data.data.pagination.total || 0);
			}
		} catch (err) {
			console.error(err);
			alert('Failed to load students');
		} finally {
			setLoading(false);
		}
	};

	const fetchStudentDetails = async (studentId: string) => {
		setLoadingDetails(true);
		try {
			const token = localStorage.getItem('token');
			const res = await axios.get(`${API_URL}/api/teachers/students/${studentId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			if (res.data.success) {
				setSelectedStudent(res.data.student);
			}
		} catch (err: any) {
			alert(err.response?.data?.message || 'Failed to load student details');
		} finally {
			setLoadingDetails(false);
		}
	};

	const handleViewProfile = async (student: BasicStudent) => {
		await fetchStudentDetails(student._id);
	};

	const assignMentor = async () => {
		if (!selectedStudent || !mentorName.trim() || !mentorPhone.trim()) {
			alert('Please enter mentor name and phone');
			return;
		}
		setAssigning(true);
		try {
			const token = localStorage.getItem('token');
			const res = await axios.put(`${API_URL}/api/teachers/assign-mentor/${selectedStudent._id}`, { name: mentorName.trim(), phone: mentorPhone.trim() }, { headers: { Authorization: `Bearer ${token}` } });
			if (res.data.success) {
				setSuccessMsg('Mentor assigned successfully!');
				if (selectedStudent) {
					selectedStudent.mentor = { name: mentorName.trim(), phone: mentorPhone.trim() };
					setSelectedStudent({ ...selectedStudent });
				}
				setTimeout(() => setSuccessMsg(''), 3000);
			}
		} catch (err: any) {
			alert(err.response?.data?.message || 'Failed to assign mentor');
		} finally {
			setAssigning(false);
		}
	};

	const getRiskColor = (level: string) => {
		const base = {
			Low: 'text-emerald-400 bg-emerald-900/30 border-emerald-800/50',
			Medium: 'text-yellow-400 bg-yellow-900/30 border-yellow-800/50',
			High: 'text-red-400 bg-red-900/30 border-red-800/50',
		}[level];
		return base || (isDark ? 'text-slate-400 bg-slate-800/50 border-slate-700' : 'text-gray-600 bg-gray-200 border-gray-300');
	};

	const getAttendanceColor = (p: number) => {
		if (p >= 85) return 'from-emerald-500 to-emerald-400';
		if (p >= 75) return 'from-yellow-500 to-amber-400';
		return 'from-red-500 to-pink-500';
	};

	const handleSendSMS = async () => {
		if (!selectedStudent?._id) return;
		setSendingSMS(true);
		try {
			const token = localStorage.getItem('token');
			const res = await axios.post(`${API_URL}/api/teachers/send-test-sms`, { message: smsMessage }, { headers: { Authorization: `Bearer ${token}` } });
			if (res.data.success) {
				alert('SMS sent successfully!');
				setSmsMessage('');
			}
		} catch (err: any) {
			alert(err.response?.data?.message || 'Failed to send SMS');
		} finally {
			setSendingSMS(false);
		}
	};

	if (loading) {
		return (
			<div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`}>
				<motion.div
					animate={{ rotate: 360 }}
					transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
					className="text-orange-500">
					<Users size={48} />
				</motion.div>
				<p className={`ml-4 text-xl ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Loading students...</p>
			</div>
		);
	}

	return (
		<>
			<div className={`min-h-screen transition-colors duration-300 p-6 ${isDark ? 'bg-slate-950 text-slate-200' : 'bg-gray-50 text-gray-800'}`}>
				<div className="mx-auto max-w-8xl">
					{/* Header */}
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
						<div className="flex items-center gap-5">
							<div className="rounded-2xl bg-gradient-to-br from-orange-600 to-pink-600 p-4 shadow-lg">
								<Users className="h-12 w-12 text-white" />
							</div>
							<div>
								<h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">All Students</h1>
								<p className={`${isDark ? 'text-slate-400' : 'text-gray-600'} mt-1`}>
									{totalStudents} students enrolled • {students.length} shown
								</p>
							</div>
						</div>
						<button className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-orange-600 to-pink-600 rounded-2xl font-bold text-white hover:scale-105 transition shadow-lg">
							<Download className="h-5 w-5" />
							Export CSV
						</button>
					</motion.div>

					{/* Search */}
					<div className="mb-8">
						<div className="relative max-w-2xl">
							<Search className={`absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 ${isDark ? 'text-slate-500' : 'text-gray-500'}`} />
							<input
								type="text"
								placeholder="Search by name, roll no, email, batch..."
								value={search}
								onChange={(e) => {
									setSearch(e.target.value);
									setPage(1);
								}}
								className={`w-full pl-14 pr-6 py-5 rounded-2xl outline-none text-lg transition-all ${isDark ? 'bg-slate-900/70 border border-slate-800 focus:border-orange-500 backdrop-blur-sm' : 'bg-white border border-gray-300 focus:border-orange-400'}`}
							/>
						</div>
					</div>

					{/* Students Grid */}
					{/* Students Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
						{students.map((student, index) => (
							<motion.div
								key={student._id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.05 }}
								className={`group relative rounded-2xl p-6 transition-all duration-300 overflow-hidden border ${isDark ? 'bg-slate-900/80 backdrop-blur-xl border-slate-800 hover:border-orange-500/50' : 'bg-white border-gray-200 hover:border-orange-400/50 shadow-sm'}`}>
								{/* Background Icon */}
								<div className="absolute right-0 top-0 opacity-5 pointer-events-none">
									<GraduationCap
										size={140}
										className="text-orange-600"
									/>
								</div>

								{/* Header */}
								<div className="flex items-start justify-between mb-5">
									<div className="flex items-center gap-4">
										<div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-600/10 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
											{student.name
												.split(' ')
												.map((n) => n[0])
												.join('')
												.toUpperCase()}
										</div>
										<div>
											<h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{student.name}</h3>
											<p className="text-orange-400 font-mono text-sm">{student.rollNo}</p>
										</div>
									</div>

									{/* Risk Level + Score */}
									<div className="text-right space-y-1">
										{/* Risk Level Badge */}
										<div className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 justify-center ${getRiskColor(student.riskLevel)}`}>
											{student.riskLevel === 'High' && <AlertCircle size={14} />}
											{student.riskLevel === 'Medium' && <AlertCircle size={14} />}
											{student.riskLevel === 'Low' && <Target size={14} />}
											{student.riskLevel}
										</div>

										{/* Risk Score */}
										<p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
											Risk Score: <span className="font-bold text-orange-400">{student.riskScore ?? 'N/A'}</span>
										</p>
									</div>
								</div>

								{/* Info Grid */}
								<div className="grid grid-cols-2 gap-4 mb-6 text-sm">
									<div className="flex items-center gap-3">
										<Hash className={`h-5 w-5 ${isDark ? 'text-slate-500' : 'text-gray-500'}`} />
										<div>
											<p className={`${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Batch</p>
											<p className="font-semibold">{student.batch}</p>
										</div>
									</div>
									<div className="flex items-center gap-3">
										<BookOpen className="h-5 w-5 text-emerald-400" />
										<div>
											<p className={`${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Semester</p>
											<p className="font-semibold">
												Sem {student.semester} • Sec {student.section}
											</p>
										</div>
									</div>
									<div className="flex items-center gap-3">
										<Mail className="h-5 w-5 text-blue-400" />
										<div>
											<p className={`${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Email</p>
											<p className={`font-mono text-xs ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>{student.email}</p>
										</div>
									</div>
									<div className="flex items-center gap-3">
										<GraduationCap className="h-5 w-5 text-purple-400" />
										<div>
											<p className={`${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Program</p>
											<p className="font-semibold">
												{student.program} - {student.department}
											</p>
										</div>
									</div>
								</div>

								{/* Attendance Section */}
								<div className="mb-6">
									<div className="flex justify-between items-center mb-3">
										<span className={`text-sm flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
											<Calendar className="h-4 w-4" /> Attendance
										</span>
										<span className="text-2xl font-bold text-orange-400">{student.attendancePercentage}%</span>
									</div>
									<div className={`w-full rounded-full h-4 overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-gray-200'}`}>
										<motion.div
											initial={{ width: 0 }}
											animate={{ width: `${student.attendancePercentage}%` }}
											transition={{ duration: 1, delay: 0.3 }}
											className={`h-full rounded-full bg-gradient-to-r ${getAttendanceColor(student.attendancePercentage)}`}
										/>
									</div>
									{/* <div className={`flex justify-between text-xs mt-2 ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
										<span>P: {student.presentCount ?? Math.round((student.attendancePercentage / 100) * (student.totalClasses || 0)) ?? 0}</span>
										<span>L: {student.lateCount ?? 0}</span>
										<span>A: {student.absentCount ?? 0}</span>
									</div> */}
								</div>

								{/* Stats Row */}
								<div className="grid grid-cols-3 gap-4 text-center">
									<div className={`rounded-xl p-4 border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
										<Award className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
										<p className="text-2xl font-bold">{student.cgpa?.toFixed(2) || 'N/A'}</p>
										<p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>CGPA</p>
									</div>
									<div className={`rounded-xl p-4 border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
										<AlertCircle className="h-6 w-6 text-red-400 mx-auto mb-2" />
										<p className="text-2xl font-bold">{student.currentBacklogs}</p>
										<p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Backlogs</p>
									</div>
									<div className={`rounded-xl p-4 border ${student.feePending ? (isDark ? 'border-red-500/50' : 'border-red-400') : isDark ? 'border-emerald-500/50' : 'border-emerald-400'}`}>
										{student.feePending ? <AlertCircle className="h-6 w-6 text-red-400 mx-auto mb-2" /> : <Check className="h-6 w-6 text-emerald-400 mx-auto mb-2" />}
										<p className={`text-lg font-bold ${student.feePending ? 'text-red-400' : 'text-emerald-400'}`}>{student.feePending ? 'Fee Due' : 'Paid'}</p>
										<p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Fee Status</p>
									</div>
								</div>

								{/* Action Button */}
								<button
									onClick={() => handleViewProfile(student)}
									className={`mt-6 w-full py-3 rounded-xl font-medium transition flex items-center justify-center gap-2 ${isDark ? 'bg-gradient-to-r from-orange-600/20 to-pink-600/20 hover:from-orange-600/40 hover:to-pink-600/40 text-orange-300' : 'bg-gradient-to-r from-orange-100 to-pink-100 hover:from-orange-200 hover:to-pink-200 text-orange-700'}`}>
									<Eye size={18} />
									View Full Profile
								</button>
							</motion.div>
						))}
					</div>

					{/* Pagination */}
					{totalPages > 1 && (
						<div className="mt-12 flex items-center justify-center gap-4">
							<button
								onClick={() => setPage((p) => Math.max(1, p - 1))}
								disabled={page === 1}
								className={`p-4 rounded-xl transition disabled:opacity-50 ${isDark ? 'bg-slate-900 border border-slate-800 hover:bg-slate-800' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}>
								<ChevronLeft size={24} />
							</button>
							<span className="px-8 py-4 bg-orange-600 text-white font-bold rounded-xl shadow-lg">
								Page {page} of {totalPages}
							</span>
							<button
								onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
								disabled={page === totalPages}
								className={`p-4 rounded-xl transition disabled:opacity-50 ${isDark ? 'bg-slate-900 border border-slate-800 hover:bg-slate-800' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}>
								<ChevronRight size={24} />
							</button>
						</div>
					)}
				</div>
			</div>

			{/* Full Student Details Modal */}
			{selectedStudent && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
					onClick={() => !loadingDetails && !assigning && setSelectedStudent(null)}>
					<motion.div
						initial={{ scale: 0.9, opacity: 0, y: 20 }}
						animate={{ scale: 1, opacity: 1, y: 0 }}
						onClick={(e) => e.stopPropagation()}
						className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}`}>
						{/* Modal Header */}
						<div className={`sticky top-0 backdrop-blur-sm border-b p-6 z-10 ${isDark ? 'bg-slate-900/95 border-slate-800' : 'bg-white/95 border-gray-200'}`}>
							<div className="flex justify-between items-center">
								<div className="flex items-center gap-4">
									<div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
										{selectedStudent.name
											.split(' ')
											.map((n) => n[0])
											.join('')
											.toUpperCase()}
									</div>
									<div>
										<h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedStudent.name}</h2>
										<p className="text-orange-400 font-mono text-sm">{selectedStudent.rollNo}</p>
									</div>
								</div>
								<button
									onClick={() => setSelectedStudent(null)}
									disabled={loadingDetails || assigning}
									className={`${isDark ? 'text-slate-500 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition disabled:opacity-50`}>
									<X size={28} />
								</button>
							</div>
						</div>

						<div className="p-6 space-y-8">
							{loadingDetails ? (
								<div className="flex items-center justify-center py-12">
									<motion.div
										animate={{ rotate: 360 }}
										transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
										className="text-orange-500 mr-4">
										<Users size={32} />
									</motion.div>
									<p className={`${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Loading details...</p>
								</div>
							) : (
								<>
									{/* Student Info Grid */}
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div className="space-y-4">
											<div className="flex items-center gap-3">
												<BookOpen className="h-5 w-5 text-emerald-400" />
												<div>
													<p className={`${isDark ? 'text-slate-400' : 'text-gray-600'} text-sm`}>Academic Details</p>
													<p className="font-semibold">
														{selectedStudent.program} - {selectedStudent.department}
													</p>
													<p className={`${isDark ? 'text-slate-300' : 'text-gray-700'} text-sm`}>
														Batch: {selectedStudent.batch} • Sem {selectedStudent.semester} • Sec {selectedStudent.section}
													</p>
												</div>
											</div>
											<div className="flex items-center gap-3">
												<Mail className="h-5 w-5 text-blue-400" />
												<div>
													<p className={`${isDark ? 'text-slate-400' : 'text-gray-600'} text-sm`}>Contact</p>
													<p className="font-mono text-sm">{selectedStudent.email}</p>
													{selectedStudent.phone && <p className={`${isDark ? 'text-slate-300' : 'text-gray-700'} text-sm`}>{selectedStudent.phone}</p>}
												</div>
											</div>
											<div className="flex items-center gap-3">
												<Award className="h-5 w-5 text-yellow-400" />
												<div>
													<p className={`${isDark ? 'text-slate-400' : 'text-gray-600'} text-sm`}>Performance</p>
													<p className="font-semibold">CGPA: {selectedStudent.cgpa ? Number(selectedStudent.cgpa).toFixed(2) : 'N/A'}</p>
													<p className={`${isDark ? 'text-slate-300' : 'text-gray-700'} text-sm`}>Backlogs: {selectedStudent.currentBacklogs}</p>
												</div>
											</div>
										</div>
										<div className="space-y-4">
											<div className="flex items-center gap-3">
												<Calendar className="h-5 w-5 text-orange-400" />
												<div>
													<p className={`${isDark ? 'text-slate-400' : 'text-gray-600'} text-sm`}>Attendance</p>
													<p className="font-semibold">{selectedStudent.attendancePercentage}%</p>
													<div className={`w-full rounded-full h-2 mt-1 ${isDark ? 'bg-slate-800' : 'bg-gray-200'}`}>
														<motion.div
															initial={{ width: 0 }}
															animate={{ width: `${selectedStudent.attendancePercentage}%` }}
															className={`h-full rounded-full bg-gradient-to-r ${getAttendanceColor(selectedStudent.attendancePercentage)}`}
														/>
													</div>
													<p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>
														P: {selectedStudent.attendanceSummary?.present || 0} | L: {selectedStudent.attendanceSummary?.late || 0} | A: {selectedStudent.attendanceSummary?.absent || 0}
													</p>
												</div>
											</div>
											<div className={`p-3 rounded-xl ${getRiskColor(selectedStudent.riskLevel)}`}>
												<p className="font-semibold flex items-center gap-2">
													<TrendingUp className="h-5 w-5" />
													Risk Level: {selectedStudent.riskLevel}
												</p>
												<p className="text-xs mt-1">Score: {selectedStudent.riskScore || 0}</p>
												{selectedStudent.isAtRisk && <p className="text-xs">⚠️ At Risk</p>}
											</div>
											<div className="flex items-center gap-3">
												<Clock className="h-5 w-5 text-purple-400" />
												<div>
													<p className={`${isDark ? 'text-slate-400' : 'text-gray-600'} text-sm`}>Socio-Economic</p>
													<p className={`${isDark ? 'text-slate-300' : 'text-gray-700'} text-sm`}>Income: ₹{selectedStudent.familyIncome?.toLocaleString() || 'N/A'}</p>
													<p className={`${isDark ? 'text-slate-300' : 'text-gray-700'} text-sm`}>Distance: {selectedStudent.distanceFromCollege || 'N/A'} km</p>
													<p className={`text-sm ${selectedStudent.scholarship ? 'text-emerald-400' : isDark ? 'text-slate-400' : 'text-gray-600'}`}>Scholarship: {selectedStudent.scholarship ? 'Yes' : 'No'}</p>
												</div>
											</div>
										</div>
									</div>

									{/* Fee & Warnings */}
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div className={`p-4 rounded-xl border ${selectedStudent.feePending ? (isDark ? 'border-red-500/50 bg-red-900/20' : 'border-red-400 bg-red-50') : isDark ? 'border-emerald-500/50 bg-emerald-900/20' : 'border-emerald-400 bg-emerald-50'}`}>
											<p className="font-semibold text-lg">{selectedStudent.feePending ? '💸 Fee Pending' : '✅ Fee Paid'}</p>
											<p className={`text-sm mt-2 ${selectedStudent.feePending ? 'text-red-400' : 'text-emerald-400'}`}>Status: {selectedStudent.feePending ? 'Overdue' : 'Current'}</p>
										</div>
										{selectedStudent.warnings && selectedStudent.warnings.length > 0 && (
											<div className={`p-4 rounded-xl border border-yellow-500/50 ${isDark ? 'bg-yellow-900/20' : 'bg-yellow-50'}`}>
												<p className="font-semibold text-lg flex items-center gap-2">
													<AlertCircle className="text-yellow-400" />
													Warnings ({selectedStudent.warnings.length})
												</p>
												<ul className={`mt-2 space-y-1 text-sm ${isDark ? 'text-yellow-300' : 'text-yellow-700'}`}>
													{selectedStudent.warnings.slice(0, 3).map((w, i) => (
														<li
															key={i}
															className="flex items-center gap-2">
															• {w.reason} (by {w.givenBy?.name || 'Staff'})
														</li>
													))}
													{selectedStudent.warnings.length > 3 && <li className={`text-xs ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>... and {selectedStudent.warnings.length - 3} more</li>}
												</ul>
											</div>
										)}
									</div>

									{/* Current Mentor */}
									{selectedStudent.mentor && (
										<div className={`p-4 rounded-xl border ${isDark ? 'bg-emerald-900/20 border-emerald-800/50' : 'bg-emerald-50 border-emerald-300'}`}>
											<p className={`text-sm font-semibold flex items-center gap-2 mb-2 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
												<User className="h-4 w-4" />
												Current Mentor
											</p>
											<p className="font-medium">{selectedStudent.mentor.name}</p>
											<p className={`${isDark ? 'text-emerald-300' : 'text-emerald-600'} text-sm`}>{selectedStudent.mentor.phone}</p>
										</div>
									)}

									{/* SEND SMS SECTION */}
									<div className={`mt-8 p-6 rounded-2xl border transition-all ${isDark ? 'bg-gradient-to-br from-blue-900/30 to-purple-900/20 border-blue-700/50' : 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-300'}`}>
										<h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
											<Phone className="h-5 w-5" />
											Send Test SMS (Only to +917479676602)
										</h3>
										<textarea
											value={smsMessage}
											onChange={(e) => setSmsMessage(e.target.value)}
											placeholder="Type your message here..."
											className={`w-full px-4 py-3 rounded-xl outline-none text-sm resize-none transition-all ${isDark ? 'bg-slate-800/70 border border-slate-700 focus:border-blue-500' : 'bg-white border border-gray-300 focus:border-blue-400'}`}
											rows={4}
										/>
										<div className="flex justify-between items-center mt-4">
											<p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>To: +917479676602 (Admin)</p>
											<button
												onClick={handleSendSMS}
												disabled={sendingSMS || !smsMessage.trim()}
												className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${isDark ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-105 disabled:opacity-60' : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:scale-105 disabled:opacity-60'}`}>
												{sendingSMS ? (
													<>
														<motion.div
															animate={{ rotate: 360 }}
															transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
															className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full"
														/>
														Sending...
													</>
												) : (
													<>
														<Phone className="h-5 w-5" />
														Send SMS
													</>
												)}
											</button>
										</div>
										{smsMessage && <p className={`text-xs mt-2 text-right ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>{smsMessage.length} characters</p>}
									</div>

									{/* Assign Mentor Form */}
									<div className={`p-6 rounded-2xl border transition-all ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
										<h3 className="text-xl font-bold text-orange-400 mb-4 flex items-center gap-2">
											<UserPlus className="h-5 w-5" />
											Assign / Update Mentor
										</h3>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											<div>
												<label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Mentor Name</label>
												<input
													type="text"
													value={mentorName}
													onChange={(e) => setMentorName(e.target.value)}
													placeholder="e.g., Dr. Rajesh Kumar"
													className={`w-full px-4 py-3 rounded-xl outline-none transition text-sm ${isDark ? 'bg-slate-900 border border-slate-700 focus:border-orange-500' : 'bg-white border border-gray-300 focus:border-orange-400'}`}
													disabled={assigning}
												/>
											</div>
											<div>
												<label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Phone Number</label>
												<input
													type="tel"
													value={mentorPhone}
													onChange={(e) => setMentorPhone(e.target.value)}
													placeholder="e.g., +91 98765 43210"
													className={`w-full px-4 py-3 rounded-xl outline-none transition text-sm ${isDark ? 'bg-slate-900 border border-slate-700 focus:border-orange-500' : 'bg-white border border-gray-300 focus:border-orange-400'}`}
													disabled={assigning}
												/>
											</div>
										</div>
										{successMsg && (
											<motion.p
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												className={`mt-4 p-3 rounded-xl text-center font-medium ${isDark ? 'bg-emerald-900/30 border border-emerald-700 text-emerald-400' : 'bg-emerald-100 border border-emerald-300 text-emerald-700'}`}>
												{successMsg}
											</motion.p>
										)}
										<div className="flex flex-col sm:flex-row gap-4 mt-6">
											<button
												onClick={() => setSelectedStudent(null)}
												disabled={assigning}
												className={`flex-1 py-3 rounded-xl transition font-medium disabled:opacity-50 ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-gray-200 hover:bg-gray-300'}`}>
												Close
											</button>
											<button
												onClick={assignMentor}
												disabled={assigning || !mentorName.trim() || !mentorPhone.trim()}
												className="flex-1 py-3 bg-gradient-to-r from-orange-600 to-pink-600 text-white font-bold rounded-xl hover:scale-105 transition disabled:opacity-70 flex items-center justify-center gap-2">
												{assigning ? (
													<motion.div
														animate={{ rotate: 360 }}
														transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
														className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full"
													/>
												) : (
													<>
														<UserPlus className="h-5 w-5" />
														Assign Mentor
													</>
												)}
											</button>
										</div>
									</div>
								</>
							)}
						</div>
					</motion.div>
				</motion.div>
			)}
		</>
	);
}

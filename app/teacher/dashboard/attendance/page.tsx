'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useTheme } from '@/app/ThemeProvider'; // Adjust path if needed
import { CheckCircle, XCircle, Clock3, Upload, Users, Calendar, BookOpen, Loader2, UserCheck, UserX } from 'lucide-react';

interface Student {
	_id: string;
	name: string;
	rollNo: string;
}

export default function AttendancePage() {
	const { theme } = useTheme();
	const isDark = theme === 'dark';

	const [students, setStudents] = useState<Student[]>([]);
	const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'late' | undefined>>({});
	const [subjectCode, setSubjectCode] = useState('');
	const [subjectName, setSubjectName] = useState('');
	const [loading, setLoading] = useState(true);
	const [uploading, setUploading] = useState(false);

	useEffect(() => {
		fetchStudents();
	}, []);

	const fetchStudents = async () => {
		setLoading(true);
		try {
			const token = localStorage.getItem('token');
			if (!token) throw new Error('Please login again');
			const res = await axios.get('http://localhost:5000/api/teachers/my-students', {
				headers: { Authorization: `Bearer ${token}` },
			});
			if (res.data.success) {
				setStudents(res.data.students || []);
			} else {
				toast.error(res.data.message || 'Failed to load students');
			}
		} catch (err: any) {
			toast.error(err.response?.data?.message || 'Failed to load students');
		} finally {
			setLoading(false);
		}
	};

	const handleStatusChange = useCallback((studentId: string, status: 'present' | 'absent' | 'late') => {
		setAttendance((prev) => {
			if (prev[studentId] === status) {
				const { [studentId]: _, ...rest } = prev;
				return rest;
			}
			return { ...prev, [studentId]: status };
		});
	}, []);

	const markAll = (status: 'present' | 'absent' | 'late') => {
		const newAttendance: Record<string, 'present' | 'absent' | 'late'> = {};
		students.forEach((s) => {
			newAttendance[s._id] = status;
		});
		setAttendance(newAttendance);
	};

	const handleUpload = async () => {
		if (!subjectCode.trim()) {
			toast.error('Please enter Subject Code');
			return;
		}
		const markedCount = Object.keys(attendance).length;
		if (markedCount === 0) {
			toast.error('Mark attendance for at least one student');
			return;
		}
		const entries = Object.entries(attendance)
			.filter(([_, status]) => status !== undefined)
			.map(([studentId, status]) => ({
				studentId,
				status: status as 'present' | 'absent' | 'late',
				subjectCode: subjectCode.toUpperCase(),
				subjectName: subjectName.trim() || subjectCode.toUpperCase(),
				date: new Date().toISOString(),
			}));

		setUploading(true);
		try {
			const token = localStorage.getItem('token');
			await axios.post('http://localhost:5000/api/attendance/upload', entries, {
				headers: { Authorization: `Bearer ${token}` },
			});
			toast.success(`Attendance uploaded for ${entries.length} students!`);
			setAttendance({});
			setSubjectCode('');
			setSubjectName('');
		} catch (err: any) {
			toast.error(err.response?.data?.message || 'Upload failed');
		} finally {
			setUploading(false);
		}
	};

	const presentCount = Object.values(attendance).filter((s) => s === 'present').length;
	const lateCount = Object.values(attendance).filter((s) => s === 'late').length;
	const absentCount = Object.values(attendance).filter((s) => s === 'absent').length;
	const markedCount = Object.keys(attendance).length;

	return (
		<div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-950 text-slate-200' : 'bg-gray-50 text-gray-800'} p-8`}>
			<div className="mx-auto max-w-7xl space-y-10">
				{/* HEADER */}
				<motion.div
					initial={{ opacity: 0, y: -15 }}
					animate={{ opacity: 1, y: 0 }}
					className="flex items-center gap-5">
					<div className="rounded-2xl bg-gradient-to-br from-orange-600 to-pink-600 p-4 shadow-lg">
						<Calendar className="h-10 w-10 text-white" />
					</div>
					<div>
						<h1 className="text-4xl font-bold text-orange-500">Attendance Panel</h1>
						<p className={`mt-1 text-sm tracking-wide ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
							{new Date().toLocaleDateString('en-US', {
								weekday: 'long',
								year: 'numeric',
								month: 'long',
								day: 'numeric',
							})}
						</p>
					</div>
				</motion.div>

				{/* SUBJECT CARD */}
				<div className={`rounded-2xl p-8 shadow-xl border transition-all ${isDark ? 'bg-slate-900/80 backdrop-blur-sm border-slate-800' : 'bg-white border-gray-200'}`}>
					<h3 className="text-xl font-bold mb-6 flex items-center gap-3">
						<BookOpen className="h-6 w-6 text-orange-400" />
						Subject Details
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<input
							type="text"
							placeholder="Subject Code (Required)"
							value={subjectCode}
							onChange={(e) => setSubjectCode(e.target.value)}
							className={`px-5 py-4 rounded-xl outline-none transition ${isDark ? 'bg-slate-800/70 border border-slate-700 focus:border-orange-500' : 'bg-gray-100 border border-gray-300 focus:border-orange-400'}`}
						/>
						<input
							type="text"
							placeholder="Subject Name (Optional)"
							value={subjectName}
							onChange={(e) => setSubjectName(e.target.value)}
							className={`px-5 py-4 rounded-xl outline-none transition ${isDark ? 'bg-slate-800/70 border border-slate-700 focus:border-orange-500' : 'bg-gray-100 border border-gray-300 focus:border-orange-400'}`}
						/>
					</div>
				</div>

				{/* SUMMARY STATS */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
					<div className={`p-6 rounded-2xl border text-center transition-all ${isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-gray-200 shadow-sm'}`}>
						<UserCheck className="mx-auto h-9 w-9 text-emerald-400 mb-3" />
						<div className="text-3xl font-bold">{presentCount}</div>
						<p className="text-emerald-300 text-sm mt-1">Present</p>
					</div>
					<div className={`p-6 rounded-2xl border text-center transition-all ${isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-gray-200 shadow-sm'}`}>
						<Clock3 className="mx-auto h-9 w-9 text-yellow-400 mb-3" />
						<div className="text-3xl font-bold">{lateCount}</div>
						<p className="text-yellow-300 text-sm mt-1">Late</p>
					</div>
					<div className={`p-6 rounded-2xl border text-center transition-all ${isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-gray-200 shadow-sm'}`}>
						<UserX className="mx-auto h-9 w-9 text-red-400 mb-3" />
						<div className="text-3xl font-bold">{absentCount}</div>
						<p className="text-red-300 text-sm mt-1">Absent</p>
					</div>
					<div className={`p-6 rounded-2xl border text-center transition-all ${isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-gray-200 shadow-sm'}`}>
						<Users className="mx-auto h-9 w-9 text-orange-400 mb-3" />
						<div className="text-3xl font-bold">{students.length}</div>
						<p className="text-orange-300 text-sm mt-1">Total Students</p>
					</div>
				</div>

				{/* QUICK ACTIONS */}
				<div className="flex justify-end gap-4 flex-wrap">
					<button
						onClick={() => markAll('present')}
						className={`px-6 py-3 rounded-xl flex gap-2 items-center transition ${isDark ? 'bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300' : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700'}`}>
						<CheckCircle size={18} /> Mark All Present
					</button>
					<button
						onClick={() => markAll('absent')}
						className={`px-6 py-3 rounded-xl flex gap-2 items-center transition ${isDark ? 'bg-red-600/20 hover:bg-red-600/40 text-red-300' : 'bg-red-100 hover:bg-red-200 text-red-700'}`}>
						<XCircle size={18} /> Mark All Absent
					</button>
				</div>

				{/* STUDENT LIST */}
				<div className={`rounded-2xl shadow-xl overflow-hidden border transition-all ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-gray-200'}`}>
					{loading ? (
						<div className="py-24 text-center">
							<Loader2 className="mx-auto h-16 w-16 text-orange-500 animate-spin" />
							<p className={`mt-4 text-lg ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Loading students…</p>
						</div>
					) : students.length === 0 ? (
						<div className="py-24 text-center">
							<Users className={`mx-auto h-16 w-16 mb-4 ${isDark ? 'text-slate-600' : 'text-gray-400'}`} />
							<p className={`text-lg ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>No students assigned to you</p>
						</div>
					) : (
						<>
							<div className="max-h-[500px] overflow-y-auto">
								{students.map((student, index) => {
									const status = attendance[student._id];
									return (
										<motion.div
											key={student._id}
											initial={{ opacity: 0, x: -20 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: index * 0.02 }}
											className={`px-8 py-5 border-b transition-all ${isDark ? 'border-slate-800 hover:bg-slate-800/50' : 'border-gray-200 hover:bg-gray-50'}`}>
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-6">
													<span className="font-mono text-orange-400 font-bold text-lg min-w-[80px]">{student.rollNo}</span>
													<span className="font-semibold text-lg">{student.name}</span>
												</div>
												<div className="flex items-center gap-4">
													{/* Present */}
													<button
														onClick={() => handleStatusChange(student._id, 'present')}
														className={`p-4 rounded-2xl transition-all transform active:scale-95 ${status === 'present' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/50' : isDark ? 'bg-slate-800 hover:bg-emerald-600/30 text-slate-400' : 'bg-gray-200 hover:bg-emerald-100 text-gray-600'}`}>
														<CheckCircle size={26} />
													</button>
													{/* Late */}
													<button
														onClick={() => handleStatusChange(student._id, 'late')}
														className={`p-4 rounded-2xl transition-all transform active:scale-95 ${status === 'late' ? 'bg-yellow-600 text-white shadow-lg shadow-yellow-600/50' : isDark ? 'bg-slate-800 hover:bg-yellow-600/30 text-slate-400' : 'bg-gray-200 hover:bg-yellow-100 text-gray-600'}`}>
														<Clock3 size={26} />
													</button>
													{/* Absent */}
													<button
														onClick={() => handleStatusChange(student._id, 'absent')}
														className={`p-4 rounded-2xl transition-all transform active:scale-95 ${status === 'absent' ? 'bg-red-600 text-white shadow-lg shadow-red-600/50' : isDark ? 'bg-slate-800 hover:bg-red-600/30 text-slate-400' : 'bg-gray-200 hover:bg-red-100 text-gray-600'}`}>
														<XCircle size={26} />
													</button>
												</div>
											</div>
										</motion.div>
									);
								})}
							</div>

							{/* Sticky Upload Button */}
							<div className={`p-8 border-t sticky bottom-0 backdrop-blur transition-all ${isDark ? 'border-slate-700 bg-slate-900/95' : 'border-gray-200 bg-white/95'}`}>
								<button
									onClick={handleUpload}
									disabled={uploading || markedCount === 0}
									className={`w-full py-5 rounded-2xl text-white font-bold text-lg flex items-center justify-center gap-3 shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? 'bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-500 hover:to-pink-500' : 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600'}`}>
									{uploading ? (
										<>
											<Loader2 className="animate-spin h-6 w-6" />
											Uploading Attendance…
										</>
									) : (
										<>
											<Upload size={26} />
											Upload Attendance ({markedCount})
										</>
									)}
								</button>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}

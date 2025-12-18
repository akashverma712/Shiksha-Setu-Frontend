// app/(student)/marks/page.tsx
'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, TrendingUp, Award, Clock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE as string) || 'http://localhost:5000';

interface Subject {
	subjectName: string;
	subjectCode: string;
	credits: number;
	marks?: number | null;
	grade: string;
	gradePoints?: number | null;
}

interface SemesterData {
	semester: number;
	subjects: Subject[];
	sgpa?: number;
	totalCredits?: number;
	earnedCredits?: number;
	backlogsThisSem?: number;
}

interface StudentData {
	name: string;
	rollNo: string;
	cgpa?: number;
	academics?: SemesterData[];
}

function ordinal(n: number) {
	const s = ['th', 'st', 'nd', 'rd'];
	const v = n % 100;
	return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export default function MarksPage() {
	const [student, setStudent] = useState<StudentData | null>(null);
	const [loading, setLoading] = useState(true);
	const [selectedSem, setSelectedSem] = useState<number | null>(null);

	useEffect(() => {
		const fetchMarks = async () => {
			try {
				const token = localStorage.getItem('token');
				if (!token) {
					window.location.href = '/login';
					return;
				}

				const res = await axios.get(`${API_BASE}/api/students/me`, {
					headers: { Authorization: `Bearer ${token}` },
				});

				const s: StudentData = res.data.student;
				setStudent(s);

				// If there are semesters, default to latest semester
				const sems = (s.academics || []).slice();
				if (sems.length > 0) {
					const latest = sems.sort((a, b) => b.semester - a.semester)[0].semester;
					setSelectedSem(latest);
				} else {
					setSelectedSem(null);
				}
			} catch (err: any) {
				console.error(err);
				toast.error(err?.response?.data?.message || 'Failed to load marks');
			} finally {
				setLoading(false);
			}
		};

		fetchMarks();
	}, []);

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-950 to-indigo-950 flex items-center justify-center">
				<p className="text-white text-xl">Loading your marks...</p>
			</div>
		);
	}

	if (!student || !student.academics || student.academics.length === 0) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-950 to-indigo-950 p-8 text-white">
				<div className="text-center py-20">
					<AlertCircle
						size={64}
						className="mx-auto text-orange-400 mb-4"
					/>
					<h1 className="text-3xl font-bold">No marks available yet</h1>
					<p className="text-gray-400 mt-4">Your teacher hasn't uploaded marks for any semester.</p>
				</div>
			</div>
		);
	}

	// find selected semester data (default to latest if somehow null)
	const academics = [...(student.academics || [])];
	const latestSemesterNumber = academics.sort((a, b) => b.semester - a.semester)[0].semester;
	const semNumber = selectedSem ?? latestSemesterNumber;
	const latestSem = academics.find((s) => s.semester === semNumber) as SemesterData;

	const subjects: Subject[] = latestSem?.subjects || [];

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white p-6">
			<div className="max-w-6xl mx-auto space-y-8">
				{/* Header */}
				<div className="flex items-center gap-4">
					<FileText
						size={36}
						className="text-cyan-400"
					/>
					<div>
						<h1 className="text-3xl font-bold">Marks & Grades</h1>
						<p className="text-gray-400">Your performance in Semester {latestSem.semester}</p>
					</div>
				</div>

				{/* Semester selector */}
				<div className="flex gap-3 items-center">
					<p className="text-gray-400">Select Semester:</p>
					<div className="flex gap-2 flex-wrap">
						{academics
							.sort((a, b) => b.semester - a.semester)
							.map((sem) => (
								<button
									key={sem.semester}
									onClick={() => setSelectedSem(sem.semester)}
									className={`px-4 py-2 rounded-2xl font-medium ${selectedSem === sem.semester || (selectedSem === null && sem.semester === latestSemesterNumber) ? 'bg-cyan-600 text-white shadow' : 'bg-white/5 text-gray-300'}`}>
									{ordinal(sem.semester)}
								</button>
							))}
					</div>
				</div>

				{/* Summary Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-gray-400 text-sm">Current Semester</p>
								<p className="text-2xl font-bold">{latestSem.semester} Semester</p>
							</div>
							<Clock
								className="text-cyan-400"
								size={40}
							/>
						</div>
					</div>

					<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-gray-400 text-sm">Semester SGPA</p>
								<p className="text-3xl font-bold text-green-400">{(latestSem.sgpa ?? 0).toFixed(2)}</p>
								{(latestSem.backlogsThisSem ?? 0) > 0 && <p className="text-sm text-red-400 mt-1">{latestSem.backlogsThisSem} backlog(s)</p>}
							</div>
							<TrendingUp
								className="text-green-400"
								size={40}
							/>
						</div>
					</div>

					<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-gray-400 text-sm">Overall CGPA</p>
								<p className="text-3xl font-bold text-cyan-400">{(student.cgpa ?? 0).toFixed(2)}</p>
								<p className="text-sm text-gray-400">Across all semesters</p>
							</div>
							<Award
								className="text-cyan-400"
								size={40}
							/>
						</div>
					</div>
				</div>

				{/* Subject Table */}
				<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
					<div className="px-6 py-4 border-b border-white/10">
						<h2 className="text-xl font-semibold">Subject-wise Performance</h2>
					</div>
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="text-left text-gray-400 text-sm border-b border-white/10">
									<th className="px-6 py-4">Subject</th>
									<th className="px-6 py-4">Code</th>
									<th className="px-6 py-4 text-center">Credits</th>
									<th className="px-6 py-4 text-center">Marks</th>
									<th className="px-6 py-4 text-center">Percentage</th>
									<th className="px-6 py-4 text-center">Grade</th>
									<th className="px-6 py-4 text-center">Points</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-white/10">
								{subjects.map((sub, i) => {
									// Here we assume marks are out of 100 (sample document shows 85, 78 etc.)
									const percentage = typeof sub.marks === 'number' ? `${Number(sub.marks).toFixed(1)}%` : 'N/A';
									const gp = sub.gradePoints ?? 0;
									const gradeColor = gp >= 9 ? 'text-green-400' : gp >= 7 ? 'text-yellow-400' : gp >= 5 ? 'text-orange-400' : 'text-red-400';

									return (
										<tr
											key={i}
											className="hover:bg-white/5 transition-colors">
											<td className="px-6 py-4 font-medium">{sub.subjectName}</td>
											<td className="px-6 py-4 text-gray-400">{sub.subjectCode}</td>
											<td className="px-6 py-4 text-center">{sub.credits}</td>
											<td className="px-6 py-4 text-center">{typeof sub.marks === 'number' ? sub.marks : '--'}</td>
											<td className="px-6 py-4 text-center">{percentage}</td>
											<td className={`px-6 py-4 text-center font-bold ${gradeColor}`}>{sub.grade}</td>
											<td className="px-6 py-4 text-center font-mono">{gp.toFixed(1)}</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>

					{/* Summary Footer */}
					<div className="px-6 py-5 bg-white/5 border-t border-white/10 flex justify-between items-center">
						<div>
							<p className="text-gray-400">
								Total Credits: <span className="font-bold text-white">{latestSem.totalCredits ?? 0}</span>
							</p>
							<p className="text-gray-400">
								Earned Credits: <span className="font-bold text-green-400">{latestSem.earnedCredits ?? 0}</span>
							</p>
						</div>
						<div className="text-right">
							<p className="text-2xl font-bold text-cyan-300">SGPA: {(latestSem.sgpa ?? 0).toFixed(2)}</p>
							{(latestSem.backlogsThisSem ?? 0) > 0 && <p className="text-red-400 font-medium">{latestSem.backlogsThisSem} Subject(s) Failed</p>}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

// src/app/dashboard/admin/page.tsx
'use client';

import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { UserPlus, Users, LogOut, ArrowLeft, Plus, Trash2 } from 'lucide-react';

export default function AdminDashboard() {
	const [activeTab, setActiveTab] = useState<'home' | 'teacher' | 'student'>('home');

	// Teacher Form State (All fields + dynamic subjects)
	const [teacher, setTeacher] = useState({
		employeeId: '',
		name: '',
		email: '',
		password: '',
		department: '',
		designation: '',
		subjects: [{ subjectCode: '', subjectName: '', semester: '', section: '', batch: '' }],
	});

	// Student Form State (All fields)
	const [student, setStudent] = useState({
		name: '',
		email: '',
		rollNo: '',
		department: '',
		program: 'B.Tech',
		batch: '',
		semester: '',
		section: '',
	});

	const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

	// Add new subject row
	const addSubject = () => {
		setTeacher({
			...teacher,
			subjects: [...teacher.subjects, { subjectCode: '', subjectName: '', semester: '', section: '', batch: '' }],
		});
	};

	// Remove subject row
	const removeSubject = (index: number) => {
		setTeacher({
			...teacher,
			subjects: teacher.subjects.filter((_, i) => i !== index),
		});
	};

	// Update subject field
	const updateSubject = (index: number, field: string, value: string) => {
		const updated = [...teacher.subjects];
		updated[index] = { ...updated[index], [field]: value };
		setTeacher({ ...teacher, subjects: updated });
	};

	const handleTeacherSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Clean empty subjects
		const cleanedTeacher = {
			...teacher,
			subjects: teacher.subjects.filter((s) => s.subjectCode && s.subjectName && s.semester && s.section && s.batch),
		};

		if (cleanedTeacher.subjects.length === 0) {
			toast.error('Please add at least one subject');
			return;
		}

		try {
			await axios.post('http://localhost:5000/api/auth/teacher/register', cleanedTeacher, { headers: { Authorization: `Bearer ${token}` } });
			toast.success('Teacher registered successfully!');
			setTeacher({
				employeeId: '',
				name: '',
				email: '',
				password: '',
				department: '',
				designation: '',
				subjects: [{ subjectCode: '', subjectName: '', semester: '', section: '', batch: '' }],
			});
		} catch (err: any) {
			toast.error(err.response?.data?.message || 'Teacher registration failed');
		}
	};

	const handleStudentSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await axios.post('http://localhost:5000/api/auth/student/register', student, { headers: { Authorization: `Bearer ${token}` } });
			toast.success('Student registered successfully!');
			setStudent({
				name: '',
				email: '',
				rollNo: '',
				department: '',
				program: 'B.Tech',
				batch: '',
				semester: '',
				section: '',
			});
		} catch (err: any) {
			toast.error(err.response?.data?.message || 'Student registration failed');
		}
	};

	const logout = () => {
		localStorage.clear();
		window.location.href = '/admin/login';
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white p-6">
			<div className="max-w-7xl mx-auto space-y-10">
				{/* Header */}
				<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex justify-between items-center shadow-2xl">
					<div>
						<h1 className="text-4xl font-bold">Admin Portal</h1>
						<p className="text-gray-400 mt-1">Secure management dashboard</p>
					</div>
					<button
						onClick={logout}
						className="flex items-center gap-3 px-6 py-3 bg-red-500/20 border border-red-500/40 rounded-xl hover:bg-red-500/30 transition-all font-medium">
						<LogOut size={22} /> Logout
					</button>
				</div>

				{/* HOME */}
				{activeTab === 'home' && (
					<div className="text-center py-20">
						<h2 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">Welcome back, Admin</h2>
						<p className="text-xl text-gray-300 mb-16">Select an action to begin</p>
						<div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
							<button
								onClick={() => setActiveTab('teacher')}
								className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-14 hover:bg-white/10 hover:scale-105 hover:ring-4 hover:ring-blue-500/30 transition-all duration-500 shadow-2xl">
								<div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
								<UserPlus
									size={100}
									className="mx-auto mb-8 text-blue-400"
								/>
								<h3 className="text-4xl font-bold mb-4">Register Teacher</h3>
								<p className="text-lg text-gray-300">Add new faculty with subjects</p>
							</button>

							<button
								onClick={() => setActiveTab('student')}
								className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-14 hover:bg-white/10 hover:scale-105 hover:ring-4 hover:ring-purple-500/30 transition-all duration-500 shadow-2xl">
								<div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
								<Users
									size={100}
									className="mx-auto mb-8 text-purple-400"
								/>
								<h3 className="text-4xl font-bold mb-4">Register Student</h3>
								<p className="text-lg text-gray-300">Enroll new students</p>
							</button>
						</div>
					</div>
				)}

				{/* TEACHER REGISTRATION - ALL FIELDS + DYNAMIC SUBJECTS */}
				{activeTab === 'teacher' && (
					<div className="max-w-4xl mx-auto">
						<button
							onClick={() => setActiveTab('home')}
							className="flex items-center gap-3 text-blue-400 hover:text-blue-300 mb-8 text-lg font-semibold">
							<ArrowLeft size={24} /> Back to Dashboard
						</button>

						<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl">
							<h2 className="text-4xl font-bold text-center mb-4 text-blue-400">Register New Teacher</h2>
							<p className="text-center text-gray-400 mb-10">Fill all details including assigned subjects</p>

							<form
								onSubmit={handleTeacherSubmit}
								className="space-y-6">
								<div className="grid md:grid-cols-2 gap-6">
									<input
										type="text"
										placeholder="Employee ID (e.g. T101)"
										required
										value={teacher.employeeId}
										onChange={(e) => setTeacher({ ...teacher, employeeId: e.target.value })}
										className="px-6 py-4 rounded-xl bg-white/10 border border-white/20 placeholder-gray-400 focus:ring-4 focus:ring-blue-500/50"
									/>

									<input
										type="text"
										placeholder="Full Name"
										required
										value={teacher.name}
										onChange={(e) => setTeacher({ ...teacher, name: e.target.value })}
										className="px-6 py-4 rounded-xl bg-white/10 border border-white/20 placeholder-gray-400 focus:ring-4 focus:ring-blue-500/50"
									/>
								</div>

								<input
									type="email"
									placeholder="Email (rahul.sharma@college.edu)"
									required
									value={teacher.email}
									onChange={(e) => setTeacher({ ...teacher, email: e.target.value })}
									className="w-full px-6 py-4 rounded-xl bg-white/10 border border-white/20 placeholder-gray-400 focus:ring-4 focus:ring-blue-500/50"
								/>

								<input
									type="password"
									placeholder="Password"
									required
									value={teacher.password}
									onChange={(e) => setTeacher({ ...teacher, password: e.target.value })}
									className="w-full px-6 py-4 rounded-xl bg-white/10 border border-white/20 placeholder-gray-400 focus:ring-4 focus:ring-blue-500/50"
								/>

								<div className="grid md:grid-cols-2 gap-6">
									<input
										type="text"
										placeholder="Department (e.g. Computer Science)"
										required
										value={teacher.department}
										onChange={(e) => setTeacher({ ...teacher, department: e.target.value })}
										className="px-6 py-4 rounded-xl bg-white/10 border border-white/20 placeholder-gray-400 focus:ring-4 focus:ring-blue-500/50"
									/>

									<input
										type="text"
										placeholder="Designation (e.g. Associate Professor)"
										required
										value={teacher.designation}
										onChange={(e) => setTeacher({ ...teacher, designation: e.target.value })}
										className="px-6 py-4 rounded-xl bg-white/10 border border-white/20 placeholder-gray-400 focus:ring-4 focus:ring-blue-500/50"
									/>
								</div>

								<div className="mt-8">
									<div className="flex justify-between items-center mb-4">
										<h3 className="text-xl font-bold text-cyan-400">Assigned Subjects</h3>
										<button
											type="button"
											onClick={addSubject}
											className="flex items-center gap-2 px-4 py-2 bg-cyan-600/30 rounded-lg hover:bg-cyan-600/50 transition">
											<Plus size={20} /> Add Subject
										</button>
									</div>

									{teacher.subjects.map((sub, index) => (
										<div
											key={index}
											className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4 p-4 bg-white/5 rounded-xl border border-white/10">
											<input
												placeholder="Code (CS501)"
												value={sub.subjectCode}
												onChange={(e) => updateSubject(index, 'subjectCode', e.target.value)}
												className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 placeholder-gray-500 text-sm"
												required
											/>

											<input
												placeholder="Subject Name"
												value={sub.subjectName}
												onChange={(e) => updateSubject(index, 'subjectName', e.target.value)}
												className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 placeholder-gray-500 text-sm"
												required
											/>

											<input
												placeholder="Semester (5)"
												value={sub.semester}
												onChange={(e) => updateSubject(index, 'semester', e.target.value)}
												className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 placeholder-gray-500 text-sm"
												required
											/>

											<input
												placeholder="Section (A)"
												value={sub.section}
												onChange={(e) => updateSubject(index, 'section', e.target.value)}
												className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 placeholder-gray-500 text-sm"
												required
											/>

											<div className="flex gap-2">
												<input
													placeholder="Batch (2022-2026)"
													value={sub.batch}
													onChange={(e) => updateSubject(index, 'batch', e.target.value)}
													className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 placeholder-gray-500 text-sm"
													required
												/>
												{teacher.subjects.length > 1 && (
													<button
														type="button"
														onClick={() => removeSubject(index)}
														className="p-3 bg-red-600/30 hover:bg-red-600/50 rounded-lg">
														<Trash2 size={18} />
													</button>
												)}
											</div>
										</div>
									))}
								</div>

								<button
									type="submit"
									className="w-full py-5 rounded-2xl font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-2xl transform hover:scale-[1.02] transition-all mt-8">
									Register Teacher
								</button>
							</form>
						</div>
					</div>
				)}

				{/* STUDENT REGISTRATION - ALL FIELDS */}
				{activeTab === 'student' && (
					<div className="max-w-2xl mx-auto">
						<button
							onClick={() => setActiveTab('home')}
							className="flex items-center gap-3 text-purple-400 hover:text-purple-300 mb-8 text-lg font-semibold">
							<ArrowLeft size={24} /> Back to Dashboard
						</button>

						<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl">
							<h2 className="text-4xl font-bold text-center mb-4 text-purple-400">Register New Student</h2>
							<p className="text-center text-gray-400 mb-10">Enter complete student information</p>

							<form
								onSubmit={handleStudentSubmit}
								className="space-y-6">
								<input
									type="text"
									placeholder="Full Name"
									required
									value={student.name}
									onChange={(e) => setStudent({ ...student, name: e.target.value })}
									className="w-full px-6 py-5 rounded-2xl bg-white/10 border border-white/20 placeholder-gray-400 focus:ring-4 focus:ring-purple-500/50"
								/>

								<input
									type="email"
									placeholder="Email (aarav.cs.2022@college.edu)"
									required
									value={student.email}
									onChange={(e) => setStudent({ ...student, email: e.target.value })}
									className="w-full px-6 py-5 rounded-2xl bg-white/10 border border-white/20 placeholder-gray-400 focus:ring-4 focus:ring-purple-500/50"
								/>

								<input
									type="text"
									placeholder="Roll Number (22CS001)"
									required
									value={student.rollNo}
									onChange={(e) => setStudent({ ...student, rollNo: e.target.value })}
									className="w-full px-6 py-5 rounded-2xl bg-white/10 border border-white/20 placeholder-gray-400 focus:ring-4 focus:ring-purple-500/50"
								/>

								<div className="grid md:grid-cols-2 gap-6">
									<input
										type="text"
										placeholder="Department"
										required
										value={student.department}
										onChange={(e) => setStudent({ ...student, department: e.target.value })}
										className="px-6 py-5 rounded-2xl bg-white/10 border border-white/20 placeholder-gray-400 focus:ring-4 focus:ring-purple-500/50"
									/>

									<select
										value={student.program}
										onChange={(e) => setStudent({ ...student, program: e.target.value })}
										className="px-6 py-5 rounded-2xl bg-white/10 border border-white/20 text-white focus:ring-4 focus:ring-purple-500/50">
										<option value="B.Tech">B.Tech</option>
										<option value="M.Tech">M.Tech</option>
										<option value="BCA">BCA</option>
										<option value="MCA">MCA</option>
									</select>
								</div>

								<div className="grid md:grid-cols-3 gap-6">
									<input
										type="text"
										placeholder="Batch (2022-2026)"
										required
										value={student.batch}
										onChange={(e) => setStudent({ ...student, batch: e.target.value })}
										className="px-6 py-5 rounded-2xl bg-white/10 border border-white/20 placeholder-gray-400 focus:ring-4 focus:ring-purple-500/50"
									/>

									<input
										type="number"
										placeholder="Current Semester"
										required
										value={student.semester}
										onChange={(e) => setStudent({ ...student, semester: e.target.value })}
										className="px-6 py-5 rounded-2xl bg-white/10 border border-white/20 placeholder-gray-400 focus:ring-4 focus:ring-purple-500/50"
										min="1"
										max="8"
									/>

									<input
										type="text"
										placeholder="Section (A)"
										required
										value={student.section}
										onChange={(e) => setStudent({ ...student, section: e.target.value })}
										className="px-6 py-5 rounded-2xl bg-white/10 border border-white/20 placeholder-gray-400 focus:ring-4 focus:ring-purple-500/50"
									/>
								</div>

								<button
									type="submit"
									className="w-full py-5 rounded-2xl font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-2xl transform hover:scale-[1.02] transition-all mt-8">
									Register Student
								</button>
							</form>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

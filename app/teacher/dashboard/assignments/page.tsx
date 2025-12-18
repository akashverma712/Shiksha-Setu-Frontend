'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/app/ThemeProvider'; // Adjust path if needed
import { Upload, CalendarDays, Clock, FileText, Link2, Users, Download, Edit, Trash2, Share2, Eye, BookOpen, Layers, AlertCircle, CheckCircle, ChevronRight, X, Plus } from 'lucide-react';

interface Assignment {
	id: string;
	title: string;
	subject: string;
	subjectCode: string;
	classSection: string;
	dueDate: string;
	timeRequired: string;
	difficulty: 'Easy' | 'Medium' | 'Hard';
	description: string;
	links: string[];
	files: string[];
	submissions: number;
	totalStudents: number;
	status: 'Active' | 'Completed';
}

export default function AssignmentManagement() {
	const { theme } = useTheme();
	const isDark = theme === 'dark';

	const [viewMode, setViewMode] = useState<'view' | 'upload'>('view');
	const [assignments, setAssignments] = useState<Assignment[]>([
		{
			id: '1',
			title: 'Database Systems Assignment',
			subject: 'Database Systems',
			subjectCode: 'CS501',
			classSection: 'CSE 5th Sem - A',
			dueDate: '2025-12-20',
			timeRequired: '10',
			difficulty: 'Hard',
			description: 'Design an ER diagram and implement a full database for an online bookstore using MySQL.',
			links: ['https://dev.mysql.com/doc/', 'https://www.geeksforgeeks.org/dbms/'],
			files: ['assignment-brief.pdf', 'schema-template.docx'],
			submissions: 48,
			totalStudents: 60,
			status: 'Active',
		},
		{
			id: '2',
			title: 'Machine Learning Assignment #2',
			subject: 'Machine Learning',
			subjectCode: 'CS601',
			classSection: 'CSE 7th Sem - B',
			dueDate: '2025-12-15',
			timeRequired: '8',
			difficulty: 'Medium',
			description: 'Implement KNN and Decision Tree classifiers from scratch on the IRIS dataset.',
			links: ['https://scikit-learn.org'],
			files: ['ML_Assignment2.pdf'],
			submissions: 42,
			totalStudents: 55,
			status: 'Active',
		},
	]);

	const [form, setForm] = useState<Omit<Assignment, 'id' | 'submissions' | 'totalStudents' | 'status'>>({
		title: '',
		subject: '',
		subjectCode: '',
		classSection: '',
		dueDate: '',
		timeRequired: '',
		difficulty: 'Medium',
		description: '',
		links: [''],
		files: [],
	});

	const [editingId, setEditingId] = useState<string | null>(null);

	const handleInputChange = (field: keyof typeof form, value: any) => {
		setForm((prev) => ({ ...prev, [field]: value }));
	};

	const handleLinkChange = (index: number, value: string) => {
		const newLinks = [...form.links];
		newLinks[index] = value;
		setForm((prev) => ({ ...prev, links: newLinks }));
	};

	const addLink = () => {
		setForm((prev) => ({ ...prev, links: [...prev.links, ''] }));
	};

	const removeLink = (index: number) => {
		setForm((prev) => ({ ...prev, links: prev.links.filter((_, i) => i !== index) }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (editingId) {
			setAssignments((prev) =>
				prev.map((a) =>
					a.id === editingId
						? {
								...a,
								...form,
								submissions: a.submissions,
								totalStudents: a.totalStudents,
								status: new Date(form.dueDate) > new Date() ? 'Active' : 'Completed',
						  }
						: a
				)
			);
			alert('Assignment updated successfully!');
		} else {
			const newAssignment: Assignment = {
				...form,
				id: Date.now().toString(),
				submissions: 0,
				totalStudents: 60,
				status: new Date(form.dueDate) > new Date() ? 'Active' : 'Completed',
			};
			setAssignments((prev) => [newAssignment, ...prev]);
			alert('Assignment uploaded successfully!');
		}

		setForm({
			title: '',
			subject: '',
			subjectCode: '',
			classSection: '',
			dueDate: '',
			timeRequired: '',
			difficulty: 'Medium',
			description: '',
			links: [''],
			files: [],
		});
		setEditingId(null);
		setViewMode('view');
	};

	const startEdit = (assignment: Assignment) => {
		setForm({
			title: assignment.title,
			subject: assignment.subject,
			subjectCode: assignment.subjectCode,
			classSection: assignment.classSection,
			dueDate: assignment.dueDate,
			timeRequired: assignment.timeRequired,
			difficulty: assignment.difficulty,
			description: assignment.description,
			links: assignment.links.length > 0 ? assignment.links : [''],
			files: assignment.files,
		});
		setEditingId(assignment.id);
		setViewMode('upload');
	};

	const deleteAssignment = (id: string) => {
		if (confirm('Delete this assignment permanently?')) {
			setAssignments((prev) => prev.filter((a) => a.id !== id));
		}
	};

	const shareLink = (id: string) => {
		const link = `${window.location.origin}/submit-assignment/${id}`;
		navigator.clipboard.writeText(link);
		alert('Link copied to clipboard!\nStudents can submit here:\n' + link);
	};

	return (
		<div className={`min-h-screen transition-colors duration-300 p-6 ${isDark ? 'bg-slate-950 text-slate-200' : 'bg-gray-50 text-gray-800'}`}>
			<div className="mx-auto max-w-4xl">
				{/* Header */}
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
					<div>
						<h2 className="text-3xl font-bold text-orange-500 flex items-center gap-3">
							<FileText
								size={32}
								className="text-orange-400"
							/>
							Assignment Management
						</h2>
						<p className={`${isDark ? 'text-slate-400' : 'text-gray-600'} text-sm mt-1`}>
							{assignments.length} assignments • {assignments.filter((a) => a.status === 'Active').length} active
						</p>
					</div>
					<div className="flex gap-3">
						<button
							onClick={() => setViewMode('view')}
							className={`px-6 py-3 rounded-xl font-bold transition-all ${viewMode === 'view' ? 'bg-orange-600 text-white shadow-lg' : isDark ? 'bg-slate-800 text-slate-400 border border-slate-700' : 'bg-gray-200 text-gray-600 border border-gray-300'}`}>
							View All
						</button>
						<button
							onClick={() => {
								setEditingId(null);
								setViewMode('upload');
							}}
							className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${viewMode === 'upload' ? 'bg-orange-600 text-white shadow-lg' : isDark ? 'bg-slate-800 text-slate-400 border border-slate-700' : 'bg-gray-200 text-gray-600 border border-gray-300'}`}>
							<Upload size={18} />
							{editingId ? 'Edit' : 'Upload New'}
						</button>
					</div>
				</div>

				{/* VIEW MODE */}
				{viewMode === 'view' && (
					<div className="space-y-5">
						{assignments.length === 0 ? (
							<div className={`text-center py-16 rounded-2xl border transition-all ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
								<FileText
									size={64}
									className={`mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-gray-400'}`}
								/>
								<p className={`text-xl ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>No assignments yet</p>
								<button
									onClick={() => setViewMode('upload')}
									className="mt-4 px-6 py-3 bg-orange-600 rounded-xl text-white font-bold">
									Upload First Assignment
								</button>
							</div>
						) : (
							assignments.map((assignment, index) => (
								<motion.div
									key={assignment.id}
									initial={{ opacity: 0, x: -30 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: index * 0.1 }}
									className={`relative rounded-2xl p-6 overflow-hidden border transition-all hover:border-orange-500/40 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200 shadow-sm'}`}>
									<div className="absolute right-4 top-4 opacity-10">
										<FileText
											size={120}
											className="text-orange-600"
										/>
									</div>

									<div className="relative z-10">
										<div className="flex justify-between items-start mb-4">
											<div>
												<h3 className="text-2xl font-bold text-orange-400">{assignment.title}</h3>
												<p className="text-blue-400 text-sm font-medium">
													{assignment.subjectCode} • {assignment.subject}
												</p>
											</div>
											<span className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 border ${assignment.status === 'Active' ? (isDark ? 'text-emerald-400 bg-emerald-900/20 border-emerald-800/50' : 'text-emerald-600 bg-emerald-100 border-emerald-300') : isDark ? 'text-slate-400 bg-slate-800/50 border-slate-700' : 'text-gray-600 bg-gray-200 border-gray-300'}`}>
												{assignment.status === 'Active' && <CheckCircle size={14} />}
												{assignment.status}
											</span>
										</div>

										<p className={`${isDark ? 'text-slate-300' : 'text-gray-700'} mb-5 leading-relaxed`}>{assignment.description}</p>

										<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-6">
											<span className="flex items-center gap-2">
												<Users
													size={16}
													className="text-purple-400"
												/>
												{assignment.classSection}
											</span>
											<span className="flex items-center gap-2">
												<CalendarDays
													size={16}
													className="text-orange-400"
												/>
												Due: {new Date(assignment.dueDate).toLocaleDateString()}
											</span>
											<span className="flex items-center gap-2">
												<Clock
													size={16}
													className="text-blue-400"
												/>
												{assignment.timeRequired} hrs
											</span>
											<span className={`flex items-center gap-2 font-bold ${assignment.difficulty === 'Hard' ? 'text-red-400' : assignment.difficulty === 'Medium' ? 'text-yellow-400' : 'text-green-400'}`}>
												<AlertCircle size={16} />
												{assignment.difficulty}
											</span>
										</div>

										<div className="flex justify-between items-center mb-4">
											<div>
												<span className={`${isDark ? 'text-slate-400' : 'text-gray-600'} text-sm`}>Submissions</span>
												<p className="text-2xl font-bold text-orange-400">
													{assignment.submissions} / {assignment.totalStudents}
												</p>
											</div>
											<div className={`w-48 rounded-full h-3 ${isDark ? 'bg-slate-800' : 'bg-gray-200'}`}>
												<motion.div
													initial={{ width: 0 }}
													animate={{ width: `${(assignment.submissions / assignment.totalStudents) * 100}%` }}
													className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
												/>
											</div>
										</div>

										<div className="flex gap-3">
											<button
												onClick={() => startEdit(assignment)}
												className={`px-5 py-2.5 rounded-xl flex items-center gap-2 transition ${isDark ? 'bg-blue-600/20 hover:bg-blue-600/40 text-blue-300' : 'bg-blue-100 hover:bg-blue-200 text-blue-700'}`}>
												<Edit size={18} /> Edit
											</button>
											<button
												onClick={() => deleteAssignment(assignment.id)}
												className={`px-5 py-2.5 rounded-xl flex items-center gap-2 transition ${isDark ? 'bg-red-600/20 hover:bg-red-600/40 text-red-300' : 'bg-red-100 hover:bg-red-200 text-red-700'}`}>
												<Trash2 size={18} /> Delete
											</button>
											<button
												onClick={() => shareLink(assignment.id)}
												className={`px-5 py-2.5 rounded-xl flex items-center gap-2 transition ${isDark ? 'bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300' : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700'}`}>
												<Share2 size={18} /> Share
											</button>
											<button className={`px-5 py-2.5 rounded-xl flex items-center gap-2 transition ${isDark ? 'bg-purple-600/20 hover:bg-purple-600/40 text-purple-300' : 'bg-purple-100 hover:bg-purple-200 text-purple-700'}`}>
												<Users size={18} /> View Submissions
											</button>
										</div>
									</div>
								</motion.div>
							))
						)}
					</div>
				)}

				{/* UPLOAD / EDIT MODE */}
				{viewMode === 'upload' && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className={`rounded-2xl p-8 border transition-all ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200 shadow-sm'}`}>
						<div className="flex items-center justify-between mb-8">
							<h3 className="text-2xl font-bold text-orange-400 flex items-center gap-3">
								<Upload
									size={28}
									className="text-orange-400"
								/>
								{editingId ? 'Edit Assignment' : 'Upload New Assignment'}
							</h3>
							{editingId && (
								<button
									onClick={() => {
										setEditingId(null);
										setForm({
											title: '',
											subject: '',
											subjectCode: '',
											classSection: '',
											dueDate: '',
											timeRequired: '',
											difficulty: 'Medium',
											description: '',
											links: [''],
											files: [],
										});
									}}
									className={`${isDark ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
									<X size={24} />
								</button>
							)}
						</div>

						<form
							onSubmit={handleSubmit}
							className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="md:col-span-2">
									<label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Assignment Title *</label>
									<input
										type="text"
										value={form.title}
										onChange={(e) => handleInputChange('title', e.target.value)}
										className={`w-full px-5 py-4 rounded-xl outline-none transition-all ${isDark ? 'bg-slate-800/70 border border-slate-700 focus:border-orange-500' : 'bg-gray-100 border border-gray-300 focus:border-orange-400'}`}
										placeholder="e.g., Operating Systems Assignment 1"
										required
									/>
								</div>

								<div>
									<label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Subject Code</label>
									<div className="relative">
										<BookOpen className={`absolute left-4 top-5 h-5 w-5 ${isDark ? 'text-slate-500' : 'text-gray-500'}`} />
										<input
											type="text"
											value={form.subjectCode}
											onChange={(e) => handleInputChange('subjectCode', e.target.value)}
											className={`w-full pl-12 pr-5 py-4 rounded-xl outline-none transition-all ${isDark ? 'bg-slate-800/70 border border-slate-700 focus:border-orange-500' : 'bg-gray-100 border border-gray-300 focus:border-orange-400'}`}
											placeholder="CS501"
											required
										/>
									</div>
								</div>

								<div>
									<label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Subject Name</label>
									<input
										type="text"
										value={form.subject}
										onChange={(e) => handleInputChange('subject', e.target.value)}
										className={`w-full px-5 py-4 rounded-xl outline-none transition-all ${isDark ? 'bg-slate-800/70 border border-slate-700 focus:border-orange-500' : 'bg-gray-100 border border-gray-300 focus:border-orange-400'}`}
										placeholder="Database Systems"
										required
									/>
								</div>

								<div>
									<label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Class / Section</label>
									<input
										type="text"
										value={form.classSection}
										onChange={(e) => handleInputChange('classSection', e.target.value)}
										className={`w-full px-5 py-4 rounded-xl outline-none transition-all ${isDark ? 'bg-slate-800/70 border border-slate-700 focus:border-orange-500' : 'bg-gray-100 border border-gray-300 focus:border-orange-400'}`}
										placeholder="CSE 5th Sem - A"
										required
									/>
								</div>

								<div>
									<label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Due Date *</label>
									<div className="relative">
										<CalendarDays className={`absolute left-4 top-5 h-5 w-5 ${isDark ? 'text-slate-500' : 'text-gray-500'}`} />
										<input
											type="date"
											value={form.dueDate}
											onChange={(e) => handleInputChange('dueDate', e.target.value)}
											className={`w-full pl-12 pr-5 py-4 rounded-xl outline-none transition-all ${isDark ? 'bg-slate-800/70 border border-slate-700 focus:border-orange-500' : 'bg-gray-100 border border-gray-300 focus:border-orange-400'}`}
											required
										/>
									</div>
								</div>

								<div>
									<label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Time Required (hrs)</label>
									<div className="relative">
										<Clock className={`absolute left-4 top-5 h-5 w-5 ${isDark ? 'text-slate-500' : 'text-gray-500'}`} />
										<input
											type="number"
											value={form.timeRequired}
											onChange={(e) => handleInputChange('timeRequired', e.target.value)}
											className={`w-full pl-12 pr-5 py-4 rounded-xl outline-none transition-all ${isDark ? 'bg-slate-800/70 border border-slate-700 focus:border-orange-500' : 'bg-gray-100 border border-gray-300 focus:border-orange-400'}`}
											placeholder="8"
										/>
									</div>
								</div>

								<div>
									<label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Difficulty</label>
									<select
										value={form.difficulty}
										onChange={(e) => handleInputChange('difficulty', e.target.value as any)}
										className={`w-full px-5 py-4 rounded-xl outline-none transition-all ${isDark ? 'bg-slate-800/70 border border-slate-700 focus:border-orange-500' : 'bg-gray-100 border border-gray-300 focus:border-orange-400'}`}>
										<option>Easy</option>
										<option>Medium</option>
										<option>Hard</option>
									</select>
								</div>

								<div className="md:col-span-2">
									<label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Description / Instructions</label>
									<textarea
										rows={5}
										value={form.description}
										onChange={(e) => handleInputChange('description', e.target.value)}
										className={`w-full p-5 rounded-xl outline-none resize-none transition-all ${isDark ? 'bg-slate-800/70 border border-slate-700 focus:border-orange-500' : 'bg-gray-100 border border-gray-300 focus:border-orange-400'}`}
										placeholder="Provide clear instructions..."
										required
									/>
								</div>

								<div className="md:col-span-2">
									<label className={`text-sm font-medium mb-3 block ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Reference Links</label>
									{form.links.map((link, i) => (
										<div
											key={i}
											className="flex gap-3 mb-3">
											<div className="relative flex-1">
												<Link2 className={`absolute left-4 top-5 h-5 w-5 ${isDark ? 'text-slate-500' : 'text-gray-500'}`} />
												<input
													type="url"
													value={link}
													onChange={(e) => handleLinkChange(i, e.target.value)}
													className={`w-full pl-12 pr-5 py-4 rounded-xl outline-none transition-all ${isDark ? 'bg-slate-800/70 border border-slate-700 focus:border-orange-500' : 'bg-gray-100 border border-gray-300 focus:border-orange-400'}`}
													placeholder="https://example.com"
												/>
											</div>
											{form.links.length > 1 && (
												<button
													type="button"
													onClick={() => removeLink(i)}
													className={`p-4 rounded-xl transition ${isDark ? 'bg-red-600/20 hover:bg-red-600/40' : 'bg-red-100 hover:bg-red-200'}`}>
													<X size={18} />
												</button>
											)}
										</div>
									))}
									<button
										type="button"
										onClick={addLink}
										className={`mt-2 flex items-center gap-2 text-sm transition ${isDark ? 'text-orange-400 hover:text-orange-300' : 'text-orange-600 hover:text-orange-700'}`}>
										<Plus size={18} /> Add Link
									</button>
								</div>

								<div className="md:col-span-2 flex justify-end gap-4">
									<button
										type="button"
										onClick={() => setViewMode('view')}
										className={`px-8 py-4 rounded-xl transition font-medium ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-200 hover:bg-gray-300'}`}>
										Cancel
									</button>
									<button
										type="submit"
										className="px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold rounded-xl hover:scale-105 transition flex items-center gap-3 shadow-lg">
										<FileText size={20} />
										{editingId ? 'Update Assignment' : 'Upload Assignment'}
									</button>
								</div>
							</div>
						</form>
					</motion.div>
				)}
			</div>
		</div>
	);
}

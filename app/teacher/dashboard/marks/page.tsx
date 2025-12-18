'use client';

import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useTheme } from '@/app/ThemeProvider'; // Adjust path if needed
import { Plus, Trash2, Upload, CheckCircle, Loader2 } from 'lucide-react';

interface SubjectInput {
	subjectName: string;
	subjectCode: string;
	credits: number;
	grade: string;
	marks: number;
}

export default function MarksUploadPage() {
	const { theme } = useTheme();
	const isDark = theme === 'dark';

	const [rollNo, setRollNo] = useState('');
	const [semester, setSemester] = useState('');
	const [subjects, setSubjects] = useState<SubjectInput[]>([{ subjectName: '', subjectCode: '', credits: 0, grade: '', marks: 0 }]);
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState<string | null>(null);

	const addSubject = () => {
		setSubjects([...subjects, { subjectName: '', subjectCode: '', credits: 0, grade: '', marks: 0 }]);
	};

	const removeSubject = (idx: number) => {
		setSubjects(subjects.filter((_, i) => i !== idx));
	};

	const updateSubject = (idx: number, field: keyof SubjectInput, value: any) => {
		const updated = [...subjects];
		updated[idx][field] = value;
		setSubjects(updated);
	};

	const uploadMarks = async () => {
		setLoading(true);
		setSuccess(null);
		try {
			const res = await axios.post('/api/marks/upload', {
				rollNo,
				semester: Number(semester),
				subjects,
			});
			setSuccess(res.data.message || 'Marks uploaded successfully!');
		} catch (err: any) {
			console.error(err);
			setSuccess('Error uploading marks');
		} finally {
			setLoading(false);
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 40 }}
			animate={{ opacity: 1, y: 0 }}
			className={`p-6 max-w-4xl mx-auto transition-colors duration-300 ${isDark ? 'text-slate-200' : 'text-gray-800'}`}>
			<h1 className="text-3xl font-bold mb-6 text-orange-400">Upload Marks</h1>

			<div className={`rounded-2xl p-6 shadow-xl border space-y-6 transition-all ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}`}>
				{/* Roll No Input */}
				<div>
					<label className={`block mb-1 font-medium ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Roll Number</label>
					<input
						className={`w-full p-3 rounded-xl outline-none transition-all ${isDark ? 'bg-slate-800/70 border border-slate-600 focus:border-orange-500' : 'bg-gray-100 border border-gray-300 focus:border-orange-400'}`}
						value={rollNo}
						onChange={(e) => setRollNo(e.target.value)}
						placeholder="Enter roll number"
					/>
				</div>

				{/* Semester Input */}
				<div>
					<label className={`block mb-1 font-medium ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Semester</label>
					<input
						className={`w-full p-3 rounded-xl outline-none transition-all ${isDark ? 'bg-slate-800/70 border border-slate-600 focus:border-orange-500' : 'bg-gray-100 border border-gray-300 focus:border-orange-400'}`}
						value={semester}
						onChange={(e) => setSemester(e.target.value)}
						placeholder="Enter semester number"
					/>
				</div>

				{/* Subjects Section */}
				<div>
					<h2 className="text-xl mb-4 text-orange-300 font-semibold">Subjects</h2>
					{subjects.map((subj, index) => (
						<div
							key={index}
							className={`p-4 rounded-xl mb-4 border transition-all ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-300'}`}>
							<div className="grid grid-cols-1 md:grid-cols-5 gap-3">
								<input
									className={`p-3 rounded-lg outline-none transition-all ${isDark ? 'bg-slate-900/70 border border-slate-600 focus:border-orange-500' : 'bg-white border border-gray-300 focus:border-orange-400'}`}
									placeholder="Subject Name"
									value={subj.subjectName}
									onChange={(e) => updateSubject(index, 'subjectName', e.target.value)}
								/>
								<input
									className={`p-3 rounded-lg outline-none transition-all ${isDark ? 'bg-slate-900/70 border border-slate-600 focus:border-orange-500' : 'bg-white border border-gray-300 focus:border-orange-400'}`}
									placeholder="Subject Code"
									value={subj.subjectCode}
									onChange={(e) => updateSubject(index, 'subjectCode', e.target.value)}
								/>
								<input
									type="number"
									className={`p-3 rounded-lg outline-none transition-all ${isDark ? 'bg-slate-900/70 border border-slate-600 focus:border-orange-500' : 'bg-white border border-gray-300 focus:border-orange-400'}`}
									placeholder="Credits"
									value={subj.credits || ''}
									onChange={(e) => updateSubject(index, 'credits', Number(e.target.value) || 0)}
								/>
								<input
									className={`p-3 rounded-lg outline-none transition-all ${isDark ? 'bg-slate-900/70 border border-slate-600 focus:border-orange-500' : 'bg-white border border-gray-300 focus:border-orange-400'}`}
									placeholder="Grade (A, B, C...)"
									value={subj.grade}
									onChange={(e) => updateSubject(index, 'grade', e.target.value.toUpperCase())}
								/>
								<input
									type="number"
									className={`p-3 rounded-lg outline-none transition-all ${isDark ? 'bg-slate-900/70 border border-slate-600 focus:border-orange-500' : 'bg-white border border-gray-300 focus:border-orange-400'}`}
									placeholder="Marks"
									value={subj.marks || ''}
									onChange={(e) => updateSubject(index, 'marks', Number(e.target.value) || 0)}
								/>
							</div>

							{/* Remove Button */}
							{subjects.length > 1 && (
								<button
									onClick={() => removeSubject(index)}
									className={`mt-3 flex items-center gap-2 transition ${isDark ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'}`}>
									<Trash2 size={18} /> Remove
								</button>
							)}
						</div>
					))}

					<button
						onClick={addSubject}
						className={`px-4 py-2 rounded-xl flex items-center gap-2 transition ${isDark ? 'bg-orange-700 hover:bg-orange-600 text-white' : 'bg-orange-500 hover:bg-orange-600 text-white'}`}>
						<Plus size={18} /> Add Subject
					</button>
				</div>

				{/* Upload Button */}
				<button
					onClick={uploadMarks}
					disabled={loading}
					className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all ${isDark ? 'bg-gradient-to-r from-orange-600/20 to-pink-600/20 hover:from-orange-600/40 hover:to-pink-600/40 text-white disabled:opacity-50' : 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white disabled:opacity-70'}`}>
					{loading ? (
						<>
							<Loader2 className="animate-spin h-6 w-6" />
							Uploading...
						</>
					) : (
						<>
							<Upload className="h-6 w-6" />
							Upload Marks
						</>
					)}
				</button>

				{/* Success Message */}
				{success && (
					<div className={`mt-4 p-4 rounded-xl flex items-center gap-3 transition-all ${success.includes('Error') ? (isDark ? 'bg-red-900/30 border border-red-700 text-red-400' : 'bg-red-100 border border-red-300 text-red-700') : isDark ? 'bg-emerald-900/30 border border-emerald-700 text-emerald-400' : 'bg-emerald-100 border border-emerald-300 text-emerald-700'}`}>
						<CheckCircle className="h-6 w-6" />
						{success}
					</div>
				)}
			</div>
		</motion.div>
	);
}

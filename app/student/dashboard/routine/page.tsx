'use client';
import { motion } from 'framer-motion';
import {
	Calendar,
	Clock,
	Download,
	ChevronDown,
	BookOpen,
	Building,
	User,
	CheckSquare,
	AlertCircle,
	Target,
	Bell,
	Link2,
	Coffee,
	Timer,
	TrendingUp,
	Smile,
	Frown,
	Meh,
	FileText,
} from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { format, isToday, parse } from 'date-fns';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function RoutinePage() {
	const routineRef = useRef<HTMLDivElement>(null);
	const [expandedDay, setExpandedDay] = useState<string | null>(null);
	const [currentTime, setCurrentTime] = useState(new Date());
	const [mood, setMood] = useState<'sleepy' | 'neutral' | 'happy' | null>(null);

	useEffect(() => {
		const timer = setInterval(() => setCurrentTime(new Date()), 60000);
		return () => clearInterval(timer);
	}, []);

	const assignments = [
		{ name: 'Machine Learning Assignment 3', due: 'Today', urgent: true },
		{ name: 'Compiler Design Project Phase-1', due: 'Tomorrow', urgent: true },
		{ name: 'DBMS Mini Project', due: 'Dec 10', urgent: false },
	];

	const attendance = {
		overall: 78,
		subjects: [
			{ name: 'Machine Learning', percent: 82 },
			{ name: 'Operating Systems', percent: 75 },
			{ name: 'Computer Networks', percent: 70 },
			{ name: 'Database Systems', percent: 85 },
		],
	};

	const dailyGoals = [
		{ id: 1, text: 'Complete ML Assignment', completed: false },
		{ id: 2, text: 'Study 45 mins OS', completed: true },
		{ id: 3, text: 'Finish lab file', completed: false },
		{ id: 4, text: 'Drink 8 glasses of water', completed: false },
	];

	const reminders = [
		{ text: 'Fee deadline for Semester 7', date: 'Dec 08' },
		{ text: 'Internal Exam 2 starts', date: 'Dec 15' },
		{ text: 'Tech Fest registration closes', date: 'Dec 05' },
	];

	const quickLinks = [
		{ name: 'Class Notes', url: '#', icon: BookOpen },
		{ name: 'WhatsApp Group', url: '#', icon: Coffee },
		{ name: 'LMS/ERP', url: '#', icon: Link2 },
		{ name: 'Previous Papers', url: '#', icon: FileText },
	];

	const weeklyRoutine = [
		{
			day: 'Monday',
			slots: [
				{ time: '09:00 - 10:00', subject: 'Database Systems', room: 'LB-301', faculty: 'Dr. Sharma' },
				{ time: '10:00 - 11:00', subject: 'Operating Systems', room: 'LB-302', faculty: 'Prof. Verma' },
				{ time: '11:15 - 12:15', subject: 'Computer Networks', room: 'LAB-101', faculty: 'Ms. Gupta' },
				{ time: '13:00 - 14:00', subject: 'Machine Learning', room: 'LH-201', faculty: 'Dr. Kumar' },
				{ time: '14:00 - 15:00', subject: 'Professional Communication', room: 'LH-205', faculty: 'Ms. Singh' },
			],
		},
		{
			day: 'Tuesday',
			slots: [
				{ time: '09:00 - 10:00', subject: 'Machine Learning', room: 'LH-201', faculty: 'Dr. Kumar' },
				{ time: '10:00 - 11:00', subject: 'Compiler Design', room: 'LB-305', faculty: 'Prof. Rao' },
				{ time: '11:15 - 13:15', subject: 'DBMS Lab', room: 'LAB-201', faculty: 'Mr. Patel' },
				{ time: '14:00 - 15:00', subject: 'Operating Systems', room: 'LB-302', faculty: 'Prof. Verma' },
			],
		},
		{
			day: 'Wednesday',
			slots: [
				{ time: '09:00 - 10:00', subject: 'Computer Networks', room: 'LAB-101', faculty: 'Ms. Gupta' },
				{ time: '10:00 - 11:00', subject: 'Database Systems', room: 'LB-301', faculty: 'Dr. Sharma' },
				{ time: '11:15 - 12:15', subject: 'Professional Communication', room: 'LH-205', faculty: 'Ms. Singh' },
				{ time: '13:00 - 15:00', subject: 'ML Lab', room: 'AI-LAB', faculty: 'Dr. Kumar & Team' },
			],
		},
		{
			day: 'Thursday',
			slots: [
				{ time: '09:00 - 11:00', subject: 'CN Lab', room: 'NET-LAB', faculty: 'Ms. Gupta' },
				{ time: '11:15 - 12:15', subject: 'Compiler Design', room: 'LB-305', faculty: 'Prof. Rao' },
				{ time: '13:00 - 14:00', subject: 'Machine Learning', room: 'LH-201', faculty: 'Dr. Kumar' },
				{ time: '14:00 - 15:00', subject: 'Operating Systems', room: 'LB-302', faculty: 'Prof. Verma' },
			],
		},
		{
			day: 'Friday',
			slots: [
				{ time: '09:00 - 10:00', subject: 'Professional Communication', room: 'LH-205', faculty: 'Ms. Singh' },
				{ time: '10:00 - 11:00', subject: 'Database Systems', room: 'LB-301', faculty: 'Dr. Sharma' },
				{ time: '11:15 - 12:15', subject: 'Computer Networks', room: 'LAB-101', faculty: 'Ms. Gupta' },
				{ time: '13:00 - 14:00', subject: 'Compiler Design', room: 'LB-305', faculty: 'Prof. Rao' },
			],
		},
		{
			day: 'Saturday',
			slots: [
				{ time: '09:00 - 11:00', subject: 'OS Lab', room: 'SYS-LAB', faculty: 'Prof. Verma' },
				{ time: '11:15 - 13:15', subject: 'Extra Curricular / Seminar', room: 'Auditorium', faculty: 'Varies' },
			],
		},
	];

	const today = format(currentTime, 'EEEE');
	const todayData = weeklyRoutine.find((d) => d.day === today);
	const now = currentTime;
	let nextClass = null;
	let timeUntilNext = '';

	if (todayData && isToday(now)) {
		const upcoming = todayData.slots.find((slot) => {
			const [start] = slot.time.split(' - ');
			const classTime = parse(`${format(now, 'yyyy-MM-dd')} ${start}`, 'yyyy-MM-dd HH:mm', new Date());
			return classTime > now;
		});

		if (upcoming) {
			nextClass = upcoming;
			const [start] = upcoming.time.split(' - ');
			const nextTime = parse(`${format(now, 'yyyy-MM-dd')} ${start}`, 'yyyy-MM-dd HH:mm', new Date());
			const mins = Math.round((nextTime.getTime() - now.getTime()) / 60000);
			timeUntilNext = mins > 0 ? `Next class starts in ${mins} mins` : 'Class starting now!';
		}
	}

	const handleDownloadPDF = async () => {
		if (!routineRef.current) return;
		const canvas = await html2canvas(routineRef.current, {
			scale: 2,
			useCORS: true,
			backgroundColor: '#0f172a',
		});
		const imgData = canvas.toDataURL('image/png');
		const pdf = new jsPDF('p', 'mm', 'a4');
		const pdfWidth = pdf.internal.pageSize.getWidth();
		const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
		pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
		pdf.save(`Class_Routine_${format(new Date(), 'dd-MMM-yyyy')}.pdf`);
	};

	return (
		<div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
			<motion.div
				className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}>
				<div className="flex items-center gap-3">
					<Calendar className="text-purple-400" size={32} />
					<div>
						<h1 className="text-2xl sm:text-3xl font-bold">Class Routine</h1>
						<p className="text-gray-400 text-sm">
							Semester 7 • CSE • {format(currentTime, 'EEEE, dd MMMM yyyy')}
						</p>
					</div>
				</div>
				<motion.button
					onClick={handleDownloadPDF}
					className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium py-3 px-6 rounded-xl shadow-lg"
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}>
					<Download size={20} />
					Download as PDF
				</motion.button>
			</motion.div>

			<div className="grid lg:grid-cols-3 gap-6" ref={routineRef}>
				<div className="lg:col-span-2 space-y-6">
					{todayData && (
						<motion.div
							className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-sm"
							initial={{ opacity: 0, x: -30 }}
							animate={{ opacity: 1, x: 0 }}>
							<h2 className="text-2xl font-bold text-purple-300 mb-4 flex items-center gap-2">
								<Timer className="text-purple-400" />
								Today’s Classes ({today})
							</h2>

							{nextClass && (
								<div className="mb-4 p-4 bg-white/10 rounded-xl text-cyan-300 font-medium flex items-center gap-2">
									<Clock size={18} />
									{timeUntilNext}
								</div>
							)}

							<div className="space-y-3">
								{todayData.slots.map((slot, i) => (
									<motion.div
										key={i}
										className="bg-white/10 rounded-lg p-4 flex flex-col sm:flex-row justify-between gap-4"
										whileHover={{ scale: 1.02 }}>
										<div className="flex gap-4">
											<div className="text-cyan-400 font-medium min-w-[110px]">
												<Clock size={16} className="inline mr-1" />
												{slot.time}
											</div>
											<div>
												<p className="font-medium text-gray-200">
													{slot.subject}
												</p>
												<p className="text-sm text-gray-400 mt-1">
													<Building size={14} className="inline mr-1" />
													{slot.room} •{' '}
													<User size={14} className="inline mx-1" />
													{slot.faculty}
												</p>
											</div>
										</div>
									</motion.div>
								))}
							</div>
						</motion.div>
					)}

					{/* WEEKLY ROUTINE */}
					<motion.div
						className="bg-white/5 border border-white/10 rounded-2xl p-5"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}>
						<h3 className="text-xl font-bold text-purple-300 mb-4 flex items-center gap-2">
							<Calendar /> Weekly Routine
						</h3>

						<div className="space-y-4">
							{weeklyRoutine.map((day, i) => {
								const isOpen = expandedDay === day.day;
								return (
									<div key={i} className="bg-white/5 rounded-xl border border-white/10">
										<button
											onClick={() =>
												setExpandedDay(isOpen ? null : day.day)
											}
											className="flex items-center justify-between w-full p-4">
											<p className="font-semibold text-gray-200">
												{day.day}
											</p>
											<ChevronDown
												className={`transition-transform ${
													isOpen ? 'rotate-180' : ''
												}`}
											/>
										</button>

										{isOpen && (
											<div className="p-4 space-y-3">
												{day.slots.map((slot, j) => (
													<div
														key={j}
														className="bg-white/10 rounded-lg p-3">
														<p className="text-cyan-400">
															<Clock
																size={14}
																className="inline mr-1"
															/>
															{slot.time}
														</p>
														<p className="font-medium text-gray-200">
															{slot.subject}
														</p>
														<p className="text-sm text-gray-400">
															{slot.room} • {slot.faculty}
														</p>
													</div>
												))}
											</div>
										)}
									</div>
								);
							})}
						</div>
					</motion.div>
				</div>

				{/* RIGHT SIDEBAR */}
				<div className="space-y-6">
					{/* Assignment */}
					<motion.div
						className="bg-white/5 border border-white/10 rounded-2xl p-5"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}>
						<h3 className="text-xl font-bold text-purple-300 mb-4 flex items-center gap-2">
							<CheckSquare size={20} />
							Assignments
						</h3>

						{assignments.map((a, i) => (
							<div
								key={i}
								className={`p-3 mb-2 rounded-lg ${
									a.urgent
										? 'bg-red-500/20 border border-red-500/40'
										: 'bg-white/5'
								}`}>
								<p className="font-medium">{a.name}</p>
								<p className="text-sm text-gray-400 flex items-center gap-1">
									<AlertCircle size={14} />
									Due {a.due}
								</p>
							</div>
						))}
					</motion.div>

					{/* Attendance */}
					<motion.div
						className="bg-white/5 border border-white/10 rounded-2xl p-5"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}>
						<h3 className="text-xl font-bold text-purple-300 mb-4 flex items-center gap-2">
							<TrendingUp size={20} />
							Attendance
						</h3>

						<p className="text-3xl font-bold text-cyan-400">
							{attendance.overall}%
						</p>

						<div className="mt-3 space-y-2">
							{attendance.subjects.map((s, i) => (
								<div key={i}>
									<p className="text-sm text-gray-300">{s.name}</p>
									<div className="w-full h-2 bg-white/10 rounded-full">
										<div
											className="h-2 bg-cyan-400 rounded-full"
											style={{ width: `${s.percent}%` }}></div>
									</div>
								</div>
							))}
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	);
}

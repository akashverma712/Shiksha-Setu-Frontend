'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/app/ThemeProvider'; // Adjust path if needed
import { Calendar, ChevronLeft, ChevronRight, BookOpen, Layers, Users, MapPin, GraduationCap, Clock, LayoutGrid, ArrowUpRight, Brain, Server } from 'lucide-react';

const dummyTimetable = [
	{
		day: 'Monday',
		classes: [
			{ time: '09:00 - 10:30 AM', subjectCode: 'CS501', subjectName: 'Database Systems', semester: 5, section: 'A', batch: '2022-2026', room: 'L-301', instructor: 'Dr. Arora', type: 'Theory' },
			{ time: '11:00 - 12:30 PM', subjectCode: 'CS601', subjectName: 'Machine Learning', semester: 7, section: 'B', batch: '2021-2025', room: 'LH-102', instructor: 'Prof. Mehta', type: 'Advanced' },
		],
	},
	{
		day: 'Tuesday',
		classes: [
			{ time: '10:00 - 11:30 AM', subjectCode: 'CS502', subjectName: 'Operating Systems', semester: 5, section: 'A', batch: '2022-2026', room: 'L-205', instructor: 'Dr. Nair', type: 'Theory' },
			{ time: '02:00 - 03:30 PM', subjectCode: 'IT404', subjectName: 'Web Development', semester: 4, section: 'C', batch: '2023-2027', room: 'Lab-205', instructor: 'Ms. Kapoor', type: 'Lab' },
		],
	},
	{
		day: 'Wednesday',
		classes: [
			{ time: '09:00 - 10:30 AM', subjectCode: 'CS501', subjectName: 'Database Systems', semester: 5, section: 'A', batch: '2022-2026', room: 'L-301', instructor: 'Dr. Arora', type: 'Theory' },
			{ time: '03:00 - 04:30 PM', subjectCode: 'CS601', subjectName: 'Machine Learning', semester: 7, section: 'B', batch: '2021-2025', room: 'LH-102', instructor: 'Prof. Mehta', type: 'Advanced' },
		],
	},
	{ day: 'Thursday', classes: [{ time: '11:00 - 12:30 PM', subjectCode: 'CS502', subjectName: 'Operating Systems', semester: 5, section: 'A', batch: '2022-2026', room: 'L-205', instructor: 'Dr. Nair', type: 'Theory' }] },
	{
		day: 'Friday',
		classes: [
			{ time: '02:30 - 04:00 PM', subjectCode: 'IT404', subjectName: 'Web Development', semester: 4, section: 'C', batch: '2023-2027', room: 'Lab-205', instructor: 'Ms. Kapoor', type: 'Lab' },
			{ time: '04:00 - 05:30 PM', subjectCode: 'CS601', subjectName: 'Machine Learning', semester: 7, section: 'B', batch: '2021-2025', room: 'LH-102', instructor: 'Prof. Mehta', type: 'Advanced' },
		],
	},
	{ day: 'Saturday', classes: [] },
];

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function TeacherTimetable() {
	const { theme } = useTheme();
	const isDark = theme === 'dark';

	const [currentDayIndex, setCurrentDayIndex] = useState(() => {
		const today = new Date().getDay();
		return today === 0 ? 5 : today - 1;
	});

	const currentDay = dummyTimetable[currentDayIndex];

	const navigateDay = (direction: 'prev' | 'next') => {
		setCurrentDayIndex((prev) => (direction === 'prev' ? (prev === 0 ? 5 : prev - 1) : prev === 5 ? 0 : prev + 1));
	};

	const typeColors: Record<string, string> = {
		Theory: isDark ? 'text-emerald-400 bg-emerald-900/20 border-emerald-800/50' : 'text-emerald-600 bg-emerald-100 border-emerald-300',
		Lab: isDark ? 'text-blue-400 bg-blue-900/20 border-blue-800/50' : 'text-blue-600 bg-blue-100 border-blue-300',
		Advanced: isDark ? 'text-purple-400 bg-purple-900/20 border-purple-800/50' : 'text-purple-600 bg-purple-100 border-purple-300',
	};

	return (
		<div className={`min-h-screen font-montserrat transition-colors duration-300 p-6 ${isDark ? 'bg-slate-950 text-slate-200' : 'bg-gray-50 text-gray-800'}`}>
			<div className="mx-auto max-w-4xl">
				{/* Header */}
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
					<div>
						<h2 className="text-3xl font-bold text-orange-500 flex items-center gap-2">
							<LayoutGrid
								size={26}
								className="text-orange-400"
							/>
							Weekly Timetable
						</h2>
						<p className={`${isDark ? 'text-slate-400' : 'text-gray-600'} text-sm`}>Your teaching schedule</p>
					</div>

					<div className="flex items-center gap-2">
						<button
							onClick={() => navigateDay('prev')}
							className={`p-3 rounded-xl transition ${isDark ? 'bg-slate-900 border border-slate-800 hover:bg-slate-800' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}>
							<ChevronLeft size={24} />
						</button>
						<div className="text-center px-4">
							<p className="font-bold text-lg text-orange-400 flex items-center justify-center gap-1">
								<Calendar size={16} /> {currentDay.day}
							</p>
							<p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
						</div>
						<button
							onClick={() => navigateDay('next')}
							className={`p-3 rounded-xl transition ${isDark ? 'bg-slate-900 border border-slate-800 hover:bg-slate-800' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}>
							<ChevronRight size={24} />
						</button>
					</div>
				</div>

				{/* Classes */}
				<div className="space-y-4">
					{currentDay.classes.length > 0 ? (
						currentDay.classes.map((cls, index) => {
							const IconComponent = cls.type === 'Lab' ? Server : cls.type === 'Advanced' ? Brain : BookOpen;

							return (
								<motion.div
									key={`${cls.subjectCode}-${cls.time}`}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: index * 0.1 }}
									className={`relative rounded-2xl p-6 overflow-hidden border transition-all ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200 shadow-sm'}`}>
									{/* Background Icon */}
									<div className="absolute right-0 top-0 h-full w-1/3 pointer-events-none flex justify-end items-center pr-4 opacity-10">
										<IconComponent
											size={140}
											className="text-orange-600"
										/>
									</div>

									{/* Main Content */}
									<div className="flex flex-col gap-4 relative z-10">
										{/* Top Row: Time + Type Badge */}
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2 text-orange-400 font-semibold text-lg">
												<Clock size={18} />
												{cls.time}
											</div>
											<span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${typeColors[cls.type] || (isDark ? 'text-slate-400 bg-slate-800/50 border-slate-700' : 'text-gray-600 bg-gray-200 border-gray-300')}`}>
												<Layers size={14} /> {cls.type}
											</span>
										</div>

										{/* Subject */}
										<div>
											<h3 className={`font-bold text-xl flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
												<BookOpen
													size={18}
													className="text-blue-400"
												/>
												{cls.subjectName}
											</h3>
											<p className="text-blue-400 text-sm">{cls.subjectCode}</p>
										</div>

										{/* Metadata Grid */}
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mt-4">
											<span className="flex items-center gap-2">
												<Layers
													size={16}
													className="text-emerald-400"
												/>
												Semester {cls.semester} • Section {cls.section}
											</span>
											<span className="flex items-center gap-2">
												<Users
													size={16}
													className="text-purple-400"
												/>
												{cls.batch}
											</span>
											<span className="flex items-center gap-2">
												<MapPin
													size={16}
													className="text-orange-400"
												/>
												{cls.room}
											</span>
											<span className="flex items-center gap-2">
												<GraduationCap
													size={16}
													className="text-blue-400"
												/>
												{cls.instructor}
											</span>
										</div>
									</div>
								</motion.div>
							);
						})
					) : (
						<div className={`text-center py-16 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
							<Calendar
								size={64}
								className={`mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-gray-400'}`}
							/>
							<p className={`text-xl font-semibold ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>No Classes Today</p>
							<p className={`${isDark ? 'text-slate-500' : 'text-gray-500'} mt-2`}>Enjoy your well-earned rest!</p>
						</div>
					)}
				</div>

				{/* Weekday Pills */}
				<div className="grid grid-cols-6 gap-2 mt-10">
					{daysOfWeek.map((day, i) => {
						const hasClass = dummyTimetable[i].classes.length > 0;
						const isActive = i === currentDayIndex;

						return (
							<button
								key={day}
								onClick={() => setCurrentDayIndex(i)}
								className={`py-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${isActive ? 'bg-orange-600 text-white shadow-lg' : hasClass ? (isDark ? 'bg-slate-800 text-slate-300 border border-slate-700' : 'bg-gray-200 text-gray-700 border border-gray-300') : isDark ? 'bg-slate-900 text-slate-600 border border-dashed border-slate-700' : 'bg-gray-100 text-gray-500 border border-dashed border-gray-300'}`}>
								{day.slice(0, 3)}
							</button>
						);
					})}
				</div>
			</div>
		</div>
	);
}

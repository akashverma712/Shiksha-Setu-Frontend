'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { GraduationCap, User, Shield, TrendingUp, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

interface TeacherForm {
	employeeId: string;
	password: string;
}

export default function LoginPage() {
	const router = useRouter();

	const [isTeacher, setIsTeacher] = useState(false);
	const [isSwitching, setIsSwitching] = useState(false);

	const [teacherForm, setTeacherForm] = useState<TeacherForm>({ employeeId: '', password: '' });
	const [teacherLoading, setTeacherLoading] = useState(false);

	const [studentEmail, setStudentEmail] = useState('');
	const [otp, setOtp] = useState('');
	const [showOtpInput, setShowOtpInput] = useState(false);
	const [otpSending, setOtpSending] = useState(false);
	const [otpVerifying, setOtpVerifying] = useState(false);

	useEffect(() => {
		setIsSwitching(true);
		const timer = setTimeout(() => setIsSwitching(false), 1200);
		return () => clearTimeout(timer);
	}, [isTeacher]);

	const handleApiError = (err: any, fallbackMessage: string) => {
		const message = err?.response?.data?.message || err?.message || fallbackMessage;
		toast.error(message);
	};

	// Teacher Login
	// const handleTeacherLogin = async (e: React.FormEvent) => {
	//   e.preventDefault();
	//   if (!teacherForm.employeeId || !teacherForm.password) {
	//     toast.error('Employee ID and password are required');
	//     return;
	//   }

	//   setTeacherLoading(true);
	//   try {
	//     const res = await axios.post(`${API_BASE_URL}/api/auth/teacher/login`, teacherForm, {
	//       withCredentials: false
	//     });

	//     localStorage.setItem('token', res.data.token);
	//     localStorage.setItem('user', JSON.stringify(res.data.user));

	//     toast.success(`Welcome back, ${res.data.user.name}!`);
	//     setTimeout(() => router.push('/teacher/dashboard'), 600);
	//   } catch (err: any) {
	//     handleApiError(err, 'Unable to login as teacher');
	//   } finally {
	//     setTeacherLoading(false);
	//   }
	// };
	const handleTeacherLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!teacherForm.employeeId || !teacherForm.password) {
			toast.error('Employee ID and password are required');
			return;
		}
		setTeacherLoading(true);
		try {
			const res = await axios.post(`${API_BASE_URL}/api/auth/teacher/login`, teacherForm);

			// Save auth data
			localStorage.setItem('token', res.data.token);
			localStorage.setItem('user', JSON.stringify(res.data.user));

			toast.success(`Welcome back, ${res.data.user.name}!`);

			// Smart redirect based on role
			const role = res.data.user.role;
			if (role === 'Teacher' || role === 'HOD') {
				setTimeout(() => router.push('/teacher/dashboard'), 800);
			} else {
				setTimeout(() => router.push('/student/dashboard'), 800);
			}
		} catch (err: any) {
			handleApiError(err, 'Invalid Employee ID or Password');
		} finally {
			setTeacherLoading(false);
		}
	};
	// Student: Send OTP
	const sendStudentOtp = async () => {
		const email = studentEmail.trim();

		if (!email || !email.includes('@')) {
			toast.error('Enter a valid email');
			return;
		}

		setOtpSending(true);
		try {
			await axios.post(`${API_BASE_URL}/api/auth/student/send-otp`, { email });
			toast.success('OTP sent to your email!');
			setShowOtpInput(true);
		} catch (err: any) {
			handleApiError(err, 'Failed to send OTP');
		} finally {
			setOtpSending(false);
		}
	};

	// Student: Verify OTP
	const verifyStudentOtp = async () => {
		const email = studentEmail.trim();

		if (!email) {
			toast.error('Email is required');
			return;
		}

		if (otp.length !== 6) {
			toast.error('Enter the 6-digit OTP');
			return;
		}

		setOtpVerifying(true);
		try {
			const res = await axios.post(`${API_BASE_URL}/api/auth/student/verify-otp`, {
				email,
				code: otp,
			});

			localStorage.setItem('token', res.data.token);
			localStorage.setItem('user', JSON.stringify(res.data.user));
			toast.success(`Welcome, ${res.data.user.name}!`);
			setTimeout(() => router.push('/student/dashboard'), 600);
		} catch (err: any) {
			handleApiError(err, 'Invalid or expired OTP');
		} finally {
			setOtpVerifying(false);
		}
	};

	const features = isTeacher
		? [
				{ icon: Shield, text: 'Real-time dropout alerts' },
				{ icon: TrendingUp, text: 'Department analytics' },
				{ icon: Users, text: 'Early intervention tools' },
		  ]
		: [
				{ icon: TrendingUp, text: 'View your risk score' },
				{ icon: GraduationCap, text: 'Track academic progress' },
				{ icon: Shield, text: 'Get personalized tips' },
		  ];

	return (
		<>
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
				<div className="relative w-full h-screen rounded-3xl shadow-2xl overflow-hidden border border-white/10 backdrop-blur-xl">
					{/* Sliding Background Panel */}
					<div
						className={`
    absolute inset-0 w-full lg:w-1/2 h-full flex items-center justify-center px-12
    transition-all duration-[1200ms]
    ${isTeacher ? 'translate-x-full bg-gradient-to-tr from-orange-600/10 to-pink-600/30' : 'translate-x-0 bg-gradient-to-r from-cyan-600/ to-purple-600/20'}
  `}>
						<div className="text-white max-w-lg">
							<div className="flex items-center gap-6 mb-10">
								<div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">{isTeacher ? <User size={64} /> : <GraduationCap size={64} />}</div>
								<div>
									<h1 className="text-5xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">{isTeacher ? 'Faculty Portal' : 'Student Portal'}</h1>
									<p className="text-2xl mt-3 opacity-90">{isTeacher ? 'Prevent Dropouts with AI' : 'Stay on Track with AI'}</p>
								</div>
							</div>
							<ul className="space-y-7 text-lg font-medium">
								{features.map(({ icon: Icon, text }, i) => (
									<li
										key={i}
										className="flex items-center gap-5 opacity-0"
										style={{
											animation: 'fadeSlideUp 0.9s ease-out forwards',
											animationDelay: `${i * 150}ms`,
										}}>
										<div className="p-3 bg-white/10 rounded-xl backdrop-blur border border-white/20">
											<Icon className="w-7 h-7" />
										</div>
										<span>{text}</span>
									</li>
								))}
							</ul>
						</div>
					</div>

					{/* Login Form Panel */}
					<div
						className="absolute top-0 h-full w-full lg:w-1/2 bg-slate-900/80 backdrop-blur-2xl flex items-center justify-center px-8 z-10"
						style={{
							left: isTeacher ? 0 : '50%',
							transition: 'all 1.2s cubic-bezier(0.22, 1, 0.36, 1)',
						}}>
						<div
							className="w-full max-w-md"
							style={{
								opacity: isSwitching ? 0 : 1,
								filter: isSwitching ? 'blur(8px)' : 'blur(0px)',
								transform: isSwitching ? (isTeacher ? 'translateX(-80px)' : 'translateX(80px)') : 'translateX(0)',
							}}>
							<div className="text-center mb-12">
								<h2 className="text-4xl font-bold text-white">{isTeacher ? 'Faculty Login' : 'Student Login'}</h2>
								<p className="text-gray-400 mt-3 text-lg">Welcome back to DropoutGuard AI</p>
							</div>

							{/* TEACHER LOGIN FORM */}
							{isTeacher && (
								<form
									onSubmit={handleTeacherLogin}
									className="space-y-6">
									<input
										type="text"
										placeholder="Employee ID"
										className="w-full px-6 py-4 text-lg rounded-2xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:border-white/50 focus:outline-none backdrop-blur"
										value={teacherForm.employeeId}
										onChange={(e) => setTeacherForm({ ...teacherForm, employeeId: e.target.value })}
										required
									/>
									<input
										type="password"
										placeholder="Password"
										className="w-full px-6 py-4 text-lg rounded-2xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:border-white/50 focus:outline-none backdrop-blur"
										value={teacherForm.password}
										onChange={(e) => setTeacherForm({ ...teacherForm, password: e.target.value })}
										required
									/>
									<button
										type="submit"
										disabled={teacherLoading}
										className="w-full py-5 rounded-2xl font-bold text-white text-lg bg-gradient-to-r from-orange-600/10 to-pink-600/30 shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed">
										{teacherLoading ? 'Logging in...' : 'Login as Teacher'}
									</button>
								</form>
							)}

							{/* STUDENT LOGIN – Email + OTP */}
							{!isTeacher && (
								<div className="space-y-6">
									{!showOtpInput ? (
										<>
											<input
												type="email"
												placeholder="your@email.com"
												className="w-full px-6 py-4 text-lg rounded-2xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:border-white/50 focus:outline-none backdrop-blur"
												value={studentEmail}
												onChange={(e) => setStudentEmail(e.target.value)}
											/>
											<button
												onClick={sendStudentOtp}
												disabled={otpSending}
												className="w-full py-5 rounded-2xl font-bold text-white text-lg bg-gradient-to-r from-cyan-600/0 to-purple-600/30 shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed">
												{otpSending ? 'Sending OTP...' : 'Send OTP'}
											</button>
										</>
									) : (
										<>
											<input
												type="text"
												placeholder="Enter 6-digit OTP"
												maxLength={6}
												className="w-full px-6 py-5 text-3xl text-center tracking-widest rounded-2xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:border-white/50 focus:outline-none backdrop-blur"
												value={otp}
												onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
											/>
											<button
												onClick={verifyStudentOtp}
												disabled={otpVerifying}
												className="w-full py-5 rounded-2xl font-bold text-white text-lg bg-gradient-to-r from-green-500 to-emerald-600 shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed">
												{otpVerifying ? 'Verifying...' : 'Verify OTP & Login'}
											</button>
										</>
									)}
								</div>
							)}

							{/* Role Switcher */}
							<div className="mt-16 flex justify-center gap-8">
								<button
									onClick={() => {
										setIsTeacher(false);
										setShowOtpInput(false);
									}}
									className={`px-12 py-4 rounded-2xl font-bold text-lg transition-all duration-500 ${!isTeacher ? 'bg-gradient-to-r from-cyan-600/0 to-purple-600/30 text-white shadow-2xl ring-1 ring-blue-500/30' : 'bg-white/10 text-gray-400 hover:bg-white/20 border border-white/20'}`}>
									Student
								</button>
								<button
									onClick={() => {
										setIsTeacher(true);
										setShowOtpInput(false);
									}}
									className={`px-12 py-4 rounded-2xl font-bold text-lg transition-all duration-500 ${isTeacher ? 'bg-gradient-to-r from-orange-600/10 to-pink-600/30 text-white shadow-2xl ring-1 ring-purple-500/30' : 'bg-white/10 text-gray-400 hover:bg-white/20 border border-white/20'}`}>
									Teacher
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			<style
				jsx
				global>{`
				@keyframes fadeSlideUp {
					from {
						opacity: 0;
						transform: translateY(20px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}
			`}</style>

			<Toaster
				position="top-center"
				toastOptions={{
					style: {
						background: '#1e293b',
						color: '#fff',
						border: '1px solid #334155',
					},
				}}
			/>
		</>
	);
}

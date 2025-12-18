'use client';
import { motion } from 'framer-motion';
import { Sparkles, MessageCircle, Users, Heart, BookOpen, Coffee, HelpCircle, Mail, Phone, MapPin, Globe, Send, Star, Zap, Shield, AlertCircle } from 'lucide-react';

export default function StudentConnectPage() {
	const mentors = [
		{ name: 'Prof. Anjali Sharma', role: 'Academic Mentor', dept: 'Computer Science', rating: 4.9 },
		{ name: 'Dr. Rohan Kapoor', role: 'Career Counselor', dept: 'Placement Cell', rating: 5.0 },
		{ name: 'Ms. Priya Mehta', role: 'Mental Health Advisor', dept: 'Wellness Center', rating: 4.8 },
	];

	// Fixed: added missing closing quote after 'Study Groups'
	const quickLinks = [
		{ icon: BookOpen, title: 'Study Groups', desc: 'Join subject-wise peer groups' },
		{ icon: Coffee, title: 'Campus Buddies', desc: 'Find friends with same interests' },
		{ icon: Heart, title: 'Support Circle', desc: 'Anonymous peer support' },
		{ icon: Zap, title: 'Event Alerts', desc: 'Hackathons, workshops & fests' },
	];

	const emergencyContacts = [
		{ title: 'Emergency Helpline', number: '1800-123-0000', icon: Phone },
		{ title: 'Mental Health Hotline', number: '+91 98765 43210', icon: Heart },
		{ title: 'Campus Security', number: '011-2649-8888', icon: Shield },
	];

	return (
		<div className="min-h-screen bg-slate-950 text-white">
			{/* Hero Banner */}
			<div className="bg-gradient-to-br from-purple-600/20 to-cyan-600/30 rounded-2xl mx-3 mt-4 p-8 relative overflow-hidden">
				<Sparkles className="absolute right-8 top-8 h-20 w-20 text-white/20" />
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-center max-w-4xl mx-auto">
					<h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Student Connect</h1>
					<p className="text-xl md:text-2xl text-slate-300 mt-4">You're never alone — we're a family here</p>
					<div className="flex justify-center gap-4 mt-8">
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className="px-8 py-4 bg-gradient-to-br from-purple-600/20 to-cyan-600/30 rounded-full font-semibold flex items-center gap-3 shadow-2xl">
							<MessageCircle className="h-5 w-5" />
							Start a Conversation
						</motion.button>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className="px-8 py-4 bg-white/10 backdrop-blur border border-white/20 rounded-full font-semibold">
							Explore Groups
						</motion.button>
					</div>
				</motion.div>
			</div>

			<div className="px-3 mt-8 pb-24 space-y-8">
				{/* Quick Connect Cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					{quickLinks.map((link, i) => (
						<motion.div
							key={i}
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: i * 0.1 }}
							whileHover={{ scale: 1.05, y: -8 }}
							className="bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-2xl p-6 backdrop-blur-xl cursor-pointer">
							<div className="p-3 w-fit bg-white/10 rounded-xl mb-4">
								<link.icon className="h-8 w-8 text-cyan-300" />
							</div>
							<h3 className="text-lg font-semibold mb-2">{link.title}</h3>
							<p className="text-sm text-slate-400">{link.desc}</p>
						</motion.div>
					))}
				</div>

				{/* Your Mentors */}
				<div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
					<h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
						<Users className="h-8 w-8 text-purple-300" />
						Your Support Team
					</h2>
					<div className="grid md:grid-cols-3 gap-5">
						{mentors.map((mentor, i) => (
							<motion.div
								key={i}
								initial={{ opacity: 0, x: -30 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: i * 0.15 }}
								className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all">
								<div className="flex items-center gap-4 mb-4">
									<div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl font-bold">
										{mentor.name
											.split(' ')
											.map((n) => n[0])
											.join('')}
									</div>
									<div>
										<h4 className="font-semibold">{mentor.name}</h4>
										<p className="text-sm text-slate-400">{mentor.role}</p>
									</div>
								</div>
								<p className="text-xs text-slate-500 mb-3">{mentor.dept}</p>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-1">
										<Star className="h-4 w-4 text-yellow-400 fill-current" />
										<span className="text-sm font-medium">{mentor.rating}</span>
									</div>
									<motion.button
										whileHover={{ scale: 1.1 }}
										className="text-cyan-300 text-sm flex items-center gap-1">
										<Send className="h-4 w-4" />
										Message
									</motion.button>
								</div>
							</motion.div>
						))}
					</div>
				</div>

				{/* Emergency Contacts */}
				<div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-600/40 rounded-2xl p-6">
					<h2 className="text-2xl font-bold mb-5 flex items-center gap-3 text-red-300">
						<AlertCircle className="h-8 w-8" />
						Emergency? We're Here 24×7
					</h2>
					<div className="grid md:grid-cols-3 gap-4">
						{emergencyContacts.map((contact, i) => (
							<motion.a
								key={i}
								href={`tel:${contact.number}`}
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: i * 0.1 }}
								className="bg-white/5 border border-white/10 rounded-xl p-5 text-center hover:bg-white/10 transition-all">
								<contact.icon className="h-10 w-10 mx-auto mb-3 text-red-300" />
								<p className="font-semibold">{contact.title}</p>
								<p className="text-cyan-300 text-lg mt-2">{contact.number}</p>
							</motion.a>
						))}
					</div>
				</div>

				{/* Final CTA */}
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					className="bg-gradient-to-r from-cyan-600/20 to-purple-600/30 border border-cyan-500/40 rounded-2xl p-8 text-center">
					<HelpCircle className="h-16 w-16 mx-auto text-cyan-300 mb-4" />
					<h2 className="text-3xl font-bold mb-4">Feeling Lost or Stressed?</h2>
					<p className="text-lg text-slate-300 max-w-2xl mx-auto mb-6">Talk to a counselor anonymously — no judgment, just support.</p>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-10 py-4 rounded-full font-bold text-lg shadow-2xl flex items-center gap-3 mx-auto">
						<Heart className="h-6 w-6" />
						Talk to Someone Now
					</motion.button>
				</motion.div>
			</div>
		</div>
	);
}

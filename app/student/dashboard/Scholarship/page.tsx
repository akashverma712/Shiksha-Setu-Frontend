'use client';
import React, { useState } from 'react';
import { GraduationCap, Banknote, Clock, User, ExternalLink, CalendarDays, Search, ArrowRight, Sparkles, Bot, PenTool, Loader2, Copy, Check } from 'lucide-react';

export default function ScholarshipHub() {
	const [activeTab, setActiveTab] = useState('match'); // 'match' or 'essay'
	const [aiInput, setAiInput] = useState('');
	const [aiResponse, setAiResponse] = useState('');
	const [isGenerating, setIsGenerating] = useState(false);
	const [selectedScholarship, setSelectedScholarship] = useState('');

	const scholarships = [
		{
			name: 'Reliance Foundation UG Scholarship',
			provider: 'Reliance Foundation',
			amount: 'Up to ₹2,00,000 over degree duration',
			openDate: 'September 2025',
			deadline: 'Oct 15, 2025 (Tentative)',
			eligibility: 'First-year UG students with >60% in Class 12 & Family Income < ₹15L',
			link: 'https://www.scholarships.reliancefoundation.org/',
			tags: ['Merit-cum-Means', 'Undergraduate'],
		},
		{
			name: "HDFC Bank Parivartan's ECSS",
			provider: 'HDFC Bank',
			amount: 'Up to ₹75,000 per year',
			openDate: 'August 2025',
			deadline: 'Sep 30, 2025 (Tentative)',
			eligibility: 'Class 1 to PG students. Family income < ₹2.5L p.a. Facing financial crisis.',
			link: 'https://www.hdfcbank.com/personal/borrow/popular-loans/educational-loan/scholarship',
			tags: ['Need-based', 'School & College'],
		},
		{
			name: 'Tata Trusts Means Grant',
			provider: 'Tata Trusts',
			amount: 'Variable Financial Assistance',
			openDate: 'November 2025',
			deadline: 'Jan 2026 (Tentative)',
			eligibility: 'Medical & Engineering students in Mumbai/Maharashtra colleges.',
			link: 'https://www.tatatrusts.org/',
			tags: ['Medical', 'Engineering'],
		},
		{
			name: 'NSDL Shiksha Sahyog Scholarship',
			provider: 'NSDL e-Gov',
			amount: '₹10,000 - ₹50,000',
			openDate: 'Year Round',
			deadline: 'Rolling Basis',
			eligibility: 'Min 60% in previous class. Preference for low income families.',
			link: 'https://www.vidyasaarathi.co.in/',
			tags: ['General', 'Skill Development'],
		},
		{
			name: 'Aditya Birla Capital Scholarship',
			provider: 'Aditya Birla Capital Foundation',
			amount: 'Up to ₹60,000 (One-time)',
			openDate: 'October 2025',
			deadline: 'Nov 2025 (Tentative)',
			eligibility: 'Students in Class 1-12, UG, or Professional courses. Income < ₹6L.',
			link: 'https://www.adityabirlacapital.com/',
			tags: ['School', 'Professional'],
		},
		{
			name: 'ONGC Scholarship for Meritorious SC/ST',
			provider: 'ONGC',
			amount: '₹48,000 per annum',
			openDate: 'September 2025',
			deadline: 'Oct 2025 (Tentative)',
			eligibility: 'SC/ST students in 1st year of Engineering/MBBS/MBA/Masters.',
			link: 'https://ongcscholar.org/',
			tags: ['SC/ST', 'Professional'],
		},
	];

	// --- GEMINI API INTEGRATION ---
	const callGemini = async (prompt: string) => {
		// Prefer reading the API key from env; fallback to the existing key if necessary.
		const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? 'AIzaSyCk3cqA1FpqoDj2vMeVgjMN-L5sMClRiOg'; // Injected by runtime environment
		const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

		const payload = {
			contents: [{ parts: [{ text: prompt }] }],
		};

		try {
			const response = await fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});

			if (!response.ok) throw new Error('API Error');

			const data = await response.json();
			return data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response at this time.";
		} catch (error) {
			console.error('Gemini Error:', error);
			return "Sorry, I'm having trouble connecting to the AI right now. Please try again in a moment.";
		}
	};

	const handleMatchMe = async () => {
		if (!aiInput.trim()) return;
		setIsGenerating(true);
		setAiResponse('');

		// We pass the scholarship list context to Gemini
		const context = `
      You are an expert scholarship counselor for Indian students.
      Here is the list of available scholarships in our database:
      ${JSON.stringify(scholarships.map((s) => ({ name: s.name, eligibility: s.eligibility, amount: s.amount })))}

      User Profile: "${aiInput}"

      Task: Analyze the user's profile and tell them which of the ABOVE scholarships they might be eligible for.
      Be encouraging but realistic. If they don't match any specific ones, suggest general categories (like "Look for state government scholarships").
      Keep the response concise (bullet points). Use emojis.
    `;

		const result = await callGemini(context);
		setAiResponse(result);
		setIsGenerating(false);
	};

	const handleDraftEssay = async () => {
		if (!aiInput.trim()) return;
		setIsGenerating(true);
		setAiResponse('');

		const context = `
      You are a professional academic mentor.
      Task: Write a short, persuasive Statement of Purpose (SOP) or Scholarship Essay (approx 200 words) for the "${selectedScholarship || 'General Scholarship'}".

      Candidate's Background/Achievements: "${aiInput}"

      Tone: Professional, humble, yet confident. Structure it with a hook, body (achievements), and future goals.
    `;

		const result = await callGemini(context);
		setAiResponse(result);
		setIsGenerating(false);
	};

	const copyToClipboard = () => {
		if (aiResponse) navigator.clipboard.writeText(aiResponse);
	};
	// ------------------------------

	return (
		<div className="w-full min-h-screen bg-[#0f172a] text-white p-6 md:p-12 font-sans selection:bg-pink-500 selection:text-white">
			{/* --- HEADER SECTION --- */}
			<div className="max-w-6xl mx-auto text-center mb-12">
				<div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl mb-6 border border-pink-500/20">
					<GraduationCap className="w-12 h-12 text-pink-500" />
				</div>
				<h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-200 to-orange-200">Scholarship Hub</h1>
				<p className="text-xl text-gray-400 max-w-2xl mx-auto">Find the right financial aid opportunities in India. Track deadlines, eligibility, and apply directly.</p>
			</div>

			<div className="max-w-7xl mx-auto space-y-12">
				{/* --- ✨ AI SCHOLARSHIP COACH SECTION (NEW) --- */}
				<div className="relative overflow-hidden bg-[#1e293b] rounded-3xl border border-pink-500/30 shadow-2xl shadow-pink-500/10">
					{/* Background decoration */}
					<div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 blur-[100px] rounded-full pointer-events-none"></div>

					<div className="p-8 md:p-10 relative z-10">
						<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
							<div className="flex items-center gap-3">
								<div className="p-3 bg-gradient-to-br from-pink-500 to-orange-500 rounded-xl shadow-lg">
									<Sparkles className="w-6 h-6 text-white" />
								</div>
								<div>
									<h2 className="text-2xl md:text-3xl font-bold text-white">Shiksha Scholarships Details</h2>
								</div>
							</div>

							<div className="flex bg-[#0f172a] p-1 rounded-xl border border-white/10">
								<button
									onClick={() => {
										setActiveTab('match');
										setAiResponse('');
										setAiInput('');
									}}
									className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'match' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}>
									Match Finder
								</button>
								<button
									onClick={() => {
										setActiveTab('essay');
										setAiResponse('');
										setAiInput('');
									}}
									className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'essay' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}>
									Essay Drafter
								</button>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						{/* INPUT COLUMN */}
						<div className="space-y-6">
							<div className="bg-[#0f172a]/50 p-6 rounded-2xl border border-white/5 h-full">
								{activeTab === 'match' ? (
									<>
										<div className="flex items-center gap-2 mb-4 text-blue-300">
											<Bot className="w-5 h-5" />
											<span className="font-semibold">Find Your Perfect Match</span>
										</div>
										<p className="text-gray-400 text-sm mb-4">Tell me about yourself (e.g., "I am a 12th grade student with 85% marks, family income 3 Lakhs, interested in Engineering").</p>
										<textarea
											value={aiInput}
											onChange={(e) => setAiInput(e.target.value)}
											placeholder="Type your profile details here..."
											className="w-full h-32 bg-[#0f172a] border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 resize-none transition-all"
										/>
										<button
											onClick={handleMatchMe}
											disabled={isGenerating || !aiInput}
											className="mt-4 w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold text-white shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
											{isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-4 h-4" />}
											{isGenerating ? 'Analyzing...' : 'Find Matches ✨'}
										</button>
									</>
								) : (
									<>
										<div className="flex items-center gap-2 mb-4 text-orange-300">
											<PenTool className="w-5 h-5" />
											<span className="font-semibold">Draft a Winning Essay</span>
										</div>

										<select
											className="w-full bg-[#0f172a] border border-white/10 rounded-xl p-3 text-white mb-3 focus:outline-none focus:border-orange-500/50"
											value={selectedScholarship}
											onChange={(e) => setSelectedScholarship(e.target.value)}>
											<option value="">-- Select Target Scholarship --</option>
											{scholarships.map((s, i) => (
												<option
													key={i}
													value={s.name}>
													{s.name}
												</option>
											))}
											<option value="General Application">General / Other</option>
										</select>

										<textarea
											value={aiInput}
											onChange={(e) => setAiInput(e.target.value)}
											placeholder="List your achievements, grades, and why you need this scholarship..."
											className="w-full h-32 bg-[#0f172a] border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 resize-none transition-all"
										/>
										<button
											onClick={handleDraftEssay}
											disabled={isGenerating || !aiInput}
											className="mt-4 w-full py-3 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl font-bold text-white shadow-lg hover:shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
											{isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <PenTool className="w-4 h-4" />}
											{isGenerating ? 'Drafting...' : 'Generate Essay ✨'}
										</button>
									</>
								)}
							</div>
						</div>

						{/* OUTPUT COLUMN */}
						<div className="bg-[#0f172a] rounded-2xl border border-white/10 p-6 min-h-[300px] flex flex-col relative">
							<div className="flex justify-between items-center mb-4 pb-4 border-b border-white/5">
								<span className="text-gray-400 text-xs font-bold uppercase tracking-wider">AI Coach Response</span>
								{aiResponse && (
									<button
										onClick={copyToClipboard}
										className="text-xs flex items-center gap-1 text-gray-400 hover:text-white transition-colors">
										<Copy className="w-3 h-3" /> Copy
									</button>
								)}
							</div>

							<div className="flex-grow overflow-y-auto custom-scrollbar">
								{isGenerating ? (
									<div className="h-full flex flex-col items-center justify-center text-gray-500 gap-3">
										<Loader2 className="w-8 h-8 animate-spin text-pink-500" />
										<p className="text-sm animate-pulse">Consulting Gemini AI...</p>
									</div>
								) : aiResponse ? (
									<div className="prose prose-invert prose-sm max-w-none">
										<div className="whitespace-pre-wrap text-gray-300 leading-relaxed font-light">{aiResponse}</div>
									</div>
								) : (
									<div className="h-full flex flex-col items-center justify-center text-gray-600 gap-3">
										<Bot className="w-10 h-10 opacity-20" />
										<p className="text-sm text-center px-6">{activeTab === 'match' ? "Enter your details on the left, and I'll scan the database for you." : "Select a scholarship and tell me your story. I'll write the first draft."}</p>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* --- SCHOLARSHIPS GRID --- */}
			<div className="flex items-center gap-3 my-6 ">
				<div className="h-px bg-white/10 flex-grow"></div>
				<span className="text-gray-400 text-sm">Available Scholarships</span>
				<div className="h-px bg-white/10 flex-grow"></div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{scholarships.map((sch, i) => (
					<div
						key={i}
						className="group flex flex-col bg-[#1e293b] rounded-3xl border border-white/5 overflow-hidden hover:border-pink-500/40 hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-300">
						{/* Card Header */}
						<div className="p-8 pb-4">
							<div className="flex justify-between items-start mb-4">
								<div className="flex-1">
									<span className="inline-block px-3 py-1 mb-3 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-bold uppercase tracking-wider">{sch.provider}</span>
									<h3 className="text-2xl font-bold text-white group-hover:text-pink-300 transition-colors leading-tight">{sch.name}</h3>
								</div>
								<a
									href={sch.link}
									target="_blank"
									rel="noopener noreferrer"
									className="p-3 bg-white/5 rounded-xl group-hover:bg-gradient-to-br group-hover:from-pink-500 group-hover:to-orange-500 group-hover:text-white transition-all duration-300 ml-4">
									<ExternalLink className="w-6 h-6" />
								</a>
							</div>

							{/* Key Stats */}
							<div className="grid grid-cols-2 gap-4 mt-6">
								<div className="bg-[#0f172a] p-4 rounded-2xl border border-white/5">
									<div className="flex items-center gap-2 mb-1 text-green-400">
										<Banknote className="w-5 h-5" />
										<span className="text-xs font-bold uppercase">Grant Amount</span>
									</div>
									<p className="font-semibold text-white">{sch.amount}</p>
								</div>
								<div className="bg-[#0f172a] p-4 rounded-2xl border border-white/5">
									<div className="flex items-center gap-2 mb-1 text-orange-400">
										<Clock className="w-5 h-5" />
										<span className="text-xs font-bold uppercase">Deadline</span>
									</div>
									<p className="font-semibold text-white">{sch.deadline}</p>
								</div>
							</div>
						</div>

						{/* Details Section */}
						<div className="p-8 pt-2 flex-grow flex flex-col justify-between">
							<div className="space-y-4">
								<div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
									<CalendarDays className="w-6 h-6 text-purple-400 flex-shrink-0 mt-0.5" />
									<div>
										<p className="text-sm text-gray-400 font-semibold mb-1">When to Apply?</p>
										<p className="text-gray-200">
											Applications expected to open in <span className="text-white font-bold">{sch.openDate}</span>
										</p>
									</div>
								</div>

								<div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
									<User className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
									<div>
										<p className="text-sm text-gray-400 font-semibold mb-1">Who is eligible?</p>
										<p className="text-gray-300 leading-relaxed text-sm">{sch.eligibility}</p>
									</div>
								</div>
							</div>

							<div className="mt-8 flex items-center justify-between pt-6 border-t border-white/10">
								<div className="flex flex-wrap gap-2">
									{sch.tags.map((tag, tagIndex) => (
										<span
											key={tagIndex}
											className="px-3 py-1 bg-[#0f172a] rounded-lg text-xs text-gray-400 font-medium border border-white/5">
											#{tag}
										</span>
									))}
								</div>

								<a
									href={sch.link}
									target="_blank"
									rel="noopener noreferrer"
									className="hidden md:flex items-center gap-2 text-sm font-bold text-pink-500 hover:text-pink-400 transition-colors">
									Visit Portal <ArrowRight className="w-4 h-4" />
								</a>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

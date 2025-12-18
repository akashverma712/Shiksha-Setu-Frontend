'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Upload, BookOpen, BrainCircuit, CheckCircle, AlertTriangle, FileText, ArrowRight, RefreshCcw, GraduationCap, Activity, XCircle, HelpCircle, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { motion } from 'framer-motion';
const apiKey = 'YOUR_GEMINI_API_KEY'; // Replace with your key or use env

const generateContent = async (prompt: string, imageBase64: string | null = null) => {
	try {
		const baseUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`;

		const contents = imageBase64
			? [
					{
						parts: [{ text: prompt }, { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } }],
					},
			  ]
			: [{ parts: [{ text: prompt }] }];

		const response = await fetch(`${baseUrl}?key=${apiKey}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				contents,
				generationConfig: { responseMimeType: 'application/json' },
			}),
		});

		if (!response.ok) throw new Error('Gemini API request failed');

		const data = await response.json();
		let text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

		// Clean JSON
		text = text.replace(/^```json\n?|```$/g, '').trim();

		return JSON.parse(text);
	} catch (error) {
		console.error('Gemini Error:', error);
		throw error;
	}
};

export default function ShikshaSetu() {
	const [step, setStep] = useState<'welcome' | 'input' | 'loading' | 'quiz' | 'analysis'>('welcome');
	const [mode, setMode] = useState<'upload' | 'manual' | null>(null);
	const [fileData, setFileData] = useState<string | null>(null);
	const [manualData, setManualData] = useState({ class: '', subject: '', topic: '' });
	const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});
	const [analysisResult, setAnalysisResult] = useState<any>(null);
	const [error, setError] = useState<string | null>(null);

	// Handlers
	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onloadend = () => {
			const base64 = (reader.result as string).split(',')[1];
			setFileData(base64);
		};
		reader.readAsDataURL(file);
	};

	const startQuizGeneration = async () => {
		setStep('loading');
		setError(null);

		try {
			let prompt = '';

			if (mode === 'upload') {
				prompt = `Analyze this handwritten or printed study material image.
Extract key concepts and generate 10 high-quality MCQs.
Return ONLY valid JSON with this structure:
{
  "extractedTextSummary": "Brief 1-line summary",
  "questions": [
    {
      "id": 1,
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0,
      "topic": "Sub-topic"
    }
  ]
}`;
				const result = await generateContent(prompt, fileData);
				setQuizQuestions(result.questions || []);
			} else {
				prompt = `Generate 10 excellent MCQs for:
Class: ${manualData.class}
Subject: ${manualData.subject}
Topic: ${manualData.topic}

Return ONLY valid JSON:
{
  "questions": [
    {
      "id": 1,
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 2,
      "topic": "..."
    }
  ]
}`;
				const result = await generateContent(prompt);
				setQuizQuestions(result.questions || []);
			}

			if (quizQuestions.length === 0) throw new Error('No questions generated');
			setStep('quiz');
		} catch (err) {
			setError('Failed to generate quiz. Try again or check your input.');
			setStep('input');
		}
	};

	const submitQuiz = async () => {
		setStep('loading');

		let score = 0;
		const wrongTopics: string[] = [];

		quizQuestions.forEach((q, i) => {
			if (userAnswers[i] === q.correctAnswer) score++;
			else wrongTopics.push(q.topic);
		});

		try {
			const prompt = `
You are an empathetic AI academic mentor.
Student scored ${score}/10.
Weak topics: ${wrongTopics.join(', ') || 'None'}

Provide:
- riskLevel: "Low" | "Medium" | "High"
- counselingMessage: Use <b>bold</b> and <br> for formatting (HTML)
- improvementPlan: 3 actionable steps
- topicPerformance: array of { name: string, score: 0-100 }

Return strict JSON only.
`;

			const analysis = await generateContent(prompt);
			setAnalysisResult({ ...analysis, score, total: quizQuestions.length });
			setStep('analysis');
		} catch (err) {
			setError('Analysis failed. But your score is still saved!');
			setAnalysisResult({ score, total: quizQuestions.length });
			setStep('analysis');
		}
	};

	// Renderers
	const WelcomeScreen = () => (
		<div className="min-h-screen bg-gradient-to-br from-slate-900  to-slate-900 text-white flex items-center justify-center p-6">
			<div className="text-center max-w-4xl">
				<motion.div
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					className="mb-12">
					<div className="inline-flex p-6 bg-white/10 backdrop-blur rounded-3xl mb-8">
						<GraduationCap className="w-20 h-20 text-cyan-300" />
					</div>
					<h1 className="text-6xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Shiksha Setu</h1>
					<p className="text-xl text-slate-300 mt-6">AI-Powered Learning Companion</p>
				</motion.div>

				<div className="grid md:grid-cols-2 gap-8 mt-12">
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={() => {
							setMode('upload');
							setStep('input');
						}}
						className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 hover:bg-white/20 transition-all">
						<Upload className="w-16 h-16 mx-auto mb-6 text-cyan-300" />
						<h3 className="text-2xl font-bold mb-3">Upload Notes</h3>
						<p className="text-slate-300">Scan handwritten notes or textbook pages</p>
					</motion.button>

					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={() => {
							setMode('manual');
							setStep('input');
						}}
						className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 hover:bg-white/20 transition-all">
						<BookOpen className="w-16 h-16 mx-auto mb-6 text-purple-300" />
						<h3 className="text-2xl font-bold mb-3">Choose Topic</h3>
						<p className="text-slate-300">Select class, subject & topic manually</p>
					</motion.button>
				</div>
			</div>
		</div>
	);

	const InputScreen = () => (
		<div className="min-h-screen bg-slate-900 text-white p-6">
			<div className="max-w-2xl mx-auto">
				<button
					onClick={() => setStep('welcome')}
					className="flex items-center gap-2 text-slate-400 hover:text-white mb-8">
					<ChevronLeft /> Back
				</button>

				{mode === 'upload' ? (
					<div className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 text-center">
						<h2 className="text-3xl font-bold mb-8">Upload Your Study Material</h2>
						<label className="cursor-pointer block">
							<input
								type="file"
								accept="image/*"
								onChange={handleFileUpload}
								className="hidden"
							/>
							{fileData ? (
								<div className="space-y-6">
									<img
										src={`data:image/jpeg;base64,${fileData}`}
										alt="Uploaded"
										className="max-h-96 mx-auto rounded-2xl shadow-2xl"
									/>
									<p className="text-green-400 flex items-center justify-center gap-2">
										<CheckCircle /> Image ready!
									</p>
								</div>
							) : (
								<div className="border-4 border-dashed border-white/20 rounded-3xl p-16 hover:border-cyan-400 transition-colors">
									<Upload className="w-20 h-20 mx-auto text-slate-400 mb-6" />
									<p className="text-xl">Click to upload image</p>
									<p className="text-sm text-slate-400 mt-3">Handwritten or printed notes</p>
								</div>
							)}
						</label>
						<button
							onClick={startQuizGeneration}
							disabled={!fileData}
							className="mt-10 w-full py-5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl font-bold text-lg disabled:opacity-50">
							Generate Quiz Now
						</button>
					</div>
				) : (
					<div className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 space-y-8">
						<h2 className="text-3xl font-bold text-center">Tell Us What You're Studying</h2>
						{['class', 'subject', 'topic'].map((field) => (
							<div key={field}>
								<label className="block text-sm font-medium mb-3 capitalize">{field === 'class' ? 'Class / Course' : field}</label>
								<input
									type="text"
									placeholder={field === 'class' ? 'e.g. 12th CBSE, B.Tech CSE' : field === 'subject' ? 'e.g. Physics, Machine Learning' : 'e.g. Thermodynamics'}
									value={manualData[field as keyof typeof manualData]}
									onChange={(e) => setManualData({ ...manualData, [field]: e.target.value })}
									className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl focus:border-cyan-400 outline-none transition"
								/>
							</div>
						))}
						<button
							onClick={startQuizGeneration}
							disabled={!manualData.class || !manualData.subject || !manualData.topic}
							className="w-full py-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl font-bold text-lg disabled:opacity-50">
							Generate My Quiz
						</button>
					</div>
				)}
			</div>
		</div>
	);

	const LoadingScreen = () => (
		<div className="min-h-screen bg-slate-900 flex items-center justify-center">
			<div className="text-center">
				<div className="relative w-32 h-32 mx-auto mb-8">
					<div className="absolute inset-0 rounded-full border-8 border-slate-700"></div>
					<div className="absolute inset-0 rounded-full border-8 border-t-cyan-500 border-r-purple-500 animate-spin"></div>
					<Sparkles className="absolute inset-0 m-auto w-12 h-12 text-cyan-400 animate-pulse" />
				</div>
				<h3 className="text-2xl font-bold text-white mb-3">Shiksha AI is Thinking...</h3>
				<p className="text-slate-400">{mode === 'upload' ? 'Reading your notes...' : 'Creating personalized questions...'}</p>
			</div>
		</div>
	);

	const QuizScreen = () => {
		if (quizQuestions.length === 0) return null;
		const q = quizQuestions[currentQuestionIndex];
		const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

		return (
			<div className="min-h-screen bg-slate-900 text-white p-6">
				<div className="max-w-4xl mx-auto">
					<div className="mb-8">
						<div className="flex justify-between text-sm mb-3">
							<span>
								Question {currentQuestionIndex + 1} / {quizQuestions.length}
							</span>
							<span>{Math.round(progress)}%</span>
						</div>
						<div className="h-3 bg-white/10 rounded-full overflow-hidden">
							<motion.div
								className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
								initial={{ width: 0 }}
								animate={{ width: `${progress}%` }}
								transition={{ duration: 0.5 }}
							/>
						</div>
					</div>

					<motion.div
						key={currentQuestionIndex}
						initial={{ opacity: 0, x: 100 }}
						animate={{ opacity: 1, x: 0 }}
						className="bg-white/10 backdrop-blur-xl rounded-3xl p-10">
						<span className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium">{q.topic}</span>
						<h3 className="text-2xl font-bold mt-6 mb-10">{q.question}</h3>

						<div className="grid gap-4">
							{q.options.map((opt: string, i: number) => {
								const selected = userAnswers[currentQuestionIndex] === i;
								return (
									<button
										key={i}
										onClick={() => setUserAnswers({ ...userAnswers, [currentQuestionIndex]: i })}
										className={`p-5 rounded-2xl text-left transition-all ${selected ? 'bg-gradient-to-r from-cyan-500/30 to-purple-500/30 border-2 border-cyan-400' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}>
										<span className="text-lg font-medium">{opt}</span>
									</button>
								);
							})}
						</div>

						<div className="flex justify-between mt-12">
							<button
								onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
								disabled={currentQuestionIndex === 0}
								className="px-8 py-4 bg-white/10 rounded-2xl disabled:opacity-50">
								Previous
							</button>
							{currentQuestionIndex === quizQuestions.length - 1 ? (
								<button
									onClick={submitQuiz}
									className="px-10 py-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl font-bold text-lg shadow-xl">
									See My Results
								</button>
							) : (
								<button
									onClick={() => setCurrentQuestionIndex(Math.min(quizQuestions.length - 1, currentQuestionIndex + 1))}
									className="px-8 py-4 bg-white/20 rounded-2xl font-semibold">
									Next Question → Next
								</button>
							)}
						</div>
					</motion.div>
				</div>
			</div>
		);
	};

	const AnalysisScreen = () => {
		if (!analysisResult) return <div className="text-white">Loading results...</div>;

		const { score, total, riskLevel, counselingMessage, improvementPlan, topicPerformance = [] } = analysisResult;
		const percentage = Math.round((score / total) * 100);

		return (
			<div className="min-h-screen bg-gradient-to-b from-slate-900 to-black text-white p-6">
				<div className="max-w-6xl mx-auto space-y-8">
					<div className="text-center py-12">
						<h1 className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Your Assessment Report</h1>
						<p className="text-xl text-slate-400 mt-4">Powered by Shiksha AI</p>
					</div>

					{/* Score + Risk */}
					<div className="grid md:grid-cols-3 gap-8">
						<div className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 text-center">
							<p className="text-slate-400 mb-4">Your Score</p>
							<div className="text-7xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
								{score}
								<span className="text-5xl text-slate-400">/{total}</span>
							</div>
							<p className="text-2xl mt-4 text-cyan-300">{percentage}%</p>
						</div>

						<div className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 text-center">
							<p className="text-slate-400 mb-4">Academic Risk Level</p>
							<p className={`text-5xl font-black ${riskLevel === 'Low' ? 'text-emerald-400' : riskLevel === 'Medium' ? 'text-yellow-400' : 'text-red-400'}`}>{riskLevel}</p>
						</div>

						<div className="bg-white/10 backdrop-blur-xl rounded-3xl p-10">
							<p className="text-slate-400 mb-6">Focus Areas</p>
							<ul className="space-y-3">
								{improvementPlan?.map((item: string, i: number) => (
									<li
										key={i}
										className="flex items-center gap-3">
										<CheckCircle className="text-emerald-400" />
										<span>{item}</span>
									</li>
								))}
							</ul>
						</div>
					</div>

					{/* Charts */}
					<div className="grid lg:grid-cols-2 gap-8">
						<div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8">
							<h3 className="text-2xl font-bold mb-6">Topic-wise Performance</h3>
							<ResponsiveContainer
								width="100%"
								height={300}>
								<BarChart data={topicPerformance}>
									<CartesianGrid
										strokeDasharray="3 3"
										stroke="#333"
									/>
									<XAxis
										dataKey="name"
										stroke="#888"
									/>
									<YAxis
										domain={[0, 100]}
										stroke="#888"
									/>
									<Tooltip contentStyle={{ background: '#1e1e1e', border: 'none', borderRadius: '12px' }} />
									<Bar
										dataKey="score"
										fill="#8b5cf6"
										radius={[10, 10, 0, 0]}
									/>
								</BarChart>
							</ResponsiveContainer>
						</div>

						<div className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-3xl p-8 text-white">
							<div className="flex items-center gap-4 mb-6">
								<BrainCircuit className="w-12 h-12 text-cyan-300" />
								<div>
									<h3 className="text-2xl font-bold">AI Counselor Message</h3>
									<p className="text-slate-300">Personal guidance just for you</p>
								</div>
							</div>
							<div
								className="prose prose-invert max-w-none leading-relaxed text-lg"
								dangerouslySetInnerHTML={{ __html: counselingMessage || "Keep going! You're doing great." }}
							/>
						</div>
					</div>

					<div className="text-center">
						<button
							onClick={() => {
								setStep('welcome');
								setQuizQuestions([]);
								setAnalysisResult(null);
								setUserAnswers({});
							}}
							className="px-12 py-5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full text-xl font-bold shadow-2xl hover:shadow-cyan-500/50 transition-all">
							Start New Assessment
						</button>
					</div>
				</div>
			</div>
		);
	};

	return (
		<>
			{step === 'welcome' && <WelcomeScreen />}
			{step === 'input' && <InputScreen />}
			{step === 'loading' && <LoadingScreen />}
			{step === 'quiz' && <QuizScreen />}
			{step === 'analysis' && <AnalysisScreen />}
		</>
	);
}

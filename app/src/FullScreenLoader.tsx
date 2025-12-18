'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function FullScreenLoader({ isLoading = true }: { isLoading?: boolean }) {
	if (!isLoading) return null;

	return (
		<motion.div
			initial={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.6, ease: 'easeOut' }}
			className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950">
			{/* Animated Background Shimmer */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 via-pink-900/10 to-purple-900/20" />

				<motion.div
					animate={{
						x: [-1000, 1000],
					}}
					transition={{
						duration: 8,
						repeat: Infinity,
						ease: 'linear',
					}}
					className="absolute inset-0 -skew-x-12">
					<div className="h-full w-full bg-gradient-to-r from-transparent via-orange-500/10 to-transparent blur-xl" />
				</motion.div>

				<motion.div
					animate={{
						x: [1000, -1000],
					}}
					transition={{
						duration: 12,
						repeat: Infinity,
						ease: 'linear',
					}}
					className="absolute inset-0 skew-x-12">
					<div className="h-full w-full bg-gradient-to-r from-transparent via-pink-500/8 to-transparent blur-2xl" />
				</motion.div>
			</div>

			{/* Content */}
			<motion.div
				initial={{ scale: 0.9, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ duration: 0.8, ease: 'easeOut' }}
				className="relative z-10 flex flex-col items-center gap-8">
				{/* Optional Logo or Icon */}
				<motion.div
					animate={{
						rotate: [0, 360],
					}}
					transition={{
						duration: 20,
						repeat: Infinity,
						ease: 'linear',
					}}
					className="p-6 bg-gradient-to-br from-orange-600 to-pink-600 rounded-3xl shadow-2xl shadow-orange-900/50">
					<Loader2 className="h-12 w-12 text-white animate-spin" />
				</motion.div>

				{/* Text */}
				<div className="text-center">
					<motion.h2
						animate={{
							opacity: [0.6, 1, 0.6],
						}}
						transition={{
							duration: 2,
							repeat: Infinity,
							ease: 'easeInOut',
						}}
						className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400">
						Loading...
					</motion.h2>
					<p className="mt-3 text-slate-400 text-sm tracking-wider">Preparing something awesome</p>
				</div>

				{/* Shimmer Bar at Bottom */}
				<div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-64 h-1 bg-slate-800 rounded-full overflow-hidden">
					<motion.div
						animate={{ x: [-100, 300] }}
						transition={{
							duration: 2.5,
							repeat: Infinity,
							ease: 'easeInOut',
						}}
						className="h-full w-32 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full blur-sm"
					/>
				</div>
			</motion.div>
		</motion.div>
	);
}

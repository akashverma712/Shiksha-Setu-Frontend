'use client';

import React from 'react';
import Navbar from '../components/Navbar';
import StairsTransition from '../components/StairsTransition';
import ExperienceSection from './components/ExpereinceSection';

export default function About() {
	return (
		<StairsTransition>
			<div className="absolute top-0 left-0 w-full z-30 bg-black/40 backdrop-blur-md">
				<Navbar />
			</div>

			<div className="min-h-screen bg-black text-white w-full pt-16 relative overflow-x-hidden">
				<ExperienceSection />
			</div>
		</StairsTransition>
	);
}

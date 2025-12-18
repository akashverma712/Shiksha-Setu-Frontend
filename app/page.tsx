'use client';

import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Loader from './components/Loading';

export default function HomePage() {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => setLoading(false), 6000);
		return () => clearTimeout(timer);
	}, []);

	if (loading) return <Loader />;

	return (
		<div className="relative w-screen h-screen bg-[#0B0B0B] overflow-hidden select-none">
			{/* Spline Background */}
			<iframe
				src="https://my.spline.design/quantum-KEA5SsgHlabw69udiGz2AEEj/"
				frameBorder="0"
				width="100%"
				height="100%"></iframe>

			{/* Navbar */}
			<div className="absolute top-0 left-0 w-full z-20 bg-black/40 backdrop-blur-md">
				<Navbar />
			</div>

			{/* Social Sidebar */}
			{/* <SocialSidebar /> */}
		</div>
	);
}

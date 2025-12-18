'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {  GraduationCap, Server, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function Loading() {
  const [progress, setProgress] = useState(0);
  const [textIndex, setTextIndex] = useState(0);

  const loadingTexts = [
   
    "Calculating Dropout Risks...",
    "Optimizing Dashboard...",
    "Almost Ready..."
  ];

  // Logic for non-linear loading speed (Increased speed)
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 99) return 99; // Stalls at 99% until page actually loads

        // Dynamic increment based on current progress (Values increased for faster load)
        let increment = 0;
        const random = Math.random();

        if (prev < 30) {
          increment = random * 25; // Blazing fast start
        } else if (prev < 60) {
          increment = random * 15; // Fast
        } else if (prev < 80) {
          increment = random * 8; // Medium
        } else if (prev < 90) {
          increment = random * 4; // Slowing down
        } else {
          increment = random * 0.8; // Crawling at the end (Zeno's paradox)
        }

        const nextValue = prev + increment;
        return nextValue > 99 ? 99 : nextValue;
      });
    }, 150); // Updates every 150ms (faster tick rate)

    return () => clearInterval(timer);
  }, []);

  // Faster Text cycling logic
  useEffect(() => {
    const textTimer = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % loadingTexts.length);
    }, 1800);
    return () => clearInterval(textTimer);
  }, []);

  return (
    <div className="fixed inset-0 bg-slate-950 z-100 flex flex-col items-center justify-center overflow-hidden font-sans text-slate-200">
      
      {/* Background Decor: Pulsing Orbs (Dark Mode Adjusted) */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-120 h-120 bg-blue-600 rounded-full blur-[100px] -z-10"
      />
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 right-1/4 w-140 h-140 bg-orange-600 rounded-full blur-[100px] -z-10"
      />

      {/* Main Loader Composition */}
      <div className="relative flex flex-col items-center justify-center w-full max-w-md px-6">
        
        {/* Central Progress Circle */}
        <div className="relative w-48 h-48 mb-10 flex items-center justify-center">
          
          {/* Outer Rotating Ring (Decorative) */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-slate-800 border-dashed"
          />

          {/* SVG Progress Circle */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
             {/* Track */}
             <circle
               cx="96"
               cy="96"
               r="88"
               stroke="currentColor"
               strokeWidth="4"
               fill="transparent"
               className="text-slate-800"
             />
             {/* Progress Fill */}
             <motion.circle
               cx="96"
               cy="96"
               r="88"
               stroke="currentColor"
               strokeWidth="4"
               fill="transparent"
               strokeDasharray={2 * Math.PI * 88}
               strokeDashoffset={2 * Math.PI * 88 * (1 - progress / 100)}
               strokeLinecap="round"
               className="text-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.5)] transition-all duration-300 ease-out"
             />
          </svg>

          {/* Inner Content: Percentage & Icons */}
          <div className="flex flex-col items-center z-10">
             <div className="flex items-center justify-center mb-2 text-slate-500">
                < GraduationCap className="w-6 h-6 animate-pulse" />
             </div>
             <div className="text-5xl font-bold text-white tracking-tighter tabular-nums">
               {Math.floor(progress)}%
             </div>
             <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-widest">Processing</p>
          </div>

          {/* Orbiting Particle */}
          <motion.div
            className="absolute w-full h-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
             <div className="w-3 h-3 bg-blue-500 rounded-full absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1.5 shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>
          </motion.div>
        </div>

        {/* Branding Title */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-4xl font-black tracking-widest uppercase">
            <span className="text-transparent [-webkit-text-stroke:1px_#cbd5e1]">Shiksha</span>{' '}
            <span className="text-transparent [-webkit-text-stroke:1px_#f97316] drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]">Setu</span>
          </h1>
        </motion.div>

        {/* Dynamic Loading Text */}
        <div className="h-8 overflow-hidden relative w-full text-center">
            <AnimatePresence mode='wait'>
            <motion.p
              key={textIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-slate-400 font-medium text-sm"
            >
              {loadingTexts[textIndex]}
            </motion.p>
            </AnimatePresence>
        </div>

        {/* System Status Indicators (Bottom) */}
        <div className="mt-12 grid grid-cols-3 gap-4 w-full border-t border-slate-800 pt-6">
           <StatusItem 
             icon={<Server size={14} />} 
             label="PREVENT" 
             active={progress > 15} 
             color="text-emerald-400"
             glow="shadow-emerald-500/20"
           />
           <StatusItem 
             icon={<GraduationCap size={14} />} 
             label="PREDICT" 
             active={progress > 45} 
             color="text-purple-400"
             glow="shadow-purple-500/20"
           />
           <StatusItem 
             icon={<ShieldCheck size={14} />} 
             label="PROTECT"         
             active={progress > 80} 
             color="text-blue-400"
             glow="shadow-blue-500/20"
           />
        </div>
      </div>
    </div>
  );
}

// Sub-component for Status Indicators
function StatusItem({ icon, label, active, color, glow }: { icon: React.ReactNode, label: string, active: boolean, color: string, glow: string }) {
  return (
    <div className={`flex flex-col items-center gap-2 transition-all duration-500 ${active ? 'opacity-100' : 'opacity-30 grayscale'}`}>
      <div className={`p-2 rounded-full bg-slate-900 border border-slate-800 ${active ? `${color} shadow-lg ${glow}` : 'text-slate-600'}`}>
        {active ? <CheckCircle2 size={16} /> : icon}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</span>
    </div>
  );
}
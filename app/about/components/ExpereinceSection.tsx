"use client";
import React, { JSX, useRef } from "react";
import { Star, ShieldCheck, Users, Headphones } from "lucide-react";

// --- Sub-Component for individual Cards ---
// Isko alag isliye kiya taaki har card ka apna 'ref' ho sake video control ke liye
const CardItem = ({
  card,
  index,
}: {
  card: { icon: JSX.Element; title: string; desc: string; video: string };
  index: number;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        // Auto-play browsers block kar sakte hain agar user interaction na ho, 
        // par muted videos usually play ho jaate hain.
        console.error("Video play error:", error);
      });
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0; // Video ko reset karne ke liye
    }
  };

  return (
    <div
      key={index}
      className="group relative flex-1 w-full overflow-hidden rounded-3xl bg-[#101010] 
      border border-white/10 hover:border-white/40 transition-all duration-500
      hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] cursor-pointer"
      onMouseEnter={handleMouseEnter} // Event ab parent container par hai
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Video */}
      <video
        ref={videoRef}
        src={card.video}
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-0 
        transition-all duration-500 scale-105 group-hover:opacity-100 group-hover:scale-100"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-8 transition-transform duration-500 group-hover:-translate-y-2">
        <div className="text-white mb-4 bg-white/10 w-fit p-3 rounded-full backdrop-blur-md group-hover:bg-transparent group-hover:p-0 transition-all">
          {card.icon}
        </div>
        <h2 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-white transition-colors">
          {card.title}
        </h2>
        <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-[90%] group-hover:text-gray-200">
          {card.desc}
        </p>
      </div>
    </div>
  );
};

// --- Main Component ---
export default function ExperienceSection() {
  const cards = [
    {
      icon: <Star size={32} />,
      title: "Dropout Prediction",
      desc: "Predicts dropout based on attendance, scores.",
      video: "/video1.mp4",
    },
    {
      icon: <ShieldCheck size={32} />,
      title: "Workflow Automation",
      desc: "Automated processes reduce manual effort.",
      video: "/video2.mp4",
    },
    {
      icon: <Users size={32} />,
      title: "Student Connect",
      desc: "Connect with communities across colleges.",
      video: "/video3.mp4",
    },
    {
      icon: <Headphones size={32} />,
      title: "24/7 Support",
      desc: "AI + teacher support available anytime.",
      video: "/video4.mp4",
    },
  ];

  return (
    <div className="w-full h-screen bg-black text-white relative overflow-hidden flex items-center justify-center p-4 lg:p-8">
      <div className="max-w-[1600px] w-full h-full flex flex-col lg:flex-row items-center justify-between gap-6">
        
        {/* --- LEFT COLUMN --- */}
        <div className="flex flex-col gap-6 w-full lg:w-[25%] h-full lg:h-[90%]">
          {cards.slice(0, 2).map((card, i) => (
            <CardItem key={i} card={card} index={i} />
          ))}
        </div>

        {/* --- CENTER COLUMN --- */}
        <div className="flex flex-col items-center justify-center text-center w-full lg:w-[40%] z-20 py-10 lg:py-0">
          <h1
            className="text-6xl lg:text-[90px] font-extrabold tracking-tight leading-none text-transparent 
            bg-clip-text bg-linear-to-b from-white to-gray-600 drop-shadow-2xl"
            style={{ WebkitTextStroke: "1px rgba(255,255,255,0.2)" }}
          >
            Shiksha <br /> Setu
          </h1>

          <div className="w-24 h-1 bg-white/20 rounded-full my-8"></div>

          <div className="flex flex-col gap-2 text-xl lg:text-2xl text-gray-400 font-medium tracking-widest uppercase">
            <span className="hover:text-white transition-colors duration-300 cursor-default">Prevent</span>
            <span className="hover:text-white transition-colors duration-300 cursor-default">Predict</span>
            <span className="hover:text-white transition-colors duration-300 cursor-default">Protect</span>
          </div>
        </div>

        {/* --- RIGHT COLUMN --- */}
        <div className="flex flex-col gap-6 w-full lg:w-[25%] h-full lg:h-[90%]">
          {cards.slice(2, 4).map((card, i) => (
            <CardItem key={i + 2} card={card} index={i + 2} />
          ))}
        </div>

      </div>
    </div>
  );
}
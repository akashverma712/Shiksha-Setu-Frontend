import React from 'react';
import { Calendar, User, CheckCircle, ArrowRight, Star } from 'lucide-react';

export default function MentorConnect() {
  const sessionLink = "https://elevenlabs.io/app/talk-to?agent_id=agent_5301kbpfry1zetj9kb06ywa25xmv";

  const counsellors = [
    {
      name: "Dr. Priya Sharma",
      spec: "Counsellor",
      initial: "P",
      link: sessionLink,
      rating: "4.9"
    },
    {
      name: "Prof. Rajat Verma",
      spec: "Counsellor",
      initial: "R",
      link: sessionLink,
      rating: "4.8"
    },
  ];

  return (
    <div className="w-full min-h-screen bg-[#0f172a] text-white p-6 md:p-12 font-sans selection:bg-pink-500 selection:text-white">

      <div className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          Counsellors Connect
        </h1>

        <div className="flex justify-center">
          <a
            href="#containers"
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-600 to-orange-500 rounded-full text-lg font-bold shadow-lg hover:shadow-pink-500/25 hover:scale-105 transition-all duration-300"
          >
            <Calendar className="w-5 h-5" />
            Book Your Session Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>

      <div
        id="containers"
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 scroll-mt-10"
      >

        <div className="bg-[#1e293b] rounded-3xl p-8 shadow-2xl border border-white/5 flex flex-col justify-between hover:border-pink-500/20 transition-colors duration-300">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-pink-500/10 rounded-xl">
                <Star className="w-8 h-8 text-pink-500" />
              </div>
              <h2 className="text-3xl font-bold text-white">Why Book a Session?</h2>
            </div>

            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              Unlock your potential by talking directly with expert counsellors who provide personalized guidance in:
            </p>

            <ul className="space-y-4 text-gray-300">
              {[
                "Academic doubts & exam preparation",
                "Career counselling & strategic roadmap",
                "Personal guidance & stress management",
                "Productivity hacks & habit building"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 bg-[#0f172a]/50 p-3 rounded-xl border border-white/5">
                  <CheckCircle className="w-6 h-6 text-orange-500 flex-shrink-0" />
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <a
            href={sessionLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 w-full px-6 py-4 bg-[#0f172a] border border-pink-500/30 text-center rounded-xl font-bold text-pink-400 hover:bg-pink-500 hover:text-white hover:border-transparent shadow-lg transition-all duration-300"
          >
            Book a session now
          </a>
        </div>

        <div className="bg-[#1e293b] rounded-3xl p-8 shadow-2xl border border-white/5 flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-orange-500/10 rounded-xl">
              <User className="w-8 h-8 text-orange-500" />
            </div>
            <h2 className="text-3xl font-bold text-white">Available Counsellors</h2>
          </div>

          <div className="flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
            {counsellors.map((c, index) => (
              <a
                key={index}
                href={c.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-[#0f172a] p-6 rounded-2xl border border-white/5 shadow-md hover:border-orange-500/50 hover:shadow-orange-500/10 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-pink-400 transition-colors">
                      {c.name}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1 mb-3">{c.spec}</p>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold bg-green-500/10 text-green-400 px-2 py-1 rounded">
                      <Star className="w-3 h-3 fill-green-400" /> {c.rating} Rating
                    </span>
                  </div>

                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center font-bold text-2xl shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                    {c.initial}
                  </div>
                </div>

                <button className="relative z-10 mt-6 w-full py-3 bg-white/5 group-hover:bg-gradient-to-r group-hover:from-pink-600 group-hover:to-orange-600 rounded-xl text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2">
                     Book Now
                   <ArrowRight className="w-4 h-4" />
                </button>
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

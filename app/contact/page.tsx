"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import SocialSidebar from "../components/SocialSidebar";
import StairsTransition from "../components/StairsTransition";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleChange = (e: any) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      setShowError(true);
      setTimeout(() => setShowError(false), 2500);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setIsSent(false), 2000);
    }, 1500);
  };

  return (
    <>
      <StairsTransition>
        <style jsx>{`
          @keyframes fadeUp {
            0% {
              opacity: 0;
              transform: translateY(40px) scale(0.97);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          .animate-page {
            animation: fadeUp 0.9s cubic-bezier(0.16, 0.8, 0.34, 1);
          }
        `}</style>

        <div className="min-h-screen w-full bg-black text-white flex justify-center items-center px-5 py-12 pt-32">
          <div className="max-w-6xl w-full animate-page grid grid-cols-1 lg:grid-cols-2 gap-20">

            <div className="space-y-9 flex flex-col justify-center">
              <h1 className="text-6xl md:text-7xl font-extrabold leading-tight">
                Contact <span className="text-white">Us.</span>
              </h1>
              <p className="text-gray-300 text-lg max-w-md leading-relaxed">
              Have any suggestion of improvements? We'd love to hear from you! Reach out to us with your ideas, feedback, or any questions you may have. Together, we can make ShikshaSetu even better.
               </p>

              <div className="space-y-2 text-gray-400 text-lg">
                <p>📞 +91 2382972929 / +91 9320402702</p>
                <p>✉ shikshasetu@company.com</p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-10 bg-white/5 backdrop-blur-2xl border border-white/15 hover:border-white/30 transition-all shadow-xl rounded-3xl p-10 duration-500"
            >
              {["name", "email"].map((field) => (
                <div key={field} className="relative">
                  <input
                    name={field}
                    value={(formData as any)[field]}
                    onChange={handleChange}
                    className="peer w-full bg-transparent border-b border-gray-600 text-white text-lg py-4 outline-none focus:border-white transition-all"
                  />
                  <label
                    className="absolute left-0 top-4 text-gray-500 pointer-events-none transition-all peer-focus:-top-5 peer-focus:text-sm peer-focus:text-white peer-valid:-top-5 peer-valid:text-sm"
                  >
                    {field === "name" ? "Name" : "Email"}
                  </label>
                </div>
              ))}

              <div className="relative">
                <textarea
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="peer w-full bg-transparent border-b border-gray-600 text-white text-lg py-4 outline-none resize-none focus:border-white transition-all"
                />
                <label
                  className="absolute left-0 top-4 text-gray-500 pointer-events-none transition-all peer-focus:-top-5 peer-focus:text-sm peer-focus:text-white peer-valid:-top-5 peer-valid:text-sm"
                >
                  Message
                </label>
              </div>

              <button
                disabled={isLoading}
                className="w-full py-4 text-xl font-semibold rounded-full border border-white text-white hover:bg-white hover:text-black transition-all duration-500 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? "Sending..." : isSent ? "Sent ✔" : "Send Message"}
              </button>
            </form>
          </div>

          {showError && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-red-600 text-white rounded-xl shadow-lg font-semibold">
              Name & Email required
            </div>
          )}

          {isSent && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-green-600 text-white rounded-xl shadow-lg font-semibold">
              Message Sent Successfully ✔
            </div>
          )}
        </div>

        <div className="absolute top-0 left-0 w-full z-20 bg-black/40 backdrop-blur-md">
          <Navbar />
        </div>
        {/* <SocialSidebar /> */}
      </StairsTransition>
    </>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Home, Info, Mail, User } from "lucide-react";

const Navbar = () => {
  const [hoverLabel, setHoverLabel] = useState("");

  const items = [
    { icon: <Home size={20} />, label: "Home", route: "/" },
    { icon: <Info size={20} />, label: "About", route: "/about" },
    { icon: <Mail size={20} />, label: "Contact", route: "/contact" },
    { icon: <User size={20} />, label: "Login", route: "/login" },  // ← added
  ];

  return (
    <div className="relative w-full flex flex-col items-center mt-4 select-none">

      {/* Hover label */}
      <div
        className={`absolute -bottom-6 text-white text-xs md:text-sm font-medium transition-all duration-300 ${
          hoverLabel ? "opacity-100" : "opacity-0"
        }`}
      >
        {hoverLabel}
      </div>

      {/* Navbar box */}
      <div
        className="
          flex items-center gap-4 md:gap-6 px-4 md:px-6 py-2 md:py-3
          rounded-3xl border border-white/10
          bg-white/5 backdrop-blur-xl
          shadow-[0_0_25px_rgba(255,255,255,0.07)]
          transition-all duration-300
        "
      >
        {/* Logo */}
        <img
          src="/logo.svg"
          alt="Logo"
          className="
            w-10 h-10 md:w-12 md:h-12 rounded-2xl object-contain
            border border-white/10 p-1.5 md:p-2 bg-white/5
            hover:border-white/40 hover:bg-white/10
            hover:shadow-[0_0_12px_rgba(255,255,255,0.35)]
            transition-all duration-300
          "
        />

        {/* Navbar items */}
        {items.map((item, index) => (
          <Link key={index} href={item.route}>
            <button
              onMouseEnter={() => setHoverLabel(item.label)}
              onMouseLeave={() => setHoverLabel("")}
              className="
                flex items-center justify-center
                w-10 h-10 md:w-14 md:h-12 rounded-2xl
                border border-white/10 text-white transition-all duration-300
                hover:border-white/40 hover:shadow-[0_0_12px_rgba(255,255,255,0.35)]
                hover:bg-white/10 hover:scale-[1.07]
              "
            >
              {item.icon}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Navbar;

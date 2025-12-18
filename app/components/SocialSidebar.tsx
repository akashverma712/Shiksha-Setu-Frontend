"use client";

import React, { useState } from "react";
import { Linkedin, Twitter, Instagram } from "lucide-react";

const SocialSidebar = () => {
  const socials = [
    { icon: <Linkedin size={26} />, label: "LinkedIn", href: "https://linkedin.com" },
    { icon: <Twitter size={26} />, label: "Twitter", href: "https://twitter.com" },
    { icon: <Instagram size={26} />, label: "Instagram", href: "https://instagram.com" },
  ];

  const [scrambleText, setScrambleText] = useState("");

  const scramble = (target: string) => {
    const chars = "!<>-_\\/[]{}—=+*^?#@%&$";
    let iteration = 0;

    const interval = setInterval(() => {
      setScrambleText(
        target
          .split("")
          .map((char: string, index: number) =>
            index < iteration
              ? target[index]
              : chars[Math.floor(Math.random() * chars.length)]
          )
          .join("")
      );

      if (iteration >= target.length) clearInterval(interval);
      iteration += 1 / 2.2;
    }, 35);
  };

  return (
    <div className="absolute top-1/2 -translate-y-1/2 left-6 flex flex-col gap-6 z-30">
      {socials.map((item, index) => (
        <a
          key={index}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 text-white text-lg font-medium transition-all duration-300"
          onMouseEnter={() => scramble(item.label)}
        >
          <span className="transition-all duration-300 group-hover:drop-shadow-[0_0_8px_white]">
            {item.icon}
          </span>
          <span
            className="
              opacity-0 group-hover:opacity-100 transition-all duration-300
              group-hover:drop-shadow-[0_0_8px_white]
            "
          >
            {scrambleText}
          </span>
        </a>
      ))}
    </div>
  );
};

export default SocialSidebar;

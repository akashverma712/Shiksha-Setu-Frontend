"use client";

import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useEffect, useRef } from "react";

export default function StairsTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const stairParentRef = useRef<HTMLDivElement | null>(null);
  const pageRef = useRef<HTMLDivElement | null>(null);

  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return; 
    }

    if (!stairParentRef.current || !pageRef.current) return;

    const stairs = stairParentRef.current.querySelectorAll(".stair");

    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        document.body.style.overflow = "auto";
      },
    });

    tl.set(stairParentRef.current, { opacity: 1, display: "block" });

    tl.fromTo(
      stairs,
      { height: 0 },
      {
        height: "100%",
        duration: 0.45,
        stagger: { amount: 0.25 },
      }
    );

    tl.to(stairs, {
      y: "100%",
      duration: 0.45,
      stagger: { amount: 0.25 },
    });

    tl.set(stairParentRef.current, { display: "none", opacity: 0 });
    tl.set(stairs, { y: 0, height: "100%" });

    tl.from(pageRef.current, {
      opacity: 0,
      scale: 1.06,
      duration: 0.55,
      ease: "power2.out",
    });

    return () => {
      tl.kill();
    };
  }, [pathname]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div
        ref={stairParentRef}
        className="fixed inset-0 h-screen w-screen z-[9999] hidden pointer-events-none"
      >
        <div className="flex w-full h-full">
          <div className="stair w-1/5 h-full bg-black"></div>
          <div className="stair w-1/5 h-full bg-black"></div>
          <div className="stair w-1/5 h-full bg-black"></div>
          <div className="stair w-1/5 h-full bg-black"></div>
          <div className="stair w-1/5 h-full bg-black"></div>
        </div>
      </div>

      <div ref={pageRef} className="overflow-hidden">
        {children}
      </div>
    </div>
  );
}

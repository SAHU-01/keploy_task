"use client";

import React, { useEffect, useRef, useState } from "react";

const CONFETTI = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  color: ["#FF914D", "#FFB347", "#FF6B35", "#FFA07A", "#FF7043", "#FFCC80"][i % 6],
  left: Math.random() * 100,
  delay: Math.random() * 0.6,
  duration: 1.2 + Math.random() * 0.8,
  size: 3 + Math.random() * 3,
  drift: (Math.random() - 0.5) * 40,
  rotation: Math.random() * 360,
}));

export const Celebrate = ({ children }: { children: React.ReactNode }) => {
  const [fired, setFired] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setFired(true);
          observer.disconnect();
        }
      },
      { threshold: 0.6 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative my-8 overflow-hidden rounded-lg">
      {/* Confetti layer */}
      {fired && (
        <div className="absolute inset-0 pointer-events-none z-10" aria-hidden>
          {CONFETTI.map((c) => (
            <span
              key={c.id}
              className="absolute rounded-sm"
              style={{
                width: c.size,
                height: c.size * 1.6,
                backgroundColor: c.color,
                left: `${c.left}%`,
                top: -8,
                opacity: 0,
                transform: `rotate(${c.rotation}deg)`,
                animation: `confetti-fall ${c.duration}s ${c.delay}s ease-out forwards`,
                // @ts-expect-error -- custom property for drift
                "--drift": `${c.drift}px`,
              }}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative z-0 bg-[#FF914D]/[0.05] dark:bg-[#FF914D]/[0.07] rounded-lg px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="text-[#FF914D] shrink-0 mt-0.5">
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-[13.5px] text-foreground/85 leading-relaxed">
            {children}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(120px) translateX(var(--drift)) rotate(720deg) scale(0.3);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

"use client";

import { useEffect, useState } from "react";

export default function AnimatedBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Gradient Orbs */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-30 dark:opacity-20 blur-3xl animate-float-slow"
        style={{
          background: "radial-gradient(circle, rgba(59,130,246,0.5) 0%, transparent 70%)",
          top: "10%",
          left: "10%",
          transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
        }}
      />
      
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-30 dark:opacity-20 blur-3xl animate-float-medium"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.5) 0%, transparent 70%)",
          top: "50%",
          right: "5%",
          transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * -0.015}px)`,
        }}
      />
      
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-30 dark:opacity-20 blur-3xl animate-float-fast"
        style={{
          background: "radial-gradient(circle, rgba(16,185,129,0.5) 0%, transparent 70%)",
          bottom: "10%",
          left: "30%",
          transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
        }}
      />

      {/* Animated Mesh Gradient */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20 dark:opacity-10"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="mesh-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" className="animate-pulse-slow">
              <animate
                attributeName="stop-color"
                values="#3b82f6;#8b5cf6;#10b981;#3b82f6"
                dur="20s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="50%">
              <animate
                attributeName="stop-color"
                values="#8b5cf6;#10b981;#3b82f6;#8b5cf6"
                dur="25s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%">
              <animate
                attributeName="stop-color"
                values="#10b981;#3b82f6;#8b5cf6;#10b981"
                dur="30s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>
          
          <pattern id="grid-pattern" x1="0" y1="0" x2="40" y2="40" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" className="fill-blue-500 dark:fill-blue-400" opacity="0.3" />
          </pattern>
        </defs>
        
        {/* Flowing waves */}
        <path
          className="animate-wave-slow"
          d="M0,100 Q250,150 500,100 T1000,100 T1500,100 L1500,200 L0,200 Z"
          fill="url(#mesh-gradient)"
          opacity="0.1"
        />
        <path
          className="animate-wave-medium"
          d="M0,150 Q250,200 500,150 T1000,150 T1500,150 L1500,250 L0,250 Z"
          fill="url(#mesh-gradient)"
          opacity="0.08"
        />
        <path
          className="animate-wave-fast"
          d="M0,200 Q250,250 500,200 T1000,200 T1500,200 L1500,300 L0,300 Z"
          fill="url(#mesh-gradient)"
          opacity="0.06"
        />
      </svg>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 dark:bg-blue-300 rounded-full animate-particle-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
              opacity: 0.3,
            }}
          />
        ))}
      </div>

      {/* Corner decorations */}
      <svg
        className="absolute top-0 left-0 w-64 h-64 opacity-10 dark:opacity-5 pointer-events-none"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="100" cy="100" r="80" stroke="url(#corner-gradient)" strokeWidth="0.5" />
        <circle cx="100" cy="100" r="60" stroke="url(#corner-gradient)" strokeWidth="0.5" />
        <circle cx="100" cy="100" r="40" stroke="url(#corner-gradient)" strokeWidth="0.5" />
        <defs>
          <radialGradient id="corner-gradient">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
      </svg>

      <svg
        className="absolute bottom-0 right-0 w-96 h-96 opacity-10 dark:opacity-5 pointer-events-none rotate-180"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="100" cy="100" r="80" stroke="url(#corner-gradient-2)" strokeWidth="0.5" />
        <circle cx="100" cy="100" r="60" stroke="url(#corner-gradient-2)" strokeWidth="0.5" />
        <circle cx="100" cy="100" r="40" stroke="url(#corner-gradient-2)" strokeWidth="0.5" />
        <defs>
          <radialGradient id="corner-gradient-2">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}

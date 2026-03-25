"use client";

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const stats = [
  {
    target: 21000,
    label: "FOOTFALL",
    iconSrc: "/svg/Shoes.svg",
    iconAlt: "Footfall",
  },
  {
    target: 6000,
    label: "PARTICIPATION",
    iconSrc: "/svg/Customer.svg",
    iconAlt: "Participation",
  },
  {
    target: 20,
    label: "SPORTS",
    iconSrc: "/svg/Badminton%20Player.svg",
    iconAlt: "Sports",
  }
];

export default function TurtleBg() {
  const brochureUrl = "https://drive.google.com/file/d/1KNL0LU_aw9EjICN03_Qu5Vg_ZnJkvy1W/view?usp=sharing";
  const [animatedValues, setAnimatedValues] = useState<number[]>(() => stats.map(() => 0));
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasStartedCounting, setHasStartedCounting] = useState(false);

  useEffect(() => {
    if (hasStartedCounting) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStartedCounting(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasStartedCounting]);

  useEffect(() => {
    if (!hasStartedCounting) {
      return;
    }

    const durationMs = 1800;
    let startTime: number | null = null;
    let frameId = 0;

    const animate = (timestamp: number) => {
      if (startTime === null) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setAnimatedValues(stats.map((stat) => Math.round(stat.target * eased)));

      if (progress < 1) {
        frameId = window.requestAnimationFrame(animate);
      }
    };

    frameId = window.requestAnimationFrame(animate);

    return () => window.cancelAnimationFrame(frameId);
  }, [hasStartedCounting]);

  const glassCardStyle = {
    backgroundColor: "rgba(184, 196, 72, 0.16)",
    backdropFilter: "blur(4px)",
    WebkitBackdropFilter: "blur(4px)",
    borderRadius: "20px",
    border: "1px solid rgba(225, 238, 169, 0.34)",
  } as const;

  return (
    <div ref={sectionRef} className="relative w-full h-screen min-h-140 md:min-h-175 overflow-hidden bg-black flex items-center justify-center">
      {/* Background */}
      <Image
        src="/turtles-bg.png"
        alt="Turtles Background"
        fill
        className="object-cover object-center opacity-90 scale-100 md:scale-[0.77]"
        quality={100}
      />

      {/* Top and bottom smooth black fades */}
      <div className="absolute inset-x-0 top-0 h-[20vh] bg-linear-to-b from-black via-black/85 to-transparent z-1 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-[20vh] bg-linear-to-t from-black via-black/85 to-transparent z-1 pointer-events-none" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.75)_85%)]" />

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-7 sm:gap-10 md:gap-27 lg:gap-36 px-3 sm:px-6 md:px-8 w-full max-w-6xl motion-safe:animate-[arenaDrift_8s_ease-in-out_infinite]">
        {/* LEFT: STAT CARDS */}
        <div className="flex flex-col gap-5 sm:gap-8 md:gap-10 w-full md:w-auto max-w-95 sm:max-w-105 md:max-w-none">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="group touch-manipulation flex items-center justify-between w-full md:w-98.75 md:h-36.75 px-4 sm:px-6 md:px-8 py-3 sm:py-5 md:py-0 hover:bg-[#B8C448]/24 active:bg-[#B8C448]/24 shadow-[0_14px_34px_rgba(0,0,0,0.42),0_4px_12px_rgba(0,0,0,0.26),inset_0_1px_0_rgba(255,255,255,0.14)] hover:shadow-[0_20px_38px_rgba(0,0,0,0.55),0_8px_20px_rgba(0,0,0,0.36),inset_0_1px_0_rgba(255,255,255,0.2)] active:shadow-[0_20px_38px_rgba(0,0,0,0.55),0_8px_20px_rgba(0,0,0,0.36),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-500 ease-out transform-gpu hover:-translate-y-2 active:-translate-y-1 hover:scale-[1.02] active:scale-[1.01] hover:-rotate-[0.35deg] active:-rotate-[0.2deg]"
              style={glassCardStyle}
            >
              <div
                className="flex flex-col text-left"
                style={{ fontFamily: "'gangofthree', sans-serif" }}
              >
                <span className="text-lg sm:text-2xl md:text-3xl font-bold text-[#F5F7EA] tracking-widest leading-none mb-2">
                  {animatedValues[idx].toLocaleString("en-IN")}
                  <span
                    className="ml-1 inline-block"
                    style={{ fontFamily: "'Segoe UI Symbol', 'Noto Sans', sans-serif" }}
                  >
                    +
                  </span>
                </span>
                <span className="text-sm sm:text-lg md:text-xl font-semibold text-[#EEF2D9] tracking-widest uppercase leading-none">
                  {stat.label}
                </span>
              </div>

              <Image
                src={stat.iconSrc}
                alt={stat.iconAlt}
                width={44}
                height={44}
                className="ml-4 h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 opacity-95 transition-transform duration-500 ease-out motion-safe:animate-[iconDrift_3.2s_ease-in-out_infinite] group-hover:scale-110 group-active:scale-110 group-hover:translate-x-1 group-active:translate-x-1"
              />
            </div>
          ))}
        </div>

        {/* RIGHT: BUTTON */}
        <div className="w-full md:w-auto flex h-full items-center md:ml-4 max-w-95 sm:max-w-105 md:max-w-none">
          <a
            href={brochureUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group touch-manipulation flex items-center justify-between w-full md:w-98.75 md:h-36.75 px-4 sm:px-6 md:px-8 py-3 sm:py-5 md:py-0 cursor-pointer hover:bg-[#B8C448]/24 active:bg-[#B8C448]/24 shadow-[0_14px_34px_rgba(0,0,0,0.42),0_4px_12px_rgba(0,0,0,0.26),inset_0_1px_0_rgba(255,255,255,0.14)] hover:shadow-[0_20px_38px_rgba(0,0,0,0.55),0_8px_20px_rgba(0,0,0,0.36),inset_0_1px_0_rgba(255,255,255,0.2)] active:shadow-[0_20px_38px_rgba(0,0,0,0.55),0_8px_20px_rgba(0,0,0,0.36),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-500 ease-out transform-gpu hover:-translate-y-2 active:-translate-y-1 hover:scale-[1.02] active:scale-[1.01] hover:rotate-[0.35deg] active:rotate-[0.2deg]"
            style={glassCardStyle}
          >
            <div
              className="flex flex-col text-left"
              style={{ fontFamily: "'gangofthree', sans-serif" }}
            >
              <span className="text-lg sm:text-2xl md:text-3xl font-bold text-[#F5F7EA] tracking-widest leading-none mb-2">
                DOWNLOAD
              </span>
              <span className="text-lg sm:text-2xl md:text-3xl font-bold text-[#F5F7EA] tracking-widest uppercase leading-none">
                BROCHURE
              </span>
            </div>

            <Image
              src="/svg/Downloading%20Updates.svg"
              alt="Download brochure"
              width={44}
              height={44}
              className="ml-4 h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 opacity-95 transition-transform duration-500 ease-out motion-safe:animate-[iconDrift_3.2s_ease-in-out_infinite] group-hover:scale-110 group-active:scale-110 group-hover:translate-x-1 group-active:translate-x-1 group-hover:-translate-y-1 group-active:-translate-y-1"
            />
          </a>
        </div>

      </div>

      <style jsx global>{`
        @keyframes arenaDrift {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        @keyframes iconDrift {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-3px);
          }
        }
      `}</style>
    </div>
  );
}
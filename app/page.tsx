"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import { SportsSection } from "../components/SportsSection";
import TurtleBg from "../components/TurtleBg";

const TICKER_WORDS = Array(40).fill("ABOUT");

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mazeCanvasRef = useRef<HTMLCanvasElement>(null);

  const [heroOpacity, setHeroOpacity] = useState(1);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // --- Transition State ---
  const [transitionProgress, setTransitionProgress] = useState(0);

  // Loading Screen States
  const [isLoading, setIsLoading] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isMouthOpen, setIsMouthOpen] = useState(true);
  const [fakeProgress, setFakeProgress] = useState(0);

  const frameCount = 141;

  // ---> TRUE RANDOMIZED MAZE ALGORITHM (NO BLINKING) <---
  useEffect(() => {
    if (!isLoading) return;
    const canvas = mazeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cellSize = 60;
    const cols = Math.floor(canvas.width / cellSize);
    const rows = Math.floor(canvas.height / cellSize);

    const xOffset = (canvas.width - cols * cellSize) / 2;
    const yOffset = (canvas.height - rows * cellSize) / 2;

    const visited = Array(cols).fill(null).map(() => Array(rows).fill(false));
    const hWalls = Array(cols).fill(null).map(() => Array(rows + 1).fill(true));
    const vWalls = Array(cols + 1).fill(null).map(() => Array(rows).fill(true));

    const stack: { x: number; y: number }[] = [];
    let currX = Math.floor(Math.random() * cols);
    let currY = Math.floor(Math.random() * rows);
    visited[currX][currY] = true;

    while (true) {
      const neighbors: { x: number; y: number; dir: string }[] = [];
      if (currY > 0 && !visited[currX][currY - 1]) neighbors.push({ x: currX, y: currY - 1, dir: "UP" });
      if (currY < rows - 1 && !visited[currX][currY + 1]) neighbors.push({ x: currX, y: currY + 1, dir: "DOWN" });
      if (currX > 0 && !visited[currX - 1][currY]) neighbors.push({ x: currX - 1, y: currY, dir: "LEFT" });
      if (currX < cols - 1 && !visited[currX + 1][currY]) neighbors.push({ x: currX + 1, y: currY, dir: "RIGHT" });

      if (neighbors.length > 0) {
        const next = neighbors[Math.floor(Math.random() * neighbors.length)];
        stack.push({ x: currX, y: currY });
        if (next.dir === "UP") hWalls[currX][currY] = false;
        if (next.dir === "DOWN") hWalls[currX][currY + 1] = false;
        if (next.dir === "LEFT") vWalls[currX][currY] = false;
        if (next.dir === "RIGHT") vWalls[currX + 1][currY] = false;
        currX = next.x;
        currY = next.y;
        visited[currX][currY] = true;
      } else if (stack.length > 0) {
        const popped = stack.pop();
        if (popped) { currX = popped.x; currY = popped.y; }
      } else {
        break;
      }
    }

    for (let i = 0; i < cols; i++)
      for (let j = 1; j < rows; j++)
        if (Math.random() < 0.1) hWalls[i][j] = false;

    for (let i = 1; i < cols; i++)
      for (let j = 0; j < rows; j++)
        if (Math.random() < 0.1) vWalls[i][j] = false;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const traceWalls = () => {
      ctx.beginPath();
      for (let i = 0; i < cols; i++)
        for (let j = 0; j <= rows; j++)
          if (hWalls[i][j]) {
            ctx.moveTo(xOffset + i * cellSize, yOffset + j * cellSize);
            ctx.lineTo(xOffset + (i + 1) * cellSize, yOffset + j * cellSize);
          }
      for (let i = 0; i <= cols; i++)
        for (let j = 0; j < rows; j++)
          if (vWalls[i][j]) {
            ctx.moveTo(xOffset + i * cellSize, yOffset + j * cellSize);
            ctx.lineTo(xOffset + i * cellSize, yOffset + (j + 1) * cellSize);
          }
      ctx.stroke();
    };

    ctx.lineWidth = 6;
    ctx.strokeStyle = "#064e3b";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#064e3b";
    traceWalls();

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#000000";
    ctx.shadowBlur = 0;
    traceWalls();

    const pellets: { x: number; y: number }[] = [];
    for (let i = 0; i < cols; i++)
      for (let j = 0; j < rows; j++)
        if (Math.random() < 0.25)
          pellets.push({ x: xOffset + i * cellSize + cellSize / 2, y: yOffset + j * cellSize + cellSize / 2 });

    for (let i = pellets.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pellets[i], pellets[j]] = [pellets[j], pellets[i]];
    }

    const glowingDotCount = Math.floor(Math.random() * 8) + 8;
    const neonColors = ["#ff0000", "#00ffff", "#ff00ff", "#ffff00", "#39ff14", "#ff8800", "#bc13fe"];

    for (let i = 0; i < pellets.length; i++) {
      ctx.beginPath();
      const radius = i < glowingDotCount ? 4 : 3;
      ctx.arc(pellets[i].x, pellets[i].y, radius, 0, Math.PI * 2);
      if (i < glowingDotCount) {
        const randomColor = neonColors[Math.floor(Math.random() * neonColors.length)];
        ctx.fillStyle = randomColor;
        ctx.shadowBlur = 25;
        ctx.shadowColor = randomColor;
      } else {
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.shadowBlur = 0;
      }
      ctx.fill();
    }

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isLoading]);

  // Chomp Animation
  useEffect(() => {
    if (!isLoading) return;
    const chompInterval = setInterval(() => setIsMouthOpen((prev) => !prev), 250);
    return () => clearInterval(chompInterval);
  }, [isLoading]);

  // Fake Progress Timer
  useEffect(() => {
    if (!isLoading) return;
    const progressInterval = setInterval(() => {
      setFakeProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 1;
      });
    }, 30);
    return () => clearInterval(progressInterval);
  }, [isLoading]);

  // Canvas Preload + Scroll Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const images: HTMLImageElement[] = [];
    for (let i = 0; i <= frameCount; i++) {
      const img = new Image();
      const frameNum = i.toString().padStart(3, "0");
      img.src = `/arena_images/arena_images${frameNum}.jpg`;
      img.onload = () => {
        setLoadedCount((prev) => prev + 1);
        if (i === 0) renderFrame(0);
      };
      images.push(img);
    }

    function renderFrame(index: number) {
      const currentImage = images[index];
      if (currentImage && currentImage.complete) {
        canvas!.width = window.innerWidth;
        canvas!.height = window.innerHeight;

        const imgAspect = currentImage.width / currentImage.height;
        const canvasAspect = canvas!.width / canvas!.height;

        let drawW, drawH, drawX, drawY;
        if (imgAspect > canvasAspect) {
          drawH = canvas!.height;
          drawW = drawH * imgAspect;
          drawX = (canvas!.width - drawW) / 2;
          drawY = 0;
        } else {
          drawW = canvas!.width;
          drawH = drawW / imgAspect;
          drawX = 0;
          drawY = (canvas!.height - drawH) / 2;
        }

        context!.drawImage(currentImage, drawX, drawY, drawW, drawH);
      }
    }

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollPosition = -rect.top;
      const totalScrollableDistance = rect.height - window.innerHeight;
      const scrollFraction = Math.max(0, Math.min(1, scrollPosition / totalScrollableDistance));

      setHeroOpacity(Math.max(0, 1 - scrollFraction * 5));

      const panelStart = 0.70;
      const panelProgress = Math.max(0, Math.min(1, (scrollFraction - panelStart) / (1 - panelStart)));
      setTransitionProgress(panelProgress);

      const videoFraction = Math.min(scrollFraction / panelStart, 1);
      const frameIndex = Math.min(frameCount, Math.floor(videoFraction * (frameCount + 1)));
      renderFrame(frameIndex);
    };

    let scrollRequestId: number;
    const onScroll = () => {
      cancelAnimationFrame(scrollRequestId);
      scrollRequestId = requestAnimationFrame(handleScroll);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 15;
      setMouseOffset({ x, y });
    };

    const onResize = () => renderFrame(0);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(scrollRequestId);
    };
  }, []);

  // Hybrid Loading Math
  const actualPercentage = Math.round((loadedCount / (frameCount + 1)) * 100);
  const displayPercentage = Math.min(actualPercentage, fakeProgress);

  useEffect(() => {
    if (displayPercentage >= 100) {
      const timer = setTimeout(() => setIsLoading(false), 200);
      return () => clearTimeout(timer);
    }
  }, [displayPercentage]);

  // --- PANEL CONFIG ---
  const PANEL_COUNT = 7;
  const PANEL_STAGGER = 0.1;

  return (
    <>
      {/* ── Ticker keyframe injected globally once ── */}
      <style>{`
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <main ref={containerRef} className="relative h-[1000vh] bg-black">

        {/* LAYER 0: LOADING SCREEN */}
        {isLoading && (
          <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-4 overflow-hidden">
            <canvas
              ref={mazeCanvasRef}
              className="absolute inset-0 w-full h-full opacity-50 pointer-events-none"
            />
            <div className="relative z-10 w-full max-w-2xl flex flex-col items-center">
              <div
                className="relative w-full h-20 md:h-32 border-[6px] border-double border-red-950 rounded-full flex items-center px-4 overflow-hidden bg-black/70 backdrop-blur-sm"
                style={{ boxShadow: "0 0 20px rgba(127,29,29,0.7), inset 0 0 20px rgba(127,29,29,0.7)" }}
              >
                <img
                  src={isMouthOpen ? "/loader_open.png" : "/loader_close.png"}
                  className="absolute h-10 md:h-20 w-auto top-1/2 -translate-y-1/2 transition-all duration-[100ms] ease-linear drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                  style={{ left: `${Math.min(displayPercentage * 0.60, 60)}%` }}
                  alt="Loading Turtles"
                />
              </div>
              <p className="mt-8 text-lime-400 font-mono tracking-widest text-lg md:text-xl drop-shadow-[0_0_8px_rgba(163,230,53,0.6)]">
                LOADING ARENA... {displayPercentage}%
              </p>
            </div>
          </div>
        )}

        <div className="sticky top-0 h-screen w-full overflow-hidden">

          {/* LAYER 1: The Canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ backgroundColor: "#000000" }}
          />

          {/* LAYER 2: Parallax Hero */}
          <div
            style={{ opacity: heroOpacity }}
            className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-75"
          >
            <img
              src="/background_only.png"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-200 ease-out"
              style={{ transform: `translate(${mouseOffset.x * 0.5}px, ${mouseOffset.y * 0.5}px) scale(1.05)` }}
              alt="Arena Background"
            />
            <img
              src="/ninja_and_text.png"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-200 ease-out"
              style={{ transform: `translate(${mouseOffset.x * 1.5}px, ${mouseOffset.y * 1.5}px) scale(1.05)` }}
              alt="Arena Foreground"
            />
          </div>

          {/* LAYER 2.5: Scroll Indicator */}
          <div 
            style={{ opacity: heroOpacity }}
            className="absolute bottom-8 md:bottom-12 left-0 right-0 z-20 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-200"
          >
            <span 
              className="text-[#7E9678] text-xs md:text-sm tracking-widest uppercase mb-3 drop-shadow-md"
              style={{ fontFamily: "'GangOfThree', sans-serif" }}
            >
              Scroll to explore
            </span>
            <motion.svg
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-5 h-5 md:w-6 md:h-6 text-[#7E9678] drop-shadow-md"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </motion.svg>
          </div>

          {/* LAYER 4: BLACK SKEWED PANEL TRANSITION */}
          {transitionProgress > 0 && (
            <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
              {Array.from({ length: PANEL_COUNT }).map((_, i) => {
                const panelDelay = i * PANEL_STAGGER;
                const maxProgress = 1 - panelDelay;
                const rawProgress = Math.max(0, transitionProgress - panelDelay);
                const panelProgress = maxProgress > 0 ? Math.min(1, rawProgress / maxProgress) : 0;

                const eased = 1 - Math.pow(1 - panelProgress, 3);
                const translateY = (1 - eased) * 130;

                const panelWidthVW = 30;
                const leftVW = i * 14 - 4;

                return (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      left: `${leftVW}vw`,
                      width: `${panelWidthVW}vw`,
                      height: "180%",
                      top: "-30%",
                      transform: `translateY(${translateY}vh) skewX(-10deg)`,
                      backgroundColor: "#000000",
                      willChange: "transform",
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>
      </main>
      
      <section className="relative z-40 -mt-[150vh] bg-[#000000] overflow-hidden">

        {/* ── Ticker Stripe ── */}
        <div className="w-full bg-[#2B5152] py-2 overflow-hidden whitespace-nowrap">
          <div
            className="inline-flex"
            style={{ animation: "ticker-scroll 18s linear infinite" }}
            aria-hidden="true"
          >
            {TICKER_WORDS.map((word, i) => (
              <span
                key={i}
                className="px-4 uppercase tracking-widest text-sm md:text-2xl font-bold select-none text-[#000000]"
                style={{ fontFamily: "'Tillburg', 'Impact', sans-serif" }}
              >
                {word}
              </span>
            ))}
          </div>
        </div>

        {/* ── Body ── */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between min-h-[90vh] px-[6vw] py-16 gap-10">

          {/* Left: Ninja Image */}
          <div className="flex-shrink-0 w-[80vw] md:w-[42vw] max-w-[560px] self-end">
            <img
              src="/ninja1.png"
              alt="Arena ninja mascot"
              className="w-full h-auto object-contain"
            />
          </div>

          {/* Right: Text Column */}
          <div className="flex flex-col items-end text-right gap-9 max-w-[520px] ml-auto transform -translate-y-40">

            {/* Paragraph */}
            <p
              className="text-[#7E9678] uppercase leading-normal tracking-widest"
              style={{
                fontFamily: "'GangOfThree'",
                fontSize: "clamp(10px, 1.05vw, 14px)",
              }}
            >
              ARENA IS THE ANNUAL NATIONAL SPORTS FESTIVAL OF OUR CAMPUS.
              ARENA HOSTS A WIDE VARIETY OF COMPETITIVE SPORTING EVENTS WHICH
              INCLUDE BASKETBALL, FOOTBALL, HOCKEY, CRICKET, KHO KHO, TABLE
              TENNIS, BADMINTON, TENNIS, FRISBEE, CARROM AND CHESS. THE FEST
              BRINGS TOGETHER COLLEGES FROM ACROSS THE COUNTRY, PROVIDING A
              PLATFORM FOR ATHLETES TO SHOWCASE THEIR SKILL, TEAMWORK AND
              SPORTSMANSHIP. THE FEST ALSO HOSTS TALKS AND PRO-SHOWS WITH
              CELEBRITIES AND ARTISTS APPEARING AND PERFORMING DURING THE FEST.
            </p>

            {/* WHAT IS ARENA? */}
            <div className="flex items-baseline gap-2 flex-wrap justify-end">
              <span
                className="text-[#EE271F] uppercase tracking-widest"
                style={{
                  fontFamily: "'Tillburg', 'Impact', sans-serif",
                  fontSize: "clamp(14px, 2vw, 26px)",
                }}
              >
                WHAT IS
              </span>
              <span
                className="text-[#EE271F] uppercase leading-none"
                style={{
                  fontFamily: "'Tillburg', 'Impact', sans-serif",
                  fontSize: "clamp(52px, 10vw, 130px)",
                }}
              >
                ARENA?
              </span>
            </div>
          </div>
         </div>
       
        {/* ── Top Text Block ── */}
        <div className="w-full pt-16 px-[6vw] mb-12 md:mb-24"> 
          <p
            className="text-[#7E9678] uppercase leading-normal tracking-widest text-center mx-auto max-w-7xl"
            style={{
              fontFamily: "'GangOfThree', sans-serif",
              fontSize: "clamp(10px, 1.1vw, 15px)",
            }}
          >
            ARENA&apos;26 STEPS OUT OF THE SHADOWS AND INTO THE BATTLEFIELD. THIS YEAR&apos;S THEME IS SHADOWS RISING. 
            ROOTED IN THE FIERCE SPIRIT OF NINJA WARRIORS, IT BRINGS ALIVE A WORLD OF STEALTH, STRENGTH, 
            AND UNBREAKABLE DISCIPLINE WHERE WARRIORS TRAIN IN SILENCE, STRIKE WITH PRECISION, AND RISE 
            WITH UNSTOPPABLE POWER. BATHED IN BOLD GREENS AND FORGED IN THE AURA OF COMBAT, ARENA CHANNELS 
            THE INTENSITY OF THE FIGHT AND THE HONOR OF THE WARRIOR CODE. WITH THE SILHOUETTE OF A MASKED 
            FIGHTER WIELDING KATANAS AND PIERCING GREEN EYES THAT GLOW THROUGH THE DARK, THIS EDITION 
            PROMISES A CLASH OF CHAMPIONS WHERE EVERY MATCH IS A DUEL, EVERY ARENA A BATTLEGROUND, 
            AND EVERY ATHLETE RISES FROM THE SHADOWS TO CLAIM VICTORY.
          </p>
        </div>

        {/* ── Middle Body: Overlapping Heading + Large Ninja ── */}
        <div className="relative w-full px-[6vw] min-h-[300px] md:min-h-[500px] flex items-end">
          
          {/* WHAT IS THEME Block - Positioned on top with z-20 */}
          <div className="relative z-20 flex flex-col items-start pb-4 md:pb-12 pointer-events-none -translate-y-90 translate-x-12">
            <span
              className="text-[#EE271F] uppercase tracking-widest"
              style={{
                fontFamily: "'Tillburg', 'Impact', sans-serif",
                fontSize: "clamp(14px, 2vw, 26px)", // Smaller size
              }}
            >
              WHAT IS THE
            </span>
            <h2
              className="text-[#EE271F] uppercase leading-[0.8] -ml-1"
              style={{
                fontFamily: "'Tillburg', 'Impact', sans-serif",
                fontSize: "clamp(52px, 10vw, 130px)", // Reduced from 160px/240px
              }}
            >
              THEME?
            </h2>
          </div>

          {/* Ninja Image - Expanding to the left behind the text */}
          <div className="absolute inset-0 z-10 flex justify-end items-end overflow-visible">
            <img
              src="/ninja2.png"
              alt="Ninja Theme Mascot"
              className="w-full h-auto max-h-[85%] object-contain object-right-bottom scale-110 translate-x-[-5%] translate-y-[-45%]" 
              /* scale-110 and translate make the ninja feel larger and fill the space */
            />
          </div>
        </div>
      </section>

      <div className="relative z-40 -mt-[20vh] max-[900px]:-mt-[14vh] max-[600px]:-mt-[10vh]">
        <SportsSection />
      </div>
      <TurtleBg />
      <Footer />
    </>
  );
}
//moving loader
// "use client";

// import { useEffect, useRef, useState } from "react";

// export default function Home() {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
  
//   const [heroOpacity, setHeroOpacity] = useState(1);
//   const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  
//   // Loading Screen States
//   const [isLoading, setIsLoading] = useState(true);
//   const [loadedCount, setLoadedCount] = useState(0);
//   const [isMouthOpen, setIsMouthOpen] = useState(true);
//   const [fakeProgress, setFakeProgress] = useState(0);
  
//   const frameCount = 141; 

//   // 1. The "Chomp" Animation Loop
//   useEffect(() => {
//     if (!isLoading) return;
//     const chompInterval = setInterval(() => {
//       setIsMouthOpen((prev) => !prev);
//     }, 250); 
//     return () => clearInterval(chompInterval);
//   }, [isLoading]);

//   // ---> UPDATE 1: 3-SECOND TIMER <---
//   useEffect(() => {
//     if (!isLoading) return;
//     const progressInterval = setInterval(() => {
//       setFakeProgress((prev) => {
//         if (prev >= 100) return 100;
//         return prev + 1; 
//       });
//     }, 30); // Changed from 40 to 30! (30ms * 100 = exactly 3 seconds)

//     return () => clearInterval(progressInterval);
//   }, [isLoading]);

//   // 3. Canvas Preload Logic
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const context = canvas?.getContext("2d");
//     if (!canvas || !context) return;

//     const images: HTMLImageElement[] = [];
//     for (let i = 0; i <= frameCount; i++) {
//       const img = new Image();
//       const frameNum = i.toString().padStart(3, "0"); 
//       img.src = `/arena_images/arena_images${frameNum}.jpg`;
      
//       img.onload = () => {
//         setLoadedCount((prev) => {
//           return prev + 1;
//         });

//         if (i === 0) renderFrame(0);
//       };
//       images.push(img);
//     }

//     function renderFrame(index: number) {
//       const currentImage = images[index];
//       if (currentImage && currentImage.complete) {
//         canvas!.width = currentImage.width;
//         canvas!.height = currentImage.height;
//         context!.drawImage(currentImage, 0, 0);
//       }
//     }

//     const handleScroll = () => {
//       if (!containerRef.current) return;
//       const rect = containerRef.current.getBoundingClientRect();
//       const scrollPosition = -rect.top;
//       const totalScrollableDistance = rect.height - window.innerHeight;
//       let scrollFraction = Math.max(0, Math.min(1, scrollPosition / totalScrollableDistance));

//       setHeroOpacity(Math.max(0, 1 - (scrollFraction * 5)));

//       const frameIndex = Math.min(frameCount, Math.floor(scrollFraction * (frameCount + 1)));
//       renderFrame(frameIndex);
//     };

//     let scrollRequestId: number;
//     const onScroll = () => {
//       cancelAnimationFrame(scrollRequestId);
//       scrollRequestId = requestAnimationFrame(handleScroll);
//     };

//     const handleMouseMove = (e: MouseEvent) => {
//       const x = (e.clientX / window.innerWidth - 0.5) * 20; 
//       const y = (e.clientY / window.innerHeight - 0.5) * 15;
//       setMouseOffset({ x, y });
//     };

//     window.addEventListener("scroll", onScroll, { passive: true });
//     window.addEventListener("mousemove", handleMouseMove); 
    
//     return () => {
//       window.removeEventListener("scroll", onScroll);
//       window.removeEventListener("mousemove", handleMouseMove);
//       cancelAnimationFrame(scrollRequestId);
//     };
//   }, []);

//   // Hybrid Math Logic
//   const actualPercentage = Math.round((loadedCount / (frameCount + 1)) * 100);
//   const displayPercentage = Math.min(actualPercentage, fakeProgress);

//   // The Instant Kill Switch
//   useEffect(() => {
//     if (displayPercentage >= 100) {
//       const timer = setTimeout(() => setIsLoading(false), 200); 
//       return () => clearTimeout(timer);
//     }
//   }, [displayPercentage]);

//   return (
//     <main ref={containerRef} className="relative h-[400vh] bg-black">
      
//       {/* LAYER 0: THE LOADING SCREEN */}
//       {isLoading && (
//         <div className="fixed inset-0 z-[200] bg-[#1a1a1a] flex flex-col items-center justify-center">
//           <div className="relative w-full max-w-2xl h-32 px-8">
//             <img 
//               src={isMouthOpen ? "/loader_open.png" : "/loader_close.png"}
//               // ---> UPDATE 2: SHORTER DISTANCE <---
//               // Changed multiplier to 0.52 to keep the exact same speed over 3 seconds
//               className="absolute h-14 md:h-24 w-auto top-1/2 -translate-y-1/2"
//               style={{ left: `${Math.min(displayPercentage * 0.40, 40)}%` }} 
//               alt="Loading Turtles"
//             />
//           </div>
//           <p className="mt-8 text-lime-400 font-mono tracking-widest text-lg md:text-xl drop-shadow-[0_0_8px_rgba(163,230,53,0.6)]">
//             LOADING ARENA... {displayPercentage}%
//           </p>
//         </div>
//       )}

//       <div className="sticky top-0 h-screen w-full overflow-hidden">
        
//         {/* LAYER 1: The Ninja Canvas */}
//         <canvas 
//           ref={canvasRef} 
//           className="absolute inset-0 w-full h-full object-cover" 
//         />

//         {/* LAYER 2 WRAPPER: Handles the fade out for both Figma images */}
//         <div 
//           style={{ opacity: heroOpacity }}
//           className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-75"
//         >
//           {/* LAYER 2a: Background Scenery */}
//           <img 
//             src="/background_only.png" 
//             className="absolute inset-0 w-full h-full object-cover transition-transform duration-200 ease-out" 
//             style={{
//               transform: `translate(${mouseOffset.x * 0.5}px, ${mouseOffset.y * 0.5}px) scale(1.05)`
//             }}
//             alt="Arena Background" 
//           />

//           {/* LAYER 2b: Ninja & Text Foreground */}
//           <img 
//             src="/ninja_and_text.png" 
//             className="absolute inset-0 w-full h-full object-cover transition-transform duration-200 ease-out" 
//             style={{
//               transform: `translate(${mouseOffset.x * 1.5}px, ${mouseOffset.y * 1.5}px) scale(1.05)`
//             }}
//             alt="Arena Foreground" 
//           />
//         </div>

//         {/* LAYER 3: 3-Bar Menu */}
//         <button 
//           style={{ 
//             opacity: heroOpacity,
//             pointerEvents: heroOpacity > 0 ? "auto" : "none"
//           }}
//           className="fixed top-10 left-10 z-[100] transition-transform duration-300 hover:scale-110 active:scale-95"
//           onClick={() => console.log("Menu Open")}
//         >
//           <img 
//             src="/3bar.png" 
//             className="w-14 h-auto drop-shadow-[0_0_15px_rgba(163,230,53,0.4)]" 
//             alt="Navigation Menu" 
//           />
//         </button>

//       </div>
//     </main>
//   );
// }


//no moving loader
// "use client";

// import { useEffect, useRef, useState } from "react";

// export default function Home() {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
  
//   const [heroOpacity, setHeroOpacity] = useState(1);
//   const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  
//   // Loading Screen States
//   const [isLoading, setIsLoading] = useState(true);
//   const [loadedCount, setLoadedCount] = useState(0);
//   const [isMouthOpen, setIsMouthOpen] = useState(true);
//   const [fakeProgress, setFakeProgress] = useState(0);
  
//   const frameCount = 141; 

//   // 1. The "Chomp" Animation Loop
//   useEffect(() => {
//     if (!isLoading) return;
//     const chompInterval = setInterval(() => {
//       setIsMouthOpen((prev) => !prev);
//     }, 250); 
//     return () => clearInterval(chompInterval);
//   }, [isLoading]);

//   // 2. The 3-Second Timer
//   useEffect(() => {
//     if (!isLoading) return;
//     const progressInterval = setInterval(() => {
//       setFakeProgress((prev) => {
//         if (prev >= 100) return 100;
//         return prev + 1; 
//       });
//     }, 20); 

//     return () => clearInterval(progressInterval);
//   }, [isLoading]);

//   // 3. Canvas Preload Logic
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const context = canvas?.getContext("2d");
//     if (!canvas || !context) return;

//     const images: HTMLImageElement[] = [];
//     for (let i = 0; i <= frameCount; i++) {
//       const img = new Image();
//       const frameNum = i.toString().padStart(3, "0"); 
//       img.src = `/arena_images/arena_images${frameNum}.jpg`;
      
//       img.onload = () => {
//         setLoadedCount((prev) => {
//           return prev + 1;
//         });

//         if (i === 0) renderFrame(0);
//       };
//       images.push(img);
//     }

//     function renderFrame(index: number) {
//       const currentImage = images[index];
//       if (currentImage && currentImage.complete) {
//         canvas!.width = currentImage.width;
//         canvas!.height = currentImage.height;
//         context!.drawImage(currentImage, 0, 0);
//       }
//     }

//     const handleScroll = () => {
//       if (!containerRef.current) return;
//       const rect = containerRef.current.getBoundingClientRect();
//       const scrollPosition = -rect.top;
//       const totalScrollableDistance = rect.height - window.innerHeight;
//       let scrollFraction = Math.max(0, Math.min(1, scrollPosition / totalScrollableDistance));

//       setHeroOpacity(Math.max(0, 1 - (scrollFraction * 5)));

//       const frameIndex = Math.min(frameCount, Math.floor(scrollFraction * (frameCount + 1)));
//       renderFrame(frameIndex);
//     };

//     let scrollRequestId: number;
//     const onScroll = () => {
//       cancelAnimationFrame(scrollRequestId);
//       scrollRequestId = requestAnimationFrame(handleScroll);
//     };

//     const handleMouseMove = (e: MouseEvent) => {
//       const x = (e.clientX / window.innerWidth - 0.5) * 20; 
//       const y = (e.clientY / window.innerHeight - 0.5) * 15;
//       setMouseOffset({ x, y });
//     };

//     window.addEventListener("scroll", onScroll, { passive: true });
//     window.addEventListener("mousemove", handleMouseMove); 
    
//     return () => {
//       window.removeEventListener("scroll", onScroll);
//       window.removeEventListener("mousemove", handleMouseMove);
//       cancelAnimationFrame(scrollRequestId);
//     };
//   }, []);

//   // Hybrid Math Logic
//   const actualPercentage = Math.round((loadedCount / (frameCount + 1)) * 100);
//   const displayPercentage = Math.min(actualPercentage, fakeProgress);

//   // The Instant Kill Switch
//   useEffect(() => {
//     if (displayPercentage >= 100) {
//       const timer = setTimeout(() => setIsLoading(false), 200); 
//       return () => clearTimeout(timer);
//     }
//   }, [displayPercentage]);

//   return (
//     <main ref={containerRef} className="relative h-[400vh] bg-black">
      
//       {/* LAYER 0: THE LOADING SCREEN */}
//       {isLoading && (
//         <div className="fixed inset-0 z-[200] bg-[#1a1a1a] flex flex-col items-center justify-center">
          
//           <div className="relative w-full max-w-2xl h-32 px-8 flex justify-center items-center">
//             <img 
//               src={isMouthOpen ? "/loader_open.png" : "/loader_close.png"}
//               className="h-14 md:h-24 w-auto" 
//               alt="Loading Turtles"
//             />
//           </div>

//           <p className="mt-8 text-lime-400 font-mono tracking-widest text-lg md:text-xl drop-shadow-[0_0_8px_rgba(163,230,53,0.6)]">
//             LOADING ARENA... {displayPercentage}%
//           </p>
//         </div>
//       )}

//       <div className="sticky top-0 h-screen w-full overflow-hidden">
        
//         {/* LAYER 1: The Ninja Canvas */}
//         <canvas 
//           ref={canvasRef} 
//           className="absolute inset-0 w-full h-full object-cover" 
//         />

//         {/* LAYER 2 WRAPPER: Handles the fade out for both Figma images */}
//         <div 
//           style={{ opacity: heroOpacity }}
//           className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-75"
//         >
//           {/* LAYER 2a: Background Scenery */}
//           <img 
//             src="/background_only.png" 
//             className="absolute inset-0 w-full h-full object-cover transition-transform duration-200 ease-out" 
//             style={{
//               transform: `translate(${mouseOffset.x * 0.5}px, ${mouseOffset.y * 0.5}px) scale(1.05)`
//             }}
//             alt="Arena Background" 
//           />

//           {/* LAYER 2b: Ninja & Text Foreground */}
//           <img 
//             src="/ninja_and_text.png" 
//             className="absolute inset-0 w-full h-full object-cover transition-transform duration-200 ease-out" 
//             style={{
//               transform: `translate(${mouseOffset.x * 1.5}px, ${mouseOffset.y * 1.5}px) scale(1.05)`
//             }}
//             alt="Arena Foreground" 
//           />
//         </div>

//         {/* LAYER 3: 3-Bar Menu */}
//         <button 
//           style={{ 
//             opacity: heroOpacity,
//             pointerEvents: heroOpacity > 0 ? "auto" : "none"
//           }}
//           className="fixed top-10 left-10 z-[100] transition-transform duration-300 hover:scale-110 active:scale-95"
//           onClick={() => console.log("Menu Open")}
//         >
//           <img 
//             src="/3bar.png" 
//             className="w-14 h-auto drop-shadow-[0_0_15px_rgba(163,230,53,0.4)]" 
//             alt="Navigation Menu" 
//           />
//         </button>

//       </div>
//     </main>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mazeCanvasRef = useRef<HTMLCanvasElement>(null);
  
  const [heroOpacity, setHeroOpacity] = useState(1);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  
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

    const cellSize = 60; // Size of the corridors
    const cols = Math.floor(canvas.width / cellSize);
    const rows = Math.floor(canvas.height / cellSize);
    
    // Center the maze on the screen
    const xOffset = (canvas.width - cols * cellSize) / 2;
    const yOffset = (canvas.height - rows * cellSize) / 2;

    // Data structures for the walls (true means wall exists)
    const visited = Array(cols).fill(null).map(() => Array(rows).fill(false));
    const hWalls = Array(cols).fill(null).map(() => Array(rows + 1).fill(true)); // Horizontal walls
    const vWalls = Array(cols + 1).fill(null).map(() => Array(rows).fill(true)); // Vertical walls

    // Depth-First Search Maze Generation
    const stack = [];
    let currX = Math.floor(Math.random() * cols);
    let currY = Math.floor(Math.random() * rows);
    visited[currX][currY] = true;

    while (true) {
      const neighbors = [];
      if (currY > 0 && !visited[currX][currY - 1]) neighbors.push({ x: currX, y: currY - 1, dir: 'UP' });
      if (currY < rows - 1 && !visited[currX][currY + 1]) neighbors.push({ x: currX, y: currY + 1, dir: 'DOWN' });
      if (currX > 0 && !visited[currX - 1][currY]) neighbors.push({ x: currX - 1, y: currY, dir: 'LEFT' });
      if (currX < cols - 1 && !visited[currX + 1][currY]) neighbors.push({ x: currX + 1, y: currY, dir: 'RIGHT' });

      if (neighbors.length > 0) {
        const next = neighbors[Math.floor(Math.random() * neighbors.length)];
        stack.push({ x: currX, y: currY });

        // Knock down the wall between current and next cell
        if (next.dir === 'UP') hWalls[currX][currY] = false;
        if (next.dir === 'DOWN') hWalls[currX][currY + 1] = false;
        if (next.dir === 'LEFT') vWalls[currX][currY] = false;
        if (next.dir === 'RIGHT') vWalls[currX + 1][currY] = false;

        currX = next.x;
        currY = next.y;
        visited[currX][currY] = true;
      } else if (stack.length > 0) {
        const popped = stack.pop();
        if(popped) {
            currX = popped.x;
            currY = popped.y;
        }
      } else {
        break; // Maze complete!
      }
    }

    // Arcade-ify: Randomly remove 10% of remaining walls to create classic loops
    for (let i = 0; i < cols; i++) {
      for (let j = 1; j < rows; j++) {
         if (Math.random() < 0.1) hWalls[i][j] = false;
      }
    }
    for (let i = 1; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
         if (Math.random() < 0.1) vWalls[i][j] = false;
      }
    }

    // --- DRAWING THE MAZE ---
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const traceWalls = () => {
        ctx.beginPath();
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j <= rows; j++) {
                if (hWalls[i][j]) {
                    ctx.moveTo(xOffset + i * cellSize, yOffset + j * cellSize);
                    ctx.lineTo(xOffset + (i + 1) * cellSize, yOffset + j * cellSize);
                }
            }
        }
        for (let i = 0; i <= cols; i++) {
            for (let j = 0; j < rows; j++) {
                if (vWalls[i][j]) {
                    ctx.moveTo(xOffset + i * cellSize, yOffset + j * cellSize);
                    ctx.lineTo(xOffset + i * cellSize, yOffset + (j + 1) * cellSize);
                }
            }
        }
        ctx.stroke();
    };

    // Step 1: Draw the thick glowing base
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#064e3b"; // Dark Emerald Green
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#064e3b"; // Dark Emerald Green Glow
    traceWalls();

    // Step 2: Draw a thin black line over the exact same paths to make them "hollow"
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#000000";
    ctx.shadowBlur = 0; // Turn off glow for the inner black line
    traceWalls();

    // ---> NEW: MULTI-COLORED NEON PELLET LOGIC <---
    const pellets = [];
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if (Math.random() < 0.25) { 
                pellets.push({
                    x: xOffset + i * cellSize + cellSize / 2,
                    y: yOffset + j * cellSize + cellSize / 2
                });
            }
        }
    }

    // Shuffle the array of pellets randomly
    for (let i = pellets.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pellets[i], pellets[j]] = [pellets[j], pellets[i]];
    }

    // Pick 8 to 15 dots to be the special glowing ones
    const glowingDotCount = Math.floor(Math.random() * 8) + 8; 
    
    // A palette of bright, classic arcade neon colors
    const neonColors = [
        "#ff0000", // Red
        "#00ffff", // Cyan
        "#ff00ff", // Magenta
        "#ffff00", // Yellow
        "#39ff14", // Neon Green
        "#ff8800", // Orange
        "#bc13fe"  // Purple
    ];

    // Draw all the pellets
    for (let i = 0; i < pellets.length; i++) {
        ctx.beginPath();
        const radius = i < glowingDotCount ? 4 : 3; 
        ctx.arc(pellets[i].x, pellets[i].y, radius, 0, Math.PI * 2);

        if (i < glowingDotCount) {
            // Pick a random bright color from our palette for this specific dot
            const randomColor = neonColors[Math.floor(Math.random() * neonColors.length)];
            
            ctx.fillStyle = randomColor;
            ctx.shadowBlur = 25; 
            ctx.shadowColor = randomColor;
        } else {
            // STANDARD DOTS 
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

  // 1. The "Chomp" Animation Loop
  useEffect(() => {
    if (!isLoading) return;
    const chompInterval = setInterval(() => {
      setIsMouthOpen((prev) => !prev);
    }, 250); 
    return () => clearInterval(chompInterval);
  }, [isLoading]);

  // 2. The 3-Second Timer
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

  // 3. Canvas Preload Logic
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
        setLoadedCount((prev) => {
          return prev + 1;
        });

        if (i === 0) renderFrame(0);
      };
      images.push(img);
    }

    function renderFrame(index: number) {
      const currentImage = images[index];
      if (currentImage && currentImage.complete) {
        canvas!.width = currentImage.width;
        canvas!.height = currentImage.height;
        context!.drawImage(currentImage, 0, 0);
      }
    }

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollPosition = -rect.top;
      const totalScrollableDistance = rect.height - window.innerHeight;
      let scrollFraction = Math.max(0, Math.min(1, scrollPosition / totalScrollableDistance));

      setHeroOpacity(Math.max(0, 1 - (scrollFraction * 5)));

      const frameIndex = Math.min(frameCount, Math.floor(scrollFraction * (frameCount + 1)));
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

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove); 
    
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(scrollRequestId);
    };
  }, []);

  // Hybrid Math Logic
  const actualPercentage = Math.round((loadedCount / (frameCount + 1)) * 100);
  const displayPercentage = Math.min(actualPercentage, fakeProgress);

  // The Instant Kill Switch
  useEffect(() => {
    if (displayPercentage >= 100) {
      const timer = setTimeout(() => setIsLoading(false), 200); 
      return () => clearTimeout(timer);
    }
  }, [displayPercentage]);

  return (
    <main ref={containerRef} className="relative h-[400vh] bg-black">
      
      {/* LAYER 0: THE LOADING SCREEN */}
      {isLoading && (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-4 overflow-hidden">
          
          {/* THE PROCEDURAL MAZE CANVAS */}
          <canvas 
            ref={mazeCanvasRef} 
            className="absolute inset-0 w-full h-full opacity-50 pointer-events-none" 
          />
          
          {/* THE PROGRESS BAR CONTAINER */}
          <div className="relative z-10 w-full max-w-2xl flex flex-col items-center">
            
            {/* THE GLOWING RED TRACK */}
            <div 
              className="relative w-full h-20 md:h-32 border-[6px] border-double border-red-950 rounded-full flex items-center px-4 overflow-hidden bg-black/70 backdrop-blur-sm"
              style={{
                boxShadow: "0 0 20px rgba(127,29,29,0.7), inset 0 0 20px rgba(127,29,29,0.7)"
              }}
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
        
        {/* LAYER 1: The Ninja Canvas */}
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full object-cover" 
        />

        {/* LAYER 2 WRAPPER: Figma Design Parallax */}
        <div 
          style={{ opacity: heroOpacity }}
          className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-75"
        >
          {/* Background Scenery */}
          <img 
            src="/background_only.png" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-200 ease-out" 
            style={{
              transform: `translate(${mouseOffset.x * 0.5}px, ${mouseOffset.y * 0.5}px) scale(1.05)`
            }}
            alt="Arena Background" 
          />

          {/* Ninja & Text Foreground */}
          <img 
            src="/ninja_and_text.png" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-200 ease-out" 
            style={{
              transform: `translate(${mouseOffset.x * 1.5}px, ${mouseOffset.y * 1.5}px) scale(1.05)`
            }}
            alt="Arena Foreground" 
          />
        </div>

        {/* LAYER 3: Navigation Menu */}
        <button 
          style={{ 
            opacity: heroOpacity,
            pointerEvents: heroOpacity > 0 ? "auto" : "none"
          }}
          className="fixed top-10 left-10 z-[100] transition-transform duration-300 hover:scale-110 active:scale-95"
          onClick={() => console.log("Menu Open")}
        >
          <img 
            src="/3bar.png" 
            className="w-14 h-auto drop-shadow-[0_0_15px_rgba(163,230,53,0.4)]" 
            alt="Navigation Menu" 
          />
        </button>

      </div>
    </main>
  );
}
// "use client";

// import { useEffect, useRef, useState } from "react";

// export default function Home() {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [heroOpacity, setHeroOpacity] = useState(1);
  
//   // Total frame count for the ninja animation
//   const frameCount = 141; 

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const context = canvas?.getContext("2d");
//     if (!canvas || !context) return;

//     const images: HTMLImageElement[] = [];

//     // Preload the 141 ninja frames
//     for (let i = 0; i <= frameCount; i++) {
//       const img = new Image();
//       const frameNum = i.toString().padStart(3, "0"); 
//       img.src = `/arena_images/arena_images${frameNum}.jpg`;
      
//       img.onload = () => {
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

//     // Scroll Logic for Animation and Fade
//     const handleScroll = () => {
//       if (!containerRef.current) return;
//       const rect = containerRef.current.getBoundingClientRect();
//       const scrollPosition = -rect.top;
//       const totalScrollableDistance = rect.height - window.innerHeight;
//       let scrollFraction = Math.max(0, Math.min(1, scrollPosition / totalScrollableDistance));

//       // Figma Art Fade Out Math
//       setHeroOpacity(Math.max(0, 1 - (scrollFraction * 5)));

//       // Canvas Frame Math
//       const frameIndex = Math.min(frameCount, Math.floor(scrollFraction * (frameCount + 1)));
//       renderFrame(frameIndex);
//     };

//     let requestId: number;
//     const onScroll = () => {
//       cancelAnimationFrame(requestId);
//       requestId = requestAnimationFrame(handleScroll);
//     };

//     window.addEventListener("scroll", onScroll, { passive: true });
//     return () => {
//       window.removeEventListener("scroll", onScroll);
//       cancelAnimationFrame(requestId);
//     };
//   }, []);

//   return (
//     <main ref={containerRef} className="relative h-[400vh] bg-black">
//       <div className="sticky top-0 h-screen w-full overflow-hidden">
        
//         {/* LAYER 1: The Ninja Canvas (Bottom Layer) */}
//         <canvas 
//           ref={canvasRef} 
//           className="absolute inset-0 w-full h-full object-cover" 
//         />

//         {/* LAYER 2: Figma Design (Middle Layer - Fades out) */}
//         {/* FIX: Changed object-contain to object-cover to remove black bars */}
//         <div 
//           style={{ opacity: heroOpacity }}
//           className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none transition-opacity duration-75"
//         >
//           <img 
//             src="/home_first.png" 
//             className="w-full h-full object-cover" 
//             alt="Arena 2026 Intro" 
//           />
//         </div>

//         {/* LAYER 3: 3-Bar Menu (Top Layer - Fades out too!) */}
//         <button 
//           // ADDED: This links the button's visibility to your scroll math
//           // It also turns off clicking when the opacity hits 0
//           style={{ 
//             opacity: heroOpacity,
//             pointerEvents: heroOpacity > 0 ? "auto" : "none"
//           }}
//           // REMOVED "transition-all" and ADDED "transition-transform" so the scroll fade doesn't lag
//           className="fixed top-15 left-15 z-[100] transition-transform duration-300 hover:scale-110 active:scale-95"
//           onClick={() => console.log("Menu Open")}
//         >
//           <img 
//             src="/3bar.png" 
//             className="w-20 h-auto drop-shadow-[0_0_15px_rgba(163,230,53,0.4)]" 
//             alt="Navigation Menu" 
//           />
//         </button>

//       </div>
//     </main>
//   );
// }

//above is without the mouse parallax effect

"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [heroOpacity, setHeroOpacity] = useState(1);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  
  const frameCount = 141; 

  useEffect(() => {
    // --- CANVAS PRELOAD LOGIC ---
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const images: HTMLImageElement[] = [];
    for (let i = 0; i <= frameCount; i++) {
      const img = new Image();
      const frameNum = i.toString().padStart(3, "0"); 
      img.src = `/arena_images/arena_images${frameNum}.jpg`;
      img.onload = () => {
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

    // --- SCROLL LOGIC ---
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

    // --- MOUSE MOVEMENT LOGIC ---
    const handleMouseMove = (e: MouseEvent) => {
      // Calculates distance from the center of the screen
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

  return (
    <main ref={containerRef} className="relative h-[400vh] bg-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        
        {/* LAYER 1: The Ninja Canvas */}
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full object-cover" 
        />

        {/* LAYER 2 WRAPPER: Handles the fade out for both Figma images */}
        <div 
          style={{ opacity: heroOpacity }}
          className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-75"
        >
          {/* LAYER 2a: Background Scenery (Moves Slower - 50% speed) */}
          <img 
            src="/background_only.png" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-200 ease-out" 
            style={{
              transform: `translate(${mouseOffset.x * 0.5}px, ${mouseOffset.y * 0.5}px) scale(1.05)`
            }}
            alt="Arena Background" 
          />

          {/* LAYER 2b: Ninja & Text Foreground (Moves Faster - 150% speed) */}
          <img 
            src="/ninja_and_text.png" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-200 ease-out" 
            style={{
              transform: `translate(${mouseOffset.x * 1.5}px, ${mouseOffset.y * 1.5}px) scale(1.05)`
            }}
            alt="Arena Foreground" 
          />
        </div>

        {/* LAYER 3: 3-Bar Menu */}
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
"use client";

import { useEffect, useRef } from "react";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Adjusted to your last frame number
  const frameCount = 141; 

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    // 1. Preload all images into memory
    const images: HTMLImageElement[] = [];

    for (let i = 0; i <= frameCount; i++) {
      const img = new Image();
      // This matches Premiere's naming: arena_images000.jpg, arena_images001.jpg
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
        // This ensures the image fills the screen perfectly
        canvas!.width = currentImage.width;
        canvas!.height = currentImage.height;
        context!.drawImage(currentImage, 0, 0);
      }
    }

    // 2. Scroll Logic
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();

      const scrollPosition = -rect.top;
      const totalScrollableDistance = rect.height - window.innerHeight;
      let scrollFraction = scrollPosition / totalScrollableDistance;
      scrollFraction = Math.max(0, Math.min(1, scrollFraction));

      const frameIndex = Math.min(
        frameCount,
        Math.floor(scrollFraction * (frameCount + 1))
      );

      renderFrame(frameIndex);
    };

    let requestId: number;
    const onScroll = () => {
      cancelAnimationFrame(requestId);
      requestId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(requestId);
    };
  }, []);

  return (
    <main ref={containerRef} className="relative h-[400vh] bg-black">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover"
        />
      </div>
    </main>
  );
}
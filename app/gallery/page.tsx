"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import Image from "next/image";

const arenaData = [
  { id: 1,  title: "Basketball", align: "left",  src: "/images/arena/basketball1.webp" },
  { id: 2,  title: "Cricket", align: "right", src: "/images/arena/cricket.webp" },
  { id: 3,  title: "Football", align: "left",  src: "/images/arena/football.webp" },
  { id: 4,  title: "Badminton", align: "right", src: "/images/arena/badminton.webp" },
  { id: 5,  title: "Hockey", align: "left",  src: "/images/arena/hockey.webp" },
  { id: 6,  title: "Kabaddi", align: "right", src: "/images/arena/kabaddi.webp" },
  { id: 7,  title: "Swimming ", align: "left",  src: "/images/arena/swimming.webp" },
  { id: 8,  title: "Table Tennis", align: "right", src: "/images/arena/tabletennis.webp" },
  { id: 9,  title: "Tennis", align: "left",  src: "/images/arena/tennis.webp" },
  { id: 10, title: "Volleyball ", align: "right", src: "/images/arena/volleyball.webp" },
  { id: 11, title: "Snooker", align: "left",  src: "/images/arena/snooker.webp" },
];

export default function ArenaGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Fades the indicator out completely once the user scrolls 5% down
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  return (
    <section ref={containerRef} className="relative h-[1100vh] bg-neutral-950">
      
      <div 
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center"
        style={{ perspective: "1500px" }} 
      >
        
        <motion.div
          initial={{ x: "100%", opacity: 0, rotateY: -45, scale: 0.8 }}
          animate={{ x: 0, opacity: 1, rotateY: 0, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }} 
          className="absolute inset-0 z-0 origin-right"
        >
          <Image
            src="/images/arena/background.webp"
            alt="Arena Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
        </motion.div>

        <div 
          className="relative w-full max-w-7xl h-full flex items-center justify-center z-10"
          style={{ transformStyle: "preserve-3d" }}
        >
          {arenaData.map((item, index) => (
            <GalleryItem 
              key={item.id} 
              item={item} 
              index={index} 
              total={arenaData.length} 
              progress={scrollYProgress} 
            />
          ))}
        </div>

        <div className="absolute bottom-12 md:bottom-24 left-0 w-full h-16 overflow-hidden z-20 pointer-events-none">
          {arenaData.map((item, index) => (
            <GalleryCaption
              key={`caption-${item.id}`}
              title={item.title}
              index={index}
              total={arenaData.length}
              progress={scrollYProgress}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-0 right-0 mx-auto flex flex-col items-center justify-center z-30 pointer-events-none"
          style={{ opacity: indicatorOpacity }}
        >
          <span className="text-white/70 text-xs md:text-sm font-semibold tracking-[0.2em] uppercase mb-3 drop-shadow-md">
            Scroll to explore
          </span>
          <motion.svg
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-5 h-5 md:w-6 md:h-6 text-white/70 drop-shadow-md"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </motion.svg>
        </motion.div>

      </div>
    </section>
  );
}


function GalleryItem({ item, index, total, progress }: { item: any, index: number, total: number, progress: MotionValue<number> }) {
  const step = 1 / (total - 1); 
  const peak = index * step; 
  const start = peak - step; 
  const end = peak + step;   

  const z = useTransform(progress, [start, peak, end], [-2500, 0, 1500]);
  const opacity = useTransform(progress, [start, peak, end], [0, 1, 0]);

  return (
    <motion.div
      className={`absolute w-[65%] md:w-[35%] aspect-square ${
        item.align === "left" ? "left-[5%] md:left-[10%]" : "right-[5%] md:right-[10%]"
      }`}
      style={{
        translateZ: z,
        opacity,
        transformStyle: "preserve-3d"
      }}
    >
      <Image
        src={item.src}
        alt={item.title}
        fill
        className="object-cover rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.6)]"
        sizes="(max-width: 768px) 65vw, 35vw"
      />
    </motion.div>
  );
}

function GalleryCaption({ title, index, total, progress }: { title: string, index: number, total: number, progress: MotionValue<number> }) {
  const step = 1 / (total - 1);
  const peak = index * step;
  
  const start = peak - (step * 0.4);
  const end = peak + (step * 0.4);

  const y = useTransform(progress, [start, peak, end], ["100%", "0%", "-100%"]);
  const opacity = useTransform(progress, [start, peak, end], [0, 1, 0]);

  return (
    <motion.div
      className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
      style={{ y, opacity }}
    >
      <span className="text-white text-lg md:text-2xl font-bold uppercase tracking-[0.15em] drop-shadow-lg">
        {title}
      </span>
    </motion.div>
  );
}
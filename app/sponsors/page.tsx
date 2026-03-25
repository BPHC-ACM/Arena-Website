'use client';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';

export default function SponsorsPage() {
  return (
    <main 
      className="min-h-screen flex flex-col bg-black text-white overflow-x-hidden relative"
    >
      {/* Background Pattern */}
      <div 
        className="fixed top-0 left-0 w-full h-full z-0 opacity-40 pointer-events-none"
        style={{ 
          backgroundImage: "url('/sponsors-bg-new.jpg')", 
          backgroundSize: "600px", 
          backgroundPosition: "center",
          backgroundRepeat: "repeat" 
        }}
      />

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes sponsorMarquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .ticker-inner { animation: sponsorMarquee 20s linear infinite; display: flex; width: max-content; will-change: transform; -webkit-transform: translateZ(0); }
      `}} />
      
      {/* Absolute Top Ticker */}
      <div className="w-full bg-[#2d4a1e] text-[#86efac] text-[12px] md:text-[14px] tracking-[.1em] overflow-hidden py-1.5 whitespace-nowrap border-b border-[#86efac]/20 shadow-md flex relative z-10" style={{ fontFamily: "'gangofthree', sans-serif" }}>
         <div className="ticker-inner flex items-center">
            {[...Array(15)].map((_, i) => (
              <span key={i} className="pr-4 flex items-center">
                SOUTH INDIA'S LARGEST SPORTS FESTIVAL <span className="mx-2 text-[10px] text-[#A3E635]">●</span>
              </span>
            ))}
         </div>
      </div>

      {/* Main Content */}
      <div className="px-[20px] md:px-[60px] pt-[60px] md:pt-[80px] pb-[80px] w-full flex-grow relative z-10 flex flex-col items-center">
        
        {/* Main Title */}
        <h1 
          className="text-[48px] md:text-[64px] text-white mb-12 drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]" 
          style={{ fontFamily: "'gangofthree', sans-serif" }}
        >
          OUR SPONSORS
        </h1>

        {/* Title Sponsors Section */}
        <div className="w-full max-w-[1100px] flex flex-col items-center mb-[40px]">
          <h2 
            className="text-[#d97736] text-[20px] md:text-[28px] mb-[30px]"
            style={{ fontFamily: "'gangofthree', sans-serif" }}
          >
            TITLE SPONSORS
          </h2>
          
          <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-[40px] w-full mb-[40px]">
            {/* Box 1 */}
            <div className="flex flex-col items-center w-full max-w-[450px]">
              <div className="w-full aspect-[4/3] bg-[#D9D9D9] mb-4 shadow-xl border border-white/5" />
              <p 
                className="text-[#d97736] text-[16px] md:text-[20px]"
                style={{ fontFamily: "'gangofthree', sans-serif" }}
              >
                TITLE SPONSOR
              </p>
            </div>
            
            {/* Box 2 */}
            <div className="flex flex-col items-center w-full max-w-[450px]">
              <div className="w-full aspect-[4/3] bg-[#D9D9D9] mb-4 shadow-xl border border-white/5" />
              <p 
                className="text-[#d97736] text-[16px] md:text-[20px]"
                style={{ fontFamily: "'gangofthree', sans-serif" }}
              >
                CO-TITLE SPONSOR
              </p>
            </div>
          </div>
          
          {/* Below Box 3 Placeholder */}
          <div className="flex flex-col items-center w-full max-w-[450px]">
            <div className="w-full aspect-[4/3] bg-[#D9D9D9] mb-4 shadow-xl border border-white/5" />
          </div>
        </div>

      </div>

      <Footer />
    </main>
  );
}

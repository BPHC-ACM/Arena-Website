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

        {/* Sponsors Sections */}
        <div className="w-full max-w-[1100px] flex flex-col items-center">
          
          {/* Title Partner */}
          <div className="flex flex-col items-center mb-[60px] w-full">
            <h2 
              className="text-[#d97736] text-[20px] md:text-[28px] mb-[30px]"
              style={{ fontFamily: "'gangofthree', sans-serif" }}
            >
              TITLE PARTNER
            </h2>
            <div className="w-full max-w-[500px] aspect-[4/3] bg-white rounded-xl shadow-2xl flex items-center justify-center p-8 border border-white/10">
              <img 
                src="/sponsors/sbi.webp" 
                alt="SBI" 
                className="w-full h-full object-contain"
              />
            </div>
            <p 
              className="mt-6 text-[#d97736] text-[18px] md:text-[24px]"
              style={{ fontFamily: "'gangofthree', sans-serif" }}
            >
              SBI Bank
            </p>
          </div>

          {/* Associate Partner */}
          <div className="flex flex-col items-center w-full">
            <h2 
              className="text-[#d97736] text-[20px] md:text-[28px] mb-[30px]"
              style={{ fontFamily: "'gangofthree', sans-serif" }}
            >
              ASSOCIATE TITLE PARTNER
            </h2>
            <div className="w-full max-w-[500px] aspect-[4/3] bg-white rounded-xl shadow-2xl flex items-center justify-center p-12 border border-white/10">
              <img 
                src="/sponsors/icici.webp" 
                alt="ICICI Bank" 
                className="w-full h-full object-contain"
              />
            </div>
            <p 
              className="mt-6 text-[#d97736] text-[18px] md:text-[24px]"
              style={{ fontFamily: "'gangofthree', sans-serif" }}
            >
              ICICI BANK
            </p>
          </div>

        </div>

      </div>

      <Footer />
    </main>
  );
}

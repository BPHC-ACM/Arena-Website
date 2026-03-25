'use client';
import { motion } from 'framer-motion';

export default function ScoreboardPage() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center pt-24 pb-12 overflow-hidden relative">
      
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#ef4444] rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#a3e635] rounded-full mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 
            className="text-[60px] md:text-[100px] lg:text-[130px] font-black uppercase italic tracking-[0.1em] text-[#EE271F] mb-4 drop-shadow-[0_0_25px_rgba(238,39,31,0.5)]"
            style={{ fontFamily: "'Tillburg', 'Impact', sans-serif" }}
          >
            Scoreboard
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <p 
            className="text-[#a3e635] text-[18px] md:text-[24px] uppercase tracking-[0.3em]"
            style={{ fontFamily: "'GangOfThree', sans-serif" }}
          >
            The Battle Hasn't Begun
          </p>
          <div className="w-24 h-1 bg-[#a3e635] mx-auto mt-6 rounded-full shadow-[0_0_10px_rgba(163,230,53,0.8)]"></div>
          
          <p className="mt-8 text-white/50 max-w-lg mx-auto text-sm md:text-base tracking-widest uppercase font-mono">
            Check back here during the fest for live scores, match updates, and tournament standings.
          </p>
        </motion.div>
      </div>

      {/* Decorative Lines */}
      <div className="absolute left-0 bottom-12 w-full h-[1px] bg-gradient-to-r from-transparent via-[#EE271F]/50 to-transparent"></div>
      <div className="absolute left-0 top-32 w-full h-[1px] bg-gradient-to-r from-transparent via-[#a3e635]/50 to-transparent"></div>
    </main>
  );
}

'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { allMembers } from './data';
import TeamMemberCard from '@/components/TeamMemberCard';
import Footer from '@/components/Footer';

const subtitleMap: Record<string, string> = {
  'core': 'Core Council',
  'cossacn': 'The Cossacn of All Departments',
  'sports': 'Sports Senate',
};

export default function TeamPage() {
  const [council, setCouncil] = useState('core');

  const filteredMembers = allMembers.filter(m => m.council === council);
  
  const councils = [
    { id: 'core', label: 'Core Council' },
    { id: 'cossacn', label: 'The Cossacn of All Departments' },
    { id: 'sports', label: 'Sports Senate' }
  ];

  return (
    <main 
      className="min-h-screen flex flex-col bg-black text-white overflow-x-hidden bg-cover bg-top bg-no-repeat bg-fixed"
      style={{ backgroundImage: "url('/team-bg.jpg')", fontFamily: "'tillburg', sans-serif" }}
    >
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes teamMarquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .ticker-inner { animation: teamMarquee 20s linear infinite; display: flex; width: max-content; will-change: transform; -webkit-transform: translateZ(0); }
      `}} />
      
      {/* Ticker */}
      <div className="w-full bg-[#2d4a1e] text-[#86efac] text-[12px] md:text-[14px] tracking-[.1em] overflow-hidden py-1.5 whitespace-nowrap border-b border-[#86efac]/20 shadow-md flex relative z-10" style={{ fontFamily: "'gangofthree', sans-serif" }}>
         <div className="ticker-inner flex items-center">
            {[...Array(15)].map((_, i) => (
              <span key={i} className="pr-4 flex items-center">
                SOUTH INDIA'S LARGEST SPORTS FESTIVAL <span className="mx-2 text-[10px] text-[#A3E635]">●</span>
              </span>
            ))}
         </div>
      </div>

      <div className="px-[20px] md:px-[60px] pt-[10px] md:pt-[20px] pb-[80px] text-center max-w-[1024px] mx-auto w-full flex-grow relative z-10">
        <h1 className="text-[40px] md:text-[52px] font-black uppercase italic tracking-[0.15em] text-white mb-1.5 drop-shadow-lg" style={{ fontFamily: "'tillburg', sans-serif" }}>OUR TEAM</h1>
        <p className="text-[#EE271F] text-[11px] md:text-[13px] tracking-[0.3em] font-bold uppercase mb-[36px]" style={{ fontFamily: "'tillburg', sans-serif" }}>
          {subtitleMap[council]}
        </p>

        {/* Tabs */}
        <div className="flex justify-center flex-wrap gap-3 mb-[48px]">
          {councils.map(c => (
            <button
              key={c.id}
              onClick={() => setCouncil(c.id)}
              className={`text-[11px] font-bold uppercase tracking-[0.15em] px-5 py-2.5 md:px-7 border-2 rounded transition-all duration-300 shadow-md ${
                council === c.id 
                  ? 'bg-[#a3e635] border-[#a3e635] text-black shadow-[#a3e635]/20' 
                  : 'bg-transparent border-[#a3e635]/40 text-white/60 hover:border-[#a3e635] hover:text-[#a3e635]'
              }`}
              style={{ fontFamily: "'tillburg', sans-serif" }}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Grid Area */}
        <div className="w-full flex-grow">
          <AnimatePresence mode="popLayout">
            {council === 'core' ? (
              <motion.div 
                key="core-layout" 
                layout 
                className="w-full flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <GroupSection title="Student Union Council" members={filteredMembers.filter(m => m.group === 'suc')} />
                <GroupSection title="Election Commission" members={filteredMembers.filter(m => m.group === 'ec')} />
                <GroupSection title="Corroboration and Review Committee" members={filteredMembers.filter(m => m.group === 'crc')} />
              </motion.div>
            ) : (
              <motion.div 
                key="other-layout" 
                layout 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[18px] w-full justify-items-center"
              >
                {filteredMembers.map(m => (
                  <TeamMemberCard key={m.id} member={m} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Bottom Color Bar */}
      <div className="flex h-[20px] md:h-10 w-full mt-auto mb-0 border-t border-white/10 shrink-0">
        <div className="flex-1 bg-[#ef4444]" />
        <div className="flex-1 bg-[#a3e635]" />
        <div className="flex-1 bg-[#7E9678]" />
      </div>

      <Footer />
    </main>
  );
}

function GroupSection({ title, members }: { title: string, members: any[] }) {
  if (members.length === 0) return null;
  return (
    <div className="w-full flex flex-col items-center mb-[50px] last:mb-0 relative z-10">
      <p 
        className="text-[#EE271F] text-[13px] tracking-[0.25em] font-bold uppercase text-center w-full mb-[24px]"
        style={{ fontFamily: "'tillburg', sans-serif" }}
      >
        {title}
      </p>
      <div className="flex flex-wrap justify-center gap-[18px] w-full max-w-[880px]">
        {members.map(m => (
          <TeamMemberCard key={m.id} member={m} />
        ))}
      </div>
    </div>
  );
}

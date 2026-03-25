'use client';
import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { TeamMember } from '@/app/team/data';

export default function TeamMemberCard({ member }: { member: TeamMember }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className="flex justify-center h-[270px] w-[170px] sm:h-[300px] sm:w-[190px] [perspective:900px] cursor-pointer group"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div 
        className={`relative h-full w-full [transform-style:preserve-3d] transition-transform duration-500 ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
      >
        {/* Front */}
        <div className="absolute inset-0 rounded-[14px] [backface-visibility:hidden] [-webkit-backface-visibility:hidden] flex flex-col items-center justify-end overflow-hidden border-4 border-[#525252] bg-[#0a0a0a] transition-colors duration-300 group-hover:border-[#a3e635] shadow-lg">
          {member.photo ? (
            <div className="relative w-full flex-1 min-h-0 bg-transparent">
              <Image 
                src={member.photo} 
                alt={member.name}
                fill
                className="object-cover object-top rounded-t-[10px] pointer-events-none"
                sizes="150px"
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full border-2 border-white/10 flex items-center justify-center mb-2 z-10 shrink-0">
              <span className="text-white/20 text-xs">?</span>
            </div>
          )}
          
          <div className="w-full h-[36px] shrink-0 rounded-b-[10px] bg-[#a3e635]/15 transition-colors duration-300 group-hover:bg-[#a3e635]/85 flex items-center justify-center px-1.5 z-10">
            <span className="text-[12px] font-bold uppercase tracking-[.05em] text-white/90 text-center leading-[1.2] group-hover:text-black">
              {member.name}
            </span>
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 rounded-[14px] [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:rotateY(180deg)] bg-[#a3e635] flex flex-col items-center justify-center px-[14px] text-center shadow-lg">
          {member.council === 'sports' ? (
            <p className="text-[9px] tracking-[.12em] uppercase text-black/60 mt-1 font-bold">{member.role}</p>
          ) : (
            <>
              {member.council !== 'core' && (
                <span className="text-[8px] uppercase tracking-[.15em] text-black/50 mb-1">{member.department}</span>
              )}
              <h3 className="text-[14px] font-black uppercase leading-[1.2] text-black">{member.name}</h3>
              <p className="text-[9px] tracking-[.12em] uppercase text-black/60 mt-1 font-bold">{member.role}</p>
            </>
          )}
          
          <button 
            className="mt-4 text-[8px] tracking-[.1em] uppercase border border-black/60 py-1.5 px-3 rounded bg-transparent text-black transition-colors hover:bg-black hover:text-[#a3e635] font-bold"
            onClick={(e) => { e.stopPropagation(); /* Optional profile link */ }}
          >
            View Profile
          </button>
        </div>
      </div>
    </motion.div>
  );
}

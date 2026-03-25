"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";
import { useLenis } from "lenis/react";

interface NavMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const navLinks = [
  { name: "HOME", path: "/" },
  { name: "SCOREBOARD", path: "/scoreboards", color: "text-[#EE271F]" },
  { name: "GALLERY", path: "/gallery" },
  { name: "TEAM", path: "/team" },
  { name: "SPONSORS", path: "/sponsors" },
];

export default function NavMenu({ isOpen, onClose }: NavMenuProps) {
  const lenis = useLenis();

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (lenis) lenis.stop();
    } else {
      document.body.style.overflow = "auto";
      if (lenis) lenis.start();
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "auto";
      if (lenis) lenis.start();
    };
  }, [isOpen, lenis]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black/85"
        >
          {/* Close Background Area */}
          <div className="absolute inset-0 z-0 cursor-pointer" onClick={onClose} />

          {/* Menu Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center justify-center w-full h-full p-8"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-8 left-8 md:top-10 md:left-10 text-[#A3E635] hover:text-[#EE271F] transition-colors duration-300 hover:rotate-90 z-50"
            >
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* Links */}
            <nav className="flex flex-col items-center gap-6 w-full max-w-2xl">
              {navLinks.map((link, idx) => (
                <div key={link.name} className="overflow-hidden">
                  <motion.div
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "100%", opacity: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.1 + idx * 0.05,
                      ease: [0.33, 1, 0.68, 1], // Custom easing for smooth slide up
                    }}
                  >
                    <Link
                      href={link.path}
                      onClick={onClose}
                      className={`group relative block text-5xl md:text-7xl lg:text-8xl ${link.color || "text-white"} uppercase tracking-widest hover:text-[#A3E635] transition-colors duration-300`}
                      style={{ fontFamily: "'Tillburg', 'Impact', sans-serif" }}
                    >
                      {link.name}
                      {/* Hover Decoration */}
                      <span className="absolute -bottom-2 left-0 w-0 h-1 bg-[#EE271F] group-hover:w-full transition-all duration-300 ease-out"></span>
                    </Link>
                  </motion.div>
                </div>
              ))}
            </nav>

            {/* Bottom Graphic / Mascot text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-16 text-[#7E9678] text-sm md:text-base uppercase tracking-widest text-center"
              style={{ fontFamily: "'GangOfThree'" }}
            >
              <span>ARENA&apos;26</span> <span style={{ fontFamily: "Arial, sans-serif" }}>|</span> <span>SHADOWS RISING</span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

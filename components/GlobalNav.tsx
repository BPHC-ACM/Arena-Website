"use client";

import { useState } from "react";
import NavMenu from "./NavMenu";

export default function GlobalNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <button
        className="fixed top-8 left-8 md:top-10 md:left-10 z-[100] transition-transform duration-300 hover:scale-110 active:scale-95"
        onClick={() => setIsMenuOpen(true)}
        aria-label="Toggle Navigation Menu"
      >
        <img
          src="/3bar.png"
          className="w-12 md:w-14 h-auto drop-shadow-[0_0_15px_rgba(163,230,53,0.4)]"
          alt="Navigation Menu"
        />
      </button>

      <NavMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}

import React from 'react';
import Image from 'next/image';

const quickLinks = [
  { label: "SCORE", href: "/scoreboards" },
  { label: "GALLERY", href: "/gallery" },
  { label: "TEAM", href: "/team" },
  { label: "SPONSORS", href: "/sponsors" },
];

const contactItems = [
  { icon: "phone", text: "+91 99459 23134" },
  { icon: "mail", text: "ARENA@HYDERABAD.BITS-PILANI.AC.IN" },
  { icon: "location", text: "BITS PILANI, HYDERABAD CAMPUS" },
];

function getContactHref(icon: string, text: string) {
  if (icon === "phone") {
    return `tel:${text.replace(/\s+/g, "")}`;
  }

  if (icon === "mail") {
    return `mailto:${text}`;
  }

  return null;
}

function ContactText({ text }: { text: string }) {
  return (
    <>
      {Array.from(text).map((char, idx) => {
        if (char === "+" || char === "@" || char === ".") {
          return (
            <span
              key={`${char}-${idx}`}
              style={{ fontFamily: "'Segoe UI Symbol', 'Noto Sans', sans-serif" }}
            >
              {char}
            </span>
          );
        }

        return <React.Fragment key={`${char}-${idx}`}>{char}</React.Fragment>;
      })}
    </>
  );
}

function ContactIcon({ type }: { type: string }) {
  if (type === "phone") {
    return (
      <svg viewBox="0 0 24 24" className="h-3.75 w-3.75 md:h-4.5 md:w-4.5 text-white" fill="currentColor">
        <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57a1.02 1.02 0 0 0-1.02.24l-2.2 2.2a15.045 15.045 0 0 1-6.59-6.59l2.2-2.21a.96.96 0 0 0 .25-1A11.36 11.36 0 0 1 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z" />
      </svg>
    );
  }

  if (type === "mail") {
    return (
      <svg viewBox="0 0 24 24" className="h-3.75 w-3.75 md:h-4.5 md:w-4.5 text-white" fill="currentColor">
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-3.75 w-3.75 md:h-4.5 md:w-4.5 text-white" fill="currentColor">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
  );
}

export default function Footer() {
  const customFont = { fontFamily: "'gangofthree', sans-serif" };

  return (
    <footer className="relative w-full overflow-hidden bg-[#152323] py-9 md:py-12 lg:py-16 px-6 md:px-10 lg:px-16">
      {/* Main Grid Container */}
      <div className="mx-auto grid w-full max-w-350 grid-cols-1 gap-9 md:gap-6 lg:gap-9 md:grid-cols-[1.3fr_1fr_1.6fr] items-stretch relative z-10 pb-16 sm:pb-12 md:pb-0">
        
        {/* Left Column: Logo */}
        <div className="flex justify-center md:justify-start items-center md:items-start md:-mt-8 lg:-mt-12 md:-ml-4 lg:-ml-8">
          <Image
            src="/arena%20logo_%202.png"
            alt="Arena logo"
            width={270}
            height={150}
            className="h-auto w-37.5 sm:w-45 md:w-48.75 lg:w-60 xl:w-67.5 object-contain drop-shadow-2xl"
          />
        </div>

        {/* Middle Column: Links, Socials & Made With */}
        <div className="flex flex-col justify-between items-center md:items-start space-y-9 md:space-y-0">
          <div className="flex flex-col w-full items-center md:items-start">
            <nav className="flex flex-col gap-2">
              {quickLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-[#8c9c81] transition-colors hover:text-[#bacb48]"
                  style={{ ...customFont, fontSize: "clamp(18px, 1.9vw, 26px)", letterSpacing: "0.06em", lineHeight: 1.1 }}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3 mt-4">
              <a href="https://www.instagram.com/arena.bitsh/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex items-center justify-center w-7.5 h-7.5 rounded-full border border-white text-white hover:bg-white/10 transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-4 h-4">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" aria-label="Facebook" className="flex items-center justify-center w-7.5 h-7.5 rounded-full border border-white text-white hover:bg-white/10 transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-[0.86rem] h-[0.86rem]">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Made With Text */}
          <div className="md:mb-2 w-full flex justify-center md:justify-start">
            <p 
              className="text-[#bacb48] uppercase tracking-wide flex items-center whitespace-nowrap"
              style={{ ...customFont, fontSize: "clamp(12px, 1.35vw, 17px)", letterSpacing: "0.04em" }}
            >
              MADE WITH 
              <span
                className="text-[#d82d27] px-2 text-[1.125rem] relative -top-0.5"
                style={{ fontFamily: "'Segoe UI Symbol', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif" }}
              >
                ♥
              </span>{" "}
              BY DOTA AND ACM
            </p>
          </div>
        </div>

        {/* Right Column: Contact */}
        <div className="flex flex-col gap-4 text-center md:text-left md:pl-2 pt-2">
          {contactItems.map((item) => {
            const href = getContactHref(item.icon, item.text);
            const isInteractive = Boolean(href);

            const content = (
              <>
                <span className="text-white flex items-center justify-center w-6 shrink-0">
                  <ContactIcon type={item.icon} />
                </span>
                <span
                  className="text-[#8c9c81]"
                  style={{ ...customFont, fontSize: "clamp(15px, 1.65vw, 21px)", letterSpacing: "0.04em", lineHeight: 1.15 }}
                >
                  <ContactText text={item.text} />
                </span>
              </>
            );

            if (isInteractive && href) {
              return (
                <a
                  key={item.text}
                  href={href}
                  className="group flex items-center justify-center md:justify-start gap-3 rounded-sm transition-colors hover:text-[#bacb48] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bacb48]/70"
                  aria-label={item.icon === "phone" ? `Call ${item.text}` : `Email ${item.text}`}
                >
                  {content}
                </a>
              );
            }

            return (
              <div key={item.text} className="flex items-center justify-center md:justify-start gap-3">
                {content}
              </div>
            );
          })}
        </div>

      </div>

      {/* Bottom Right Graphics */}
      <div className="absolute bottom-0 right-0 h-45 md:h-56.25 lg:h-67.5
    w-41.25 md:w-52.5 lg:w-63.75 pointer-events-none z-0">
        
        {/* CSS Polygon Fallback */}
        <div
          className="absolute inset-0 bg-[#bacb48]"
          style={{ clipPath: "polygon(10% 60%, 100% 35%, 100% 100%, 0% 100%)" }}
        />

        <div className="absolute bottom-3 right-0 md:bottom-5 md:right-4 lg:right-2 flex items-end gap-2 md:gap-3 lg:gap-4">
          <Image
            src="/white%20var%201.png"
            alt="Department of Technical Arts logo"
            width={98}
            height={98}
            className="h-auto w-16.5 md:w-21 lg:w-24.75 object-contain -translate-y-1 md:-translate-y-2"
          />
          <Image
            src="/acm-logo.png"
            alt="BITS ACM logo"
            width={120}
            height={120}
            className="h-auto w-17.25 md:w-22 lg:w-26.25 object-contain"
          />
        </div>
      </div>
    </footer>
  );
}
import Image from 'next/image';

const stats = [
  {
    number: "21,000",
    label: "FOOTFALL",
    iconSrc: "/svg/Shoes.svg",
    iconAlt: "Footfall",
  },
  {
    number: "6,000",
    label: "PARTICIPATION",
    iconSrc: "/svg/Customer.svg",
    iconAlt: "Participation",
  },
  {
    number: "20",
    label: "SPORTS",
    iconSrc: "/svg/Badminton%20Player.svg",
    iconAlt: "Sports",
  }
];

export default function TurtleBg() {
  const brochureUrl = "https://drive.google.com/file/d/1KNL0LU_aw9EjICN03_Qu5Vg_ZnJkvy1W/view?usp=sharing";

  const glassCardStyle = {
    backgroundColor: "rgba(184, 196, 72, 0.16)",
    backdropFilter: "blur(4px)",
    WebkitBackdropFilter: "blur(4px)",
    borderRadius: "20px",
    border: "1px solid rgba(225, 238, 169, 0.34)",
  } as const;

  return (
    <div className="relative w-full h-screen min-h-[620px] md:min-h-[700px] overflow-hidden bg-black flex items-center justify-center">
      {/* Background */}
      <Image
        src="/turtles-bg.png"
        alt="Turtles Background"
        fill
        className="object-cover opacity-90 scale-[0.77]"
        quality={100}
      />

      {/* Top and bottom smooth black fades */}
      <div className="absolute inset-x-0 top-0 h-[20vh] bg-gradient-to-b from-black via-black/85 to-transparent z-[1] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-[20vh] bg-gradient-to-t from-black via-black/85 to-transparent z-[1] pointer-events-none" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.75)_85%)]" />

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-9 sm:gap-12 md:gap-[108px] lg:gap-36 px-4 sm:px-6 md:px-8 w-full max-w-6xl motion-safe:animate-[arenaDrift_8s_ease-in-out_infinite]">
        {/* LEFT: STAT CARDS */}
        <div className="flex flex-col gap-6 sm:gap-8 md:gap-10 w-full md:w-auto max-w-[420px] md:max-w-none">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="group flex items-center justify-between w-full md:w-[395px] md:h-[147px] px-5 sm:px-6 md:px-8 py-4 sm:py-5 md:py-0 hover:bg-[#B8C448]/24 shadow-[0_14px_34px_rgba(0,0,0,0.42),0_4px_12px_rgba(0,0,0,0.26),inset_0_1px_0_rgba(255,255,255,0.14)] hover:shadow-[0_20px_38px_rgba(0,0,0,0.55),0_8px_20px_rgba(0,0,0,0.36),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-500 ease-out transform-gpu hover:-translate-y-2 hover:scale-[1.02] hover:-rotate-[0.35deg]"
              style={glassCardStyle}
            >
              <div
                className="flex flex-col text-left"
                style={{ fontFamily: "'gangofthree', sans-serif" }}
              >
                <span className="text-xl sm:text-2xl md:text-3xl font-bold text-[#F5F7EA] tracking-widest leading-none mb-2">
                  {stat.number}
                  <span
                    className="ml-1 inline-block"
                    style={{ fontFamily: "'Segoe UI Symbol', 'Noto Sans', sans-serif" }}
                  >
                    +
                  </span>
                </span>
                <span className="text-base sm:text-lg md:text-xl font-semibold text-[#EEF2D9] tracking-widest uppercase leading-none">
                  {stat.label}
                </span>
              </div>

              <Image
                src={stat.iconSrc}
                alt={stat.iconAlt}
                width={44}
                height={44}
                className="ml-4 h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 opacity-95 transition-transform duration-500 ease-out motion-safe:animate-[iconDrift_3.2s_ease-in-out_infinite] group-hover:scale-110 group-hover:translate-x-1"
              />
            </div>
          ))}
        </div>

        {/* RIGHT: BUTTON */}
        <div className="w-full md:w-auto flex h-full items-center md:ml-4 max-w-[420px] md:max-w-none">
          <a
            href={brochureUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between w-full md:w-[395px] md:h-[147px] px-5 sm:px-6 md:px-8 py-4 sm:py-5 md:py-0 cursor-pointer hover:bg-[#B8C448]/24 shadow-[0_14px_34px_rgba(0,0,0,0.42),0_4px_12px_rgba(0,0,0,0.26),inset_0_1px_0_rgba(255,255,255,0.14)] hover:shadow-[0_20px_38px_rgba(0,0,0,0.55),0_8px_20px_rgba(0,0,0,0.36),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-500 ease-out transform-gpu hover:-translate-y-2 hover:scale-[1.02] hover:rotate-[0.35deg]"
            style={glassCardStyle}
          >
            <div
              className="flex flex-col text-left"
              style={{ fontFamily: "'gangofthree', sans-serif" }}
            >
              <span className="text-xl sm:text-2xl md:text-3xl font-bold text-[#F5F7EA] tracking-widest leading-none mb-2">
                DOWNLOAD
              </span>
              <span className="text-xl sm:text-2xl md:text-3xl font-bold text-[#F5F7EA] tracking-widest uppercase leading-none">
                BROCHURE
              </span>
            </div>

            <Image
              src="/svg/Downloading%20Updates.svg"
              alt="Download brochure"
              width={44}
              height={44}
              className="ml-4 h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 opacity-95 transition-transform duration-500 ease-out motion-safe:animate-[iconDrift_3.2s_ease-in-out_infinite] group-hover:scale-110 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </a>
        </div>

      </div>

      <style jsx global>{`
        @keyframes arenaDrift {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        @keyframes iconDrift {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-3px);
          }
        }
      `}</style>
    </div>
  );
}
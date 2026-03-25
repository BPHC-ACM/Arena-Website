"use client";

const marqueeVector = '/sports-vectors/sports-vector.svg'
const OVERLAP_PX = 50 

const bannerSports = ['TENNIS', 'BADMINTON', 'POOL', 'FOOTBALL', 'VOLLEYBALL', 'SWIMMING', 'HOCKEY', 'BASKETBALL', 'FRISBEE']
const bannerRepeats = 14
const sportsAccentRed = '#d11916'

const BannerLine = ({ reverse = false }: { reverse?: boolean }) => (
  <p
    className="m-0 flex w-max items-center whitespace-nowrap px-0 py-[0.12rem] text-[clamp(0.82rem,1.2vw,1.05rem)] leading-none font-normal uppercase tracking-[0.03em] [text-rendering:geometricPrecision] max-[600px]:pb-[0.08rem] max-[600px]:text-[clamp(0.72rem,2.4vw,0.92rem)]"
    style={{
      color: sportsAccentRed,
      fontFamily: "'gangofthree', Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
      animation: reverse ? 'sports-marquee-reverse 60s linear infinite' : 'sports-marquee 60s linear infinite',
      WebkitTransform: 'translate3d(0, 0, 0)', 
    }}
  >
    {Array.from({ length: bannerRepeats }).map((_, repeatIdx) => (
      <span key={`banner-repeat-${repeatIdx}`} className="inline-flex items-center">
        {bannerSports.map((sport, sportIdx) => (
          <span key={`banner-item-${repeatIdx}-${sport}-${sportIdx}`} className="inline-flex items-center">
            <span>{sport}</span>
            <span
              aria-hidden="true"
              className="mx-[0.22em]"
              style={{ fontFamily: "'Segoe UI Symbol', 'Noto Sans', sans-serif" }}
            >
              -
            </span>
          </span>
        ))}
      </span>
    ))}
  </p>
)

export const SportsSection = () => {
  const repeatingImages = Array.from({ length: 8 });

  return (
    <>
      <style>{`
        @keyframes sports-marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes sports-marquee-reverse {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        @keyframes sports-vector-marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
      `}</style>
      <section className="grid h-[740px] w-full select-none overflow-hidden bg-black grid-rows-[auto_1fr_auto] max-[900px]:h-[600px] max-[600px]:h-[500px]">
        <div className="overflow-hidden bg-[#B8C448] py-1">
          <BannerLine />
        </div>

        <div className="relative flex items-center justify-center overflow-hidden bg-black">
          
          {/* Marquee Container */}
          <div 
            className="pointer-events-none absolute flex h-full items-center will-change-transform"
            style={{ 
              animation: 'sports-vector-marquee 60s linear infinite',
              width: 'max-content' 
            }}
          >
            {repeatingImages.map((_, i) => (
              <img
                key={`img-vector-${i}`}
                className="h-[85%] w-auto max-w-none shrink-0 filter-[brightness(1.04)]"
                style={{ marginRight: `-${OVERLAP_PX}px` }}
                src={marqueeVector}
                alt="sports vector marquee"
                draggable={false}
                loading={i < 3 ? "eager" : "lazy"}
                aria-hidden="true"
              />
            ))}
          </div>

          {/* Central Label */}
          <div
            className="relative z-20 flex h-[120px] w-[300px] items-center justify-center rounded-2xl backdrop-blur-sm max-[900px]:h-[100px] max-[900px]:w-[280px] max-[600px]:h-[80px] max-[600px]:w-[240px]"
            style={{ backgroundColor: 'rgba(209, 25, 22, 0.4)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
            aria-hidden="true"
          >
            <span
              className="block translate-y-[0.04em] text-[4rem] leading-none tracking-[0.015em] text-[#f4f0df] max-[900px]:text-[3.2rem] max-[600px]:text-[2.5rem]"
              style={{ fontFamily: "'tillburg', Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif" }}
            >
              SPORTS
            </span>
          </div>
        </div>

        <div className="overflow-hidden bg-[#B8C448] py-1">
          <BannerLine reverse />
        </div>
      </section>
    </>
  )
}
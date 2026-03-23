"use client";

const marqueeVector = '/sports-vectors/sports-vector.svg'

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
  return (
    <>
      <style jsx global>{`
        @keyframes sports-marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes sports-marquee-reverse {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        @keyframes sports-vector-marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-170vw + var(--sports-vector-overlap)));
          }
        }
      `}</style>

      <section
        className="grid h-[740px] w-full select-none overflow-hidden bg-black grid-rows-[22px_1fr_22px] min-[1280px]:[--sports-layout-scale:1.46] min-[1280px]:[--sports-track-pad-top:154px] min-[1280px]:[--sports-track-pad-bottom:84px] min-[1600px]:[--sports-layout-scale:1.56] min-[1600px]:[--sports-track-pad-top:180px] min-[1600px]:[--sports-track-pad-bottom:100px] max-[900px]:h-[600px] max-[900px]:grid-rows-[20px_1fr_20px] max-[900px]:[--sports-layout-scale:1.14] max-[900px]:[--sports-track-pad-top:95px] max-[900px]:[--sports-track-pad-bottom:55px] max-[600px]:h-[460px] max-[600px]:grid-rows-[18px_1fr_18px] max-[600px]:[--sports-layout-scale:0.87] max-[600px]:[--sports-track-pad-top:66px] max-[600px]:[--sports-track-pad-bottom:36px]"
        style={{
          ['--sports-layout-scale' as string]: '1.3',
          ['--sports-track-pad-top' as string]: '130px',
          ['--sports-track-pad-bottom' as string]: '70px',
          ['--sports-vector-overlap' as string]: '50px',
        }}
      >
      <div className="overflow-hidden bg-[#B8C448]">
        <BannerLine />
      </div>

      <div className="relative box-border flex h-[696px] items-center overflow-hidden bg-[linear-gradient(180deg,#050505_0%,#000_50%,#050505_100%)] pt-[var(--sports-track-pad-top)] pb-[var(--sports-track-pad-bottom)] max-[900px]:h-[560px] max-[600px]:h-[424px]">

        <div className="pointer-events-none absolute top-1/2 left-0 w-full -translate-y-1/2">
          <div className="flex w-max" style={{ animation: 'sports-vector-marquee 45s linear infinite' }}>
            <img
              className="h-[calc(382.5px*var(--sports-layout-scale))] w-[170vw] shrink-0 select-none object-cover object-center filter-[brightness(1.04)]"
              src={marqueeVector}
              alt="sports vector marquee"
              draggable={false}
              aria-hidden="true"
            />
            <img
              className="h-[calc(382.5px*var(--sports-layout-scale))] w-[170vw] shrink-0 select-none object-cover object-center filter-[brightness(1.04)] ml-[calc(var(--sports-vector-overlap)*-1)]"
              src={marqueeVector}
              alt="sports vector marquee"
              draggable={false}
              aria-hidden="true"
            />
            <img
              className="h-[calc(382.5px*var(--sports-layout-scale))] w-[170vw] shrink-0 select-none object-cover object-center filter-[brightness(1.04)] ml-[calc(var(--sports-vector-overlap)*-1)]"
              src={marqueeVector}
              alt="sports vector marquee"
              draggable={false}
              aria-hidden="true"
            />
          </div>
        </div>

        <div
          className="pointer-events-none absolute top-1/2 left-1/2 z-20 flex h-[clamp(108px,10.5vw,162px)] w-[clamp(328.32px,31.68vw,489.6px)] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl shadow-[0_16px_44px_rgba(0,0,0,0.58)] backdrop-blur-[1px] max-[900px]:h-[clamp(96px,13.5vw,138px)] max-[900px]:w-[clamp(288px,44.64vw,396.48px)] max-[600px]:h-[clamp(72px,19.5vw,114px)] max-[600px]:w-[clamp(216px,67.68vw,316.8px)]"
          style={{ backgroundColor: 'rgba(209, 25, 22, 0.4)' }}
          aria-hidden="true"
        >
          <span
            className="block translate-y-[0.04em] text-[clamp(4.03rem,7.67vw,7.41rem)] leading-[0.9] uppercase tracking-[0.015em] text-[#f4f0df] max-[900px]:text-[clamp(3.38rem,9.62vw,5.72rem)] max-[600px]:text-[clamp(2.47rem,11.96vw,4.03rem)]"
            style={{ fontFamily: "'tillburg', Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif" }}
          >
            SPORTS
          </span>
        </div>

      </div>

      <div className="overflow-hidden bg-[#B8C448]">
        <BannerLine reverse />
      </div>
      </section>
    </>
  )
}
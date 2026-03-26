import type { SkatingMatch } from '@/app/lib/types';
import { cn } from '@/app/lib/utils';

export function SkatingCard({ match }: { match: SkatingMatch }) {
  const {
    athlete1,
    athlete2,
    time1,
    time2,
    distance,
    eventType,
    scoreAthlete1,
    scoreAthlete2,
    status,
  } = match;

  const isSpeed = eventType === 'speed';

  const rows = [
    { name: athlete1, time: time1, score: scoreAthlete1 },
    { name: athlete2, time: time2, score: scoreAthlete2 },
  ];

  return (
    <div className='space-y-3'>
      <div className='rounded-lg bg-[#0d0d0d] overflow-hidden'>
        <div className='flex items-center gap-2 px-3 pt-2 pb-1'>
          {eventType && (
            <span className='text-[10px] text-[#444] uppercase tracking-wider'>
              {eventType} Skating
            </span>
          )}
          {distance && (
            <>
              {eventType && <span className='text-[10px] text-[#444]'>·</span>}
              <span className='text-[10px] text-[#444] uppercase tracking-wider'>
                {distance}
              </span>
            </>
          )}
        </div>

        {rows.map((a, i) => (
          <div
            key={i}
            className='flex items-center gap-3 px-3 py-3 border-t border-[#181818]'
          >
            <div className='flex items-center gap-1.5 flex-1 min-w-0'>
              <span
                className={cn(
                  'font-semibold text-sm truncate',
                  i === 0 ? 'text-white' : 'text-[#aaa]',
                )}
              >
                {a.name}
              </span>
            </div>
            <div className='flex items-center gap-4'>
              {isSpeed ? (
                <span className='font-mono text-2xl font-extrabold text-white'>
                  {a.time || '--:--'}
                </span>
              ) : (
                <div className='text-right'>
                  <div className='text-xs text-[#666]'>Score</div>
                  <span className='font-mono text-2xl font-extrabold text-white'>
                    {a.score?.toFixed(2) || '0.00'}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {status && (
        <div className='flex justify-center'>
          <p className='text-[10px] uppercase font-bold tracking-[0.2em] text-[#CCC] py-1 px-3 rounded-full border border-[#181818] bg-[#080808]'>
            {status}
          </p>
        </div>
      )}
    </div>
  );
}

import type { KhoKhoMatch } from '@/app/lib/types';
import { cn } from '@/app/lib/utils';

export function KhoKhoCard({ match }: { match: KhoKhoMatch }) {
  const {
    teamA,
    teamB,
    scoreA,
    scoreB,
    currentInning,
    chasingTeam,
    defendersRemaining,
    timeRemaining,
    inning1ScoreA,
    inning2ScoreA,
    inning1ScoreB,
    inning2ScoreB,
    status,
  } = match;

  const rows = [
    {
      name: teamA,
      score: scoreA,
      innings: [inning1ScoreA ?? 0, inning2ScoreA ?? 0],
      isChasing: chasingTeam === 'A',
    },
    {
      name: teamB,
      score: scoreB,
      innings: [inning1ScoreB ?? 0, inning2ScoreB ?? 0],
      isChasing: chasingTeam === 'B',
    },
  ];

  return (
    <div className='space-y-3'>
      <div className='rounded-lg bg-[#0d0d0d] overflow-hidden'>
        <div className='flex items-center gap-2 px-3 pt-2 pb-1'>
          <span className='text-[10px] text-[#444] uppercase tracking-wider'>
            Inning {currentInning}
          </span>
          <span className='text-[10px] text-[#444]'>·</span>
          <span className='text-[10px] text-[#444] uppercase tracking-wider'>
            {timeRemaining}
          </span>
          {defendersRemaining !== undefined && (
            <>
              <span className='text-[10px] text-[#444]'>·</span>
              <span className='text-[10px] text-[#57a639] uppercase tracking-wider'>
                {defendersRemaining} Defenders
              </span>
            </>
          )}
        </div>

        {rows.map((t, i) => (
          <div
            key={i}
            className='flex items-center gap-3 px-3 py-3 border-t border-[#181818]'
          >
            <div className='flex-1 min-w-0'>
              <span
                className={cn(
                  'font-semibold text-sm truncate block',
                  i === 0 ? 'text-white' : 'text-[#aaa]',
                )}
              >
                {t.name}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              {t.innings.map((s, j) => (
                <span
                  key={j}
                  className={cn(
                    'font-mono text-base min-w-[20px] text-center',
                    j === currentInning - 1
                      ? 'text-white font-bold'
                      : 'text-[#333]',
                  )}
                >
                  {s}
                </span>
              ))}
              <span className='font-mono text-3xl font-extrabold text-white ml-2 min-w-[40px] text-right'>
                {t.score}
              </span>
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

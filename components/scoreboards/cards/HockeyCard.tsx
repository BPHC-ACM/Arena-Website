import type { HockeyMatch } from '@/app/lib/types';
import { cn } from '@/app/lib/utils';

export function HockeyCard({ match }: { match: HockeyMatch }) {
  const {
    teamA,
    teamB,
    scoreA,
    scoreB,
    currentPeriod,
    matchTime,
    periodScoresA,
    periodScoresB,
    penaltiesA,
    penaltiesB,
    status,
  } = match;

  const isFinished =
    status &&
    [
      'won',
      'complete',
      'match over',
      'ended',
      'finished',
      'full time',
      'tied',
      'draw',
    ].some((w) => status.toLowerCase().includes(w));
  const aWins = isFinished && scoreA > scoreB;
  const bWins = isFinished && scoreB > scoreA;
  const tied = isFinished && scoreA === scoreB;
  const winnerName = aWins ? teamA : bWins ? teamB : null;
  const statusLabel = isFinished
    ? tied
      ? 'Match tied'
      : winnerName
        ? `${winnerName} wins`
        : status
    : status;

  const rows = [
    {
      name: teamA,
      score: scoreA,
      periods: periodScoresA,
      penalties: penaltiesA,
      dimmed: !!bWins,
    },
    {
      name: teamB,
      score: scoreB,
      periods: periodScoresB,
      penalties: penaltiesB,
      dimmed: !!aWins,
    },
  ];

  return (
    <div className='space-y-3'>
      <div className='rounded-lg bg-[#0d0d0d] overflow-hidden'>
        <div className='flex items-center gap-2 px-3 pt-2 pb-1'>
          <span className='text-[10px] text-[#444] uppercase tracking-wider'>
            Period {currentPeriod}
          </span>
          <span className='text-[10px] text-[#444]'>·</span>
          <span className='text-[10px] text-[#444] uppercase tracking-wider'>
            {matchTime}
          </span>
        </div>

        {rows.map((t, i) => (
          <div
            key={i}
            className='flex items-center gap-3 px-3 py-3 border-t border-[#181818]'
          >
            <div className='flex items-center gap-1.5 flex-1 min-w-0'>
              <span
                className={cn(
                  'font-semibold text-sm truncate',
                  t.dimmed ? 'text-[#555]' : 'text-white',
                )}
              >
                {t.name}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              {t.periods?.map((s, j) => (
                <span
                  key={j}
                  className={cn(
                    'font-mono text-base min-w-[20px] text-center',
                    j === currentPeriod - 1
                      ? 'text-white font-bold'
                      : 'text-[#333]',
                  )}
                >
                  {s}
                </span>
              ))}
              {t.penalties !== undefined && t.penalties > 0 && (
                <span className='text-xs text-[#f87171] font-mono px-1'>
                  P{t.penalties}
                </span>
              )}
              <span
                className={cn(
                  'font-mono text-3xl font-extrabold ml-2 min-w-[40px] text-right',
                  t.dimmed ? 'text-[#555]' : 'text-white',
                )}
              >
                {t.score}
              </span>
            </div>
          </div>
        ))}
      </div>
      {statusLabel && (
        <div className='flex justify-center'>
          <p className='text-[10px] uppercase font-bold tracking-[0.2em] text-[#CCC] py-1 px-3 rounded-full border border-[#181818] bg-[#080808]'>
            {statusLabel}
          </p>
        </div>
      )}
    </div>
  );
}

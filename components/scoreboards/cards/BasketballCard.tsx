import type { BasketballMatch } from '@/app/lib/types';
import { cn } from '@/app/lib/utils';

export function BasketballCard({ match }: { match: BasketballMatch }) {
  const {
    teamA,
    teamB,
    scoreA,
    scoreB,
    currentQuarter,
    gameClock,
    shotClock,
    quarterScoresA,
    quarterScoresB,
    foulsA,
    foulsB,
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

  return (
    <div className='space-y-4'>
      {/* Teams + Score */}
      <div className='grid grid-cols-[1fr_auto_1fr] gap-2 items-center'>
        <div>
          <p
            className={cn(
              'text-base md:text-lg font-bold',
              bWins ? 'text-[#555]' : 'text-white',
            )}
          >
            {teamA}
          </p>
          <p
            className={cn(
              'font-mono text-4xl md:text-5xl font-extrabold mt-1',
              bWins ? 'text-[#555]' : 'text-white',
            )}
          >
            {scoreA}
          </p>
          {foulsA != null && (
            <p className='text-xs text-[#555] mt-1'>Fouls: {foulsA}</p>
          )}
        </div>
        <div className='text-center px-2'>
          <p className='font-mono text-xl font-bold text-white'>{gameClock}</p>
          <p className='text-[11px] text-[#555] mt-0.5'>Q{currentQuarter}</p>
          {shotClock != null && (
            <p className='font-mono text-sm text-[#888] mt-1'>{shotClock}s</p>
          )}
        </div>
        <div className='text-right'>
          <p
            className={cn(
              'text-base md:text-lg font-bold',
              aWins ? 'text-[#555]' : 'text-white',
            )}
          >
            {teamB}
          </p>
          <p
            className={cn(
              'font-mono text-4xl md:text-5xl font-extrabold mt-1',
              aWins ? 'text-[#555]' : 'text-white',
            )}
          >
            {scoreB}
          </p>
          {foulsB != null && (
            <p className='text-xs text-[#555] mt-1'>Fouls: {foulsB}</p>
          )}
        </div>
      </div>

      {/* Quarter scores */}
      {quarterScoresA && quarterScoresA.length > 0 && (
        <div className='rounded-lg bg-[#0d0d0d] p-3'>
          <p className='text-[10px] text-[#555] uppercase tracking-wider mb-2'>
            Quarter Scores
          </p>
          <div className='grid grid-cols-5 gap-1 text-center text-xs'>
            <div className='text-[#444]' />
            {quarterScoresA.map((_, i) => (
              <div
                key={i}
                className={cn(
                  'text-[10px] font-medium',
                  i === currentQuarter - 1 ? 'text-[#aaa]' : 'text-[#555]',
                )}
              >
                Q{i + 1}
              </div>
            ))}
          </div>
          <div className='grid grid-cols-5 gap-1 text-center mt-1'>
            <div className='text-xs text-[#666] text-left'>{teamA}</div>
            {quarterScoresA.map((s, i) => (
              <div
                key={i}
                className={cn(
                  'font-mono text-sm font-bold',
                  i === currentQuarter - 1 ? 'text-white' : 'text-[#555]',
                )}
              >
                {s}
              </div>
            ))}
          </div>
          <div className='grid grid-cols-5 gap-1 text-center mt-0.5'>
            <div className='text-xs text-[#666] text-left'>{teamB}</div>
            {quarterScoresB.map((s, i) => (
              <div
                key={i}
                className={cn(
                  'font-mono text-sm font-bold',
                  i === currentQuarter - 1 ? 'text-[#aaa]' : 'text-[#555]',
                )}
              >
                {s}
              </div>
            ))}
          </div>
        </div>
      )}

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

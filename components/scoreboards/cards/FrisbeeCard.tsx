import type { FrisbeeMatch } from '@/app/lib/types';
import { cn } from '@/app/lib/utils';

export function FrisbeeCard({ match }: { match: FrisbeeMatch }) {
  const {
    teamA,
    teamB,
    scoreA,
    scoreB,
    timeRemaining,
    pointCap,
    possession,
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
          {possession === teamA && (
            <p className='text-xs mt-1 text-[#14b8a6]'>◆ Possession</p>
          )}
        </div>
        <div className='text-center px-2'>
          <p className='font-mono text-lg font-bold text-white'>
            {timeRemaining}
          </p>
          <p className='text-[10px] text-[#555] mt-0.5'>Cap {pointCap}</p>
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
          {possession === teamB && (
            <p className='text-xs mt-1 text-[#14b8a6]'>◆ Possession</p>
          )}
        </div>
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

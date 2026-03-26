import type { KabaddiMatch } from '@/app/lib/types';
import { cn } from '@/app/lib/utils';

export function KabaddiCard({ match }: { match: KabaddiMatch }) {
  const {
    teamA,
    teamB,
    scoreA,
    scoreB,
    raidTimer,
    raidingTeam,
    bonusActive,
    superRaidActive,
    half,
    timeRemaining,
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
        </div>
        <div className='text-center px-2'>
          <p className='font-mono text-lg font-bold text-white'>{raidTimer}s</p>
          <p className='text-[10px] text-[#555]'>Raid</p>
          {timeRemaining && (
            <p className='font-mono text-xs text-[#555] mt-1'>
              {timeRemaining}
            </p>
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
        </div>
      </div>

      {/* Raid info */}
      {(raidingTeam || bonusActive || superRaidActive || half) && (
        <div className='flex flex-wrap gap-2'>
          {raidingTeam && (
            <span className='text-xs text-[#555] bg-[#0d0d0d] border border-[#1e1e1e] rounded-full px-2.5 py-0.5'>
              Raiding: <span className='text-[#aaa]'>{raidingTeam}</span>
            </span>
          )}
          {half && (
            <span className='text-xs text-[#555] bg-[#0d0d0d] border border-[#1e1e1e] rounded-full px-2.5 py-0.5'>
              {half === 1 ? '1st Half' : '2nd Half'}
            </span>
          )}
          {bonusActive && (
            <span className='text-xs text-[#f97316] bg-[#1a0f05] border border-[#f9731630] rounded-full px-2.5 py-0.5'>
              Bonus Active
            </span>
          )}
          {superRaidActive && (
            <span className='text-xs text-[#ef4444] bg-[#1a0505] border border-[#ef444430] rounded-full px-2.5 py-0.5'>
              Super Raid
            </span>
          )}
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

import type { FootballMatch, FootballEvent } from '@/app/lib/types';
import { cn } from '@/app/lib/utils';

function EventBadge({ event }: { event: FootballEvent }) {
  const icon =
    event.type === 'goal'
      ? '⚽'
      : event.type === 'own_goal'
        ? '⚽ OG'
        : event.type === 'yellow'
          ? '🟨'
          : event.type === 'red'
            ? '🟥'
            : '↕';
  return (
    <span className={cn('text-[11px] text-[#666]')}>
      {event.minute}&apos; {icon} {event.playerName}
      {event.assistName ? ` (${event.assistName})` : ''}
    </span>
  );
}

export function FootballCard({ match }: { match: FootballMatch }) {
  const {
    teamA,
    teamB,
    scoreA,
    scoreB,
    matchTime,
    half,
    events = [],
    yellowCardsA,
    yellowCardsB,
    status,
  } = match;

  const goals = events.filter(
    (e) => e.type === 'goal' || e.type === 'own_goal',
  );

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
          {yellowCardsA != null && yellowCardsA > 0 && (
            <p className='text-xs text-[#555] mt-1'>🟨 ×{yellowCardsA}</p>
          )}
        </div>
        <div className='text-center px-2'>
          <p className='font-mono text-xl font-bold text-white'>
            {matchTime}&apos;
          </p>
          <p className='text-[11px] text-[#555] mt-0.5'>
            {half === 1 ? '1st Half' : '2nd Half'}
          </p>
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
          {yellowCardsB != null && yellowCardsB > 0 && (
            <p className='text-xs text-[#555] mt-1'>🟨 ×{yellowCardsB}</p>
          )}
        </div>
      </div>

      {/* Goal scorers */}
      {goals.length > 0 && (
        <div className='rounded-lg bg-[#0d0d0d] p-3'>
          <p className='text-[10px] text-[#555] uppercase tracking-wider mb-2'>
            Goals
          </p>
          <div className='flex flex-col gap-1'>
            {goals.map((e, i) => (
              <EventBadge key={i} event={e} />
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

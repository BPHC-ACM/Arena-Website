import type { VolleyballMatch } from '@/app/lib/types';
import { cn } from '@/app/lib/utils';

export function VolleyballCard({ match }: { match: VolleyballMatch }) {
  const {
    teamA,
    teamB,
    setsTeamA,
    setsTeamB,
    currentSet,
    currentPointsTeamA,
    currentPointsTeamB,
    setWinsA,
    setWinsB,
    bestOf,
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
  const aWins = isFinished && setWinsA > setWinsB;
  const bWins = isFinished && setWinsB > setWinsA;
  const tied = isFinished && setWinsA === setWinsB;
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
      {/* Teams + set wins */}
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
            {currentPointsTeamA}
          </p>
          <p
            className={cn(
              'text-xs mt-1 font-mono',
              bWins ? 'text-[#444]' : 'text-[#555]',
            )}
          >
            {setWinsA} sets
          </p>
        </div>
        <div className='text-center px-2'>
          <p className='font-mono text-sm font-bold text-[#555]'>
            Set {currentSet}
          </p>
          {bestOf && (
            <p className='text-[10px] text-[#444]'>Best of {bestOf}</p>
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
            {currentPointsTeamB}
          </p>
          <p
            className={cn(
              'text-xs mt-1 font-mono',
              aWins ? 'text-[#444]' : 'text-[#555]',
            )}
          >
            {setWinsB} sets
          </p>
        </div>
      </div>

      {/* Set history */}
      {setsTeamA && setsTeamA.length > 0 && (
        <div className='rounded-lg bg-[#0d0d0d] p-3'>
          <p className='text-[10px] text-[#555] uppercase tracking-wider mb-2'>
            Set History
          </p>
          <div className='flex gap-3'>
            {setsTeamA.map((s, i) => (
              <div
                key={i}
                className={cn(
                  'text-center',
                  i === currentSet - 1 ? 'opacity-100' : 'opacity-40',
                )}
              >
                <p className='text-[10px] text-[#555]'>S{i + 1}</p>
                <p className='font-mono text-sm font-bold text-white'>{s}</p>
                <p className='font-mono text-sm text-[#888]'>{setsTeamB[i]}</p>
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

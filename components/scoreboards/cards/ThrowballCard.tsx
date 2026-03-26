import type { ThrowballMatch } from '@/app/lib/types';
import { cn } from '@/app/lib/utils';

const FINISHED = [
  'won',
  'complete',
  'match over',
  'ended',
  'finished',
  'full time',
  'tied',
  'draw',
];
const isFinished = (s?: string) =>
  !!s && FINISHED.some((w) => s.toLowerCase().includes(w));

export function ThrowballCard({ match }: { match: ThrowballMatch }) {
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

  const finished = isFinished(status);
  const aWins = finished && setWinsA > setWinsB;
  const bWins = finished && setWinsB > setWinsA;
  const tied = finished && setWinsA === setWinsB;

  const winnerName = aWins ? teamA : bWins ? teamB : null;
  const statusLabel = finished
    ? tied
      ? 'Match tied'
      : winnerName
        ? `${winnerName} wins`
        : status
    : status;

  const rows = [
    {
      name: teamA,
      sets: setsTeamA,
      cur: currentPointsTeamA,
      setWins: setWinsA,
      dimmed: !!bWins,
    },
    {
      name: teamB,
      sets: setsTeamB,
      cur: currentPointsTeamB,
      setWins: setWinsB,
      dimmed: !!aWins,
    },
  ];

  return (
    <div className='space-y-3'>
      <div className='rounded-lg bg-[#0d0d0d] overflow-hidden'>
        <div className='flex items-center gap-2 px-3 pt-2 pb-1'>
          <span className='text-[10px] text-[#444] uppercase tracking-wider'>
            Best of {bestOf ?? 3}
          </span>
          <span className='text-[10px] text-[#444]'>·</span>
          <span className='text-[10px] text-[#444] uppercase tracking-wider'>
            Set {currentSet}
          </span>
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
                  t.dimmed ? 'text-[#555]' : 'text-white',
                )}
              >
                {t.name}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              {t.sets?.map((s, j) => (
                <span
                  key={j}
                  className={cn(
                    'font-mono text-base min-w-[20px] text-center',
                    !finished && j === currentSet - 1
                      ? 'text-white font-bold'
                      : t.dimmed
                        ? 'text-[#444]'
                        : 'text-[#555]',
                  )}
                >
                  {s}
                </span>
              ))}
              <div className='text-right ml-2'>
                <div
                  className={cn(
                    'text-xs',
                    t.dimmed ? 'text-[#444]' : 'text-[#666]',
                  )}
                >
                  {t.setWins} sets
                </div>
                <span
                  className={cn(
                    'font-mono text-2xl font-extrabold',
                    t.dimmed ? 'text-[#555]' : 'text-white',
                  )}
                >
                  {t.cur}
                </span>
              </div>
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

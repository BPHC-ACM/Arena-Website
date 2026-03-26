import type { SquashMatch } from '@/app/lib/types';
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

export function SquashCard({ match }: { match: SquashMatch }) {
  const {
    player1,
    player2,
    gamesPlayer1,
    gamesPlayer2,
    currentGame,
    currentPointsPlayer1,
    currentPointsPlayer2,
    bestOf,
    status,
  } = match;

  const p1GamesWon = (gamesPlayer1 || []).filter(
    (s, i) => s > (gamesPlayer2?.[i] || 0),
  ).length;
  const p2GamesWon = (gamesPlayer2 || []).filter(
    (s, i) => s > (gamesPlayer1?.[i] || 0),
  ).length;

  const finished = isFinished(status);
  const p1Wins = finished && p1GamesWon > p2GamesWon;
  const p2Wins = finished && p2GamesWon > p1GamesWon;
  const tied = finished && p1GamesWon === p2GamesWon;

  const winnerName = p1Wins ? player1 : p2Wins ? player2 : null;
  const statusLabel = finished
    ? tied
      ? 'Match tied'
      : winnerName
        ? `${winnerName} wins`
        : status
    : status;

  const rows = [
    {
      name: player1,
      games: gamesPlayer1,
      cur: currentPointsPlayer1,
      dimmed: !!p2Wins,
    },
    {
      name: player2,
      games: gamesPlayer2,
      cur: currentPointsPlayer2,
      dimmed: !!p1Wins,
    },
  ];

  return (
    <div className='space-y-3'>
      <div className='rounded-lg bg-[#0d0d0d] overflow-hidden'>
        <div className='flex items-center gap-2 px-3 pt-2 pb-1'>
          <span className='text-[10px] text-[#444] uppercase tracking-wider'>
            Best of {bestOf ?? 5}
          </span>
          <span className='text-[10px] text-[#444]'>·</span>
          <span className='text-[10px] text-[#444] uppercase tracking-wider'>
            Game {currentGame}
          </span>
        </div>

        {rows.map((p, i) => (
          <div
            key={i}
            className='flex items-center gap-3 px-3 py-3 border-t border-[#181818]'
          >
            <div className='flex-1 min-w-0'>
              <span
                className={cn(
                  'font-semibold text-sm truncate block',
                  p.dimmed ? 'text-[#555]' : 'text-white',
                )}
              >
                {p.name}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              {p.games.map((s, j) => (
                <span
                  key={j}
                  className={cn(
                    'font-mono text-base min-w-[20px] text-center',
                    !finished && j === currentGame - 1
                      ? 'text-white font-bold'
                      : p.dimmed
                        ? 'text-[#444]'
                        : 'text-[#555]',
                  )}
                >
                  {s}
                </span>
              ))}
              <span
                className={cn(
                  'font-mono text-3xl font-extrabold ml-2 min-w-[40px] text-right',
                  p.dimmed ? 'text-[#555]' : 'text-white',
                )}
              >
                {p.cur}
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

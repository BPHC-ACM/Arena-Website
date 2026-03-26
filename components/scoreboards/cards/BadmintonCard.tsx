import type { BadmintonMatch } from '@/app/lib/types';
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

export function BadmintonCard({ match }: { match: BadmintonMatch }) {
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

  const p1SetsWon = (gamesPlayer1 || []).filter(
    (s, i) => s > (gamesPlayer2?.[i] || 0),
  ).length;
  const p2SetsWon = (gamesPlayer2 || []).filter(
    (s, i) => s > (gamesPlayer1?.[i] || 0),
  ).length;

  const finished = isFinished(status);
  const p1Wins = finished && p1SetsWon > p2SetsWon;
  const p2Wins = finished && p2SetsWon > p1SetsWon;
  const tied = finished && p1SetsWon === p2SetsWon;

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
      games: gamesPlayer1 || [],
      setsWon: p1SetsWon,
      cur: currentPointsPlayer1,
      dimmed: !!p2Wins,
    },
    {
      name: player2,
      games: gamesPlayer2 || [],
      setsWon: p2SetsWon,
      cur: currentPointsPlayer2,
      dimmed: !!p1Wins,
    },
  ];

  const gameColCount = Math.max(
    gamesPlayer1?.length || 0,
    gamesPlayer2?.length || 0,
  );
  const gridTemplate = `minmax(60px, 1fr) repeat(${gameColCount}, 25px) 30px 48px`;

  return (
    <div className='space-y-3'>
      <div className='rounded-xl bg-[#0d0d0d] border border-[#181818] overflow-hidden'>
        <div className='flex items-center gap-2 px-3 pt-3 pb-1'>
          <span className='text-[10px] text-[#444] uppercase font-bold tracking-[0.1em]'>
            Best of {bestOf ?? 3}
          </span>
          {!finished && (
            <>
              <span className='text-[10px] text-[#222]'>/</span>
              <span className='text-[10px] text-[#555] font-bold uppercase tracking-[0.1em]'>
                Game {currentGame}
              </span>
            </>
          )}
        </div>

        {/* Header - shown only if games were played */}
        {gameColCount > 0 && (
          <div
            className='grid gap-0 text-[8px] text-[#333] font-bold uppercase tracking-widest px-3 pt-1 pb-1'
            style={{ gridTemplateColumns: gridTemplate }}
          >
            <div />
            {Array.from({ length: gameColCount }).map((_, i) => (
              <div key={i} className='text-center'>
                G{i + 1}
              </div>
            ))}
            <div className='text-center'>Sets</div>
            <div className='text-center'>Rally</div>
          </div>
        )}

        {rows.map((p, i) => (
          <div
            key={i}
            className='grid gap-0 px-3 py-3 items-center border-t border-[#181818]'
            style={{ gridTemplateColumns: gridTemplate }}
          >
            <div className='overflow-hidden'>
              <span
                className={cn(
                  'font-bold text-sm leading-tight truncate block',
                  p.dimmed ? 'text-[#555]' : 'text-white',
                )}
              >
                {p.name || `Player ${i + 1}`}
              </span>
            </div>
            {p.games.map((s, j) => (
              <div
                key={j}
                className={cn(
                  'text-center font-mono text-xs',
                  !finished && j === currentGame - 1
                    ? 'text-white font-bold'
                    : p.dimmed
                      ? 'text-[#444]'
                      : 'text-[#888]',
                )}
              >
                {s}
              </div>
            ))}
            {Array.from({ length: gameColCount - p.games.length }).map(
              (_, j) => (
                <div key={`empty-${j}`} />
              ),
            )}

            <div className='flex justify-center'>
              <div
                className={cn(
                  'w-6 h-6 flex items-center justify-center font-mono text-xs font-bold bg-[#1a1a1a] rounded-md border border-[#222]',
                  p.dimmed ? 'text-[#555]' : 'text-white',
                )}
              >
                {p.setsWon}
              </div>
            </div>
            <div
              className={cn(
                'text-center font-mono text-xl font-black',
                p.dimmed ? 'text-[#555]' : 'text-white',
              )}
            >
              {p.cur}
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

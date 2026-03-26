import type { TennisMatch } from '@/app/lib/types';
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

export function TennisCard({ match }: { match: TennisMatch }) {
  const {
    player1,
    player2,
    setsPlayer1,
    setsPlayer2,
    currentGameScorePlayer1,
    currentGameScorePlayer2,
    surface,
    status,
  } = match;

  const p1SetsWon = setsPlayer1.filter(
    (s, i) => s > (setsPlayer2[i] || 0),
  ).length;
  const p2SetsWon = setsPlayer2.filter(
    (s, i) => s > (setsPlayer1[i] || 0),
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
      sets: setsPlayer1,
      setsWon: p1SetsWon,
      cur: currentGameScorePlayer1,
      dimmed: !!p2Wins,
    },
    {
      name: player2,
      sets: setsPlayer2,
      setsWon: p2SetsWon,
      cur: currentGameScorePlayer2,
      dimmed: !!p1Wins,
    },
  ];

  const setColCount = setsPlayer1.length;
  const gridTemplate = `minmax(60px, 1fr) repeat(${setColCount}, 24px) 30px 48px`;

  return (
    <div className='space-y-3'>
      {surface && (
        <p className='text-[10px] text-[#555] uppercase tracking-wider'>
          {surface} Court
        </p>
      )}

      {/* Score table */}
      <div className='rounded-xl bg-[#0d0d0d] border border-[#181818] overflow-hidden'>
        {/* Header */}
        <div
          className='grid gap-0 text-[9px] text-[#444] font-bold uppercase tracking-widest px-3 pt-3 pb-1'
          style={{ gridTemplateColumns: gridTemplate }}
        >
          <div />
          {setsPlayer1.map((_, i) => (
            <div key={i} className='text-center'>
              S{i + 1}
            </div>
          ))}
          <div className='text-center'>Sets</div>
          <div className='text-center'>Game</div>
        </div>

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
            {p.sets.map((s, j) => (
              <div
                key={j}
                className={cn(
                  'text-center font-mono text-sm',
                  p.dimmed ? 'text-[#444]' : 'text-[#888]',
                )}
              >
                {s}
              </div>
            ))}
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

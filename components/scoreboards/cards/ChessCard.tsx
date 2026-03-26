import type { ChessMatch } from '@/app/lib/types';
import { cn } from '@/app/lib/utils';

export function ChessCard({ match }: { match: ChessMatch }) {
  const {
    player1,
    player2,
    timePlayer1,
    timePlayer2,
    moveCount,
    currentTurn,
    timeControl,
    result,
    status,
  } = match;

  const rows = [
    {
      name: player1,
      time: timePlayer1,
      moves: moveCount,
      isTurn: currentTurn === 1,
    },
    {
      name: player2,
      time: timePlayer2,
      moves: moveCount,
      isTurn: currentTurn === 2,
    },
  ];

  return (
    <div className='space-y-3'>
      <div className='rounded-lg bg-[#0d0d0d] overflow-hidden'>
        <div className='flex items-center gap-2 px-3 pt-2 pb-1'>
          {timeControl && (
            <span className='text-[10px] text-[#444] uppercase tracking-wider'>
              {timeControl}
            </span>
          )}
          {result && (
            <>
              {timeControl && (
                <span className='text-[10px] text-[#444]'>·</span>
              )}
              <span className='text-[10px] text-[#57a639] uppercase tracking-wider font-semibold'>
                {result}
              </span>
            </>
          )}
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
                  i === 0 ? 'text-white' : 'text-[#aaa]',
                )}
              >
                {p.name}
              </span>
            </div>
            <div className='flex items-center gap-4'>
              <div className='text-right'>
                <div className='text-xs text-[#666]'>Moves</div>
                <div className='font-mono text-sm text-white'>{p.moves}</div>
              </div>
              <div className='font-mono text-2xl font-extrabold text-white min-w-[70px] text-right'>
                {p.time}
              </div>
            </div>
          </div>
        ))}
      </div>
      {status && (
        <div className='flex justify-center'>
          <p className='text-[10px] uppercase font-bold tracking-[0.2em] text-[#CCC] py-1 px-3 rounded-full border border-[#181818] bg-[#080808]'>
            {status}
          </p>
        </div>
      )}
    </div>
  );
}

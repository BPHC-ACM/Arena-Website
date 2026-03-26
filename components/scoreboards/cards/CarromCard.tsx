import type { CarromMatch } from '@/app/lib/types';
import { cn } from '@/app/lib/utils';

export function CarromCard({ match }: { match: CarromMatch }) {
  const {
    player1,
    player2,
    scorePlayer1,
    scorePlayer2,
    currentBoard,
    bestOf,
    striker,
    status,
    board1Player1,
    board2Player1,
    board3Player1,
    board1Player2,
    board2Player2,
    board3Player2,
  } = match;

  const rows = [
    {
      name: player1,
      score: scorePlayer1,
      boards: [board1Player1 ?? 0, board2Player1 ?? 0, board3Player1 ?? 0],
      isStriker: striker === 1,
    },
    {
      name: player2,
      score: scorePlayer2,
      boards: [board1Player2 ?? 0, board2Player2 ?? 0, board3Player2 ?? 0],
      isStriker: striker === 2,
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
            Board {currentBoard}
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
                  i === 0 ? 'text-white' : 'text-[#aaa]',
                )}
              >
                {p.name}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              {p.boards.map((s, j) => (
                <span
                  key={j}
                  className={cn(
                    'font-mono text-base min-w-[20px] text-center',
                    j === currentBoard - 1
                      ? 'text-white font-bold'
                      : 'text-[#333]',
                  )}
                >
                  {s}
                </span>
              ))}
              <span className='font-mono text-3xl font-extrabold text-white ml-2 min-w-[40px] text-right'>
                {p.score}
              </span>
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

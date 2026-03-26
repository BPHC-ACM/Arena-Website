import type { EightBallMatch } from '@/app/lib/types';
import { cn } from '@/app/lib/utils';

export function EightBallCard({ match }: { match: EightBallMatch }) {
  const {
    player1,
    player2,
    framesPlayer1,
    framesPlayer2,
    currentFrame,
    bestOf,
    ballsRemainingPlayer1,
    ballsRemainingPlayer2,
    onBreak,
    status,
  } = match;

  const rows = [
    {
      name: player1,
      frames: framesPlayer1,
      ballsRemaining: ballsRemainingPlayer1,
      isBreaking: onBreak === 1,
    },
    {
      name: player2,
      frames: framesPlayer2,
      ballsRemaining: ballsRemainingPlayer2,
      isBreaking: onBreak === 2,
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
            Frame {currentFrame}
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
            <div className='flex items-center gap-4'>
              {p.ballsRemaining !== undefined && (
                <div className='text-xs text-[#666]'>
                  {p.ballsRemaining} balls
                </div>
              )}
              <div className='text-right'>
                <div className='text-xs text-[#666]'>Frames</div>
                <span className='font-mono text-2xl font-extrabold text-white'>
                  {p.frames}
                </span>
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

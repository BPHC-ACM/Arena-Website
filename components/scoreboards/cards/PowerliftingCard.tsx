import type { PowerliftingMatch } from '@/app/lib/types';
import { cn } from '@/app/lib/utils';

export function PowerliftingCard({ match }: { match: PowerliftingMatch }) {
  const {
    athlete1,
    athlete2,
    squatAthlete1,
    benchAthlete1,
    deadliftAthlete1,
    totalAthlete1,
    squatAthlete2,
    benchAthlete2,
    deadliftAthlete2,
    totalAthlete2,
    currentLift,
    weightClass,
    status,
  } = match;

  const rows = [
    {
      name: athlete1,
      squat: squatAthlete1,
      bench: benchAthlete1,
      deadlift: deadliftAthlete1,
      total: totalAthlete1,
    },
    {
      name: athlete2,
      squat: squatAthlete2,
      bench: benchAthlete2,
      deadlift: deadliftAthlete2,
      total: totalAthlete2,
    },
  ];

  return (
    <div className='space-y-3'>
      <div className='rounded-lg bg-[#0d0d0d] overflow-hidden'>
        <div className='flex items-center gap-2 px-3 pt-2 pb-1'>
          {weightClass && (
            <span className='text-[10px] text-[#444] uppercase tracking-wider'>
              {weightClass}
            </span>
          )}
          {currentLift && (
            <>
              {weightClass && (
                <span className='text-[10px] text-[#444]'>·</span>
              )}
              <span className='text-[10px] text-[#57a639] uppercase tracking-wider font-semibold'>
                Current: {currentLift}
              </span>
            </>
          )}
        </div>

        {rows.map((a, i) => (
          <div key={i} className='px-3 py-3 border-t border-[#181818]'>
            <div className='flex items-center justify-between mb-2'>
              <span
                className={cn(
                  'font-semibold text-sm',
                  i === 0 ? 'text-white' : 'text-[#aaa]',
                )}
              >
                {a.name}
              </span>
              <span className='font-mono text-2xl font-extrabold text-white'>
                {a.total} kg
              </span>
            </div>
            <div className='grid grid-cols-3 gap-2 text-xs'>
              <div className='bg-[#0a0a0a] rounded p-1.5 text-center'>
                <div className='text-[#666]'>Squat</div>
                <div className='font-mono text-white font-semibold'>
                  {a.squat}
                </div>
              </div>
              <div className='bg-[#0a0a0a] rounded p-1.5 text-center'>
                <div className='text-[#666]'>Bench</div>
                <div className='font-mono text-white font-semibold'>
                  {a.bench}
                </div>
              </div>
              <div className='bg-[#0a0a0a] rounded p-1.5 text-center'>
                <div className='text-[#666]'>Deadlift</div>
                <div className='font-mono text-white font-semibold'>
                  {a.deadlift}
                </div>
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

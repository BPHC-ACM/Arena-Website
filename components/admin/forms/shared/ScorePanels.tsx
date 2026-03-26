import { ACCENT } from '@/app/lib/sports';
import { Minus, Plus, Pause, Play } from 'lucide-react';

export function ScorePanel({
  name,
  score,
  onDelta,
  children,
}: {
  name: string;
  score: number;
  onDelta: (d: number) => void;
  children?: React.ReactNode;
}) {
  return (
    <div className='flex-1 rounded-xl bg-[#0d0d0d] border border-[#1e1e1e] p-2 space-y-3'>
      <p className='text-xs text-[#888] font-semibold uppercase tracking-wider truncate'>
        {name || 'Team'}
      </p>
      <div className='flex items-center gap-2'>
        <button
          onClick={(e) => { e.preventDefault(); onDelta(-1); }}
          className='w-10 h-10 rounded-lg bg-[#161616] border border-[#222] flex items-center justify-center text-[#888] hover:text-white'
        >
          <Minus className='w-3.5 h-3.5 flex-shrink-0' />
        </button>
        <span className='font-mono text-4xl font-extrabold text-white w-14 text-center'>
          {score}
        </span>
        <button
          onClick={(e) => { e.preventDefault(); onDelta(1); }}
          className='w-10 h-10 rounded-lg bg-[#161616] border border-[#222] flex items-center justify-center text-[#888] hover:text-white'
        >
          <Plus className='w-3.5 h-3.5 flex-shrink-0' />
        </button>
      </div>
      {children}
    </div>
  );
}

export function TimerToggle({
  running,
  onToggle,
}: {
  running: boolean;
  onToggle: (r: boolean) => void;
}) {
  return (
    <button
      onClick={(e) => { e.preventDefault(); onToggle(!running); }}
      className='w-full flex items-center justify-center h-9 mt-1 rounded-lg text-[13px] font-bold transition-colors border'
      style={{
        background: running ? '#1a0808' : `${ACCENT}18`,
        borderColor: running ? '#3a1010' : `${ACCENT}44`,
        color: running ? '#ef4444' : ACCENT,
      }}
    >
      {running ? (
        <Pause className='w-3.5 h-3.5 mr-2' />
      ) : (
        <Play className='w-3.5 h-3.5 mr-2' />
      )}
      {running ? 'Pause Clock' : 'Start Clock'}
    </button>
  );
}

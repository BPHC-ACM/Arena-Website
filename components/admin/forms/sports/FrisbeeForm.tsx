'use client';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { TF, Toggle, StatusSelect, SaveBtn } from '../shared/FormControls';
import { TimerToggle } from '../shared/ScorePanels';
import { DEFAULTS } from '../shared/constants';
import { ACCENT } from '@/app/lib/sports';
import { Label } from '@/components/ui/label';

export function FrisbeeForm({ match, onSave, isCreate }: any) {
  const [form, setForm] = useState(match ?? DEFAULTS['frisbee']);

  const update = (updates: any) => {
    const next = { ...form, ...updates };
    setForm(next);
    if (!isCreate) setTimeout(() => onSave(next), 0);
  };

  const handleStatusChange = (v: string) => {
    let summary = form.summary;
    if (['Game complete'].includes(v)) {
      if (form.scoreA === form.scoreB) summary = 'Match Tied';
      else summary = `${form.scoreA > form.scoreB ? form.teamA || 'Team A' : form.teamB || 'Team B'} won by ${Math.abs(form.scoreA - form.scoreB)} points`;
    }
    update({ status: v, summary });
  };

  return (
    <div className='space-y-5'>
      <div className='grid grid-cols-2 gap-3'>
        <TF label='Team A' value={form.teamA} onChange={(v: string) => update({ teamA: v })} placeholder='Wind Chill' />
        <TF label='Team B' value={form.teamB} onChange={(v: string) => update({ teamB: v })} placeholder='Machine' />
      </div>
      <Separator className='bg-[#1e1e1e]' />
      <Label className='text-xs text-[#888] font-medium uppercase tracking-wider'>
        Point Scored By
      </Label>
      <div className='flex gap-3'>
        <button
          onClick={(e) => { 
            e.preventDefault(); 
            update({ scoreA: (form.scoreA || 0) + 1, possession: form.teamB }); 
          }}
          className='flex-1 py-4 rounded-xl border text-sm font-bold'
          style={{ background: `${ACCENT}18`, borderColor: `${ACCENT}44`, color: ACCENT }}
        >
          +1 {form.teamA || 'A'}
        </button>
        <button
          onClick={(e) => { 
            e.preventDefault(); 
            update({ scoreB: (form.scoreB || 0) + 1, possession: form.teamA }); 
          }}
          className='flex-1 py-4 rounded-xl border text-sm font-bold text-[#ccc]'
          style={{ background: '#161616', borderColor: '#2a2a2a' }}
        >
          +1 {form.teamB || 'B'}
        </button>
      </div>
      <div className='flex gap-8 py-3 rounded-xl bg-[#0d0d0d] border border-[#1e1e1e] justify-center'>
        <div className='text-center'>
          <p className='text-xs text-[#888]'>{form.teamA || 'A'}</p>
          <p className='font-mono text-3xl font-extrabold text-white mt-1'>
            {form.scoreA || 0}
          </p>
        </div>
        <div className='text-center'>
          <p className='text-xs text-[#888]'>{form.teamB || 'B'}</p>
          <p className='font-mono text-3xl font-extrabold text-white mt-1'>
            {form.scoreB || 0}
          </p>
        </div>
      </div>
      <Toggle
        label='Possession'
        options={[
          { l: form.teamA || 'A', v: form.teamA || 'A' },
          { l: form.teamB || 'B', v: form.teamB || 'B' },
        ]}
        value={form.possession}
        onChange={(v) => update({ possession: v })}
      />
      <div className='grid grid-cols-2 gap-3'>
        <div className='space-y-2'>
          <TF label='Time Remaining' value={form.timeRemaining} onChange={(v: string) => update({ timeRemaining: v })} placeholder='15:30' />
          <TimerToggle running={!!form.clockRunning} onToggle={(v) => update({ clockRunning: v })} />
        </div>
        <TF label='Point Cap' type='number' value={form.pointCap} onChange={(v: number) => update({ pointCap: v })} />
      </div>
      <StatusSelect sport='frisbee' value={form.status ?? ''} onChange={handleStatusChange} />
      {isCreate && <SaveBtn onClick={() => onSave(form)} isCreate />}
    </div>
  );
}

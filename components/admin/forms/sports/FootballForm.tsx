'use client';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { TF, Stepper, Toggle, StatusSelect, SaveBtn } from '../shared/FormControls';
import { ScorePanel, TimerToggle } from '../shared/ScorePanels';
import { DEFAULTS } from '../shared/constants';

export function FootballForm({ match, onSave, isCreate }: any) {
  const [form, setForm] = useState(match ?? DEFAULTS['football']);

  const update = (updates: any) => {
    const next = { ...form, ...updates };
    setForm(next);
    if (!isCreate) setTimeout(() => onSave(next), 0);
  };

  const handleStatusChange = (v: string) => {
    let summary = form.summary;
    if (['Full time', 'Match complete', 'Extra time AET'].includes(v)) {
      if (form.scoreA === form.scoreB) summary = 'Match Tied';
      else summary = `${form.scoreA > form.scoreB ? form.teamA || 'Team A' : form.teamB || 'Team B'} won by ${Math.abs(form.scoreA - form.scoreB)} points`;
    }
    const updates: any = { status: v, summary };
    update(updates);
  };

  return (
    <div className='space-y-5'>
      <div className='grid grid-cols-2 gap-3'>
        <TF label='Team A' value={form.teamA} onChange={(v: string) => update({ teamA: v })} />
        <TF label='Team B' value={form.teamB} onChange={(v: string) => update({ teamB: v })} />
      </div>
      <Separator className='bg-[#1e1e1e]' />
      <div className='flex gap-3'>
        <ScorePanel name={form.teamA || 'Team A'} score={form.scoreA} onDelta={(d) => update({ scoreA: Math.max(0, form.scoreA + d) })} />
        <ScorePanel name={form.teamB || 'Team B'} score={form.scoreB} onDelta={(d) => update({ scoreB: Math.max(0, form.scoreB + d) })} />
      </div>
      <div className='grid grid-cols-2 gap-3'>
        <div className='space-y-2'>
          <Stepper label='Match Time (min)' value={form.matchTime || 0} onChange={(v) => update({ matchTime: v })} />
          <TimerToggle running={!!form.clockRunning} onToggle={(v) => update({ clockRunning: v })} />
        </div>
        <Toggle label='Half' options={[{ l: '1st Half', v: 1 }, { l: '2nd Half', v: 2 }]} value={form.half} onChange={(v) => update({ half: v })} />
      </div>
      <StatusSelect sport='football' value={form.status ?? ''} onChange={handleStatusChange} />
      {isCreate && <SaveBtn onClick={() => onSave(form)} isCreate />}
    </div>
  );
}

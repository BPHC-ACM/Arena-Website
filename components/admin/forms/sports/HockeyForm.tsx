'use client';
import { useState, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import { TF, StatusSelect, SaveBtn } from '../shared/FormControls';
import { ScorePanel } from '../shared/ScorePanels';
import { ClockSection } from '../shared/ClockSection';
import { DEFAULTS } from '../shared/constants';

export function HockeyForm({ match, onSave, isCreate }: any) {
  const [form, setForm] = useState(match ?? DEFAULTS['hockey']);

  useEffect(() => {
    if (match) setForm(match);
  }, [match]);

  const update = (updates: any) => {
    const next = { ...form, ...updates };
    setForm(next);
    if (!isCreate) setTimeout(() => onSave(next), 0);
  };

  const handleStatusChange = (v: string) => {
    let summary = form.summary;
    if (['Match complete', 'Full time'].includes(v)) {
      if (form.scoreA === form.scoreB) summary = 'Match Tied';
      else summary = `${form.scoreA > form.scoreB ? form.teamA || 'Team A' : form.teamB || 'Team B'} won by ${Math.abs(form.scoreA - form.scoreB)} goals`;
    }
    const updates: any = { status: v, summary };
    if (v.startsWith('Period ')) {
      const m = v.match(/\d+/);
      const num = m ? parseInt(m[0], 10) : null;
      if (num) updates.currentPeriod = num;
    }
    update(updates);
  };

  return (
    <div className='space-y-5'>
      <div className='grid grid-cols-2 gap-3'>
        <TF label='Team A' value={form.teamA} onChange={(v: string) => update({ teamA: v })} placeholder='Team A' />
        <TF label='Team B' value={form.teamB} onChange={(v: string) => update({ teamB: v })} placeholder='Team B' />
      </div>
      <Separator className='bg-[#1e1e1e]' />

      <div className='flex gap-3'>
        <ScorePanel name={form.teamA || 'Team A'} score={form.scoreA} onDelta={(d) => update({ scoreA: Math.max(0, form.scoreA + d) })} />
        <ScorePanel name={form.teamB || 'Team B'} score={form.scoreB} onDelta={(d) => update({ scoreB: Math.max(0, form.scoreB + d) })} />
      </div>

      {/* Clock — count-up for Hockey */}
      <ClockSection
        timeValue={form.matchTime ?? '0:00'}
        running={!!form.clockRunning}
        mode='countup'
        defaultTime='00:00'
        label='Match Clock'
        onChange={(time, running) => update({ matchTime: time, clockRunning: running })}
      >
        <TF
          label='Current Period'
          type='number'
          value={form.currentPeriod}
          onChange={(v: number) => {
            const updates: any = { currentPeriod: v };
            if (v >= 1 && v <= 3) updates.status = `Period ${v}`;
            update(updates);
          }}
        />
      </ClockSection>

      <StatusSelect sport='hockey' value={form.status ?? ''} onChange={handleStatusChange} />
      {isCreate && <SaveBtn onClick={() => onSave(form)} isCreate />}
    </div>
  );
}

'use client';
import { useState, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import { TF, Toggle, StatusSelect, SaveBtn } from '../shared/FormControls';
import { ScorePanel } from '../shared/ScorePanels';
import { ClockSection } from '../shared/ClockSection';
import { DEFAULTS } from '../shared/constants';

// Football stores matchTime as integer minutes.
// ClockSection works in MM:SS so we convert.
function minsToMMSS(mins: number): string {
  const m = Math.floor(mins);
  return `${m.toString().padStart(2, '0')}:00`;
}
function mmssToMins(mmss: string): number {
  const [m] = String(mmss).split(':').map(Number);
  return m || 0;
}

export function FootballForm({ match, onSave, isCreate }: any) {
  const [form, setForm] = useState(match ?? DEFAULTS['football']);

  useEffect(() => {
    if (match) setForm(match);
  }, [match]);

  const update = (updates: any) => {
    const next = { ...form, ...updates };
    setForm(next);
    if (!isCreate) setTimeout(() => onSave(next), 0);
  };

  const STATUS_HALF_MAP: Record<string, number> = {
    '1st half': 1,
    '2nd half': 2,
  };
  const HALF_STATUS_MAP: Record<number, string> = {
    1: '1st half',
    2: '2nd half',
  };

  const handleStatusChange = (v: string) => {
    let summary = form.summary;
    if (['Full time', 'Match complete', 'Extra time AET'].includes(v)) {
      if (form.scoreA === form.scoreB) summary = 'Match Tied';
      else summary = `${form.scoreA > form.scoreB ? form.teamA || 'Team A' : form.teamB || 'Team B'} won by ${Math.abs(form.scoreA - form.scoreB)} points`;
    }
    const halfFromStatus = STATUS_HALF_MAP[v];
    update({ status: v, summary, ...(halfFromStatus ? { half: halfFromStatus } : {}) });
  };

  const handleHalfChange = (h: number) => {
    const updates: any = { half: h };
    if (HALF_STATUS_MAP[h]) updates.status = HALF_STATUS_MAP[h];
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

      {/* Clock Section — count-up. Stores as integer minutes in DB */}
      <ClockSection
        timeValue={minsToMMSS(form.matchTime || 0)}
        running={!!form.clockRunning}
        mode='countup'
        defaultTime='00:00'
        label='Match Clock'
        onChange={(time, running) =>
          update({ matchTime: mmssToMins(time), clockRunning: running })
        }
      >
        <Toggle
          label='Half'
          options={[{ l: '1st Half', v: 1 }, { l: '2nd Half', v: 2 }]}
          value={form.half}
          onChange={(v) => handleHalfChange(v)}
        />
      </ClockSection>

      <StatusSelect sport='football' value={form.status ?? ''} onChange={handleStatusChange} />
      {isCreate && <SaveBtn onClick={() => onSave(form)} isCreate />}
    </div>
  );
}

'use client';
import { useState, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import { TF, Toggle, StatusSelect, SaveBtn } from '../shared/FormControls';
import { ScorePanel } from '../shared/ScorePanels';
import { ClockSection } from '../shared/ClockSection';
import { DEFAULTS } from '../shared/constants';

export function FrisbeeForm({ match, onSave, isCreate }: any) {
  const [form, setForm] = useState(match ?? DEFAULTS['frisbee']);

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
    const halfFromStatus = STATUS_HALF_MAP[v];
    update({ status: v, ...(halfFromStatus ? { half: halfFromStatus } : {}) });
  };

  const handleHalfChange = (h: number) => {
    const updates: any = { half: h };
    if (HALF_STATUS_MAP[h]) updates.status = HALF_STATUS_MAP[h];
    update(updates);
  };

  return (
    <div className='space-y-5'>
      <div className='grid grid-cols-2 gap-3'>
        <TF label='Team A' value={form.teamA} onChange={(v: string) => update({ teamA: v })} placeholder='Wind Chill' />
        <TF label='Team B' value={form.teamB} onChange={(v: string) => update({ teamB: v })} placeholder='Machine' />
      </div>
      <Separator className='bg-[#1e1e1e]' />

      {/* Score Panels */}
      <div className='flex gap-3'>
        <ScorePanel name={form.teamA || 'Team A'} score={form.scoreA} onDelta={(d) => update({ scoreA: Math.max(0, form.scoreA + d) })} />
        <ScorePanel name={form.teamB || 'Team B'} score={form.scoreB} onDelta={(d) => update({ scoreB: Math.max(0, form.scoreB + d) })} />
      </div>

      {/* Possession quick-score buttons */}
      <div className='flex gap-3'>
        <button
          onClick={(e) => {
            e.preventDefault();
            update({ scoreA: (form.scoreA || 0) + 1, possession: form.teamB });
          }}
          className='flex-1 py-4 rounded-xl border text-sm font-bold'
          style={{ background: '#161616', borderColor: '#2a2a2a', color: '#ccc' }}
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

      <Toggle
        label='Possession'
        options={[
          { l: form.teamA || 'A', v: form.teamA || 'A' },
          { l: form.teamB || 'B', v: form.teamB || 'B' },
        ]}
        value={form.possession}
        onChange={(v) => update({ possession: v })}
      />

      <TF label='Point Cap' type='number' value={form.pointCap} onChange={(v: number) => update({ pointCap: v })} />

      {/* Clock */}
      <ClockSection
        timeValue={form.timeRemaining ?? '48:00'}
        running={!!form.clockRunning}
        mode='countdown'
        defaultTime='48:00'
        warnAt={120}
        onChange={(time, running) => update({ timeRemaining: time, clockRunning: running })}
      >
        <Toggle
          label='Half'
          options={[{ l: '1st Half', v: 1 }, { l: '2nd Half', v: 2 }]}
          value={form.half}
          onChange={(v) => handleHalfChange(v)}
        />
      </ClockSection>

      <StatusSelect sport='frisbee' value={form.status ?? ''} onChange={handleStatusChange} />
      {isCreate && <SaveBtn onClick={() => onSave(form)} isCreate />}
    </div>
  );
}

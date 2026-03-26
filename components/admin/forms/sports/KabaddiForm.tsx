'use client';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { TF, Toggle, StatusSelect, SaveBtn } from '../shared/FormControls';
import { ScorePanel, TimerToggle } from '../shared/ScorePanels';
import { DEFAULTS } from '../shared/constants';
import { ACCENT } from '@/app/lib/sports';
import { Label } from '@/components/ui/label';

export function KabaddiForm({ match, onSave, isCreate }: any) {
  const [form, setForm] = useState(match ?? DEFAULTS['kabaddi']);

  const update = (updates: any) => {
    const next = { ...form, ...updates };
    setForm(next);
    if (!isCreate) setTimeout(() => onSave(next), 0);
  };

  const raidEv = (t: 'touch' | 'tackle' | 'bonus' | 'super') => {
    if (t === 'touch') {
      update({ scoreA: (form.scoreA || 0) + 1, playersOnMatB: Math.max(1, form.playersOnMatB - 1) });
    } else if (t === 'tackle') {
      update({ scoreB: (form.scoreB || 0) + 1, playersOnMatA: Math.max(1, form.playersOnMatA - 1) });
    } else if (t === 'bonus') {
      update({ scoreA: (form.scoreA || 0) + 1 });
    } else if (t === 'super') {
      update({ scoreA: (form.scoreA || 0) + 2 });
    }
  };

  const handleStatusChange = (v: string) => {
    let summary = form.summary;
    if (['Match complete'].includes(v)) {
      if (form.scoreA === form.scoreB) summary = 'Match Tied';
      else summary = `${form.scoreA > form.scoreB ? form.teamA || 'Team A' : form.teamB || 'Team B'} won by ${Math.abs(form.scoreA - form.scoreB)} points`;
    }
    update({ status: v, summary });
  };

  return (
    <div className='space-y-5'>
      <div className='grid grid-cols-2 gap-3'>
        <TF label='Team A' value={form.teamA} onChange={(v: string) => update({ teamA: v })} placeholder='Patna Pirates' />
        <TF label='Team B' value={form.teamB} onChange={(v: string) => update({ teamB: v })} placeholder='Bengal Warriors' />
      </div>
      <Separator className='bg-[#1e1e1e]' />
      <div className='flex gap-3'>
        <ScorePanel name={form.teamA || 'Team A'} score={form.scoreA} onDelta={(d) => update({ scoreA: Math.max(0, form.scoreA + d) })}>
          <p className='text-xs text-[#888]'>{form.playersOnMatA} on mat</p>
        </ScorePanel>
        <ScorePanel name={form.teamB || 'Team B'} score={form.scoreB} onDelta={(d) => update({ scoreB: Math.max(0, form.scoreB + d) })}>
          <p className='text-xs text-[#888]'>{form.playersOnMatB} on mat</p>
        </ScorePanel>
      </div>
      <Label className='text-xs text-[#888] font-medium uppercase tracking-wider'>
        Raid Outcome
      </Label>
      <div className='grid grid-cols-2 gap-2'>
        <button
          onClick={(e) => { e.preventDefault(); raidEv('touch'); }}
          className='py-3 rounded-xl border text-sm font-bold flex flex-col items-center justify-center'
          style={{ background: `${ACCENT}18`, borderColor: `${ACCENT}44`, color: ACCENT }}
        >
          <span className="text-white mb-1">Touch</span>
          <span className="text-[10px] opacity-70">(+1 A, −1 B)</span>
        </button>
        <button
          onClick={(e) => { e.preventDefault(); raidEv('tackle'); }}
          className='py-3 rounded-xl border text-sm font-bold flex flex-col items-center justify-center'
          style={{ background: '#1a0808', borderColor: '#3a1010', color: '#ef4444' }}
        >
          <span className="text-white mb-1">Tackle</span>
          <span className="text-[10px] opacity-70">(+1 B, −1 A)</span>
        </button>
        <button
          onClick={(e) => { e.preventDefault(); raidEv('bonus'); }}
          className='py-3 rounded-xl border text-sm font-bold flex flex-col items-center justify-center'
          style={{ background: '#1a1408', borderColor: '#3a2a10', color: '#f97316' }}
        >
          <span className="text-white mb-1">Bonus</span>
          <span className="text-[10px] opacity-70">+1 A</span>
        </button>
        <button
          onClick={(e) => { e.preventDefault(); raidEv('super'); }}
          className='py-3 rounded-xl border text-sm font-bold flex flex-col items-center justify-center'
          style={{ background: '#0d0d1a', borderColor: '#1a1a3a', color: '#818cf8' }}
        >
          <span className="text-white mb-1">Super Raid</span>
          <span className="text-[10px] opacity-70">+2 A</span>
        </button>
      </div>
      <div className='grid grid-cols-2 gap-3'>
        <TF label='Raid Timer (s)' value={form.raidTimer} type='number' onChange={(v: number) => update({ raidTimer: v })} />
        <TF label='Raiding Team' value={form.raidingTeam} onChange={(v: string) => update({ raidingTeam: v })} placeholder={form.teamA} />
      </div>
      <div className='grid grid-cols-2 gap-3'>
        <Toggle
          label='Half'
          options={[{ l: '1st Half', v: 1 }, { l: '2nd Half', v: 2 }]}
          value={form.half}
          onChange={(v) => update({ half: v })}
        />
        <div className='space-y-2'>
          <TF label='Time Remaining' value={form.timeRemaining} onChange={(v: string) => update({ timeRemaining: v })} placeholder='08:30' />
          <TimerToggle running={!!form.clockRunning} onToggle={(v) => update({ clockRunning: v })} />
        </div>
      </div>
      <StatusSelect sport='kabaddi' value={form.status ?? ''} onChange={handleStatusChange} />
      {isCreate && <SaveBtn onClick={() => onSave(form)} isCreate />}
    </div>
  );
}

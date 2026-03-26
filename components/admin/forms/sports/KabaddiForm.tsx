'use client';
import { useState, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import { TF, Toggle, StatusSelect, SaveBtn } from '../shared/FormControls';
import { ScorePanel } from '../shared/ScorePanels';
import { ClockSection } from '../shared/ClockSection';
import { DEFAULTS } from '../shared/constants';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function KabaddiForm({ match, onSave, isCreate }: any) {
  const [form, setForm] = useState(match ?? DEFAULTS['kabaddi']);

  // Sync form when match prop changes (new match selected)
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

  // Raiding team options
  const teamOptions = [
    { label: form.teamA || 'Team A', value: form.teamA || 'Team A' },
    { label: form.teamB || 'Team B', value: form.teamB || 'Team B' },
  ];

  return (
    <div className='space-y-5'>
      {/* Teams */}
      <div className='grid grid-cols-2 gap-3'>
        <TF label='Team A' value={form.teamA} onChange={(v: string) => update({ teamA: v })} placeholder='Patna Pirates' />
        <TF label='Team B' value={form.teamB} onChange={(v: string) => update({ teamB: v })} placeholder='Bengal Warriors' />
      </div>

      <Separator className='bg-[#1e1e1e]' />

      {/* Scores */}
      <div className='flex gap-3'>
        <ScorePanel name={form.teamA || 'Team A'} score={form.scoreA} onDelta={(d) => update({ scoreA: Math.max(0, form.scoreA + d) })} />
        <ScorePanel name={form.teamB || 'Team B'} score={form.scoreB} onDelta={(d) => update({ scoreB: Math.max(0, form.scoreB + d) })} />
      </div>

      <Separator className='bg-[#1e1e1e]' />

      {/* Raid Info */}
      <div className='grid grid-cols-2 gap-3'>
        <TF
          label='Raid Timer (s)'
          value={form.raidTimer}
          type='number'
          onChange={(v: number) => update({ raidTimer: v })}
        />
        <div className='space-y-1.5'>
          <Label className='text-xs text-[#888] font-medium uppercase tracking-wider'>
            Raiding Team
          </Label>
          <Select
            value={form.raidingTeam || teamOptions[0].value}
            onValueChange={(v) => update({ raidingTeam: v })}
          >
            <SelectTrigger className='bg-[#0d0d0d] border-[#222] text-sm h-9 w-full'>
              <SelectValue placeholder='Select team…' />
            </SelectTrigger>
            <SelectContent className='bg-[#111] border-[#222]'>
              {teamOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className='text-sm'>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Clock */}
      <ClockSection
        timeValue={form.timeRemaining ?? '20:00'}
        running={!!form.clockRunning}
        mode='countdown'
        defaultTime='20:00'
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

      <StatusSelect sport='kabaddi' value={form.status ?? ''} onChange={handleStatusChange} />
      {isCreate && <SaveBtn onClick={() => onSave(form)} isCreate />}
    </div>
  );
}

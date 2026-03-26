'use client';
import { useState, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import { TF, StatusSelect, SaveBtn } from '../shared/FormControls';
import { ScorePanel } from '../shared/ScorePanels';
import { ClockSection } from '../shared/ClockSection';
import { DEFAULTS } from '../shared/constants';
import { ACCENT } from '@/app/lib/sports';

interface BasketballState {
  teamA: string; teamB: string;
  scoreA: number; scoreB: number;
  currentQuarter: number;
  gameClock: string; shotClock: number; clockRunning?: boolean;
  quarterScoresA: number[]; quarterScoresB: number[];
  foulsA: number; foulsB: number;
  status: string;
  summary?: string;
  id?: string;
}

const QUARTER_LABELS = ['Q1', 'Q2', 'Q3', 'Q4'];

export function BasketballForm({ match, onSave, isCreate }: any) {
  const [form, setForm] = useState<BasketballState>(match ?? DEFAULTS['basketball']);

  useEffect(() => {
    if (match) setForm(match);
  }, [match]);

  const update = (updates: Partial<BasketballState>) => {
    const next = { ...form, ...updates };
    setForm(next);
    if (!isCreate) setTimeout(() => onSave(next), 0);
  };

  const handleScore = (team: 'A' | 'B', delta: number) => {
    const qIdx = Math.max(0, (form.currentQuarter || 1) - 1);
    const scores = team === 'A' ? [...(form.quarterScoresA || [0,0,0,0])] : [...(form.quarterScoresB || [0,0,0,0])];
    scores[qIdx] = Math.max(0, (scores[qIdx] || 0) + delta);
    if (team === 'A') update({ scoreA: Math.max(0, form.scoreA + delta), quarterScoresA: scores });
    else update({ scoreB: Math.max(0, form.scoreB + delta), quarterScoresB: scores });
  };

  const QUARTER_STATUS_MAP: Record<number, string> = {
    1: 'Quarter I', 2: 'Quarter II', 3: 'Quarter III', 4: 'Quarter IV',
  };
  const STATUS_QUARTER_MAP: Record<string, number> = {
    'Quarter I': 1, 'Quarter II': 2, 'Quarter III': 3, 'Quarter IV': 4,
  };

  const handleStatus = (v: string) => {
    const quarterFromStatus = STATUS_QUARTER_MAP[v];
    update({ status: v, ...(quarterFromStatus ? { currentQuarter: quarterFromStatus } : {}) });
  };

  const handleQuarterClick = (q: number) => {
    const updates: Partial<BasketballState> = { currentQuarter: q };
    if (QUARTER_STATUS_MAP[q]) updates.status = QUARTER_STATUS_MAP[q];
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
        <ScorePanel name={form.teamA} score={form.scoreA} onDelta={(d) => handleScore('A', d)}>
          <div className='flex gap-1.5'>
            {[{ l: '+2', d: 2 }, { l: '+3', d: 3 }, { l: '+1 FT', d: 1 }].map(({ l, d }) => (
              <button
                key={l}
                onClick={(e) => { e.preventDefault(); handleScore('A', d); }}
                className='flex-1 h-8 rounded-lg bg-[#161616] border border-[#222] text-sm font-bold text-[#aaa] hover:text-white'
              >
                {l}
              </button>
            ))}
          </div>
          <button
            onClick={(e) => { e.preventDefault(); update({ foulsA: (form.foulsA || 0) + 1 }); }}
            className='w-full h-8 rounded-lg bg-[#2a1212] border border-[#3a1a1a] text-sm font-bold text-red-500 hover:bg-[#3a1a1a]'
          >
            Foul ({form.foulsA || 0})
          </button>
        </ScorePanel>
        <ScorePanel name={form.teamB} score={form.scoreB} onDelta={(d) => handleScore('B', d)}>
          <div className='flex gap-1.5'>
            {[{ l: '+2', d: 2 }, { l: '+3', d: 3 }, { l: '+1 FT', d: 1 }].map(({ l, d }) => (
              <button
                key={l}
                onClick={(e) => { e.preventDefault(); handleScore('B', d); }}
                className='flex-1 h-8 rounded-lg bg-[#161616] border border-[#222] text-sm font-bold text-[#aaa] hover:text-white'
              >
                {l}
              </button>
            ))}
          </div>
          <button
            onClick={(e) => { e.preventDefault(); update({ foulsB: (form.foulsB || 0) + 1 }); }}
            className='w-full h-8 rounded-lg bg-[#2a1212] border border-[#3a1a1a] text-sm font-bold text-red-500 hover:bg-[#3a1a1a]'
          >
            Foul ({form.foulsB || 0})
          </button>
        </ScorePanel>
      </div>

      {/* Clock Section */}
      <ClockSection
        timeValue={form.gameClock ?? '12:00'}
        running={!!form.clockRunning}
        mode='countdown'
        defaultTime='12:00'
        warnAt={60}
        label='Game Clock'
        onChange={(time, running) => update({ gameClock: time, clockRunning: running })}
      >
        {/* Quarter selector */}
        <div className='space-y-1.5'>
          <p className='text-xs text-[#888] font-medium uppercase tracking-wider'>Quarter</p>
          <div className='flex gap-2'>
            {QUARTER_LABELS.map((lbl, i) => (
              <button
                key={lbl}
                onClick={(e) => { e.preventDefault(); handleQuarterClick(i + 1); }}
                className='flex-1 h-9 rounded-lg text-sm font-semibold border transition-colors'
                style={
                  form.currentQuarter === i + 1
                    ? { background: `${ACCENT}20`, borderColor: `${ACCENT}44`, color: ACCENT }
                    : { background: '#0d0d0d', borderColor: '#222', color: '#888' }
                }
              >
                {lbl}
              </button>
            ))}
          </div>
        </div>

        {/* Shot clock */}
        <div className='flex items-center justify-between px-1 pt-1'>
          <span className='text-xs text-[#888] font-medium uppercase tracking-wider'>Shot Clock</span>
          <div className='flex items-center gap-2'>
            <button
              onClick={(e) => { e.preventDefault(); update({ shotClock: Math.max(0, (form.shotClock || 24) - 1) }); }}
              className='w-7 h-7 rounded-md bg-[#161616] border border-[#222] text-white text-sm font-bold flex items-center justify-center hover:bg-[#222]'
            >−</button>
            <span className='font-mono text-lg font-bold text-white w-8 text-center'>
              {form.shotClock ?? 24}
            </span>
            <button
              onClick={(e) => { e.preventDefault(); update({ shotClock: (form.shotClock || 0) + 1 }); }}
              className='w-7 h-7 rounded-md bg-[#161616] border border-[#222] text-white text-sm font-bold flex items-center justify-center hover:bg-[#222]'
            >+</button>
            <button
              onClick={(e) => { e.preventDefault(); update({ shotClock: 24 }); }}
              className='ml-1 text-xs text-[#555] hover:text-[#888] border border-[#222] rounded-md px-2 h-7 bg-[#111]'
            >24</button>
            <button
              onClick={(e) => { e.preventDefault(); update({ shotClock: 14 }); }}
              className='text-xs text-[#555] hover:text-[#888] border border-[#222] rounded-md px-2 h-7 bg-[#111]'
            >14</button>
          </div>
        </div>
      </ClockSection>

      <StatusSelect sport='basketball' value={form.status} onChange={handleStatus} />
      {isCreate && <SaveBtn onClick={() => onSave(form)} isCreate />}
    </div>
  );
}

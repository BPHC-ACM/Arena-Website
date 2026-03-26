'use client';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { TF, StatusSelect, SaveBtn } from '../shared/FormControls';
import { ScorePanel, TimerToggle } from '../shared/ScorePanels';
import { DEFAULTS } from '../shared/constants';

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

export function BasketballForm({ match, onSave, isCreate }: any) {
  const [form, setForm] = useState<BasketballState>(match ?? DEFAULTS['basketball']);

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

  const handleStatus = (v: string) => {
    let summary = form.summary;
    if (v === 'Full time' || v === 'OT') {
      if (form.scoreA === form.scoreB) summary = 'Match Tied';
      else summary = `${form.scoreA > form.scoreB ? form.teamA || 'Team A' : form.teamB || 'Team B'} won by ${Math.abs(form.scoreA - form.scoreB)} points`;
    }
    update({ status: v, summary });
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
              {[
                { l: '+2', d: 2 },
                { l: '+3', d: 3 },
                { l: '+1 FT', d: 1 },
              ].map(({ l, d }) => (
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
              {[
                { l: '+2', d: 2 },
                { l: '+3', d: 3 },
                { l: '+1 FT', d: 1 },
              ].map(({ l, d }) => (
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

      <Separator className='bg-[#1e1e1e]' />
      
      <div className='grid grid-cols-2 gap-3'>
        <TF label='Game Clock' value={form.gameClock} onChange={(v: string) => update({ gameClock: v })} />
        <TF label='Shot Clock' type='number' value={form.shotClock} onChange={(v: number) => update({ shotClock: v })} />
      </div>
      <TimerToggle running={!!form.clockRunning} onToggle={(r: boolean) => update({ clockRunning: r })} />

      <StatusSelect sport='basketball' value={form.status} onChange={handleStatus} />
      {isCreate && <SaveBtn onClick={() => onSave(form)} isCreate />}
    </div>
  );
}

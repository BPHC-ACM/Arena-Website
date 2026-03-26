'use client';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { TF, StatusSelect, SaveBtn } from '../shared/FormControls';
import { DEFAULTS } from '../shared/constants';
import { ACCENT } from '@/app/lib/sports';
import { Label } from '@/components/ui/label';

export function VolleyballForm({ match, onSave, isCreate }: any) {
  const [form, setForm] = useState(match ?? DEFAULTS['volleyball']);

  const update = (updates: any) => {
    const next = { ...form, ...updates };
    setForm(next);
    if (!isCreate) setTimeout(() => onSave(next), 0);
  };

  const winPt = (team: 'A' | 'B') => {
    const f = team === 'A' ? 'currentPointsTeamA' : 'currentPointsTeamB';
    const oF = team === 'A' ? 'currentPointsTeamB' : 'currentPointsTeamA';
    const pts = (form[f] || 0) + 1;
    const opp = form[oF] || 0;
    
    const minPts = form.currentSet === 5 ? 15 : 25;
    const isSetWon = (pts >= minPts && pts - opp >= 2) || pts === 30; // 30 pt cap

    if (isSetWon) {
      const sa = [...(form.setsTeamA ?? [])];
      const sb = [...(form.setsTeamB ?? [])];
      sa.push(team === 'A' ? pts : opp);
      sb.push(team === 'B' ? pts : opp);
      const wA = (form.setWinsA || 0) + (team === 'A' ? 1 : 0);
      const wB = (form.setWinsB || 0) + (team === 'B' ? 1 : 0);
      update({
        setsTeamA: sa,
        setsTeamB: sb,
        setWinsA: wA,
        setWinsB: wB,
        currentSet: (form.currentSet || 1) + 1,
        status: `Set ${(form.currentSet || 1) + 1}`,
        currentPointsTeamA: 0,
        currentPointsTeamB: 0,
      });
    } else {
      update({ [f]: pts });
    }
  };

  const handleStatusChange = (v: string) => {
    const updates: any = { status: v };
    if (v.startsWith('Set ')) {
      const m = v.match(/\d+/);
      const num = m ? parseInt(m[0], 10) : null;
      updates.currentPointsTeamA = 0;
      updates.currentPointsTeamB = 0;
      if (num) updates.currentSet = num;
    }
    update(updates);
  };

  return (
    <div className='space-y-5'>
      <div className='grid grid-cols-2 gap-3'>
        <TF label='Team A' value={form.teamA} onChange={(v: string) => update({ teamA: v })} placeholder='Brazil' />
        <TF label='Team B' value={form.teamB} onChange={(v: string) => update({ teamB: v })} placeholder='USA' />
      </div>
      <Separator className='bg-[#1e1e1e]' />
      <Label className='text-xs text-[#888] font-medium uppercase tracking-wider'>
        Point Scored By
      </Label>
      <div className='flex gap-3'>
        <button
          onClick={(e) => { e.preventDefault(); winPt('A'); }}
          className='flex-1 py-4 rounded-xl border text-sm font-bold'
          style={{ background: `${ACCENT}18`, borderColor: `${ACCENT}44`, color: ACCENT }}
        >
          +1 {form.teamA || 'A'}
        </button>
        <button
          onClick={(e) => { e.preventDefault(); winPt('B'); }}
          className='flex-1 py-4 rounded-xl border text-sm font-bold text-[#ccc]'
          style={{ background: '#161616', borderColor: '#2a2a2a' }}
        >
          +1 {form.teamB || 'B'}
        </button>
      </div>
      <div className='flex gap-6 py-3 rounded-xl bg-[#0d0d0d] border border-[#1e1e1e] justify-center'>
        <div className='text-center'>
          <p className='text-xs text-[#888]'>{form.teamA || 'A'}</p>
          <p className='font-mono text-3xl font-extrabold text-white mt-1'>
            {form.currentPointsTeamA || 0}
          </p>
          <p className='text-xs text-[#888] mt-1'>
            {form.setWinsA || 0} sets
          </p>
        </div>
        <div className='self-center text-xs text-[#444]'>
          Set {form.currentSet}
        </div>
        <div className='text-center'>
          <p className='text-xs text-[#888]'>{form.teamB || 'B'}</p>
          <p className='font-mono text-3xl font-extrabold text-white mt-1'>
            {form.currentPointsTeamB || 0}
          </p>
          <p className='text-xs text-[#888] mt-1'>
            {form.setWinsB || 0} sets
          </p>
        </div>
      </div>
      <StatusSelect sport='volleyball' value={form.status ?? ''} onChange={handleStatusChange} />
      {isCreate && <SaveBtn onClick={() => onSave(form)} isCreate />}
    </div>
  );
}

'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { TF, StatusSelect, SaveBtn } from '../shared/FormControls';
import { DEFAULTS } from '../shared/constants';
import { ACCENT } from '@/app/lib/sports';

export function BadmintonForm({ match, onSave, isCreate }: any) {
  const [form, setForm] = useState(match ?? DEFAULTS['badminton']);

  const update = (updates: any) => {
    const next = { ...form, ...updates };
    setForm(next);
    if (!isCreate) setTimeout(() => onSave(next), 0);
  };

  const winRally = (player: 1 | 2) => {
    const f = player === 1 ? 'currentPointsPlayer1' : 'currentPointsPlayer2';
    const oF = player === 1 ? 'currentPointsPlayer2' : 'currentPointsPlayer1';
    const pts = (form[f] || 0) + 1;
    const opp = form[oF] || 0;
    
    // SOUNDNESS CHECK: Win by 2, OR absolute cap at 30
    const isGameWon = (pts >= 21 && pts - opp >= 2) || pts === 30;

    if (isGameWon) {
      const g1 = [...(form.gamesPlayer1 ?? [])]; 
      const g2 = [...(form.gamesPlayer2 ?? [])];
      g1.push(player === 1 ? pts : opp);
      g2.push(player === 2 ? pts : opp);
      
      const bestOf = form.bestOf ?? 3;
      const gamesNeeded = Math.ceil(bestOf / 2);
      const p1WonGames = g1.filter((s, i) => s > g2[i]).length;
      const p2WonGames = g2.filter((s, i) => s > g1[i]).length;
      const matchWon = p1WonGames >= gamesNeeded || p2WonGames >= gamesNeeded;

      update({
        gamesPlayer1: g1, gamesPlayer2: g2,
        currentGame: matchWon ? form.currentGame || 1 : (form.currentGame || 1) + 1,
        currentPointsPlayer1: 0, currentPointsPlayer2: 0,
        server: player,
        ...(matchWon ? { status: 'Match complete' } : { status: `Game ${(form.currentGame || 1) + 1}` })
      });
    } else {
      update({ [f]: pts, server: player });
    }
  };

  const handleStatusChange = (v: string) => {
    const updates: any = { status: v };
    if (v.startsWith('Game ')) {
      const m = v.match(/\d+/);
      const num = m ? parseInt(m[0], 10) : null;
      updates.currentPointsPlayer1 = 0;
      updates.currentPointsPlayer2 = 0;
      if (num) updates.currentGame = num;
    }
    update(updates);
  };

  return (
    <div className='space-y-5'>
      <div className='grid grid-cols-2 gap-3'>
        <TF label='Player 1' value={form.player1} onChange={(v: string) => update({ player1: v })} placeholder='Lin Dan' />
        <TF label='Player 2' value={form.player2} onChange={(v: string) => update({ player2: v })} placeholder='Lee Chong Wei' />
      </div>
      <Separator className='bg-[#1e1e1e]' />
      <Label className='text-xs text-[#888] font-medium uppercase tracking-wider'>
        Rally Won By
      </Label>
      <div className='flex gap-3'>
        <button
          onClick={(e) => { e.preventDefault(); winRally(1); }}
          className='flex-1 py-4 rounded-xl border text-sm font-bold'
          style={{ background: `${ACCENT}18`, borderColor: `${ACCENT}44`, color: ACCENT }}
        >
          +1 {form.player1 || 'P1'}
        </button>
        <button
          onClick={(e) => { e.preventDefault(); winRally(2); }}
          className='flex-1 py-4 rounded-xl border text-sm font-bold text-[#ccc]'
          style={{ background: '#161616', borderColor: '#2a2a2a' }}
        >
          +1 {form.player2 || 'P2'}
        </button>
      </div>
      <div className='flex gap-6 py-3 rounded-xl bg-[#0d0d0d] border border-[#1e1e1e] justify-center'>
        <div className='text-center'>
          <p className='text-xs text-[#888]'>{form.player1 || 'P1'}</p>
          <p className='font-mono text-3xl font-extrabold text-white mt-1'>
            {form.currentPointsPlayer1 || 0}
          </p>
        </div>
        <div className='self-center text-xs text-[#444]'>
          Game {form.currentGame}
        </div>
        <div className='text-center'>
          <p className='text-xs text-[#888]'>{form.player2 || 'P2'}</p>
          <p className='font-mono text-3xl font-extrabold text-white mt-1'>
            {form.currentPointsPlayer2 || 0}
          </p>
        </div>
      </div>
      <div className='grid grid-cols-2 gap-3'>
        <div className='space-y-1.5'>
          <Label className='text-xs text-[#888] font-medium uppercase tracking-wider'>
            Games P1
          </Label>
          <Input
            value={(form.gamesPlayer1 ?? []).join(', ')}
            onChange={(e) =>
              update({
                gamesPlayer1: e.target.value
                  .split(',')
                  .map((v: string) => Number(v.trim()) || 0),
              })
            }
            className='bg-[#0d0d0d] border-[#222] text-sm h-9'
          />
        </div>
        <div className='space-y-1.5'>
          <Label className='text-xs text-[#888] font-medium uppercase tracking-wider'>
            Games P2
          </Label>
          <Input
            value={(form.gamesPlayer2 ?? []).join(', ')}
            onChange={(e) =>
              update({
                gamesPlayer2: e.target.value
                  .split(',')
                  .map((v: string) => Number(v.trim()) || 0),
              })
            }
            className='bg-[#0d0d0d] border-[#222] text-sm h-9'
          />
        </div>
      </div>
      <StatusSelect sport='badminton' value={form.status ?? ''} onChange={handleStatusChange} />
      {isCreate && <SaveBtn onClick={() => onSave(form)} isCreate />}
    </div>
  );
}

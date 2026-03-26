'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { TF, Toggle, StatusSelect, SaveBtn } from '../shared/FormControls';
import { DEFAULTS } from '../shared/constants';
import { ACCENT } from '@/app/lib/sports';

export function TennisForm({ match, onSave, isCreate }: any) {
  const [form, setForm] = useState(match ?? DEFAULTS['tennis']);

  const update = (updates: any) => {
    const next = { ...form, ...updates };
    setForm(next);
    if (!isCreate) setTimeout(() => onSave(next), 0);
  };

  const isTieBreak = () => {
    const si = (form.currentSet || 1) - 1;
    const s1 = (form.setsPlayer1 || [])[si] || 0;
    const s2 = (form.setsPlayer2 || [])[si] || 0;
    return s1 === 6 && s2 === 6;
  };

  const winPoint = (player: 1 | 2) => {
    if (isTieBreak()) {
      const p1Score = parseInt(form.currentGameScorePlayer1) || 0;
      const p2Score = parseInt(form.currentGameScorePlayer2) || 0;
      
      const newP1 = player === 1 ? p1Score + 1 : p1Score;
      const newP2 = player === 2 ? p2Score + 1 : p2Score;

      if ((newP1 >= 7 || newP2 >= 7) && Math.abs(newP1 - newP2) >= 2) {
         const s1 = [...(form.setsPlayer1 || [])]; 
         const s2 = [...(form.setsPlayer2 || [])];
         const si = (form.currentSet || 1) - 1;
         s1[si] = (s1[si] || 0) + (player === 1 ? 1 : 0);
         s2[si] = (s2[si] || 0) + (player === 2 ? 1 : 0);
         const nextSet = (form.currentSet || 1) + 1;
         update({ 
           setsPlayer1: s1, 
           setsPlayer2: s2, 
           currentGameScorePlayer1: '0', 
           currentGameScorePlayer2: '0', 
           currentSet: nextSet,
           status: `Set ${nextSet}`,
           server: form.server === 1 ? 2 : 1 
         });
      } else {
         update({ currentGameScorePlayer1: newP1.toString(), currentGameScorePlayer2: newP2.toString() });
      }
      return;
    }

    const SCORES = ['0', '15', '30', '40', 'A'];
    const wCur = String(player === 1 ? form.currentGameScorePlayer1 : form.currentGameScorePlayer2);
    const lCur = String(player === 1 ? form.currentGameScorePlayer2 : form.currentGameScorePlayer1);
    
    const winGame = () => {
      const s1 = [...(form.setsPlayer1 ?? [])]; 
      const s2 = [...(form.setsPlayer2 ?? [])];
      const si = (form.currentSet || 1) - 1;
      s1[si] = (s1[si] || 0) + (player === 1 ? 1 : 0);
      s2[si] = (s2[si] || 0) + (player === 2 ? 1 : 0);

      const g1 = s1[si];
      const g2 = s2[si];
      const setOver = (g1 >= 6 && g1 - g2 >= 2) || (g2 >= 6 && g2 - g1 >= 2) || g1 === 7 || g2 === 7;
      const nextSet = setOver ? (form.currentSet || 1) + 1 : (form.currentSet || 1);

      update({ 
        setsPlayer1: s1, 
        setsPlayer2: s2, 
        currentGameScorePlayer1: '0', 
        currentGameScorePlayer2: '0', 
        server: form.server === 1 ? 2 : 1,
        currentSet: nextSet,
        ...(setOver ? { status: `Set ${nextSet}` } : {})
      });
    };

    if (wCur === 'A' || (wCur === '40' && lCur !== '40' && lCur !== 'A')) return winGame();
    if (wCur === '40' && lCur === 'A') {
      update({ currentGameScorePlayer1: '40', currentGameScorePlayer2: '40' });
    } else if (wCur === '40' && lCur === '40') {
      update({ [player === 1 ? 'currentGameScorePlayer1' : 'currentGameScorePlayer2']: 'A' });
    } else {
      const idx = SCORES.indexOf(wCur);
      update({[player === 1 ? 'currentGameScorePlayer1' : 'currentGameScorePlayer2']: SCORES[Math.min(idx + 1, 3)] });
    }
  };

  const handleStatusChange = (v: string) => {
    const updates: any = { status: v };
    if (v.startsWith('Set ')) {
      const m = v.match(/\d+/);
      const num = m ? parseInt(m[0], 10) : null;
      updates.currentGameScorePlayer1 = '0';
      updates.currentGameScorePlayer2 = '0';
      if (num) updates.currentSet = num;
    }
    update(updates);
  };

  return (
    <div className='space-y-5'>
      <div className='grid grid-cols-2 gap-3'>
        <TF label='Player 1' value={form.player1} onChange={(v: string) => update({ player1: v })} placeholder='Djokovic' />
        <TF label='Player 2' value={form.player2} onChange={(v: string) => update({ player2: v })} placeholder='Nadal' />
      </div>
      <Separator className='bg-[#1e1e1e]' />
      <Label className='text-xs text-[#888] font-medium uppercase tracking-wider'>
        Award Point {isTieBreak() && '(Tie Break)'}
      </Label>
      <div className='flex gap-3'>
        <button
          onClick={(e) => { e.preventDefault(); winPoint(1); }}
          className='flex-1 py-4 rounded-xl border text-sm font-bold'
          style={{ background: `${ACCENT}18`, borderColor: `${ACCENT}44`, color: ACCENT }}
        >
          Point to {form.player1 || 'P1'}
        </button>
        <button
          onClick={(e) => { e.preventDefault(); winPoint(2); }}
          className='flex-1 py-4 rounded-xl border text-sm font-bold text-[#ccc]'
          style={{ background: '#161616', borderColor: '#2a2a2a' }}
        >
          Point to {form.player2 || 'P2'}
        </button>
      </div>
      <div className='flex gap-6 py-3 rounded-xl bg-[#0d0d0d] border border-[#1e1e1e] justify-center'>
        <div className='text-center'>
          <p className='text-xs text-[#888]'>{form.player1 || 'P1'}</p>
          <p className='font-mono text-3xl font-extrabold text-white mt-1'>
            {form.currentGameScorePlayer1}
          </p>
        </div>
        <div className='self-center text-[#333] mt-4 text-lg'>—</div>
        <div className='text-center'>
          <p className='text-xs text-[#888]'>{form.player2 || 'P2'}</p>
          <p className='font-mono text-3xl font-extrabold text-white mt-1'>
            {form.currentGameScorePlayer2}
          </p>
        </div>
      </div>
      <Toggle
        label='Server'
        options={[
          { l: `${form.player1 || 'P1'} Serves`, v: 1 },
          { l: `${form.player2 || 'P2'} Serves`, v: 2 },
        ]}
        value={form.server}
        onChange={(v) => update({ server: v })}
      />
      <div className='grid grid-cols-3 gap-3'>
        <TF label='Current Set' value={form.currentSet} type='number' onChange={(v: number) => {
            const updates: any = { currentSet: v };
            if (v >= 1 && v <= 5) updates.status = `Set ${v}`;
            update(updates);
        }} />
        <div className='space-y-1.5'>
          <Label className='text-xs text-[#888] font-medium uppercase tracking-wider'>
            Sets P1
          </Label>
          <Input
            value={(form.setsPlayer1 ?? []).join(', ')}
            onChange={(e) =>
              update({
                setsPlayer1: e.target.value
                  .split(',')
                  .map((v: string) => Number(v.trim()) || 0),
              })
            }
            className='bg-[#0d0d0d] border-[#222] text-sm h-9'
            placeholder='6, 4'
          />
        </div>
        <div className='space-y-1.5'>
          <Label className='text-xs text-[#888] font-medium uppercase tracking-wider'>
            Sets P2
          </Label>
          <Input
            value={(form.setsPlayer2 ?? []).join(', ')}
            onChange={(e) =>
              update({
                setsPlayer2: e.target.value
                  .split(',')
                  .map((v: string) => Number(v.trim()) || 0),
              })
            }
            className='bg-[#0d0d0d] border-[#222] text-sm h-9'
            placeholder='3, 6'
          />
        </div>
      </div>
      <StatusSelect sport='tennis' value={form.status ?? ''} onChange={handleStatusChange} />
      {isCreate && <SaveBtn onClick={() => onSave(form)} isCreate />}
    </div>
  );
}

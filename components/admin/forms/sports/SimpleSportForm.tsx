'use client';
import { useState } from 'react';
import { TF, StatusSelect, SaveBtn } from '../shared/FormControls';
import { DEFAULTS } from '../shared/constants';

export function SimpleSportForm({ sport, match, onSave, isCreate }: any) {
  const [form, setForm] = useState(match ?? DEFAULTS[sport as keyof typeof DEFAULTS]);

  const update = (key: string, value: any) => {
    const next = { ...form, [key]: value };
    setForm(next);
    if (!isCreate) setTimeout(() => onSave(next), 0);
  };

  const handleStatusChange = (v: string) => {
    let summary = form.summary;
    if (['Full time', 'Match complete', 'Game complete', 'Competition complete'].includes(v)) {
      const tA = form.teamA || form.player1 || form.athlete1 || 'Player 1';
      const tB = form.teamB || form.player2 || form.athlete2 || 'Player 2';
      const sa = form.scoreA || form.scorePlayer1 || form.scoreAthlete1 || 0;
      const sb = form.scoreB || form.scorePlayer2 || form.scoreAthlete2 || 0;
      
      if (typeof sa === 'number' && typeof sb === 'number') {
        if (sa === sb) summary = 'Match Tied';
        else summary = `${sa > sb ? tA : tB} won by ${Math.abs(sa - sb)} points`;
      } else {
        summary = `${tA} won`;
      }
    }
    const next = { ...form, status: v, summary };
    setForm(next);
    if (!isCreate) setTimeout(() => onSave(next), 0);
  };

  return (
    <div className='space-y-5'>
      <div className='grid grid-cols-2 gap-3'>
        {Object.keys(form)
          .filter((key) => key !== 'id' && key !== 'status' && key !== 'summary' && typeof form[key] !== 'object')
          .map((key) => (
            <TF 
              key={key} 
              label={key} 
              value={form[key]} 
              type={typeof form[key] === 'number' ? 'number' : 'text'}
              onChange={(val: any) => update(key, val)} 
            />
          ))}
      </div>
      <StatusSelect sport={sport} value={form.status ?? ''} onChange={handleStatusChange} />
      {isCreate && <SaveBtn onClick={() => onSave(form)} isCreate />}
    </div>
  );
}

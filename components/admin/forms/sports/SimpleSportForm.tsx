'use client';
import { useState } from 'react';
import { TF, StatusSelect, SaveBtn } from '../shared/FormControls';
import { DEFAULTS } from '../shared/constants';

export function SimpleSportForm({ sport, match, onSave, isCreate }: any) {
  const [form, setForm] = useState(match ?? DEFAULTS[sport as keyof typeof DEFAULTS]);

  const SYNC_CONFIG: Record<string, { field: string; prefix: string }> = {
    khokho: { field: 'currentInning', prefix: 'Inning ' },
    carrom: { field: 'currentBoard', prefix: 'Board ' },
    '8ball': { field: 'currentFrame', prefix: 'Frame ' },
    snooker: { field: 'currentFrame', prefix: 'Frame ' },
  };

  const config = SYNC_CONFIG[sport as string];

  const update = (key: string, value: any) => {
    const updates: any = { [key]: value };
    if (config && key === config.field) {
      updates.status = `${config.prefix}${value}`;
    }
    const next = { ...form, ...updates };
    setForm(next);
    if (!isCreate) setTimeout(() => onSave(next), 0);
  };

  const handleStatusChange = (v: string) => {
    const updates: any = { status: v };
    if (config && v.startsWith(config.prefix)) {
      const num = parseInt(v.replace(config.prefix, ''), 10);
      if (!isNaN(num)) updates[config.field] = num;
    }
    const next = { ...form, ...updates };
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

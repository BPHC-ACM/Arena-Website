'use client';
import { useState } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ACCENT, type SportId } from '@/app/lib/sports';

// Map each sport to its two participant field labels and keys
const PARTICIPANT_FIELDS: Record<SportId, [string, string, string, string]> = {
  cricket:      ['Team A', 'teamA', 'Team B', 'teamB'],
  basketball:   ['Team A', 'teamA', 'Team B', 'teamB'],
  football:     ['Team A', 'teamA', 'Team B', 'teamB'],
  volleyball:   ['Team A', 'teamA', 'Team B', 'teamB'],
  kabaddi:      ['Team A', 'teamA', 'Team B', 'teamB'],
  frisbee:      ['Team A', 'teamA', 'Team B', 'teamB'],
  hockey:       ['Team A', 'teamA', 'Team B', 'teamB'],
  khokho:       ['Team A', 'teamA', 'Team B', 'teamB'],
  throwball:    ['Team A', 'teamA', 'Team B', 'teamB'],
  tennis:       ['Player 1', 'player1', 'Player 2', 'player2'],
  badminton:    ['Player 1', 'player1', 'Player 2', 'player2'],
  carrom:       ['Player 1', 'player1', 'Player 2', 'player2'],
  chess:        ['Player 1', 'player1', 'Player 2', 'player2'],
  squash:       ['Player 1', 'player1', 'Player 2', 'player2'],
  tabletennis:  ['Player 1', 'player1', 'Player 2', 'player2'],
  '8ball':      ['Player 1', 'player1', 'Player 2', 'player2'],
  snooker:      ['Player 1', 'player1', 'Player 2', 'player2'],
  powerlifting: ['Athlete 1', 'athlete1', 'Athlete 2', 'athlete2'],
  skating:      ['Athlete 1', 'athlete1', 'Athlete 2', 'athlete2'],
  swimming:     ['Swimmer 1', 'swimmer1', 'Swimmer 2', 'swimmer2'],
};

interface Props {
  sport: SportId;
  onClose: () => void;
  onCreate: (data: Record<string, string | number>) => void;
}

export function CreateMatchModal({ sport, onClose, onCreate }: Props) {
  const [labelA, keyA, labelB, keyB] = PARTICIPANT_FIELDS[sport];
  const [valA, setValA] = useState('');
  const [valB, setValB] = useState('');
  const [totalOvers, setTotalOvers] = useState('10');

  const handleCreate = () => {
    if (!valA.trim() || !valB.trim()) return;
    const payload: Record<string, string | number> = {
      [keyA]: valA.trim(),
      [keyB]: valB.trim(),
    };

    if (sport === 'cricket') {
      const parsedTotalOvers = Number(totalOvers);
      payload.totalOvers =
        Number.isFinite(parsedTotalOvers) && parsedTotalOvers > 0
          ? parsedTotalOvers
          : 10;
    }

    onCreate(payload);
    onClose();
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4'>
      <div className='bg-[#0d0d0d] border border-[#222] rounded-xl w-full max-w-sm shadow-2xl'>
        <div className='flex items-center justify-between px-5 py-4 border-b border-[#1c1c1c]'>
          <h2 className='text-base font-bold text-white tracking-wide'>New Match</h2>
          <button
            onClick={onClose}
            className='text-[#555] hover:text-white transition-colors p-1'
          >
            <X className='w-4 h-4' />
          </button>
        </div>

        <div className='p-5 space-y-4'>
          <div className='space-y-1.5'>
            <Label className='text-xs text-[#888] uppercase tracking-wider font-medium'>
              {labelA}
            </Label>
            <Input
              autoFocus
              value={valA}
              onChange={(e) => setValA(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && document.getElementById('participant-b')?.focus()}
              placeholder={`Enter ${labelA}…`}
              className='bg-[#111] border-[#2a2a2a] text-sm h-10'
            />
          </div>
          <div className='space-y-1.5'>
            <Label className='text-xs text-[#888] uppercase tracking-wider font-medium'>
              {labelB}
            </Label>
            <Input
              id='participant-b'
              value={valB}
              onChange={(e) => setValB(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              placeholder={`Enter ${labelB}…`}
              className='bg-[#111] border-[#2a2a2a] text-sm h-10'
            />
          </div>

          {sport === 'cricket' && (
            <div className='space-y-1.5'>
              <Label className='text-xs text-[#888] uppercase tracking-wider font-medium'>
                Total Overs
              </Label>
              <Input
                type='number'
                min='1'
                value={totalOvers}
                onChange={(e) => setTotalOvers(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                className='bg-[#111] border-[#2a2a2a] text-sm h-10'
              />
            </div>
          )}

          <button
            onClick={handleCreate}
            disabled={!valA.trim() || !valB.trim()}
            className='w-full h-11 rounded-xl text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed'
            style={{ background: ACCENT }}
          >
            Create Match
          </button>
        </div>
      </div>
    </div>
  );
}

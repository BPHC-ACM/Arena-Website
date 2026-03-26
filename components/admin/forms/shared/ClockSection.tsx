'use client';
/**
 * ClockSection — reusable live-clock section for sport admin forms.
 *
 * Supports two modes:
 *  - "countdown"  (default) — counts down from a given time
 *  - "countup"              — counts up from a given time
 *
 * Props:
 *   timeValue     string   current time as "MM:SS"
 *   running       boolean  whether the clock is ticking
 *   mode          'countdown' | 'countup'
 *   defaultTime   string   value to reset to (default '00:00')
 *   warnAt        number   seconds threshold to turn red in countdown mode (default 60)
 *   label         string   section label (default 'Clock')
 *   children      ReactNode  extra controls to render inside the card (e.g. half/quarter toggle)
 *   onChange      (time: string, running: boolean) => void
 */
import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { ACCENT } from '@/app/lib/sports';
import { Label } from '@/components/ui/label';
import { TF } from './FormControls';

function parseTime(t: string): number {
  const parts = String(t ?? '0:00').split(':');
  if (parts.length === 2) return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  return parseInt(parts[0]) || 0;
}

function formatTime(s: number): string {
  const m = Math.floor(Math.max(0, s) / 60);
  const sec = Math.max(0, s) % 60;
  return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

interface ClockSectionProps {
  timeValue: string;
  running: boolean;
  mode?: 'countdown' | 'countup';
  defaultTime?: string;
  warnAt?: number;
  label?: string;
  children?: React.ReactNode;
  onChange: (time: string, running: boolean) => void;
}

export function ClockSection({
  timeValue,
  running,
  mode = 'countdown',
  defaultTime = '00:00',
  warnAt = 60,
  label = 'Clock',
  children,
  onChange,
}: ClockSectionProps) {
  const [secs, setSecs] = useState<number>(parseTime(timeValue));
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sync when server pushes a new timeValue (e.g. match changed)
  useEffect(() => {
    setSecs(parseTime(timeValue));
  }, [timeValue]);

  // Ticker
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecs((prev) => {
          if (mode === 'countdown') {
            if (prev <= 0) { clearInterval(intervalRef.current!); return 0; }
            return prev - 1;
          } else {
            return prev + 1;
          }
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, mode]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    onChange(formatTime(secs), !running);
  };

  const handleReset = (e: React.MouseEvent) => {
    e.preventDefault();
    const resetSecs = parseTime(defaultTime);
    setSecs(resetSecs);
    onChange(defaultTime, false);
  };

  const handleManualSet = (v: string) => {
    const parsed = parseTime(v);
    setSecs(parsed);
    onChange(v, false); // pause when manually setting
  };

  const isWarning = mode === 'countdown' && secs <= warnAt && secs > 0;
  const displayColor = isWarning ? '#ef4444' : 'white';

  return (
    <div className='space-y-3 rounded-xl bg-[#0a0a0a] border border-[#1e1e1e] p-4'>
      <Label
        className='text-xs font-bold uppercase tracking-widest'
        style={{ color: ACCENT }}
      >
        {label}
      </Label>

      {/* Extra controls slot (e.g. half/quarter/period toggle) */}
      {children && <div>{children}</div>}

      {/* Countdown/up display */}
      <div className='flex flex-col items-center gap-3 py-2'>
        <div
          className='font-mono text-5xl font-extrabold tabular-nums tracking-tight transition-colors'
          style={{
            color: displayColor,
            textShadow: isWarning ? '0 0 20px rgba(239,68,68,0.4)' : undefined,
          }}
        >
          {formatTime(secs)}
        </div>

        {/* Manual time input */}
        <div className='w-full'>
          <TF
            label='Set Time (MM:SS)'
            value={formatTime(secs)}
            onChange={handleManualSet}
            placeholder={defaultTime}
          />
        </div>

        {/* Clock control buttons */}
        <div className='flex gap-2 w-full'>
          <button
            onClick={handleToggle}
            className='flex-1 flex items-center justify-center h-10 rounded-lg text-[13px] font-bold transition-colors border'
            style={{
              background: running ? '#1a0808' : `${ACCENT}18`,
              borderColor: running ? '#3a1010' : `${ACCENT}44`,
              color: running ? '#ef4444' : ACCENT,
            }}
          >
            {running ? (
              <Pause className='w-3.5 h-3.5 mr-2 flex-shrink-0' />
            ) : (
              <Play className='w-3.5 h-3.5 mr-2 flex-shrink-0' />
            )}
            {running ? 'Pause Clock' : 'Start Clock'}
          </button>

          <button
            onClick={handleReset}
            className='flex items-center justify-center h-10 px-4 rounded-lg text-[13px] font-bold transition-colors border border-[#222] bg-[#111] text-[#666] hover:text-white hover:border-[#333]'
          >
            <RotateCcw className='w-3.5 h-3.5 mr-2 flex-shrink-0' />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

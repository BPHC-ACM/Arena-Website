'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ACCENT } from '@/app/lib/sports';
import { Delete, Save } from 'lucide-react';

// Ball button config
const BALL_BTNS = [
  { label: '0', value: '0', color: '#888', bg: '#161616' },
  { label: '1', value: '1', color: '#fff', bg: '#161616' },
  { label: '2', value: '2', color: '#fff', bg: '#161616' },
  { label: '3', value: '3', color: '#fff', bg: '#161616' },
  { label: '4', value: '4', color: ACCENT, bg: '#0d1a0a' },
  { label: '5', value: '5', color: '#fff', bg: '#161616' },
  { label: '6', value: '6', color: ACCENT, bg: '#0d1a0a' },
  { label: 'W', value: 'W', color: '#ef4444', bg: '#1a0808' },
  { label: 'WD', value: 'WD', color: '#facc15', bg: '#1a1400' },
  { label: 'WD+1', value: 'WD+1', color: '#facc15', bg: '#1a1400' },
  { label: 'NB', value: 'NB', color: '#facc15', bg: '#1a1400' },
  { label: 'NB+1', value: 'NB+1', color: '#facc15', bg: '#1a1400' },
];

const STATUS_OPTS = ['Innings I', 'Innings II', 'Break', 'Completed'];

// Determine if a ball counts toward the over (WD and NB don't)
const isLegalBall = (ball: string) =>
  !ball.startsWith('WD') && !ball.startsWith('NB');

// How many runs does a ball add to the batting score
const runsFromBall = (ball: string): number => {
  if (ball.startsWith('WD+') || ball.startsWith('NB+'))
    return 1 + parseInt(ball.slice(3), 10);
  if (ball === 'WD' || ball === 'NB') return 1;
  if (!isNaN(Number(ball))) return Number(ball);
  return 0; // W, LB, B, etc.
};

const defaultForm = () => ({
  teamA: '',
  teamB: '',
  firstFieldingTeam: 'B',
  scoreA: { runs: 0, wickets: 0, overs: '0.0', extras: 0 },
  scoreB: { runs: 0, wickets: 0, overs: '0.0', extras: 0 },
  innings: 1,
  status: 'Match started',
  details: {
    striker: { name: '', runs: 0, balls: 0, fours: 0, sixes: 0 },
    nonStriker: { name: '', runs: 0, balls: 0 },
    bowler: { name: '', overs: '0.0', runs: 0, wickets: 0 },
    recentBalls: [] as string[],
    target: 0,
    crr: '',
    rrr: '',
    partnershipRuns: 0,
    partnershipBalls: 0,
    fallOfWickets: [] as string[],
    summary: '',
  },
});

interface Props {
  match: any;
  onSave: (data: any) => void;
  isCreate?: boolean;
}

const TF = ({
  label,
  path,
  type = 'text',
  placeholder = '',
  get,
  setPatch,
  textVal,
  handleTextChange,
  handleTextBlur,
}: any) => (
  <div className='space-y-1.5'>
    <Label className='text-xs text-[#888] uppercase tracking-wider font-medium'>
      {label}
    </Label>
    {type === 'number' ? (
      <Input
        type='number'
        value={get(path) ?? 0}
        onChange={(e) => setPatch(path, Number(e.target.value))}
        className='bg-[#0d0d0d] border-[#222] text-sm h-9'
      />
    ) : (
      <Input
        type='text'
        value={textVal(path)}
        placeholder={placeholder}
        onChange={(e) => handleTextChange(path, e.target.value)}
        onBlur={() => handleTextBlur(path)}
        className='bg-[#0d0d0d] border-[#222] text-sm h-9'
      />
    )}
  </div>
);

export function CricketAdminForm({ match, onSave, isCreate }: Props) {
  const [form, setForm] = useState<any>(match ?? defaultForm());
  const [localValues, setLocalValues] = useState<Record<string, string>>({});

  useEffect(() => {
    setForm(match ? { ...match } : defaultForm());
    setLocalValues({});
  }, [match]);

  const iPath = (path: string) => {
    if (path.startsWith('details.')) {
      return form.innings === 2 ? 'details2.' + path.slice(8) : path;
    }
    return path;
  };

  const get = (path: string) =>
    iPath(path)
      .split('.')
      .reduce((c: any, k) => c?.[k], form);

  const updateAndSave = (updater: (prev: any) => any) => {
    setForm((prev: any) => {
      const next = updater(prev);
      if (!isCreate) setTimeout(() => onSave(next), 0);
      return next;
    });
  };

  const setPatch = (path: string, value: any) =>
    updateAndSave((prev) => {
      const parts = iPath(path).split('.');
      const next = JSON.parse(JSON.stringify(prev ?? {}));
      let cur = next;
      for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]] ??= {};
      cur[parts[parts.length - 1]] = value;
      return next;
    });

  const handleTextChange = (path: string, v: string) =>
    setLocalValues((p) => ({ ...p, [iPath(path)]: v }));
  const handleTextBlur = (path: string) => {
    const p = iPath(path);
    const v = localValues[p];
    if (v !== undefined) {
      setLocalValues((s) => {
        const n = { ...s };
        delete n[p];
        return n;
      });
      setPatch(path, v);
    }
  };
  const textVal = (path: string) => localValues[iPath(path)] ?? get(path) ?? '';

  // Add a ball delivery + auto-update score
  const addBall = (ball: string) => {
    updateAndSave((prev: any) => {
      const next = JSON.parse(JSON.stringify(prev));
      const dKey = next.innings === 2 ? 'details2' : 'details';
      const d = (next[dKey] ??= {});
      const balls: string[] = d.recentBalls ?? [];
      balls.push(ball);
      // Keep only last 10 shown
      d.recentBalls = balls.slice(-10);

      // Update batting score
      const runs = runsFromBall(ball);
      const isTeamABatting = (next.innings ?? 1) === 1 
        ? (next.firstFieldingTeam === 'B')
        : (next.firstFieldingTeam === 'A');
      const inningsKey = isTeamABatting ? 'scoreA' : 'scoreB';
      const score = (next[inningsKey] ??= {
        runs: 0,
        wickets: 0,
        overs: '0.0',
        extras: 0,
      });
      score.runs = (score.runs ?? 0) + runs;

      // Wicket
      if (ball === 'W') score.wickets = (score.wickets ?? 0) + 1;

      // Extras
      if (
        ball.startsWith('WD') ||
        ball.startsWith('NB') ||
        ball === 'LB' ||
        ball === 'B'
      ) {
        score.extras = (score.extras ?? 0) + 1;
      }

      // Advance overs on legal balls
      if (isLegalBall(ball)) {
        const [ov, b] = String(score.overs ?? '0.0').split('.').map(Number);
        const nextB = (b ?? 0) + 1;
        const nextOvers = nextB >= 6 ? `${(ov ?? 0) + 1}.0` : `${ov ?? 0}.${nextB}`;
        score.overs = nextOvers;
        
        // Bowler Overs
        if (d.bowler) {
          const [bov, bbb] = String(d.bowler.overs ?? '0.0').split('.').map(Number);
          const nextBbb = (bbb ?? 0) + 1;
          d.bowler.overs = nextBbb >= 6 ? `${(bov ?? 0) + 1}.0` : `${bov ?? 0}.${nextBbb}`;
        }

        // Partnership
        d.partnershipBalls = (d.partnershipBalls ?? 0) + 1;
        d.partnershipRuns = (d.partnershipRuns ?? 0) + runs;

        // Auto-calculated CRR
        const [ovFinal, bFinal] = nextOvers.split('.').map(Number);
        const totalOversDec = ovFinal + (bFinal / 6);
        d.crr = totalOversDec > 0 ? (score.runs / totalOversDec).toFixed(2) : "0.00";
      }
      return next;
    });
  };

  const removeBall = () =>
    updateAndSave((prev: any) => {
      const next = JSON.parse(JSON.stringify(prev));
      const dKey = (next.innings === 2) ? 'details2' : 'details';
      const balls: string[] = next[dKey]?.recentBalls ?? [];
      if (balls.length === 0) return next;
      
      const ball = balls[balls.length - 1];
      next[dKey].recentBalls = balls.slice(0, -1);

      // Revert score
      const runs = runsFromBall(ball);
      const isTeamABatting = (next.innings ?? 1) === 1 
        ? (next.firstFieldingTeam === 'B')
        : (next.firstFieldingTeam === 'A');
      const inningsKey = isTeamABatting ? 'scoreA' : 'scoreB';
      const score = next[inningsKey];
      if (!score) return next;

      score.runs = Math.max(0, (score.runs ?? 0) - runs);
      if (ball === 'W') score.wickets = Math.max(0, (score.wickets ?? 0) - 1);
      if (ball.startsWith('WD') || ball.startsWith('NB') || ball === 'LB' || ball === 'B') {
        score.extras = Math.max(0, (score.extras ?? 0) - 1);
      }

      const d = next[dKey];
      if (isLegalBall(ball)) {
        // Devance overs
        const [ov, b] = String(score.overs ?? '0.0').split('.').map(Number);
        const nextOvers = b === 0 ? (ov > 0 ? `${ov - 1}.5` : '0.0') : `${ov}.${b - 1}`;
        score.overs = nextOvers;

        // Bowler Overs
        if (d.bowler) {
          const [bov, bbb] = String(d.bowler.overs ?? '0.0').split('.').map(Number);
          d.bowler.overs = bbb === 0 ? (bov > 0 ? `${bov - 1}.5` : '0.0') : `${bov}.${bbb - 1}`;
        }

        d.partnershipBalls = Math.max(0, (d.partnershipBalls ?? 0) - 1);
        d.partnershipRuns = Math.max(0, (d.partnershipRuns ?? 0) - runs);

        // Auto-calculated CRR
        const [ovFinal, bFinal] = nextOvers.split('.').map(Number);
        const totalOversDec = ovFinal + (bFinal / 6);
        d.crr = totalOversDec > 0 ? (score.runs / totalOversDec).toFixed(2) : "0.00";
      }

      return next;
    });

  const getDKey = (f: any) => (f.innings === 2 ? 'details2' : 'details');
  const balls: string[] = form[getDKey(form)]?.recentBalls ?? [];

  const fp = { get, setPatch, textVal, handleTextChange, handleTextBlur };

  const submitForm = () => {
    const next = { ...form };
    for (const [k, v] of Object.entries(localValues)) {
      const parts = k.split('.');
      let cur = next;
      for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]] ??= {};
      if (v !== "") cur[parts[parts.length - 1]] = v;
    }
    onSave(next);
  };

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-2 gap-3'>
        <TF label='Team A' path='teamA' placeholder='CSK' {...fp} />
        <TF label='Team B' path='teamB' placeholder='MI' {...fp} />
      </div>

      <div className='space-y-1.5'>
        <Label className='text-xs text-[#888] uppercase tracking-wider font-medium'>First Fielding Team</Label>
        <div className='flex gap-2'>
          {['A', 'B'].map((t) => (
            <button
              key={t}
              onClick={() => setPatch('firstFieldingTeam', t)}
              className='flex-1 h-10 rounded-lg text-sm font-semibold border transition-colors'
              style={(form.firstFieldingTeam ?? 'B') === t ? { background: `${ACCENT}20`, borderColor: `${ACCENT}44`, color: ACCENT } : { background: '#0d0d0d', borderColor: '#222', color: '#666' }}
            >
              {t === 'A' ? (form.teamA || 'Team A') : (form.teamB || 'Team B')}
            </button>
          ))}
        </div>
      </div>

      <Separator className='bg-[#1e1e1e]' />

      {/* Score panels */}
      <div className='grid grid-cols-2 gap-3'>
        <div className='rounded-xl bg-[#0d0d0d] border border-[#1e1e1e] p-4 space-y-2 relative overflow-hidden'>
          <p className='text-xs text-[#888] font-semibold uppercase tracking-wider'>
            {form.teamA || 'Team A'}
          </p>
          <p className='font-mono text-3xl font-extrabold text-white'>
            {form.scoreA?.runs}/{form.scoreA?.wickets}
          </p>
          <p className='text-sm text-[#888]'>{form.scoreA?.overs} ov</p>
        </div>
        <div className='rounded-xl bg-[#0d0d0d] border border-[#1e1e1e] p-4 space-y-2 relative overflow-hidden'>
          <p className='text-xs text-[#888] font-semibold uppercase tracking-wider'>
            {form.teamB || 'Team B'}
          </p>
          <p className='font-mono text-3xl font-extrabold text-white'>
            {form.scoreB?.runs}/{form.scoreB?.wickets}
          </p>
          <p className='text-sm text-[#888]'>{form.scoreB?.overs} ov</p>
        </div>
      </div>

      {/* Innings */}
      <div className='space-y-1.5'>
        <Label className='text-xs text-[#888] uppercase tracking-wider font-medium'>
          Innings
        </Label>
        <div className='flex gap-2'>
          {[1, 2].map((i) => (
            <button
              key={i}
              onClick={() => setPatch('innings', i)}
              className='flex-1 h-10 rounded-lg text-sm font-semibold border transition-colors'
              style={
                (form.innings ?? 1) === i
                  ? {
                      background: `${ACCENT}20`,
                      borderColor: `${ACCENT}44`,
                      color: ACCENT,
                    }
                  : {
                      background: '#0d0d0d',
                      borderColor: '#222',
                      color: '#666',
                    }
              }
            >
              Innings {i}
            </button>
          ))}
        </div>
      </div>

      <Separator className='bg-[#1e1e1e]' />

      {/* Ball-by-ball */}
      <div className='space-y-3'>
        {/* Current over display */}
        <div className='flex items-center gap-2 min-h-[36px] overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
          {balls.length === 0 ? (
            <span className='text-sm text-[#444]'>No balls recorded yet</span>
          ) : (
            balls.map((b, i) => (
              <span
                key={i}
                className='w-9 h-9 flex items-center justify-center rounded-full text-sm font-bold font-mono flex-shrink-0'
                style={{
                  background:
                    b === 'W'
                      ? '#3a0808'
                      : b.startsWith('WD') || b.startsWith('NB')
                        ? '#1a1400'
                        : b === '4' || b === '6'
                          ? '#0d1a0a'
                          : '#1e1e1e',
                  color:
                    b === 'W'
                      ? '#ef4444'
                      : b.startsWith('WD') || b.startsWith('NB')
                        ? '#facc15'
                        : b === '4' || b === '6'
                          ? ACCENT
                          : '#ccc',
                  border: '1px solid #2a2a2a',
                }}
              >
                {b}
              </span>
            ))
          )}
        </div>

        {/* Ball buttons */}
        <div className='grid grid-cols-7 gap-1.5'>
          {BALL_BTNS.map((btn) => (
            <button
              key={btn.value}
              onClick={() => addBall(btn.value)}
              className='h-11 rounded-lg text-sm font-bold font-mono border transition-all hover:brightness-125 active:scale-95'
              style={{
                background: btn.bg,
                borderColor: '#2a2a2a',
                color: btn.color,
              }}
            >
              {btn.label}
            </button>
          ))}
          <button
            onClick={removeBall}
            className='h-11 rounded-lg text-sm border border-[#2a2a2a] bg-[#161616] text-[#555] transition-all hover:text-[#888] flex items-center justify-center'
          >
            <Delete className="w-4 h-4 flex-shrink-0" />
          </button>
        </div>
      </div>

      <Separator className='bg-[#1e1e1e]' />

      <Separator className='bg-[#1e1e1e]' />

      {/* Target / CRR / RRR */}
      {form.innings === 2 ? (
        <div className='grid grid-cols-3 gap-3'>
          <TF label='Target' path='details2.target' type='number' {...fp} />
          <div className='space-y-1.5'>
            <Label className='text-xs text-[#888] uppercase tracking-wider font-medium'>CRR</Label>
            <div className='h-9 flex items-center px-3 bg-[#0d0d0d] border border-[#222] rounded-md text-sm text-[#aaa] font-mono'>
              {get('details2.crr') || '0.00'}
            </div>
          </div>
          <TF label='RRR' path='details2.rrr' placeholder='11.2' {...fp} />
        </div>
      ) : (
        <div className='space-y-1.5 max-w-[120px]'>
          <Label className='text-xs text-[#888] uppercase tracking-wider font-medium'>CRR</Label>
          <div className='h-9 flex items-center px-3 bg-[#0d0d0d] border border-[#222] rounded-md text-sm text-[#aaa] font-mono'>
            {get('details.crr') || '0.00'}
          </div>
        </div>
      )}

      {/* Status dropdown */}
      <div className='space-y-1.5 w-full'>
        <Label className='text-xs text-[#888] uppercase tracking-wider font-medium'>
          Match Status
        </Label>
        <Select
          value={STATUS_OPTS.includes(form.status) ? form.status : 'Innings I'}
          onValueChange={(v) => {
            if (v === 'Completed') {
              updateAndSave((prev) => {
                const next = JSON.parse(JSON.stringify(prev));
                next.status = v;
                const sa = next.scoreA?.runs ?? 0;
                const sb = next.scoreB?.runs ?? 0;
                const tA = next.teamA || 'Team A';
                const tB = next.teamB || 'Team B';
                let sum = '';
                if (sa === sb) sum = 'Match Tied';
                else if (sb > sa)
                  sum = `${tB} won by ${10 - (next.scoreB?.wickets ?? 0)} wickets`;
                else sum = `${tA} won by ${sa - sb} runs`;
                const dKey = next.innings === 2 ? 'details2' : 'details';
                if (!next[dKey]) next[dKey] = {};
                next[dKey].summary = sum;
                return next;
              });
            } else {
              setPatch('status', v);
            }
          }}
        >
          <SelectTrigger className='w-full bg-[#0d0d0d] border-[#222] text-sm h-10'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className='bg-[#111] border-[#222]'>
            {STATUS_OPTS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isCreate && (
        <button
          onClick={submitForm}
          className='w-full h-12 rounded-xl text-sm font-bold gap-2 text-black flex items-center justify-center transition-opacity hover:opacity-90'
          style={{ background: ACCENT }}
        >
          <Save className="w-4 h-4 mr-2 flex-shrink-0" />
          Create Match
        </button>
      )}
    </div>
  );
}

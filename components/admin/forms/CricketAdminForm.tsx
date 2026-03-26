'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  { label: 'WD', value: 'WD_MODAL', color: '#facc15', bg: '#1a1400' },
  { label: 'NB', value: 'NB_MODAL', color: '#facc15', bg: '#1a1400' },
];

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

const extrasFromBall = (ball: string): number => {
  if (ball.startsWith('WD+') || ball.startsWith('NB+')) {
    const extraRuns = parseInt(ball.slice(3), 10);
    return 1 + (Number.isNaN(extraRuns) ? 0 : extraRuns);
  }
  if (ball === 'WD' || ball === 'NB' || ball === 'LB' || ball === 'B') {
    return 1;
  }
  return 0;
};

const defaultForm = () => ({
  teamA: '',
  teamB: '',
  firstFieldingTeam: 'B',
  totalOvers: 10,
  scoreA: { runs: 0, wickets: 0, overs: '0.0', extras: 0 },
  scoreB: { runs: 0, wickets: 0, overs: '0.0', extras: 0 },
  innings: 1,
  status: 'Innings I',
  details: {
    striker: { name: '', runs: 0, balls: 0, fours: 0, sixes: 0 },
    nonStriker: { name: '', runs: 0, balls: 0 },
    bowler: { name: '', overs: '0.0', runs: 0, wickets: 0 },
    recentBalls: [] as string[],
    target: 0,
    crr: '',
    rrr: '',
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

const normalizeFieldingTeam = (
  raw: unknown,
  teamA: string,
  teamB: string,
): 'A' | 'B' => {
  if (raw === 'A' || raw === 'B') return raw;
  if (typeof raw !== 'string') return 'B';

  const value = raw.trim().toLowerCase();
  if (value === 'team a') return 'A';
  if (value === 'team b') return 'B';
  if (teamA && value === teamA.trim().toLowerCase()) return 'A';
  if (teamB && value === teamB.trim().toLowerCase()) return 'B';

  return 'B';
};

const getBattingTeamKey = (
  innings: number,
  firstFieldingTeam: 'A' | 'B',
): 'A' | 'B' => {
  if (innings === 1) return firstFieldingTeam === 'A' ? 'B' : 'A';
  return firstFieldingTeam;
};

const oversToBalls = (overs: unknown): number => {
  const [fullOversRaw, ballsRaw] = String(overs ?? '0.0').split('.');
  const fullOvers = Number(fullOversRaw) || 0;
  const balls = Number(ballsRaw) || 0;
  return fullOvers * 6 + Math.min(Math.max(balls, 0), 5);
};

const resolveBattingFirstTeamKey = (
  firstFieldingTeam: 'A' | 'B',
  scoreA: any,
  scoreB: any,
): 'A' | 'B' => {
  const expected = getBattingTeamKey(1, firstFieldingTeam);
  const other = expected === 'A' ? 'B' : 'A';

  const expectedBalls = oversToBalls(expected === 'A' ? scoreA?.overs : scoreB?.overs);
  const otherBalls = oversToBalls(other === 'A' ? scoreA?.overs : scoreB?.overs);

  // If legacy data has the toss/fielding side flipped, follow real scoring progress.
  if (expectedBalls === 0 && otherBalls > 0) return other;
  return expected;
};

const resolveCurrentBattingTeamKey = (
  innings: number,
  firstFieldingTeam: 'A' | 'B',
  scoreA: any,
  scoreB: any,
): 'A' | 'B' => {
  const battingFirst = resolveBattingFirstTeamKey(firstFieldingTeam, scoreA, scoreB);
  if (innings === 1) return battingFirst;
  return battingFirst === 'A' ? 'B' : 'A';
};

export function CricketAdminForm({ match, onSave, isCreate }: Props) {
  const [form, setForm] = useState<any>(match ?? defaultForm());
  const [localValues, setLocalValues] = useState<Record<string, string>>({});
  const [extraModalType, setExtraModalType] = useState<'WD' | 'NB' | null>(
    null,
  );

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
      syncStatus(next);
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

  const syncStatus = (next: any) => {
    const innings = next.innings ?? 1;
    const scoreA = next.scoreA ?? { runs: 0, wickets: 0 };
    const scoreB = next.scoreB ?? { runs: 0, wickets: 0 };
    const sa = scoreA.runs ?? 0;
    const sb = scoreB.runs ?? 0;
    const wa = scoreA.wickets ?? 0;
    const wb = scoreB.wickets ?? 0;
    const tA = next.teamA || 'Team A';
    const tB = next.teamB || 'Team B';
    const firstFielding = normalizeFieldingTeam(
      next.firstFieldingTeam,
      tA,
      tB,
    );
    next.firstFieldingTeam = firstFielding;
    const totalOvers = Number(next.totalOvers) || 10;
    const maxBalls = Math.max(1, Math.floor(totalOvers * 6));
    const batting1Key = resolveBattingFirstTeamKey(firstFielding, scoreA, scoreB);

    if (innings === 1) {
      const batting1Score = batting1Key === 'A' ? scoreA : scoreB;
      const innings1DoneByOvers = oversToBalls(batting1Score?.overs) >= maxBalls;

      if (wa === 10 || wb === 10 || innings1DoneByOvers) next.status = 'Break';
      else next.status = 'Innings I';
      const dKey = innings === 2 ? 'details2' : 'details';
      if (next[dKey]) next[dKey].summary = '';
      return;
    }

    // Innings 2
    const target = (batting1Key === 'A' ? sa : sb) + 1;
    const batting2Key = batting1Key === 'A' ? 'B' : 'A';
    const batting2Runs = batting2Key === 'A' ? sa : sb;
    const batting2Wickets = batting2Key === 'A' ? wa : wb;
    const batting2Score = batting2Key === 'A' ? scoreA : scoreB;
    const innings2DoneByOvers = oversToBalls(batting2Score?.overs) >= maxBalls;

    const isMatchOver = batting2Runs >= target || batting2Wickets === 10 || innings2DoneByOvers;

    const dKey2 = innings === 2 ? 'details2' : 'details';
    if (!next[dKey2]) next[dKey2] = {};
    next[dKey2].target = target;
    next.status = isMatchOver ? 'Completed' : 'Innings II';
  };

  // Add a ball delivery + auto-update score
  const addBall = (ball: string) => {
    updateAndSave((prev: any) => {
      const next = JSON.parse(JSON.stringify(prev));

      const existingSummary =
        next?.details2?.summary || next?.details?.summary || '';
      const existingStatus = String(next?.status || '');
      const resultAlreadyDeclared =
        /won|tied/i.test(existingSummary) || existingStatus === 'Completed';

      if (resultAlreadyDeclared) {
        return next;
      }

      const totalOvers = Number(next.totalOvers) || 10;
      const maxBalls = Math.max(1, Math.floor(totalOvers * 6));
      const dKey = next.innings === 2 ? 'details2' : 'details';
      const d = (next[dKey] ??= {});

      const runs = runsFromBall(ball);
      const normalizedFielding = normalizeFieldingTeam(
        next.firstFieldingTeam,
        next.teamA || '',
        next.teamB || '',
      );
      next.firstFieldingTeam = normalizedFielding;
      const battingTeamKey = resolveCurrentBattingTeamKey(
        next.innings ?? 1,
        normalizedFielding,
        next.scoreA,
        next.scoreB,
      );
      const inningsKey = battingTeamKey === 'A' ? 'scoreA' : 'scoreB';
      const score = (next[inningsKey] ??= {
        runs: 0,
        wickets: 0,
        overs: '0.0',
        extras: 0,
      });

      const inningsDoneByOvers = oversToBalls(score.overs) >= maxBalls;
      if (inningsDoneByOvers) {
        syncStatus(next);
        return next;
      }

      const balls: string[] = d.recentBalls ?? [];
      balls.push(ball);
      d.recentBalls = balls.slice(-10);

      score.runs = (score.runs ?? 0) + runs;
      if (ball === 'W') score.wickets = (score.wickets ?? 0) + 1;
      score.extras = (score.extras ?? 0) + extrasFromBall(ball);

      if (isLegalBall(ball)) {
        const [ov, b] = String(score.overs ?? '0.0')
          .split('.')
          .map(Number);
        const nextB = (b ?? 0) + 1;
        const nextOvers =
          nextB >= 6 ? `${(ov ?? 0) + 1}.0` : `${ov ?? 0}.${nextB}`;
        score.overs = nextOvers;

        if (d.bowler) {
          const [bov, bbb] = String(d.bowler.overs ?? '0.0')
            .split('.')
            .map(Number);
          const nextBbb = (bbb ?? 0) + 1;
          d.bowler.overs =
            nextBbb >= 6 ? `${(bov ?? 0) + 1}.0` : `${bov ?? 0}.${nextBbb}`;
        }

        const [ovFin, bFin] = nextOvers.split('.').map(Number);
        const totalOversDec = ovFin + bFin / 6;
        d.crr =
          totalOversDec > 0 ? (score.runs / totalOversDec).toFixed(2) : '0.00';
      }
      syncStatus(next);
      return next;
    });
  };

  const removeBall = () =>
    updateAndSave((prev: any) => {
      const next = JSON.parse(JSON.stringify(prev));
      const dKey = next.innings === 2 ? 'details2' : 'details';
      const balls: string[] = next[dKey]?.recentBalls ?? [];
      if (balls.length === 0) return next;

      const ball = balls[balls.length - 1];
      next[dKey].recentBalls = balls.slice(0, -1);

      const runs = runsFromBall(ball);
      const normalizedFielding = normalizeFieldingTeam(
        next.firstFieldingTeam,
        next.teamA || '',
        next.teamB || '',
      );
      next.firstFieldingTeam = normalizedFielding;
      const battingTeamKey = resolveCurrentBattingTeamKey(
        next.innings ?? 1,
        normalizedFielding,
        next.scoreA,
        next.scoreB,
      );
      const inningsKey = battingTeamKey === 'A' ? 'scoreA' : 'scoreB';
      const score = next[inningsKey];
      if (!score) return next;

      score.runs = Math.max(0, (score.runs ?? 0) - runs);
      if (ball === 'W') score.wickets = Math.max(0, (score.wickets ?? 0) - 1);
      score.extras = Math.max(0, (score.extras ?? 0) - extrasFromBall(ball));

      const d = next[dKey];
      if (isLegalBall(ball)) {
        const [ov, b] = String(score.overs ?? '0.0')
          .split('.')
          .map(Number);
        const nextOvers =
          b === 0 ? (ov > 0 ? `${ov - 1}.5` : '0.0') : `${ov}.${b - 1}`;
        score.overs = nextOvers;

        if (d.bowler) {
          const [bov, bbb] = String(d.bowler.overs ?? '0.0')
            .split('.')
            .map(Number);
          d.bowler.overs =
            bbb === 0
              ? bov > 0
                ? `${bov - 1}.5`
                : '0.0'
              : `${bov}.${bbb - 1}`;
        }

        const [ovFin, bFin] = nextOvers.split('.').map(Number);
        const totalOversDec = ovFin + bFin / 6;
        d.crr =
          totalOversDec > 0 ? (score.runs / totalOversDec).toFixed(2) : '0.00';
      }
      syncStatus(next);
      return next;
    });

  const getDKey = (f: any) => (f.innings === 2 ? 'details2' : 'details');
  const balls: string[] = form[getDKey(form)]?.recentBalls ?? [];
  const fp = { get, setPatch, textVal, handleTextChange, handleTextBlur };

  const autoTarget = (() => {
    const firstFielding = normalizeFieldingTeam(
      form.firstFieldingTeam,
      form.teamA || '',
      form.teamB || '',
    );
    const sa = form.scoreA?.runs ?? 0;
    const sb = form.scoreB?.runs ?? 0;
    const batting1Key = resolveBattingFirstTeamKey(firstFielding, form.scoreA, form.scoreB);
    return (batting1Key === 'A' ? sa : sb) + 1;
  })();

  const isFirstInningsDone = (() => {
    const firstFielding = normalizeFieldingTeam(
      form.firstFieldingTeam,
      form.teamA || '',
      form.teamB || '',
    );
    const totalOvers = Number(form.totalOvers) || 10;
    const maxBalls = Math.max(1, Math.floor(totalOvers * 6));
    const batting1Key = resolveBattingFirstTeamKey(firstFielding, form.scoreA, form.scoreB);
    const batting1Score = batting1Key === 'A' ? form.scoreA : form.scoreB;
    const batting1Wickets = batting1Score?.wickets ?? 0;
    const batting1Balls = oversToBalls(batting1Score?.overs);

    return batting1Wickets >= 10 || batting1Balls >= maxBalls;
  })();

  const matchResultText = (() => {
    const summary2 = form?.details2?.summary;
    const summary1 = form?.details?.summary;
    const status = form?.status;

    if (typeof summary2 === 'string' && /(won|tied)/i.test(summary2)) {
      return summary2;
    }
    if (typeof summary1 === 'string' && /(won|tied)/i.test(summary1)) {
      return summary1;
    }
    if (typeof status === 'string' && /(won|tied)/i.test(status)) {
      return status;
    }
    if (status === 'Completed') {
      return 'Match Completed';
    }
    return '';
  })();

  const isScoringLocked = Boolean(matchResultText);

  const handleBallButton = (value: string) => {
    if (value === 'WD_MODAL') {
      setExtraModalType('WD');
      return;
    }
    if (value === 'NB_MODAL') {
      setExtraModalType('NB');
      return;
    }
    addBall(value);
  };

  const selectExtraBall = (extraRuns: number) => {
    if (!extraModalType) return;
    const value = extraRuns === 0 ? extraModalType : `${extraModalType}+${extraRuns}`;
    addBall(value);
    setExtraModalType(null);
  };

  const submitForm = () => {
    const next = { ...form };
    for (const [k, v] of Object.entries(localValues)) {
      const parts = k.split('.');
      let cur = next;
      for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]] ??= {};
      if (v !== '') cur[parts[parts.length - 1]] = v;
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
        <Label className='text-xs text-[#888] uppercase tracking-wider font-medium'>
          First Fielding Team
        </Label>
        <div className='flex gap-2'>
          {['A', 'B'].map((t) => (
            <button
              key={t}
              onClick={() => setPatch('firstFieldingTeam', t)}
              className='flex-1 h-10 rounded-lg text-sm font-semibold border transition-colors'
              style={
                (form.firstFieldingTeam ?? 'B') === t
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
              {t === 'A' ? form.teamA || 'Team A' : form.teamB || 'Team B'}
            </button>
          ))}
        </div>
      </div>

      <div className='space-y-1.5 max-w-40'>
        <TF label='Total Overs' path='totalOvers' type='number' {...fp} />
      </div>

      <Separator className='bg-[#1e1e1e]' />

      {/* Score panels */}
      <div className='grid grid-cols-2 gap-3'>
        <div className='rounded-xl bg-[#0d0d0d] border border-[#1e1e1e] p-4 space-y-2 relative overflow-hidden'>
          <p className='text-xs text-[#888] font-semibold uppercase tracking-wider'>
            {form.teamA || 'Team A'}
          </p>
          <p className='font-mono text-3xl font-extrabold text-white'>
            {form.scoreA?.runs}
            {form.scoreA?.wickets === 10 ? '' : `/${form.scoreA?.wickets}`}
          </p>
          <p className='text-sm text-[#888]'>{form.scoreA?.overs} ov</p>
        </div>
        <div className='rounded-xl bg-[#0d0d0d] border border-[#1e1e1e] p-4 space-y-2 relative overflow-hidden'>
          <p className='text-xs text-[#888] font-semibold uppercase tracking-wider'>
            {form.teamB || 'Team B'}
          </p>
          <p className='font-mono text-3xl font-extrabold text-white'>
            {form.scoreB?.runs}
            {form.scoreB?.wickets === 10 ? '' : `/${form.scoreB?.wickets}`}
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
            (() => {
              const innings2Locked = i === 2 && !isFirstInningsDone;
              return (
            <button
              key={i}
              onClick={() => {
                if (innings2Locked) return;
                setPatch('innings', i);
              }}
              disabled={innings2Locked}
              className='flex-1 h-10 rounded-lg text-sm font-semibold border transition-colors'
              style={
                innings2Locked
                  ? {
                      background: '#0a0a0a',
                      borderColor: '#1a1a1a',
                      color: '#3f3f3f',
                      cursor: 'not-allowed',
                    }
                  : (form.innings ?? 1) === i
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
              );
            })()
          ))}
        </div>
      </div>

      <Separator className='bg-[#1e1e1e]' />

      {/* Ball-by-ball */}
      <div className='space-y-3'>
        <div
          className='overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'
          style={{ direction: 'rtl' }}
        >
          <div
            className='flex items-center gap-2 min-h-[36px] w-max mr-auto'
            style={{ direction: 'ltr' }}
          >
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
        </div>

        <div className='grid grid-cols-7 gap-1.5'>
          {BALL_BTNS.map((btn) => (
            <button
              key={btn.value}
              onClick={() => handleBallButton(btn.value)}
              disabled={isScoringLocked}
              className='h-11 rounded-lg text-sm font-bold font-mono border transition-all hover:brightness-125 active:scale-95'
              style={{
                background: btn.bg,
                borderColor: '#2a2a2a',
                color: btn.color,
                opacity: isScoringLocked ? 0.45 : 1,
                cursor: isScoringLocked ? 'not-allowed' : 'pointer',
              }}
            >
              {btn.label}
            </button>
          ))}
          <button
            onClick={removeBall}
            disabled={isScoringLocked}
            className='h-11 rounded-lg text-sm border border-[#2a2a2a] bg-[#161616] text-[#555] transition-all hover:text-[#888] flex items-center justify-center'
            style={{
              opacity: isScoringLocked ? 0.45 : 1,
              cursor: isScoringLocked ? 'not-allowed' : 'pointer',
            }}
          >
            <Delete className='w-4 h-4 flex-shrink-0' />
          </button>
        </div>
      </div>

      <Separator className='bg-[#1e1e1e]' />

      {/* Target / CRR / RRR */}
      {form.innings === 2 ? (
        <div className='grid grid-cols-3 gap-3'>
          <div className='space-y-1.5'>
            <Label className='text-xs text-[#888] uppercase tracking-wider font-medium'>
              Target
            </Label>
            <div className='h-9 flex items-center px-3 bg-[#0d0d0d] border border-[#222] rounded-md text-sm text-white font-mono'>
              {isFirstInningsDone ? autoTarget : '--'}
            </div>
          </div>
          <div className='space-y-1.5'>
            <Label className='text-xs text-[#888] uppercase tracking-wider font-medium'>
              CRR
            </Label>
            <div className='h-9 flex items-center px-3 bg-[#0d0d0d] border border-[#222] rounded-md text-sm text-[#aaa] font-mono'>
              {get('details2.crr') || '0.00'}
            </div>
          </div>
          <TF label='RRR' path='details2.rrr' placeholder='11.2' {...fp} />
        </div>
      ) : (
        <div className='space-y-1.5 max-w-[120px]'>
          <Label className='text-xs text-[#888] uppercase tracking-wider font-medium'>
            CRR
          </Label>
          <div className='h-9 flex items-center px-3 bg-[#0d0d0d] border border-[#222] rounded-md text-sm text-[#aaa] font-mono'>
            {get('details.crr') || '0.00'}
          </div>
        </div>
      )}

      {matchResultText && (
        <div className='rounded-lg border px-3 py-2 text-sm font-semibold bg-[#0d150a] border-[#274021] text-[#9de28a]'>
          {matchResultText}
        </div>
      )}

      {extraModalType && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'>
          <div className='w-full max-w-xs rounded-xl border border-[#222] bg-[#0d0d0d] p-4 space-y-4'>
            <div>
              <p className='text-sm font-bold text-white'>
                {extraModalType} Extra Runs
              </p>
              <p className='text-xs text-[#666] mt-1'>
                Select additional runs (base 1 is included automatically).
              </p>
            </div>

            <div className='grid grid-cols-5 gap-2'>
              {[0, 1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  onClick={() => selectExtraBall(n)}
                  className='h-10 rounded-lg border border-[#2a2a2a] text-sm font-bold text-[#facc15] bg-[#1a1400] hover:brightness-125'
                >
                  +{n}
                </button>
              ))}
            </div>

            <button
              onClick={() => setExtraModalType(null)}
              className='w-full h-10 rounded-lg border border-[#2a2a2a] text-sm text-[#888] hover:text-white'
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {isCreate && (
        <button
          onClick={submitForm}
          className='w-full h-12 rounded-xl text-sm font-bold gap-2 text-black flex items-center justify-center transition-opacity hover:opacity-90'
          style={{ background: ACCENT }}
        >
          <Save className='w-4 h-4 mr-2 flex-shrink-0' />
          Create Match
        </button>
      )}
    </div>
  );
}

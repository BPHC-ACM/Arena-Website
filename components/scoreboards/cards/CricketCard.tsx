import type { CricketMatch } from '@/app/lib/types';

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

const oversToBalls = (overs: string | number | undefined): number => {
  const [fullOversRaw, ballsRaw] = String(overs ?? '0.0').split('.');
  const fullOvers = Number(fullOversRaw) || 0;
  const balls = Number(ballsRaw) || 0;
  return fullOvers * 6 + Math.min(Math.max(balls, 0), 5);
};

export function CricketCard({ match }: { match: CricketMatch }) {
  const { teamA, teamB, scoreA, scoreB, status } = match;
  // dynamically select the active details based on innings
  const currentInnings = match.innings ?? 1;
  const details =
    currentInnings === 2
      ? (match as CricketMatch & { details2?: typeof match.details })
          .details2 || match.details
      : match.details;

  const fieldingTeam = normalizeFieldingTeam(match.firstFieldingTeam, teamA, teamB);
  const battingTeamKey = getBattingTeamKey(currentInnings, fieldingTeam);
  const isTeamABatting = battingTeamKey === 'A';
  const leftTeamKey = isTeamABatting ? 'B' : 'A';
  const rightTeamKey = isTeamABatting ? 'A' : 'B';

  const totalOvers = Number(match.totalOvers ?? 20);
  const battingScore = battingTeamKey === 'A' ? scoreA : scoreB;
  const oversLeftBalls = Math.max(
    0,
    Math.round(totalOvers * 6) - oversToBalls(battingScore?.overs),
  );
  const oversLeft = `${Math.floor(oversLeftBalls / 6)}.${oversLeftBalls % 6}`;

  const isComplete =
    status === 'Completed' || status === 'Match complete';
  let winner: 'A' | 'B' | 'Tie' | null = null;
  if (isComplete) {
    if (scoreA.runs > scoreB.runs) winner = 'A';
    else if (scoreB.runs > scoreA.runs) winner = 'B';
    else if (scoreA.runs === scoreB.runs) winner = 'Tie';
  }

  const renderTeam = (teamKey: 'A' | 'B', align: 'left' | 'right') => {
    const isLoser =
      isComplete && winner && winner !== 'Tie' && winner !== teamKey;
    const teamName = teamKey === 'A' ? teamA : teamB;
    const score = teamKey === 'A' ? scoreA : scoreB;
    const colorClass = isLoser ? 'text-[#666]' : 'text-white';

    return (
      <div className={align === 'right' ? 'text-right' : 'text-left'}>
        <p
          className={`text-base md:text-lg font-bold leading-tight ${colorClass}`}
        >
          {teamName}
        </p>
        <div className='mt-1 font-mono'>
          <div className={`text-3xl md:text-4xl font-extrabold ${colorClass}`}>
            {score.runs}
            {score.wickets === 10 ? '' : `/${score.wickets}`}
          </div>
          <div className='text-sm text-[#555] mt-0.5 leading-none'>
            ({score.overs} ov)
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='space-y-4'>
      {/* Team vs Team - large, prominent */}
      <div className='grid grid-cols-[1fr_auto_1fr] gap-2 items-center'>
        {renderTeam(leftTeamKey, 'left')}
        <div className='text-[#333] text-sm font-mono px-2'>vs</div>
        {renderTeam(rightTeamKey, 'right')}
      </div>

      <div className='flex gap-4 text-xs font-mono'>
        <span className='text-[#555]'>
          Total Overs <span className='text-white'>{totalOvers}</span>
        </span>
        <span className='text-[#555]'>
          Overs Left <span className='text-white'>{oversLeft}</span>
        </span>
      </div>

      {/* Target / required (2nd innings) */}
      {details?.target != null && details.target > 0 && (
        <div className='flex gap-4 text-xs font-mono'>
          <span className='text-[#555]'>
            Target{' '}
            <span className='text-white font-bold'>{details.target}</span>
          </span>
          {details.crr && (
            <span className='text-[#555]'>
              CRR <span className='text-white'>{details.crr}</span>
            </span>
          )}
          {details.rrr && (
            <span className='text-[#555]'>
              RRR <span className='text-white'>{details.rrr}</span>
            </span>
          )}
        </div>
      )}

      {/* Live match details */}
      {details && (
        <div className='rounded-lg bg-[#0d0d0d] p-3 space-y-2.5'>
          {/* Recent balls */}
          {details.recentBalls && details.recentBalls.length > 0 && (
            <div
              className='overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'
              style={{ direction: 'rtl' }}
            >
              <div
                className='flex items-center gap-1.5 w-max mr-auto'
                style={{ direction: 'ltr' }}
              >
                {details.recentBalls.map((ball: string, i: number) => (
                  <span
                    key={i}
                    className='w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold font-mono flex-shrink-0'
                    style={{
                      background:
                        ball === 'W'
                          ? '#5c1a1a'
                          : ball === '4' || ball === '6'
                            ? '#1a2e12'
                            : '#1a1a1a',
                      color:
                        ball === 'W'
                          ? '#ef4444'
                          : ball === '4' || ball === '6'
                            ? '#57a639'
                            : '#888',
                      border:
                        ball === 'W'
                          ? '1px solid #5c1a1a'
                          : ball === '4' || ball === '6'
                            ? '1px solid #57a63940'
                            : '1px solid #2a2a2a',
                    }}
                  >
                    {ball}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CRR / RRR stats */}
          {(details.crr || details.rrr) && (
            <div className='flex gap-4 text-xs font-mono border-t border-[#1a1a1a] pt-2'>
              {details.crr && (
                <span className='text-[#555]'>
                  CRR <span className='text-white'>{details.crr}</span>
                </span>
              )}
              {details.rrr && (
                <span className='text-[#555]'>
                  RRR <span className='text-white'>{details.rrr}</span>
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Fall of wickets */}
      {details?.fallOfWickets && details.fallOfWickets.length > 0 && (
        <div className='text-xs text-[#555]'>
          FoW: {details.fallOfWickets.join('  ·  ')}
        </div>
      )}



      {/* Status */}
      {status && (
        <p className='text-xs text-center text-[#555] pt-1'>{status}</p>
      )}
    </div>
  );
}

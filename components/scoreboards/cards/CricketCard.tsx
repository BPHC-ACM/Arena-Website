import type { CricketMatch } from '@/app/lib/types';

export function CricketCard({ match }: { match: CricketMatch }) {
  const { teamA, teamB, scoreA, scoreB, status } = match;
  // dynamically select the active details based on innings
  const currentInnings = match.innings ?? 1;
  const details = currentInnings === 2 ? ((match as CricketMatch & { details2?: typeof match.details }).details2 || match.details) : match.details;

  const mExt = match as any;
  const fieldingTeam = mExt.firstFieldingTeam ?? 'B';
  const isTeamABatting = (fieldingTeam === 'B' && currentInnings !== 2) || (fieldingTeam === 'A' && currentInnings === 2);
  const leftTeamKey = isTeamABatting ? 'B' : 'A';
  const rightTeamKey = isTeamABatting ? 'A' : 'B';

  const isComplete = status === 'Completed' || status === 'Match complete' || !!details?.summary;
  let winner: 'A' | 'B' | 'Tie' | null = null;
  if (isComplete) {
    if (scoreA.runs > scoreB.runs) winner = 'A';
    else if (scoreB.runs > scoreA.runs) winner = 'B';
    else if (scoreA.runs === scoreB.runs) winner = 'Tie';
  }

  const renderTeam = (teamKey: 'A' | 'B', align: 'left' | 'right') => {
    const isLoser = isComplete && winner && winner !== 'Tie' && winner !== teamKey;
    const teamName = teamKey === 'A' ? teamA : teamB;
    const score = teamKey === 'A' ? scoreA : scoreB;
    const colorClass = isLoser ? 'text-[#666]' : 'text-white';

    return (
      <div className={align === 'right' ? 'text-right' : 'text-left'}>
        <p className={`text-base md:text-lg font-bold leading-tight ${colorClass}`}>
          {teamName}
        </p>
        <div className='mt-1 font-mono'>
          <div className={`text-3xl md:text-4xl font-extrabold ${colorClass}`}>
            {score.runs}/{score.wickets}
          </div>
          <div className='text-sm text-[#555] mt-0.5 leading-none'>
            ({score.overs} ov)
          </div>
        </div>
        {score.extras != null && score.extras > 0 && (
          <p className='text-[11px] text-[#555] mt-0.5'>
            Extras: {score.extras}
          </p>
        )}
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
      {details && !details.summary && (
        <div className='rounded-lg bg-[#0d0d0d] border border-[#1a1a1a] p-3 space-y-2.5'>

          {/* Partnership */}
          {details.partnershipRuns != null && (
            <div className='text-xs text-[#555]'>
              Partnership:{' '}
              <span className='text-[#aaa]'>{details.partnershipRuns}</span>
              {details.partnershipBalls ? (
                <span> ({details.partnershipBalls}b)</span>
              ) : null}
            </div>
          )}

          {/* Recent balls */}
          {details.recentBalls && details.recentBalls.length > 0 && (
            <div className='flex items-center gap-1.5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
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
          )}

          {/* CRR / RRR when NOT in target mode */}
          {(!details.target || details.target === 0) &&
            (details.crr || details.rrr) && (
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

      {/* Summary / POTM after match */}
      {details?.summary && (
        <p className='text-sm text-center text-[#666] italic'>
          {details.summary}
        </p>
      )}

      {/* Status */}
      {status && (
        <p className='text-xs text-center text-[#555] pt-1 border-t border-[#181818]'>
          {status}
        </p>
      )}
    </div>
  );
}

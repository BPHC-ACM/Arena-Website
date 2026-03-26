'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import type { SportId } from '@/app/lib/sports';
import { ACCENT } from '@/app/lib/sports';
import { isInProgress } from '@/app/lib/utils';
import { Badge } from '@/components/ui/badge';
import { CricketCard } from './cards/CricketCard';
import { BasketballCard } from './cards/BasketballCard';
import { FootballCard } from './cards/FootballCard';
import { TennisCard } from './cards/TennisCard';
import { BadmintonCard } from './cards/BadmintonCard';
import { VolleyballCard } from './cards/VolleyballCard';
import { KabaddiCard } from './cards/KabaddiCard';
import { FrisbeeCard } from './cards/FrisbeeCard';
import { CarromCard } from './cards/CarromCard';
import { ChessCard } from './cards/ChessCard';
import { HockeyCard } from './cards/HockeyCard';
import { KhoKhoCard } from './cards/KhoKhoCard';
import { PowerliftingCard } from './cards/PowerliftingCard';
import { SkatingCard } from './cards/SkatingCard';
import { EightBallCard } from './cards/EightBallCard';
import { SnookerCard } from './cards/SnookerCard';
import { SquashCard } from './cards/SquashCard';
import { SwimmingCard } from './cards/SwimmingCard';
import { TableTennisCard } from './cards/TableTennisCard';
import { ThrowballCard } from './cards/ThrowballCard';
import { generateShareCard } from './ShareCard';
import { Share2 } from 'lucide-react';

interface Props {
  sport: SportId;
  match: any;
}

export function MatchCard({ sport, match }: Props) {
  const live = isInProgress(match);
  const [sharing, setSharing] = useState(false);

  const handleShare = () => {
    setSharing(true);
    setTimeout(() => {
      generateShareCard(sport, match);
      setSharing(false);
    }, 50);
  };

  return (
    <div
      className='rounded-xl transition-all duration-300 backdrop-blur-sm'
      style={{
        background: live
          ? `linear-gradient(135deg, rgba(87,166,57,0.18) 0%, rgba(17,17,17,0.85) 100%)`
          : 'rgba(17,17,17,0.75)',
        border: live ? `1px solid ${ACCENT}28` : '1px solid rgba(255,255,255,0.06)',
        boxShadow: live
          ? `0 0 0 1px ${ACCENT}10, 0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)`
          : '0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)',
      }}
    >
      {live && (
        <div className='flex items-center gap-2 px-5 pt-4'>
          <span
            className='w-2 h-2 rounded-full animate-pulse'
            style={{ background: ACCENT, boxShadow: `0 0 6px ${ACCENT}` }}
          />
          <Badge
            variant='outline'
            className='text-[11px] font-bold tracking-widest border-current py-0 px-2'
            style={{ color: ACCENT, borderColor: `${ACCENT}44` }}
          >
            LIVE
          </Badge>
        </div>
      )}

      <div className='p-5 md:p-6'>
        {sport === 'cricket' && <CricketCard match={match as any} />}
        {sport === 'basketball' && <BasketballCard match={match as any} />}
        {sport === 'football' && <FootballCard match={match as any} />}
        {sport === 'tennis' && <TennisCard match={match as any} />}
        {sport === 'badminton' && <BadmintonCard match={match as any} />}
        {sport === 'volleyball' && <VolleyballCard match={match as any} />}
        {sport === 'kabaddi' && <KabaddiCard match={match as any} />}
        {sport === 'frisbee' && <FrisbeeCard match={match as any} />}
        {sport === 'carrom' && <CarromCard match={match as any} />}
        {sport === 'chess' && <ChessCard match={match as any} />}
        {sport === 'hockey' && <HockeyCard match={match as any} />}
        {sport === 'khokho' && <KhoKhoCard match={match as any} />}
        {sport === 'powerlifting' && <PowerliftingCard match={match as any} />}
        {sport === 'skating' && <SkatingCard match={match as any} />}
        {sport === '8ball' && <EightBallCard match={match as any} />}
        {sport === 'snooker' && <SnookerCard match={match as any} />}
        {sport === 'squash' && <SquashCard match={match as any} />}
        {sport === 'swimming' && <SwimmingCard match={match as any} />}
        {sport === 'tabletennis' && <TableTennisCard match={match as any} />}
        {sport === 'throwball' && <ThrowballCard match={match as any} />}

        <div className='mt-5 pt-3 border-t border-[#181818] flex justify-end'>
          <button
            onClick={handleShare}
            disabled={sharing}
            className='flex items-center gap-2 px-3 py-1.5 rounded-md text-[13px] text-[#555] hover:text-[#999] transition-colors disabled:opacity-40'
          >
            <Share2 className='w-3.5 h-3.5 flex-shrink-0' />
            {sharing ? 'Generating…' : 'Share'}
          </button>
        </div>
      </div>
    </div>
  );
}

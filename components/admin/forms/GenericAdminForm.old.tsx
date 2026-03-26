'use client';
import type { SportId } from '@/app/lib/sports';
import { BasketballForm } from './sports/BasketballForm';
import { TennisForm } from './sports/TennisForm';
import { FootballForm } from './sports/FootballForm';
import { BadmintonForm } from './sports/BadmintonForm';
import { VolleyballForm } from './sports/VolleyballForm';
import { KabaddiForm } from './sports/KabaddiForm';
import { FrisbeeForm } from './sports/FrisbeeForm';
import { SquashForm } from './sports/SquashForm';
import { TableTennisForm } from './sports/TableTennisForm';
import { ThrowballForm } from './sports/ThrowballForm';
import { HockeyForm } from './sports/HockeyForm';
import { SimpleSportForm } from './sports/SimpleSportForm';

interface Props {
  sport: SportId;
  match: any;
  onSave: (data: any) => void;
  isCreate?: boolean;
}

const SIMPLE_SPORTS: SportId[] = ['carrom', 'chess', 'khokho', 'powerlifting', 'skating', '8ball', 'snooker', 'swimming'];

export function GenericAdminForm({ sport, match, onSave, isCreate }: Props) {
  if (SIMPLE_SPORTS.includes(sport)) {
    return <SimpleSportForm sport={sport} match={match} onSave={onSave} isCreate={isCreate} />;
  }

  switch (sport) {
    case 'basketball': return <BasketballForm match={match} onSave={onSave} isCreate={isCreate} />;
    case 'tennis': return <TennisForm match={match} onSave={onSave} isCreate={isCreate} />;
    case 'football': return <FootballForm match={match} onSave={onSave} isCreate={isCreate} />;
    case 'badminton': return <BadmintonForm match={match} onSave={onSave} isCreate={isCreate} />;
    case 'volleyball': return <VolleyballForm match={match} onSave={onSave} isCreate={isCreate} />;
    case 'kabaddi': return <KabaddiForm match={match} onSave={onSave} isCreate={isCreate} />;
    case 'frisbee': return <FrisbeeForm match={match} onSave={onSave} isCreate={isCreate} />;
    case 'squash': return <SquashForm match={match} onSave={onSave} isCreate={isCreate} />;
    case 'tabletennis': return <TableTennisForm match={match} onSave={onSave} isCreate={isCreate} />;
    case 'throwball': return <ThrowballForm match={match} onSave={onSave} isCreate={isCreate} />;
    case 'hockey': return <HockeyForm match={match} onSave={onSave} isCreate={isCreate} />;
    default:
      return <p className='text-sm text-[#888]'>No form implemented for {sport}.</p>;
  }
}

// Central sports configuration - Font Awesome icons, single TMNT accent

export const ACCENT = '#57a639'; // Ninja Turtle green - single accent for all sports

export interface SportConfig {
  id: SportId;
  name: string;
  shortName: string;
  icon: string;
  isTeamSport: boolean;
}

export type SportId =
  | 'cricket'
  | 'basketball'
  | 'football'
  | 'tennis'
  | 'badminton'
  | 'volleyball'
  | 'kabaddi'
  | 'frisbee'
  | 'carrom'
  | 'chess'
  | 'hockey'
  | 'khokho'
  | 'powerlifting'
  | 'skating'
  | '8ball'
  | 'snooker'
  | 'squash'
  | 'swimming'
  | 'tabletennis'
  | 'throwball';

export const SPORTS: SportConfig[] = [
  {
    id: 'cricket',
    name: 'Cricket',
    shortName: 'CRI',
    icon: 'fa-sharp fa-solid fa-cricket-bat-ball',
    isTeamSport: true,
  },
  {
    id: 'basketball',
    name: 'Basketball',
    shortName: 'BBL',
    icon: 'fa-sharp fa-solid fa-basketball',
    isTeamSport: true,
  },
  {
    id: 'football',
    name: 'Football',
    shortName: 'FTB',
    icon: 'fa-sharp fa-solid fa-soccer-ball',
    isTeamSport: true,
  },
  {
    id: 'tennis',
    name: 'Tennis',
    shortName: 'TEN',
    icon: 'fa-sharp fa-solid fa-racquet',
    isTeamSport: false,
  },
  {
    id: 'badminton',
    name: 'Badminton',
    shortName: 'BAD',
    icon: 'fa-sharp fa-solid fa-shuttlecock',
    isTeamSport: false,
  },
  {
    id: 'volleyball',
    name: 'Volleyball',
    shortName: 'VBL',
    icon: 'fa-sharp fa-solid fa-volleyball',
    isTeamSport: true,
  },
  {
    id: 'kabaddi',
    name: 'Kabaddi',
    shortName: 'KAB',
    icon: 'fa-sharp fa-solid fa-person-walking-dashed-line-arrow-right',
    isTeamSport: true,
  },
  {
    id: 'frisbee',
    name: 'Frisbee',
    shortName: 'FRS',
    icon: 'fa-duotone fa-solid fa-flying-disc',
    isTeamSport: true,
  },
  {
    id: 'carrom',
    name: 'Carrom',
    shortName: 'CAR',
    icon: 'fa-duotone fa-solid fa-draw-square',
    isTeamSport: false,
  },
  {
    id: 'chess',
    name: 'Chess',
    shortName: 'CHE',
    icon: 'fa-sharp fa-solid fa-chess',
    isTeamSport: false,
  },
  {
    id: 'hockey',
    name: 'Hockey',
    shortName: 'HOC',
    icon: 'fa-duotone fa-solid fa-field-hockey-stick-ball',
    isTeamSport: true,
  },
  {
    id: 'khokho',
    name: 'Kho Kho',
    shortName: 'KKO',
    icon: 'fa-duotone fa-solid fa-people-pulling',
    isTeamSport: true,
  },
  {
    id: 'powerlifting',
    name: 'Powerlifting',
    shortName: 'PWL',
    icon: 'fa-sharp fa-solid fa-dumbbell',
    isTeamSport: false,
  },
  {
    id: 'skating',
    name: 'Skating',
    shortName: 'SKT',
    icon: 'fa-sharp fa-solid fa-skating',
    isTeamSport: false,
  },
  {
    id: '8ball',
    name: '8 Ball Pool',
    shortName: '8BP',
    icon: 'fa-sharp fa-solid fa-pool-8-ball',
    isTeamSport: false,
  },
  {
    id: 'snooker',
    name: 'Snooker',
    shortName: 'SNK',
    icon: 'fa-duotone fa-solid fa-ball-pile',
    isTeamSport: false,
  },
  {
    id: 'squash',
    name: 'Squash',
    shortName: 'SQH',
    icon: 'fa-duotone fa-solid fa-racquet',
    isTeamSport: false,
  },
  {
    id: 'swimming',
    name: 'Swimming',
    shortName: 'SWM',
    icon: 'fa-sharp fa-solid fa-person-swimming',
    isTeamSport: false,
  },
  {
    id: 'tabletennis',
    name: 'Table Tennis',
    shortName: 'TTE',
    icon: 'fa-sharp fa-solid fa-table-tennis-paddle-ball',
    isTeamSport: false,
  },
  {
    id: 'throwball',
    name: 'Throwball',
    shortName: 'THB',
    icon: 'fa-duotone fa-solid fa-volleyball',
    isTeamSport: true,
  },
];

export const getSport = (id: SportId): SportConfig =>
  SPORTS.find((s) => s.id === id) ?? SPORTS[0];

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
  | 'frisbee';

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
    icon: 'fa-sharp fa-solid fa-person-running',
    isTeamSport: true,
  },
  {
    id: 'frisbee',
    name: 'Frisbee',
    shortName: 'FRS',
    icon: 'fa-duotone fa-solid fa-flying-disc',
    isTeamSport: true,
  },
];

export const getSport = (id: SportId): SportConfig =>
  SPORTS.find((s) => s.id === id) ?? SPORTS[0];

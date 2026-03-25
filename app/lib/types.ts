/* eslint-disable @typescript-eslint/no-explicit-any */

// ── Shared ────────────────────────────────────────────────────────────────────
export interface BaseMatch {
  id: number;
  status: string;
  tournamentName?: string;
  startedAt?: string;
  summary?: string;
}

// ── Cricket ───────────────────────────────────────────────────────────────────
export interface CricketScore {
  runs: number;
  wickets: number;
  overs: string;
  extras?: number;
}

export interface CricketBatsman {
  name: string;
  runs: number;
  balls: number;
  fours?: number;
  sixes?: number;
}

export interface CricketBowler {
  name: string;
  overs: string;
  runs: number;
  wickets: number;
  economy?: number;
}

export interface CricketDetails {
  striker?: CricketBatsman & { isStriker?: boolean };
  nonStriker?: CricketBatsman;
  bowler?: CricketBowler;
  crr?: string;
  rrr?: string;
  target?: number;
  recentBalls?: string[];
  summary?: string; // e.g. POTM after match ends
  fallOfWickets?: string[]; // ["1/34","2/67",...]
  partnershipRuns?: number;
  partnershipBalls?: number;
  innings?: number; // 1 or 2
}

export interface CricketMatch extends BaseMatch {
  teamA: string;
  teamB: string;
  scoreA: CricketScore;
  scoreB: CricketScore;
  innings?: number;
  details?: CricketDetails;
}

// ── Basketball ────────────────────────────────────────────────────────────────
export interface BasketballMatch extends BaseMatch {
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  currentQuarter: number;
  gameClock: string;
  shotClock?: number;
  quarterScoresA: number[];
  quarterScoresB: number[];
  foulsA?: number;
  foulsB?: number;
  timeoutsA?: number;
  timeoutsB?: number;
}

// ── Football ──────────────────────────────────────────────────────────────────
export interface FootballEvent {
  minute: number;
  addedTime?: number;
  team: 'A' | 'B';
  playerName: string;
  assistName?: string;
  type: 'goal' | 'own_goal' | 'yellow' | 'red' | 'sub';
}

export interface FootballMatch extends BaseMatch {
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  matchTime: number;
  half: number;
  events?: FootballEvent[];
  yellowCardsA?: number;
  yellowCardsB?: number;
  redCardsA?: number;
  redCardsB?: number;
}

// ── Tennis ────────────────────────────────────────────────────────────────────
export interface TennisMatch extends BaseMatch {
  player1: string;
  player2: string;
  setsPlayer1: number[];
  setsPlayer2: number[];
  currentSet: number;
  currentGameScorePlayer1: number | string; // 0/15/30/40/A
  currentGameScorePlayer2: number | string;
  server?: 1 | 2;
  surface?: string;
  aces1?: number;
  aces2?: number;
  doubleFaults1?: number;
  doubleFaults2?: number;
}

// ── Badminton ─────────────────────────────────────────────────────────────────
export interface BadmintonMatch extends BaseMatch {
  player1: string;
  player2: string;
  gamesPlayer1: number[];
  gamesPlayer2: number[];
  currentGame: number;
  currentPointsPlayer1: number;
  currentPointsPlayer2: number;
  server?: 1 | 2;
  bestOf?: number;
}

// ── Volleyball ────────────────────────────────────────────────────────────────
export interface VolleyballMatch extends BaseMatch {
  teamA: string;
  teamB: string;
  setsTeamA: number[];
  setsTeamB: number[];
  currentSet: number;
  currentPointsTeamA: number;
  currentPointsTeamB: number;
  setWinsA: number;
  setWinsB: number;
  bestOf?: number;
  servingTeam?: 'A' | 'B';
}

// ── Kabaddi ───────────────────────────────────────────────────────────────────
export interface KabaddiMatch extends BaseMatch {
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  playersOnMatA: number;
  playersOnMatB: number;
  raidTimer: number;
  raidingTeam?: string;
  bonusActive?: boolean;
  superRaidActive?: boolean;
  half?: number;
  timeRemaining?: string;
}

// ── Frisbee ───────────────────────────────────────────────────────────────────
export interface FrisbeeMatch extends BaseMatch {
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  timeRemaining: string;
  pointCap: number;
  possession?: string;
}

// ── Union ─────────────────────────────────────────────────────────────────────
export type AnyMatch =
  | CricketMatch
  | BasketballMatch
  | FootballMatch
  | TennisMatch
  | BadmintonMatch
  | VolleyballMatch
  | KabaddiMatch
  | FrisbeeMatch;

export type MatchData = Record<string, any>;

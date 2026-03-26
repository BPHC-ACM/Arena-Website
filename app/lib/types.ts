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
  firstFieldingTeam?: 'A' | 'B';
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

// ── Carrom ────────────────────────────────────────────────────────────────────
export interface CarromMatch extends BaseMatch {
  player1: string;
  player2: string;
  scorePlayer1: number;
  scorePlayer2: number;
  currentBoard: number;
  bestOf?: number;
  board1Player1?: number;
  board2Player1?: number;
  board3Player1?: number;
  board1Player2?: number;
  board2Player2?: number;
  board3Player2?: number;
  striker?: 1 | 2;
}

// ── Chess ─────────────────────────────────────────────────────────────────────
export interface ChessMatch extends BaseMatch {
  player1: string;
  player2: string;
  timePlayer1: string;
  timePlayer2: string;
  moveCount: number;
  currentTurn?: 1 | 2;
  timeControl?: string;
  result?: string;
}

// ── Hockey ────────────────────────────────────────────────────────────────────
export interface HockeyMatch extends BaseMatch {
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  currentPeriod: number;
  matchTime: string;
  periodScoresA: number[];
  periodScoresB: number[];
  penaltiesA?: number;
  penaltiesB?: number;
}

// ── Kho Kho ──────────────────────────────────────────────────────────────────
export interface KhoKhoMatch extends BaseMatch {
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  currentInning: number;
  chasingTeam?: 'A' | 'B';
  defendersRemaining?: number;
  timeRemaining: string;
  inning1ScoreA?: number;
  inning2ScoreA?: number;
  inning1ScoreB?: number;
  inning2ScoreB?: number;
}

// ── Powerlifting ─────────────────────────────────────────────────────────────
export interface PowerliftingMatch extends BaseMatch {
  athlete1: string;
  athlete2: string;
  squatAthlete1?: number;
  benchAthlete1?: number;
  deadliftAthlete1?: number;
  squatAthlete2?: number;
  benchAthlete2?: number;
  deadliftAthlete2?: number;
  totalAthlete1: number;
  totalAthlete2: number;
  currentLift?: 'squat' | 'bench' | 'deadlift';
  weightClass?: string;
}

// ── Skating ──────────────────────────────────────────────────────────────────
export interface SkatingMatch extends BaseMatch {
  athlete1: string;
  athlete2: string;
  time1?: string;
  time2?: string;
  distance?: string;
  eventType?: 'speed' | 'artistic';
  scoreAthlete1?: number;
  scoreAthlete2?: number;
}

// ── 8 Ball Pool ──────────────────────────────────────────────────────────────
export interface EightBallMatch extends BaseMatch {
  player1: string;
  player2: string;
  framesPlayer1: number;
  framesPlayer2: number;
  currentFrame: number;
  bestOf?: number;
  ballsRemainingPlayer1?: number;
  ballsRemainingPlayer2?: number;
  onBreak?: 1 | 2;
}

// ── Snooker ──────────────────────────────────────────────────────────────────
export interface SnookerMatch extends BaseMatch {
  player1: string;
  player2: string;
  framesPlayer1: number;
  framesPlayer2: number;
  currentFrame: number;
  currentScorePlayer1: number;
  currentScorePlayer2: number;
  bestOf?: number;
  onTable?: 1 | 2;
  remainingPoints?: number;
}

// ── Squash ───────────────────────────────────────────────────────────────────
export interface SquashMatch extends BaseMatch {
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

// ── Swimming ─────────────────────────────────────────────────────────────────
export interface SwimmingMatch extends BaseMatch {
  swimmer1: string;
  swimmer2: string;
  time1?: string;
  time2?: string;
  distance?: string;
  stroke?: string;
  lane1?: number;
  lane2?: number;
}

// ── Table Tennis ─────────────────────────────────────────────────────────────
export interface TableTennisMatch extends BaseMatch {
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

// ── Throwball ────────────────────────────────────────────────────────────────
export interface ThrowballMatch extends BaseMatch {
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

// ── Union ─────────────────────────────────────────────────────────────────────
export type AnyMatch =
  | CricketMatch
  | BasketballMatch
  | FootballMatch
  | TennisMatch
  | BadmintonMatch
  | VolleyballMatch
  | KabaddiMatch
  | FrisbeeMatch
  | CarromMatch
  | ChessMatch
  | HockeyMatch
  | KhoKhoMatch
  | PowerliftingMatch
  | SkatingMatch
  | EightBallMatch
  | SnookerMatch
  | SquashMatch
  | SwimmingMatch
  | TableTennisMatch
  | ThrowballMatch;

export type MatchData = Record<string, any>;

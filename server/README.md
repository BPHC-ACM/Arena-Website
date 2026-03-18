# Multi-Sport Scoreboard Backend API

Complete backend with REST APIs and WebSocket support for 8 sports.

## Installation

```bash
cd server
npm install
```

## Run Server

```bash
npm start
```

Server runs on: `http://localhost:3001`
WebSocket: `ws://localhost:3001`

## API Endpoints

### All Sports Support These Routes:

```
GET    /api/{sport}          - Get current match state
POST   /api/{sport}          - Create new match
PUT    /api/{sport}/update   - Update match state
DELETE /api/{sport}          - Reset match
```

### Sports Available:

- cricket
- basketball
- football
- tennis
- badminton
- volleyball
- kabaddi
- frisbee

## WebSocket Events

Every update emits a WebSocket event with the format:

```javascript
{
  "event": "{sport}_update",
  "data": { ...full match state }
}
```

Events:
- `cricket_update`
- `basketball_update`
- `football_update`
- `tennis_update`
- `badminton_update`
- `volleyball_update`
- `kabaddi_update`
- `frisbee_update`

## Example Usage

### Create Cricket Match

```bash
POST /api/cricket
Content-Type: application/json

{
  "teamA": "Mumbai Indians",
  "teamB": "Chennai Super Kings",
  "scoreA": {
    "runs": 0,
    "wickets": 0,
    "overs": 0
  }
}
```

### Update Cricket Match

```bash
PUT /api/cricket/update
Content-Type: application/json

{
  "scoreA": {
    "runs": 152,
    "wickets": 6,
    "overs": 18.3
  },
  "runRateA": 8.24
}
```

### Get Current State

```bash
GET /api/cricket
```

### Reset Match

```bash
DELETE /api/cricket
```

## Data Models

### Cricket
```javascript
{
  teamA, teamB,
  scoreA: { runs, wickets, overs },
  scoreB: { runs, wickets, overs },
  runRateA, runRateB,
  target, required, requiredRate,
  currentBatsmen: [],
  currentBowler: { name, overs, runs, wickets },
  innings, status
}
```

### Basketball
```javascript
{
  teamA, teamB,
  scoreA, scoreB,
  quarterScoresA: [Q1, Q2, Q3, Q4],
  quarterScoresB: [Q1, Q2, Q3, Q4],
  currentQuarter,
  gameClock, shotClock,
  status
}
```

### Football
```javascript
{
  teamA, teamB,
  scoreA, scoreB,
  matchTime, half,
  possessionA, possessionB,
  status
}
```

### Tennis
```javascript
{
  player1, player2,
  setsPlayer1: [], setsPlayer2: [],
  currentSet,
  currentGameScorePlayer1, currentGameScorePlayer2,
  server, status
}
```

### Badminton
```javascript
{
  player1, player2,
  gamesPlayer1: [], gamesPlayer2: [],
  currentGame,
  currentPointsPlayer1, currentPointsPlayer2,
  server, bestOf, status
}
```

### Volleyball
```javascript
{
  teamA, teamB,
  setsTeamA: [], setsTeamB: [],
  currentSet,
  currentPointsTeamA, currentPointsTeamB,
  setWinsA, setWinsB,
  bestOf, status
}
```

### Kabaddi
```javascript
{
  teamA, teamB,
  scoreA, scoreB,
  playersOnMatA, playersOnMatB,
  raidTimer, raidingTeam,
  bonusActive, superRaidActive,
  half, timeRemaining, status
}
```

### Frisbee
```javascript
{
  teamA, teamB,
  scoreA, scoreB,
  possession,
  timeRemaining, pointCap,
  status
}
```

## Validation Rules

### Cricket
- wickets: 0-10
- runs, overs: >= 0

### Basketball
- scores: >= 0
- quarter: 1-4
- shotClock: >= 0

### Football
- scores: >= 0
- matchTime: >= 0
- half: 1-2

### Tennis
- game scores: >= 0
- server: 1-2

### Badminton
- points: >= 0
- server: 1-2

### Volleyball
- points, set wins: >= 0

### Kabaddi
- scores: >= 0
- playersOnMat: 0-7
- raidTimer: >= 0

### Frisbee
- scores: >= 0
- pointCap: >= 1

## Architecture

```
/server
  /routes       - Express routes for each sport
  /controllers  - Business logic + validation
  /models       - In-memory data storage
  /socket       - WebSocket event emitters
  app.js        - Main server file
```

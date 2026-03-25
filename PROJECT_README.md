# Multi-Sport Scoreboard System

Complete full-stack scoreboard system with 8 sports, REST APIs, and real-time WebSocket updates.

## Features

**8 Sport-Specific Scoreboards**

- Cricket (T20 Format)
- Basketball
- Football (Soccer)
- Tennis
- Badminton
- Volleyball
- Kabaddi
- Ultimate Frisbee

**Full-Stack Architecture**

- Next.js frontend with Tailwind CSS
- Express.js backend with REST APIs
- WebSocket real-time updates
- Sport-specific data models
- Modular, maintainable code structure

## Quick Start

### Manual Start

**Backend:**

```bash
cd server
npm install
npm start
```

**Frontend:**

```bash
npm install
npm run dev
```

## Access

- **Frontend Scoreboards:** http://localhost:3000/scoreboards
- **Backend API:** http://localhost:3001
- **WebSocket:** ws://localhost:3001

## Project Structure

```
/
├── app/
│   ├── scoreboards/
│   │   ├── cricket/page.tsx
│   │   ├── basketball/page.tsx
│   │   ├── football/page.tsx
│   │   ├── tennis/page.tsx
│   │   ├── badminton/page.tsx
│   │   ├── volleyball/page.tsx
│   │   ├── kabaddi/page.tsx
│   │   ├── frisbee/page.tsx
│   │   └── page.tsx (navigation)
│   └── ...
├── server/
│   ├── routes/           (8 sport-specific route files)
│   ├── controllers/      (8 sport-specific controllers)
│   ├── models/          (8 sport-specific data models)
│   ├── socket/          (WebSocket handler)
│   ├── app.js           (Main server)
│   └── package.json
```

## API Endpoints

All sports follow the same REST pattern:

```
GET    /api/{sport}          - Get current match state
POST   /api/{sport}          - Create new match
PUT    /api/{sport}/update   - Update match state
DELETE /api/{sport}          - Reset match
```

**Available sports:**
`cricket`, `basketball`, `football`, `tennis`, `badminton`, `volleyball`, `kabaddi`, `frisbee`

## WebSocket Events

Real-time updates are emitted as:

```javascript
{
  "event": "{sport}_update",
  "data": { ...full match state }
}
```

**Events:**

- `cricket_update`
- `basketball_update`
- `football_update`
- `tennis_update`
- `badminton_update`
- `volleyball_update`
- `kabaddi_update`
- `frisbee_update`

## Example API Usage

### Create a Cricket Match

```bash
curl -X POST http://localhost:3001/api/cricket \
  -H "Content-Type: application/json" \
  -d '{
    "teamA": "Mumbai Indians",
    "teamB": "Chennai Super Kings",
    "scoreA": {"runs": 0, "wickets": 0, "overs": 0}
  }'
```

### Update Score

```bash
curl -X PUT http://localhost:3001/api/cricket/update \
  -H "Content-Type: application/json" \
  -d '{
    "scoreA": {"runs": 152, "wickets": 6, "overs": 18.3},
    "runRateA": 8.24
  }'
```

### Get Current State

```bash
curl http://localhost:3001/api/cricket
```

## Sport-Specific Data Models

### Cricket

- Runs/Wickets, Overs, Run Rate
- Target & Required RR (for chasing team)
- Current Batsmen, Current Bowler
- Innings tracking

### Basketball

- Quarter-wise scores (Q1-Q4)
- Game Clock, Shot Clock
- Total scores

### Football

- Match time, Half indicator
- Possession percentage
- Live status

### Tennis

- Set scores
- Current game score (0, 15, 30, 40)
- Server indicator

### Badminton

- Best of 3 games
- Current points
- Serving player

### Volleyball

- Best of 5 sets
- Set-wise scores
- Current set points

### Kabaddi

- Raid timer (30 seconds)
- Players on mat count
- Bonus/Super raid indicators

### Ultimate Frisbee

- Point cap (race to 21)
- Time remaining
- Possession indicator

## Key Design Principles

- **Sport-Specific Models** - No generic schemas
- **Accurate Scoring Rules** - Follows official sport formats
- **Real-Time Updates** - WebSocket integration
- **Modular Architecture** - Easy to extend
- **Clean Separation** - Routes → Controllers → Models
- **Validation** - Prevents invalid game states

## Development

### Add a New Sport

1. Create model: `server/models/{sport}Model.js`
2. Create controller: `server/controllers/{sport}Controller.js`
3. Create routes: `server/routes/{sport}.js`
4. Add to `server/app.js`: `app.use('/api/{sport}', {sport}Routes)`
5. Add emit function in `server/socket/socketHandler.js`
6. Create frontend page: `app/scoreboards/{sport}/page.tsx`

## Tech Stack

**Frontend:**

- Next.js 16
- React 19
- Tailwind CSS 4
- TypeScript

**Backend:**

- Node.js
- Express.js
- WebSocket (ws)
- In-memory storage

## License

MIT

## Support

For issues or questions, see `/server/README.md` for detailed API documentation.

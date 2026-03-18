"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import Link from "next/link";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001";

const SPORTS = [
  { id: "cricket", name: "Cricket" },
  { id: "basketball", name: "Basketball" },
  { id: "football", name: "Football" },
  { id: "tennis", name: "Tennis" },
  { id: "badminton", name: "Badminton" },
  { id: "volleyball", name: "Volleyball" },
  { id: "kabaddi", name: "Kabaddi" },
  { id: "frisbee", name: "Frisbee" },
] as const;

type SportId = (typeof SPORTS)[number]["id"];
type MatchData = Record<string, any>;

const MOCK_DATA = {
  cricket: [
    {
      id: 1,
      teamA: "Mumbai Indians",
      teamB: "Chennai Super Kings",
      scoreA: { runs: 184, wickets: 6, overs: "20.0" },
      scoreB: { runs: 142, wickets: 8, overs: "18.4" },
      status: "Mumbai Indians won by 42 runs",
      details: {
        summary: "MOTM: Rohit Sharma - 68(42)"
      }
    },
    {
      id: 2,
      teamA: "Royal Challengers",
      teamB: "Delhi Capitals",
      scoreA: { runs: 156, wickets: 4, overs: "16.2" },
      scoreB: { runs: 125, wickets: 9, overs: "20.0" },
      status: "Match in progress",
      details: {
        striker: { name: "V. Kohli", runs: 72, balls: 45 },
        nonStriker: { name: "G. Maxwell", runs: 14, balls: 8 },
        bowler: { name: "A. Nortje", overs: "3.2", runs: 28, wickets: 1 },
        crr: "9.55",
        rrr: "11.2",
        recentBalls: ["1", "4", "0", "1", "2", "6"]
      }
    }
  ],
  basketball: [
    {
      id: 1,
      teamA: "Lakers",
      teamB: "Warriors",
      scoreA: 108,
      scoreB: 112,
      currentQuarter: 4,
      gameClock: "2:34",
      quarterScoresA: [28, 24, 30, 26]
    },
    {
      id: 2,
      teamA: "Bulls",
      teamB: "Celtics",
      scoreA: 89,
      scoreB: 95,
      currentQuarter: 3,
      gameClock: "8:15",
      quarterScoresA: [22, 31, 36, 0]
    }
  ],
  football: [
    {
      id: 1,
      teamA: "Manchester United",
      teamB: "Liverpool",
      scoreA: 2,
      scoreB: 1,
      matchTime: 78,
      half: 2,
      status: "Match in progress"
    },
    {
      id: 2,
      teamA: "Barcelona",
      teamB: "Real Madrid",
      scoreA: 1,
      scoreB: 3,
      matchTime: 90,
      half: 2,
      status: "Full Time"
    }
  ],
  tennis: [
    {
      id: 1,
      player1: "Novak Djokovic",
      player2: "Rafael Nadal",
      setsPlayer1: [6, 4, 6],
      setsPlayer2: [3, 6, 2],
      currentGameScorePlayer1: 30,
      currentGameScorePlayer2: 15
    },
    {
      id: 2,
      player1: "Roger Federer",
      player2: "Andy Murray",
      setsPlayer1: [7, 6],
      setsPlayer2: [5, 4],
      currentGameScorePlayer1: 40,
      currentGameScorePlayer2: 30
    }
  ],
  badminton: [
    {
      id: 1,
      player1: "Lin Dan",
      player2: "Lee Chong Wei",
      gamesPlayer1: [21, 18, 21],
      gamesPlayer2: [19, 21, 16],
      currentGame: 3
    },
    {
      id: 2,
      player1: "P.V. Sindhu",
      player2: "Carolina Marin",
      gamesPlayer1: [21, 15],
      gamesPlayer2: [17, 21],
      currentGame: 2
    }
  ],
  volleyball: [
    {
      id: 1,
      teamA: "Brazil",
      teamB: "USA",
      setsTeamA: [25, 21, 24, 18],
      setsTeamB: [23, 25, 26, 25],
      currentSet: 4,
      setWinsA: 1,
      setWinsB: 3
    },
    {
      id: 2,
      teamA: "Italy",
      teamB: "Poland",
      setsTeamA: [25, 22, 25],
      setsTeamB: [20, 25, 19],
      currentSet: 3,
      setWinsA: 2,
      setWinsB: 1
    }
  ],
  kabaddi: [
    {
      id: 1,
      teamA: "Patna Pirates",
      teamB: "Bengal Warriors",
      scoreA: 32,
      scoreB: 28,
      playersOnMatA: 6,
      playersOnMatB: 5,
      raidTimer: 15,
      status: "2nd Half - 8:30 remaining"
    },
    {
      id: 2,
      teamA: "U Mumba",
      teamB: "Jaipur Pink Panthers",
      scoreA: 24,
      scoreB: 31,
      playersOnMatA: 7,
      playersOnMatB: 6,
      raidTimer: 8,
      status: "1st Half - 12:45 remaining"
    }
  ],
  frisbee: [
    {
      id: 1,
      teamA: "Wind Chill",
      teamB: "Machine",
      scoreA: 12,
      scoreB: 9,
      timeRemaining: "15:30",
      pointCap: 15,
      possession: "Wind Chill"
    },
    {
      id: 2,
      teamA: "Revolution",
      teamB: "Empire",
      scoreA: 8,
      scoreB: 11,
      timeRemaining: "22:15",
      pointCap: 15,
      possession: "Empire"
    }
  ]
};

export default function ScoreboardsLayout() {
  const [selectedSport, setSelectedSport] = useState<SportId>("cricket");
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMatches(selectedSport);

    let ws: WebSocket | null = null;
    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
    let isUnmounted = false;

    const connectWebSocket = () => {
      if (isUnmounted) return;

      try {
        ws = new WebSocket(WS_URL);

        ws.onopen = () => {
          console.log(`WebSocket connected for ${selectedSport} updates`);
        };

        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            if (message.event === `${selectedSport}_update`) {
              setMatches(Array.isArray(message.data) ? message.data : []);
              setLoading(false);
            }
          } catch (error) {
            console.error("Error parsing WebSocket message:", error);
          }
        };

        ws.onerror = () => {
          if (ws && ws.readyState === WebSocket.OPEN) {
            ws.close();
          }
        };

        ws.onclose = () => {
          if (!isUnmounted) {
            reconnectTimeout = setTimeout(connectWebSocket, 1500);
          }
        };
      } catch {
        reconnectTimeout = setTimeout(connectWebSocket, 1500);
      }
    };

    connectWebSocket();

    return () => {
      isUnmounted = true;
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      if (ws) {
        if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
          ws.close(1000, "Component unmounted");
        }
        ws = null;
      }
    };
  }, [selectedSport]);

  const fetchMatches = async (sport: SportId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/${sport}`, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Failed to fetch ${sport} matches`);
      }

      const data = await response.json();
      setMatches(Array.isArray(data) ? (data as MatchData[]) : []);
    } catch (error) {
      console.error("Error fetching matches:", error);
      const fallbackData = (MOCK_DATA as Record<SportId, MatchData[]>)[sport] || [];
      setMatches(Array.isArray(fallbackData) ? fallbackData : []);
    } finally {
      setLoading(false);
    }
  };

  const handleSportChange = (sportId: SportId) => {
    setLoading(true);
    setMatches([]);
    setSelectedSport(sportId);
  };

  return (
    <div className="flex h-screen bg-[#0D0D0D] font-sans text-[#EAEAEA]">
      <style jsx global>{`
        @font-face {
          font-family: 'Gang of Three';
          src: url('/fonts/go3v2.ttf') format('truetype');
          font-display: swap;
        }
        .font-gang-of-three {
          font-family: 'Gang of Three', Arial, sans-serif;
        }
      `}</style>
      
      {/* Sidebar */}
      <div className="w-64 bg-[#0D0D0D] border-r border-[rgb(135,86,36)] flex flex-col">
        <div className="p-6 border-b border-[rgb(135,86,36)]">
          <Link href="/" className="text-[#EAEAEA] hover:text-[rgb(186,196,92)] text-sm transition-colors">
            ← Home
          </Link>
          <h1 className="text-3xl font-bold text-[rgb(186,196,92)] mt-4 font-gang-of-three tracking-wide">
            SPORTS
          </h1>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          {SPORTS.map((sport) => (
            <button
              key={sport.id}
              onClick={() => handleSportChange(sport.id)}
              className={`w-full text-left px-4 py-3 mb-2 transition-all duration-200 border-l-4 ${
                selectedSport === sport.id
                  ? "border-[rgb(186,196,92)] bg-[rgb(37,81,43)]/30 text-[rgb(186,196,92)]"
                  : "border-transparent text-[#EAEAEA] hover:bg-[rgb(50,64,21)]/30 hover:text-[rgb(186,196,92)]"
              }`}
            >
              <span className="font-gang-of-three text-lg tracking-wide uppercase">{sport.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8 bg-[#0D0D0D]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 border-b border-[rgb(135,86,36)] pb-4">
            <h2 className="text-4xl font-bold text-[rgb(186,196,92)] uppercase font-gang-of-three tracking-wider">
              {selectedSport} Matches
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-[rgb(186,196,92)] text-xl animate-pulse font-gang-of-three">Loading matches...</div>
            </div>
          ) : !Array.isArray(matches) || matches.length === 0 ? (
            <div className="bg-[rgb(37,81,43)] border border-[rgb(50,64,21)] p-12 text-center">
              <p className="text-[#EAEAEA] text-xl font-gang-of-three mb-2">
                No matches available for {selectedSport}
              </p>
              <p className="text-[rgb(186,196,92)] text-sm">
                Waiting for live data...
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {matches.map((match) => (
                <div
                  key={match.id}
                  className="bg-[rgb(37,81,43)] border border-[rgb(50,64,21)] p-6 hover:border-[rgb(186,196,92)] transition-colors duration-300"
                >
                  {renderMatchCard(selectedSport, match)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function renderMatchCard(sport: SportId, match: MatchData) {
  switch (sport) {
    case "cricket":
      return <CricketMatchCard match={match} />;
    case "basketball":
      return <BasketballMatchCard match={match} />;
    case "football":
      return <FootballMatchCard match={match} />;
    case "tennis":
      return <TennisMatchCard match={match} />;
    case "badminton":
      return <BadmintonMatchCard match={match} />;
    case "volleyball":
      return <VolleyballMatchCard match={match} />;
    case "kabaddi":
      return <KabaddiMatchCard match={match} />;
    case "frisbee":
      return <FrisbeeMatchCard match={match} />;
    default:
      return null;
  }
}

function CricketMatchCard({ match }: { match: MatchData }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6 pb-6 border-b border-[rgb(135,86,36)]">
        <div>
          <h3 className="text-2xl font-bold text-[#EAEAEA] font-gang-of-three tracking-wide uppercase">{match.teamA}</h3>
          <div className="text-4xl font-bold text-[rgb(186,196,92)] mt-2 font-gang-of-three">
            {match.scoreA.runs}/{match.scoreA.wickets}
            <span className="text-lg text-[#EAEAEA] ml-3 font-sans opacity-80">
              ({match.scoreA.overs} ov)
            </span>
          </div>
        </div>
        <div className="text-right">
          <h3 className="text-2xl font-bold text-[#EAEAEA] font-gang-of-three tracking-wide uppercase">{match.teamB}</h3>
          <div className="text-4xl font-bold text-[#EAEAEA] mt-2 font-gang-of-three">
            {match.scoreB.runs}/{match.scoreB.wickets}
            <span className="text-lg text-[rgb(186,196,92)] ml-3 font-sans opacity-80">
              ({match.scoreB.overs} ov)
            </span>
          </div>
        </div>
      </div>

      {match.details && (
        <div className="mb-4 bg-[rgb(50,64,21)]/30 border border-[rgb(50,64,21)] p-4">
          {match.details.summary ? (
            <div className="text-lg font-medium text-[rgb(186,196,92)] text-center font-gang-of-three tracking-wide">{match.details.summary}</div>
          ) : (
            <>
              <div className="flex justify-between text-sm mb-4 border-b border-[rgb(50,64,21)] pb-2 font-gang-of-three">
                <div className="font-medium text-[#EAEAEA]">
                  {match.details.striker.name}* <span className="text-[rgb(186,196,92)] ml-1">{match.details.striker.runs}</span> <span className="text-[rgb(135,86,36)]">({match.details.striker.balls})</span>
                </div>
                <div className="font-medium text-[#EAEAEA] opacity-70">
                  {match.details.nonStriker.name} <span className="text-[#EAEAEA] ml-1">{match.details.nonStriker.runs}</span> <span className="text-[rgb(135,86,36)]">({match.details.nonStriker.balls})</span>
                </div>
              </div>
              
              <div className="flex justify-between text-xs text-[rgb(135,86,36)] mb-4 uppercase tracking-widest font-bold font-gang-of-three">
                <div>CRR: <span className="text-[#EAEAEA]">{match.details.crr}</span></div>
                {match.details.rrr && <div>Req: <span className="text-[#EAEAEA]">{match.details.rrr}</span></div>}
              </div>

              <div className="flex items-center justify-between text-sm font-gang-of-three">
                <div className="text-[#EAEAEA]">
                  <span className="text-[rgb(135,86,36)] text-xs uppercase mr-2 font-bold">Bowler</span>
                  {match.details.bowler.name} <span className="text-xs text-[rgb(186,196,92)] ml-1">{match.details.bowler.wickets}/{match.details.bowler.runs}</span> <span className="text-xs text-[rgb(135,86,36)]">({match.details.bowler.overs})</span>
                </div>
                <div className="flex gap-1">
                  {match.details.recentBalls.map((ball: any, i: number) => (
                    <span key={i} className={`w-6 h-6 flex items-center justify-center text-xs font-bold font-gang-of-three ${
                      ball === 'W' ? 'bg-[rgb(181,70,57)] text-[#EAEAEA]' : 
                      ball === '4' || ball === '6' ? 'bg-[rgb(186,196,92)] text-[#0D0D0D]' : 
                      'bg-[rgb(50,64,21)] text-[#EAEAEA]'
                    }`}>
                      {ball}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {match.status && (
        <div className="text-sm text-[rgb(186,196,92)] text-center font-bold font-gang-of-three tracking-wide uppercase mt-2">{match.status}</div>
      )}
    </div>
  );
}

function BasketballMatchCard({ match }: { match: MatchData }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-[#EAEAEA] font-gang-of-three tracking-wide uppercase">{match.teamA}</h3>
          <div className="text-5xl font-bold text-[rgb(186,196,92)] mt-2 font-gang-of-three">
            {match.scoreA}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-[#EAEAEA] font-gang-of-three">Q{match.currentQuarter}</div>
          <div className="text-2xl font-bold text-[rgb(181,70,57)] mt-1 font-mono">{match.gameClock}</div>
        </div>
        <div className="text-right">
          <h3 className="text-2xl font-bold text-[#EAEAEA] font-gang-of-three tracking-wide uppercase">{match.teamB}</h3>
          <div className="text-5xl font-bold text-[#EAEAEA] mt-2 font-gang-of-three">
            {match.scoreB}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2 text-center text-sm border-t border-[rgb(135,86,36)] pt-4">
        {match.quarterScoresA.map((score: any, i: number) => (
          <div key={i} className="flex flex-col">
            <span className="text-[rgb(135,86,36)] text-xs font-bold uppercase">Q{i + 1}</span>
            <span className="text-[#EAEAEA] font-gang-of-three text-lg">{score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FootballMatchCard({ match }: { match: MatchData }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-[#EAEAEA] font-gang-of-three tracking-wide uppercase">{match.teamA}</h3>
          <div className="text-5xl font-bold text-[rgb(186,196,92)] mt-2 font-gang-of-three">
            {match.scoreA}
          </div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-[rgb(186,196,92)] font-gang-of-three">{match.matchTime}&apos;</div>
          <div className="text-sm text-[rgb(135,86,36)] uppercase font-bold tracking-wider mt-1">{match.half === 1 ? "1st Half" : "2nd Half"}</div>
        </div>
        <div className="text-right">
          <h3 className="text-2xl font-bold text-[#EAEAEA] font-gang-of-three tracking-wide uppercase">{match.teamB}</h3>
          <div className="text-5xl font-bold text-[#EAEAEA] mt-2 font-gang-of-three">
            {match.scoreB}
          </div>
        </div>
      </div>
      {match.status && (
        <div className="text-sm text-[rgb(186,196,92)] text-center font-bold font-gang-of-three tracking-wide uppercase border-t border-[rgb(135,86,36)] pt-3">{match.status}</div>
      )}
    </div>
  );
}

function TennisMatchCard({ match }: { match: MatchData }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4 border-b border-[rgb(50,64,21)] pb-3">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-[#EAEAEA] font-gang-of-three tracking-wide uppercase">{match.player1}</h3>
        </div>
        <div className="flex space-x-4">
          {match.setsPlayer1.map((score: any, i: number) => (
            <div key={i} className="text-2xl font-bold text-[#EAEAEA] opacity-60 font-gang-of-three">
              {score}
            </div>
          ))}
          <div className="text-3xl font-bold text-[rgb(186,196,92)] font-gang-of-three min-w-10 text-right">
            {match.currentGameScorePlayer1}
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-[#EAEAEA] font-gang-of-three tracking-wide uppercase">{match.player2}</h3>
        </div>
        <div className="flex space-x-4">
          {match.setsPlayer2.map((score: any, i: number) => (
            <div key={i} className="text-2xl font-bold text-[#EAEAEA] opacity-60 font-gang-of-three">
              {score}
            </div>
          ))}
          <div className="text-3xl font-bold text-[#EAEAEA] font-gang-of-three min-w-10 text-right">
            {match.currentGameScorePlayer2}
          </div>
        </div>
      </div>
    </div>
  );
}

function BadmintonMatchCard({ match }: { match: MatchData }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4 border-b border-[rgb(50,64,21)] pb-3">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-[#EAEAEA] font-gang-of-three tracking-wide uppercase">{match.player1}</h3>
        </div>
        <div className="flex space-x-4">
          {match.gamesPlayer1.map((score: any, i: number) => (
            <div
              key={i}
              className={`text-2xl font-bold font-gang-of-three ${
                i === match.currentGame - 1 ? "text-[rgb(186,196,92)]" : "text-[#EAEAEA] opacity-50"
              }`}
            >
              {score}
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-[#EAEAEA] font-gang-of-three tracking-wide uppercase">{match.player2}</h3>
        </div>
        <div className="flex space-x-4">
          {match.gamesPlayer2.map((score: any, i: number) => (
            <div
              key={i}
              className={`text-2xl font-bold font-gang-of-three ${
                i === match.currentGame - 1 ? "text-[rgb(186,196,92)]" : "text-[#EAEAEA] opacity-50"
              }`}
            >
              {score}
            </div>
          ))}
        </div>
      </div>
      <div className="text-xs text-[rgb(135,86,36)] text-center mt-4 uppercase font-bold font-gang-of-three tracking-widest">
        Game {match.currentGame}
      </div>
    </div>
  );
}

function VolleyballMatchCard({ match }: { match: MatchData }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4 border-b border-[rgb(50,64,21)] pb-3">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-[#EAEAEA] font-gang-of-three tracking-wide uppercase">{match.teamA}</h3>
        </div>
        <div className="flex space-x-4 items-center">
          {match.setsTeamA.map((score: any, i: number) => (
            <div
              key={i}
              className={`text-2xl font-bold font-gang-of-three ${
                i === match.currentSet - 1 ? "text-[rgb(186,196,92)]" : "text-[#EAEAEA] opacity-50"
              }`}
            >
              {score}
            </div>
          ))}
          <div className="text-3xl font-bold text-[rgb(186,196,92)] ml-2 font-gang-of-three">
            ({match.setWinsA})
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-[#EAEAEA] font-gang-of-three tracking-wide uppercase">{match.teamB}</h3>
        </div>
        <div className="flex space-x-4 items-center">
          {match.setsTeamB.map((score: any, i: number) => (
            <div
              key={i}
              className={`text-2xl font-bold font-gang-of-three ${
                i === match.currentSet - 1 ? "text-[rgb(186,196,92)]" : "text-[#EAEAEA] opacity-50"
              }`}
            >
              {score}
            </div>
          ))}
          <div className="text-3xl font-bold text-[#EAEAEA] ml-2 font-gang-of-three">
            ({match.setWinsB})
          </div>
        </div>
      </div>
      <div className="text-xs text-[rgb(135,86,36)] text-center mt-4 uppercase font-bold font-gang-of-three tracking-widest">
        Set {match.currentSet}
      </div>
    </div>
  );
}

function KabaddiMatchCard({ match }: { match: MatchData }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-[#EAEAEA] font-gang-of-three tracking-wide uppercase">{match.teamA}</h3>
          <div className="text-5xl font-bold text-[rgb(186,196,92)] mt-2 font-gang-of-three">
            {match.scoreA}
          </div>
          <div className="text-sm text-[rgb(135,86,36)] mt-2 font-bold font-gang-of-three uppercase">
            {match.playersOnMatA} players
          </div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-[rgb(181,70,57)] font-gang-of-three">{match.raidTimer}s</div>
          <div className="text-xs text-[rgb(135,86,36)] mt-1 uppercase font-bold font-gang-of-three tracking-widest">Raid</div>
        </div>
        <div className="text-right">
          <h3 className="text-2xl font-bold text-[#EAEAEA] font-gang-of-three tracking-wide uppercase">{match.teamB}</h3>
          <div className="text-5xl font-bold text-[#EAEAEA] mt-2 font-gang-of-three">
            {match.scoreB}
          </div>
          <div className="text-sm text-[rgb(135,86,36)] mt-2 font-bold font-gang-of-three uppercase">
            {match.playersOnMatB} players
          </div>
        </div>
      </div>
      {match.status && (
        <div className="text-sm text-[rgb(186,196,92)] text-center font-bold font-gang-of-three tracking-wide uppercase border-t border-[rgb(135,86,36)] pt-3">{match.status}</div>
      )}
    </div>
  );
}

function FrisbeeMatchCard({ match }: { match: MatchData }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-[#EAEAEA] font-gang-of-three tracking-wide uppercase">{match.teamA}</h3>
          <div className="text-5xl font-bold text-[rgb(186,196,92)] mt-2 font-gang-of-three">
            {match.scoreA}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-[#EAEAEA] font-mono">{match.timeRemaining}</div>
          <div className="text-xs text-[rgb(135,86,36)] mt-1 uppercase font-bold font-gang-of-three">Cap {match.pointCap}</div>
        </div>
        <div className="text-right">
          <h3 className="text-2xl font-bold text-[#EAEAEA] font-gang-of-three tracking-wide uppercase">{match.teamB}</h3>
          <div className="text-5xl font-bold text-[#EAEAEA] mt-2 font-gang-of-three">
            {match.scoreB}
          </div>
        </div>
      </div>
      {match.possession && (
        <div className="text-sm text-[rgb(186,196,92)] text-center font-bold font-gang-of-three tracking-wide uppercase border-t border-[rgb(135,86,36)] pt-3">
          Possession: {match.possession}
        </div>
      )}
    </div>
  );
}

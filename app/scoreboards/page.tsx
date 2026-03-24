"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import Link from "next/link";
import { API_BASE_URL, getWebSocketUrl } from "../lib/websocket";

const WS_URL = getWebSocketUrl();

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
type ScorerRole = "admin" | "scorer";

type FieldPath = string[];

const getMatchLabel = (sport: SportId, match: MatchData) => {
  if (sport === "tennis" || sport === "badminton") {
    return `${match.player1 || "Player 1"} vs ${match.player2 || "Player 2"}`;
  }
  return `${match.teamA || "Team A"} vs ${match.teamB || "Team B"}`;
};

const getUpdateTemplate = (sport: SportId, match: MatchData) => {
  switch (sport) {
    case "cricket":
      return {
        scoreA: match.scoreA,
        scoreB: match.scoreB,
        status: match.status,
      };
    case "basketball":
      return {
        scoreA: match.scoreA,
        scoreB: match.scoreB,
        currentQuarter: match.currentQuarter,
        gameClock: match.gameClock,
        status: match.status,
      };
    case "football":
      return {
        scoreA: match.scoreA,
        scoreB: match.scoreB,
        matchTime: match.matchTime,
        half: match.half,
        status: match.status,
      };
    case "tennis":
      return {
        setsPlayer1: match.setsPlayer1,
        setsPlayer2: match.setsPlayer2,
        currentGameScorePlayer1: match.currentGameScorePlayer1,
        currentGameScorePlayer2: match.currentGameScorePlayer2,
        status: match.status,
      };
    case "badminton":
      return {
        gamesPlayer1: match.gamesPlayer1,
        gamesPlayer2: match.gamesPlayer2,
        currentPointsPlayer1: match.currentPointsPlayer1,
        currentPointsPlayer2: match.currentPointsPlayer2,
        currentGame: match.currentGame,
        status: match.status,
      };
    case "volleyball":
      return {
        setsTeamA: match.setsTeamA,
        setsTeamB: match.setsTeamB,
        currentPointsTeamA: match.currentPointsTeamA,
        currentPointsTeamB: match.currentPointsTeamB,
        setWinsA: match.setWinsA,
        setWinsB: match.setWinsB,
        status: match.status,
      };
    case "kabaddi":
      return {
        scoreA: match.scoreA,
        scoreB: match.scoreB,
        playersOnMatA: match.playersOnMatA,
        playersOnMatB: match.playersOnMatB,
        raidTimer: match.raidTimer,
        status: match.status,
      };
    case "frisbee":
      return {
        scoreA: match.scoreA,
        scoreB: match.scoreB,
        timeRemaining: match.timeRemaining,
        possession: match.possession,
        pointCap: match.pointCap,
        status: match.status,
      };
    default:
      return {};
  }
};

const getCreateTemplate = (sport: SportId) => {
  switch (sport) {
    case "cricket":
      return {
        teamA: "",
        teamB: "",
        scoreA: { runs: 0, wickets: 0, overs: "0.0" },
        scoreB: { runs: 0, wickets: 0, overs: "0.0" },
        status: "Match started",
      };
    case "basketball":
      return {
        teamA: "",
        teamB: "",
        scoreA: 0,
        scoreB: 0,
        currentQuarter: 1,
        gameClock: "12:00",
        quarterScoresA: [0, 0, 0, 0],
        quarterScoresB: [0, 0, 0, 0],
        status: "Tip-off",
      };
    case "football":
      return {
        teamA: "",
        teamB: "",
        scoreA: 0,
        scoreB: 0,
        matchTime: 0,
        half: 1,
        status: "Kick-off",
      };
    case "tennis":
      return {
        player1: "",
        player2: "",
        setsPlayer1: [],
        setsPlayer2: [],
        currentSet: 1,
        currentGameScorePlayer1: 0,
        currentGameScorePlayer2: 0,
        status: "Match started",
      };
    case "badminton":
      return {
        player1: "",
        player2: "",
        gamesPlayer1: [],
        gamesPlayer2: [],
        currentGame: 1,
        currentPointsPlayer1: 0,
        currentPointsPlayer2: 0,
        status: "Game 1",
      };
    case "volleyball":
      return {
        teamA: "",
        teamB: "",
        setsTeamA: [],
        setsTeamB: [],
        currentSet: 1,
        currentPointsTeamA: 0,
        currentPointsTeamB: 0,
        setWinsA: 0,
        setWinsB: 0,
        status: "Set 1",
      };
    case "kabaddi":
      return {
        teamA: "",
        teamB: "",
        scoreA: 0,
        scoreB: 0,
        playersOnMatA: 7,
        playersOnMatB: 7,
        raidTimer: 30,
        status: "Raid started",
      };
    case "frisbee":
      return {
        teamA: "",
        teamB: "",
        scoreA: 0,
        scoreB: 0,
        timeRemaining: "48:00",
        possession: "",
        pointCap: 21,
        status: "Pull",
      };
    default:
      return {};
  }
};

export default function ScoreboardsLayout() {
  const [selectedSport, setSelectedSport] = useState<SportId>("cricket");
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [scorerRole, setScorerRole] = useState<ScorerRole>("scorer");
  const [scoreToken, setScoreToken] = useState("");
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);
  const [formData, setFormData] = useState<MatchData>({});
  const [createFormData, setCreateFormData] = useState<MatchData>(getCreateTemplate("cricket"));
  const [updateStatus, setUpdateStatus] = useState<string | null>(null);
  const [createStatus, setCreateStatus] = useState<string | null>(null);
  const [scorerExpanded, setScorerExpanded] = useState(false);
  const [panelMode, setPanelMode] = useState<"update" | "create">("update");

  const editableMatches = matches.filter((match) => typeof match.id === "number");
  const selectedMatch = editableMatches.find((match) => match.id === selectedMatchId) || null;

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
          setWsConnected(true);
        };

        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            if (message.event === `${selectedSport}_update`) {
              setMatches(Array.isArray(message.data) ? message.data : []);
              setLoading(false);
              setApiError(null);
            }
          } catch (error) {
            console.error("Error parsing WebSocket message:", error);
          }
        };

        ws.onerror = () => {
          setWsConnected(false);
          if (ws && ws.readyState === WebSocket.OPEN) {
            ws.close();
          }
        };

        ws.onclose = () => {
          setWsConnected(false);
          if (!isUnmounted) {
            reconnectTimeout = setTimeout(connectWebSocket, 1500);
          }
        };
      } catch {
        setWsConnected(false);
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
    setApiError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/${sport}`, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Failed to fetch ${sport} matches`);
      }

      const data = await response.json();
      setMatches(Array.isArray(data) ? (data as MatchData[]) : []);
    } catch (error) {
      console.error("Error fetching matches:", error);
      setMatches([]);
      setApiError(`Could not connect to ${API_BASE_URL}/${sport}. Start the backend server on port 3001.`);
    } finally {
      setLoading(false);
    }
  };

  const handleSportChange = (sportId: SportId) => {
    setLoading(true);
    setMatches([]);
    setSelectedMatchId(null);
    setFormData({});
    setCreateFormData(getCreateTemplate(sportId));
    setUpdateStatus(null);
    setCreateStatus(null);
    setSelectedSport(sportId);
  };

  useEffect(() => {
    const nextEditableMatches = matches.filter((match) => typeof match.id === "number");

    if (!nextEditableMatches.length) {
      setSelectedMatchId(null);
      setFormData({});
      return;
    }

    const nextMatch = nextEditableMatches[0];
    const template = getUpdateTemplate(selectedSport, nextMatch);
    setSelectedMatchId(nextMatch.id);
    setFormData(template);
  }, [selectedSport, matches]);

  const handleMatchSelect = (matchId: number) => {
    setSelectedMatchId(matchId);
    const nextMatch = editableMatches.find((match) => match.id === matchId);
    if (nextMatch) {
      setFormData(getUpdateTemplate(selectedSport, nextMatch));
    }
  };

  const handleFormDataChange = (nextData: MatchData) => {
    setFormData(nextData);
  };

  const handleCreateFormDataChange = (nextData: MatchData) => {
    setCreateFormData(nextData);
  };

  const handleScoreUpdate = async () => {
    if (!selectedMatchId) {
      setUpdateStatus("Select a match before sending an update.");
      return;
    }

    if (!scoreToken.trim()) {
      setUpdateStatus("Token required. Enter scorer/admin token.");
      return;
    }

    setUpdateStatus("Updating match...");

    try {
      const response = await fetch(`${API_BASE_URL}/${selectedSport}/${selectedMatchId}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${scoreToken.trim()}`,
          "X-User-Role": scorerRole,
        },
        body: JSON.stringify(formData),
      });

      const body = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(body?.error || "Failed to update score");
      }

      const updatedMatch = body as MatchData;
      setMatches((prevMatches) =>
        prevMatches.map((match) => (match.id === updatedMatch.id ? updatedMatch : match))
      );
      setUpdateStatus("Score updated successfully.");
    } catch (error) {
      setUpdateStatus(error instanceof Error ? error.message : "Score update failed.");
    }
  };

  const handleCreateMatch = async () => {
    if (!scoreToken.trim()) {
      setCreateStatus("Token required. Enter scorer/admin token.");
      return;
    }

    setCreateStatus("Creating match...");

    try {
      const response = await fetch(`${API_BASE_URL}/${selectedSport}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${scoreToken.trim()}`,
          "X-User-Role": scorerRole,
        },
        body: JSON.stringify(createFormData),
      });

      const body = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(body?.error || "Failed to create match");
      }

      const createdMatch = body as MatchData;
      setMatches((prevMatches) => [...prevMatches, createdMatch]);
      setSelectedMatchId(createdMatch.id);
      setPanelMode("update");
      setFormData(getUpdateTemplate(selectedSport, createdMatch));
      setCreateFormData(getCreateTemplate(selectedSport));
      setCreateStatus("Match created successfully.");
    } catch (error) {
      setCreateStatus(error instanceof Error ? error.message : "Match creation failed.");
    }
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
            <div className="mt-3 flex items-center gap-3 text-xs font-bold uppercase tracking-wider">
              <span className={`inline-block h-2.5 w-2.5 rounded-full ${wsConnected ? "bg-emerald-400" : "bg-rose-500"}`} />
              <span className={wsConnected ? "text-emerald-300" : "text-rose-300"}>
                {wsConnected ? "Live updates connected" : "Live updates disconnected"}
              </span>
            </div>
          </div>

          {apiError && (
            <div className="mb-6 border border-rose-500/40 bg-rose-950/30 p-4 text-sm text-rose-200">
              {apiError}
            </div>
          )}

          <div className="mb-6 rounded-2xl bg-[linear-gradient(145deg,rgba(37,81,43,0.28),rgba(13,13,13,0.96))] p-4 shadow-[0_14px_30px_rgba(0,0,0,0.32)] backdrop-blur-sm border border-[rgb(79,88,43)]/30">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[rgb(186,196,92)]/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[rgb(186,196,92)]">
                    Scorer Console
                  </span>
                  <span className="text-[11px] text-[#EAEAEA]/70">Create and update live match scores</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setScorerExpanded((prev) => !prev)}
                className="rounded-full bg-[#0D0D0D]/70 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[rgb(186,196,92)] ring-1 ring-[rgb(135,86,36)]/50 transition-colors hover:bg-[rgb(37,81,43)]/45"
              >
                {scorerExpanded ? "Collapse" : "Open Controls"}
              </button>
            </div>

            {scorerExpanded && (
              <div className="mt-4 space-y-3">
                <div className="inline-flex items-center gap-1 rounded-full bg-[#0D0D0D]/70 p-1">
                  <button
                    type="button"
                    onClick={() => setPanelMode("update")}
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-all ${
                      panelMode === "update"
                        ? "bg-[rgb(186,196,92)] text-[#0D0D0D]"
                        : "text-[#EAEAEA]/75 hover:text-[#EAEAEA]"
                    }`}
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => setPanelMode("create")}
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-all ${
                      panelMode === "create"
                        ? "bg-[rgb(186,196,92)] text-[#0D0D0D]"
                        : "text-[#EAEAEA]/75 hover:text-[#EAEAEA]"
                    }`}
                  >
                    Create
                  </button>
                </div>

                <div className="grid gap-2.5 md:grid-cols-[130px_1fr_1fr_auto] md:items-end">
                  <label className="text-sm">
                    <span className="mb-1 block text-[11px] font-medium text-[rgb(186,196,92)]/85">Role</span>
                    <select
                      value={scorerRole}
                      onChange={(event) => setScorerRole(event.target.value as ScorerRole)}
                        className="w-full rounded-lg border border-[rgb(186,196,92)]/28 bg-[#111711] px-3 py-2 text-sm text-[#F3F4F6] outline-none focus:border-[rgb(186,196,92)] focus:ring-2 focus:ring-[rgb(186,196,92)]/35"
                    >
                      <option value="scorer">scorer</option>
                      <option value="admin">admin</option>
                    </select>
                  </label>

                  <label className="text-sm">
                    <span className="mb-1 block text-[11px] font-medium text-[rgb(186,196,92)]/85">Token</span>
                    <input
                      type="password"
                      value={scoreToken}
                      onChange={(event) => setScoreToken(event.target.value)}
                      placeholder="scorer/admin token"
                      className="w-full rounded-lg border border-[rgb(186,196,92)]/28 bg-[#111711] px-3 py-2 text-sm text-[#F3F4F6] placeholder:text-[#AAB08A]/75 outline-none focus:border-[rgb(186,196,92)] focus:ring-2 focus:ring-[rgb(186,196,92)]/35"
                    />
                  </label>

                  {panelMode === "update" ? (
                    <label className="text-sm">
                      <span className="mb-1 block text-[11px] font-medium text-[rgb(186,196,92)]/85">Match</span>
                      <select
                        value={selectedMatchId ?? ""}
                        onChange={(event) => handleMatchSelect(Number(event.target.value))}
                        disabled={!editableMatches.length}
                        className="w-full rounded-lg border border-[rgb(186,196,92)]/28 bg-[#111711] px-3 py-2 text-sm text-[#F3F4F6] outline-none focus:border-[rgb(186,196,92)] focus:ring-2 focus:ring-[rgb(186,196,92)]/35 disabled:opacity-50"
                      >
                        {!editableMatches.length && <option value="">No matches</option>}
                        {editableMatches.map((match) => (
                          <option key={match.id} value={match.id}>
                            #{match.id} - {getMatchLabel(selectedSport, match)}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : (
                    <div className="rounded-lg bg-[#0D0D0D]/55 px-3 py-2 text-sm text-[#EAEAEA]/80">
                      Creating a new {selectedSport} match
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      if (panelMode === "update") {
                        if (selectedMatch) {
                          setFormData(getUpdateTemplate(selectedSport, selectedMatch));
                        }
                      } else {
                        setCreateFormData(getCreateTemplate(selectedSport));
                      }
                    }}
                    className="rounded-lg bg-[rgb(186,196,92)]/12 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-[rgb(186,196,92)] transition-colors hover:bg-[rgb(186,196,92)]/22"
                  >
                    Reset
                  </button>
                </div>

                <div className="max-h-72 overflow-auto rounded-xl bg-[#0D0D0D]/35 p-3">
                  {panelMode === "update" ? (
                    <DynamicMatchForm sport={selectedSport} value={formData} onChange={handleFormDataChange} />
                  ) : (
                    <DynamicMatchForm sport={selectedSport} value={createFormData} onChange={handleCreateFormDataChange} />
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  {panelMode === "update" ? (
                    <>
                      <button
                        type="button"
                        onClick={handleScoreUpdate}
                        disabled={!editableMatches.length}
                        className="rounded-lg border border-[rgb(186,196,92)] bg-[rgb(186,196,92)]/12 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[rgb(186,196,92)] transition-colors hover:bg-[rgb(186,196,92)]/22 disabled:opacity-50"
                      >
                        Save Update
                      </button>
                      {updateStatus && <p className="text-xs text-[rgb(186,196,92)]/90">{updateStatus}</p>}
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={handleCreateMatch}
                        className="rounded-lg border border-emerald-400/80 bg-emerald-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-emerald-300 transition-colors hover:bg-emerald-500/20"
                      >
                        Create Match
                      </button>
                      {createStatus && <p className="text-xs text-emerald-300/90">{createStatus}</p>}
                    </>
                  )}
                </div>
              </div>
            )}
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

function DynamicMatchForm({
  sport,
  value,
  onChange,
}: {
  sport: SportId;
  value: MatchData;
  onChange: (nextValue: MatchData) => void;
}) {
  const handlePrimitiveChange = (path: FieldPath, rawValue: string | boolean) => {
    const currentValue = getValueByPath(value, path);
    const nextValue = coerceInputValue(rawValue, currentValue);
    onChange(setValueByPath(value, path, nextValue));
  };

  return (
    <div className="space-y-3">
      <div className="text-[11px] font-medium uppercase tracking-wider text-[#EAEAEA]/65">
        {sport.charAt(0).toUpperCase() + sport.slice(1)} fields
      </div>
      <FieldGroup value={value} path={[]} onPrimitiveChange={handlePrimitiveChange} />
    </div>
  );
}

function FieldGroup({
  value,
  path,
  onPrimitiveChange,
}: {
  value: MatchData;
  path: FieldPath;
  onPrimitiveChange: (path: FieldPath, rawValue: string | boolean) => void;
}) {
  const entries = Object.entries(value || {});
  const inputClassName =
    "w-full rounded-lg border border-[rgb(186,196,92)]/28 bg-[#111711] px-3 py-2 text-sm text-[#F3F4F6] placeholder:text-[#AAB08A]/75 outline-none focus:border-[rgb(186,196,92)] focus:ring-2 focus:ring-[rgb(186,196,92)]/35";

  return (
    <div className="space-y-3">
      {entries.map(([key, fieldValue]) => {
        const fieldPath = [...path, key];
        const fieldId = fieldPath.join(".");
        const label = prettifyKey(key);

        if (Array.isArray(fieldValue)) {
          return (
            <label key={fieldId} className="block rounded-xl bg-[#0D0D0D]/42 p-3 text-sm">
              <span className="mb-1.5 block text-[13px] font-medium text-[rgb(186,196,92)]/92">{label}</span>
              <input
                type="text"
                value={fieldValue.join(", ")}
                onChange={(event) => onPrimitiveChange(fieldPath, event.target.value)}
                placeholder="Comma separated values"
                className={inputClassName}
              />
            </label>
          );
        }

        if (fieldValue !== null && typeof fieldValue === "object") {
          return (
            <div key={fieldId} className="rounded-xl bg-[#0D0D0D]/34 p-3">
              <p className="mb-2 text-[13px] font-semibold text-[rgb(186,196,92)]">{label}</p>
              <FieldGroup value={fieldValue} path={fieldPath} onPrimitiveChange={onPrimitiveChange} />
            </div>
          );
        }

        if (typeof fieldValue === "boolean") {
          return (
            <label key={fieldId} className="flex items-center gap-2 rounded-xl bg-[#0D0D0D]/50 px-3 py-2.5 text-sm">
              <input
                type="checkbox"
                checked={fieldValue}
                onChange={(event) => onPrimitiveChange(fieldPath, event.target.checked)}
                className="h-4 w-4"
              />
              <span className="text-[12px] text-[#EAEAEA]/90">{label}</span>
            </label>
          );
        }

        const isNumeric = typeof fieldValue === "number";

        return (
          <div key={fieldId} className="grid gap-2 rounded-xl bg-[#0D0D0D]/46 px-3 py-2.5 md:grid-cols-[1fr_170px] md:items-center">
            <span className="text-[12px] text-[#EAEAEA]/88">{label}</span>
            <input
              type={isNumeric ? "number" : "text"}
              value={fieldValue ?? ""}
              onChange={(event) => onPrimitiveChange(fieldPath, event.target.value)}
              placeholder={isNumeric ? "Enter number" : `Enter ${label.toLowerCase()}`}
              className={inputClassName}
            />
          </div>
        );
      })}
    </div>
  );
}

function prettifyKey(key: string) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .trim();
}

function getValueByPath(source: MatchData, path: FieldPath) {
  return path.reduce<any>((current, segment) => {
    if (current && typeof current === "object") {
      return current[segment];
    }
    return undefined;
  }, source);
}

function setValueByPath(source: MatchData, path: FieldPath, value: any) {
  if (!path.length) {
    return source;
  }

  const next = JSON.parse(JSON.stringify(source || {}));
  let cursor = next;

  for (let index = 0; index < path.length - 1; index += 1) {
    const segment = path[index];
    if (!cursor[segment] || typeof cursor[segment] !== "object") {
      cursor[segment] = {};
    }
    cursor = cursor[segment];
  }

  cursor[path[path.length - 1]] = value;
  return next;
}

function coerceInputValue(rawValue: string | boolean, currentValue: any) {
  if (typeof currentValue === "boolean") {
    return Boolean(rawValue);
  }

  if (typeof currentValue === "number") {
    const parsed = Number(rawValue);
    return Number.isNaN(parsed) ? currentValue : parsed;
  }

  if (Array.isArray(currentValue)) {
    const itemType = typeof currentValue[0];
    const values = String(rawValue)
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    if (itemType === "number") {
      return values.map((item) => Number(item)).filter((item) => !Number.isNaN(item));
    }

    return values;
  }

  return String(rawValue);
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

import type { FootballMatch, FootballEvent } from "@/app/lib/types";
import { cn } from "@/app/lib/utils";

function EventBadge({ event }: { event: FootballEvent }) {
  const icon = event.type === "goal" ? "⚽" : event.type === "own_goal" ? "⚽ OG" : event.type === "yellow" ? "🟨" : event.type === "red" ? "🟥" : "↕";
  return (
    <span className={cn("text-[11px] text-[#666]")}>
      {event.minute}&apos; {icon} {event.playerName}
      {event.assistName ? ` (${event.assistName})` : ""}
    </span>
  );
}

export function FootballCard({ match }: { match: FootballMatch }) {
  const { teamA, teamB, scoreA, scoreB, matchTime, half, events = [], yellowCardsA, yellowCardsB, status } = match;

  const eventsA = events.filter(e => e.team === "A");
  const eventsB = events.filter(e => e.team === "B");
  const goals = events.filter(e => e.type === "goal" || e.type === "own_goal");

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
        <div>
          <p className="text-base md:text-lg font-bold text-white">{teamA}</p>
          <p className="font-mono text-4xl md:text-5xl font-extrabold text-white mt-1">{scoreA}</p>
          {yellowCardsA != null && yellowCardsA > 0 && (
            <p className="text-xs text-[#555] mt-1">🟨 ×{yellowCardsA}</p>
          )}
        </div>
        <div className="text-center px-2">
          <p className="font-mono text-xl font-bold text-white">{matchTime}&apos;</p>
          <p className="text-[11px] text-[#555] mt-0.5">{half === 1 ? "1st Half" : "2nd Half"}</p>
        </div>
        <div className="text-right">
          <p className="text-base md:text-lg font-bold text-white">{teamB}</p>
          <p className="font-mono text-4xl md:text-5xl font-extrabold text-[#bbb] mt-1">{scoreB}</p>
          {yellowCardsB != null && yellowCardsB > 0 && (
            <p className="text-xs text-[#555] mt-1">🟨 ×{yellowCardsB}</p>
          )}
        </div>
      </div>

      {/* Goal scorers */}
      {goals.length > 0 && (
        <div className="rounded-lg bg-[#0d0d0d] p-3">
          <p className="text-[10px] text-[#555] uppercase tracking-wider mb-2">Goals</p>
          <div className="flex flex-col gap-1">
            {goals.map((e, i) => (
              <EventBadge key={i} event={e} />
            ))}
          </div>
        </div>
      )}

      {status && <p className="text-xs text-center text-[#555] pt-1">{status}</p>}
    </div>
  );
}

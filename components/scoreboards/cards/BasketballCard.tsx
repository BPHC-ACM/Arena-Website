import type { BasketballMatch } from "@/app/lib/types";
import { cn } from "@/app/lib/utils";

export function BasketballCard({ match }: { match: BasketballMatch }) {
  const { teamA, teamB, scoreA, scoreB, currentQuarter, gameClock, shotClock, quarterScoresA, quarterScoresB, foulsA, foulsB, status } = match;

  return (
    <div className="space-y-4">
      {/* Teams + Score */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
        <div>
          <p className="text-base md:text-lg font-bold text-white">{teamA}</p>
          <p className="font-mono text-4xl md:text-5xl font-extrabold text-white mt-1">{scoreA}</p>
          {foulsA != null && <p className="text-xs text-[#555] mt-1">Fouls: {foulsA}</p>}
        </div>
        <div className="text-center px-2">
          <p className="font-mono text-xl font-bold text-white">{gameClock}</p>
          <p className="text-[11px] text-[#555] mt-0.5">Q{currentQuarter}</p>
          {shotClock != null && <p className="font-mono text-sm text-[#888] mt-1">{shotClock}s</p>}
        </div>
        <div className="text-right">
          <p className="text-base md:text-lg font-bold text-white">{teamB}</p>
          <p className="font-mono text-4xl md:text-5xl font-extrabold text-[#bbb] mt-1">{scoreB}</p>
          {foulsB != null && <p className="text-xs text-[#555] mt-1">Fouls: {foulsB}</p>}
        </div>
      </div>

      {/* Quarter scores */}
      {quarterScoresA && quarterScoresA.length > 0 && (
        <div className="rounded-lg bg-[#0d0d0d] border border-[#1a1a1a] p-3">
          <p className="text-[10px] text-[#555] uppercase tracking-wider mb-2">Quarter Scores</p>
          <div className="grid grid-cols-5 gap-1 text-center text-xs">
            <div className="text-[#444]" />
            {quarterScoresA.map((_, i) => (
              <div key={i} className={cn("text-[10px] font-medium", i === currentQuarter - 1 ? "text-[#aaa]" : "text-[#555]")}>Q{i+1}</div>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-1 text-center mt-1">
            <div className="text-xs text-[#666] text-left">{teamA}</div>
            {quarterScoresA.map((s, i) => (
              <div key={i} className={cn("font-mono text-sm font-bold", i === currentQuarter - 1 ? "text-white" : "text-[#555]")}>{s}</div>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-1 text-center mt-0.5">
            <div className="text-xs text-[#666] text-left">{teamB}</div>
            {quarterScoresB.map((s, i) => (
              <div key={i} className={cn("font-mono text-sm font-bold", i === currentQuarter - 1 ? "text-[#aaa]" : "text-[#555]")}>{s}</div>
            ))}
          </div>
        </div>
      )}

      {match.summary && <p className="text-sm text-center text-[#666] italic pb-1">{match.summary}</p>}
      {status && <p className="text-xs text-center text-[#555] pt-1 border-t border-[#181818]">{status}</p>}
    </div>
  );
}

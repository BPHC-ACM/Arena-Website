import type { HockeyMatch } from "@/app/lib/types";
import { cn } from "@/app/lib/utils";

export function HockeyCard({ match }: { match: HockeyMatch }) {
  const { teamA, teamB, scoreA, scoreB, currentPeriod, matchTime, periodScoresA, periodScoresB, penaltiesA, penaltiesB, status } = match;

  const rows = [
    { name: teamA, score: scoreA, periods: periodScoresA, penalties: penaltiesA },
    { name: teamB, score: scoreB, periods: periodScoresB, penalties: penaltiesB },
  ];

  return (
    <div className="space-y-3">
      <div className="rounded-lg bg-[#0d0d0d] overflow-hidden">
        <div className="flex items-center gap-2 px-3 pt-2 pb-1">
          <span className="text-[10px] text-[#444] uppercase tracking-wider">Period {currentPeriod}</span>
          <span className="text-[10px] text-[#444]">·</span>
          <span className="text-[10px] text-[#444] uppercase tracking-wider">{matchTime}</span>
        </div>

        {rows.map((t, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-3 border-t border-[#181818]">
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <span className={cn("font-semibold text-sm truncate", i === 0 ? "text-white" : "text-[#aaa]")}>{t.name}</span>
            </div>
            <div className="flex items-center gap-2">
              {t.periods?.map((s, j) => (
                <span key={j} className={cn("font-mono text-base min-w-[20px] text-center",
                  j === currentPeriod - 1 ? "text-white font-bold" : "text-[#333]")}>{s}</span>
              ))}
              {t.penalties !== undefined && t.penalties > 0 && (
                <span className="text-xs text-[#f87171] font-mono px-1">P{t.penalties}</span>
              )}
              <span className="font-mono text-3xl font-extrabold text-white ml-2 min-w-[40px] text-right">{t.score}</span>
            </div>
          </div>
        ))}
      </div>
      {status && <p className="text-xs text-center text-[#555]">{status}</p>}
    </div>
  );
}

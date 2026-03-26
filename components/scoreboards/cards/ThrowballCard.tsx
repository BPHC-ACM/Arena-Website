import type { ThrowballMatch } from "@/app/lib/types";
import { cn } from "@/app/lib/utils";

export function ThrowballCard({ match }: { match: ThrowballMatch }) {
  const { teamA, teamB, setsTeamA, setsTeamB, currentSet, currentPointsTeamA, currentPointsTeamB, setWinsA, setWinsB, bestOf, servingTeam, status } = match;

  const rows = [
    { name: teamA, sets: setsTeamA, cur: currentPointsTeamA, setWins: setWinsA, serving: servingTeam === 'A' },
    { name: teamB, sets: setsTeamB, cur: currentPointsTeamB, setWins: setWinsB, serving: servingTeam === 'B' },
  ];

  return (
    <div className="space-y-3">
      <div className="rounded-lg bg-[#0d0d0d] overflow-hidden">
        <div className="flex items-center gap-2 px-3 pt-2 pb-1">
          <span className="text-[10px] text-[#444] uppercase tracking-wider">Best of {bestOf ?? 3}</span>
          <span className="text-[10px] text-[#444]">·</span>
          <span className="text-[10px] text-[#444] uppercase tracking-wider">Set {currentSet}</span>
        </div>

        {rows.map((t, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-3 border-t border-[#181818]">
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              {t.serving && <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] flex-shrink-0" />}
              <span className={cn("font-semibold text-sm truncate", i === 0 ? "text-white" : "text-[#aaa]")}>{t.name}</span>
            </div>
            <div className="flex items-center gap-2">
              {t.sets?.map((s, j) => (
                <span key={j} className={cn("font-mono text-base min-w-[20px] text-center",
                  j === currentSet - 1 ? "text-white font-bold" : "text-[#333]")}>{s}</span>
              ))}
              <div className="text-right ml-2">
                <div className="text-xs text-[#666]">{t.setWins} sets</div>
                <span className="font-mono text-2xl font-extrabold text-white">{t.cur}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {status && <p className="text-xs text-center text-[#555]">{status}</p>}
    </div>
  );
}

import type { VolleyballMatch } from "@/app/lib/types";
import { cn } from "@/app/lib/utils";

export function VolleyballCard({ match }: { match: VolleyballMatch }) {
  const { teamA, teamB, setsTeamA, setsTeamB, currentSet, currentPointsTeamA, currentPointsTeamB, setWinsA, setWinsB, bestOf, servingTeam, status } = match;

  return (
    <div className="space-y-4">
      {/* Teams + set wins */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
        <div>
          <p className="text-base md:text-lg font-bold text-white">{teamA}</p>
          <p className="font-mono text-4xl md:text-5xl font-extrabold text-white mt-1">{currentPointsTeamA}</p>
          <p className="text-xs text-[#555] mt-1 font-mono">{setWinsA} sets</p>
        </div>
        <div className="text-center px-2">
          <p className="font-mono text-sm font-bold text-[#555]">Set {currentSet}</p>
          {bestOf && <p className="text-[10px] text-[#444]">Best of {bestOf}</p>}
        </div>
        <div className="text-right">
          <p className="text-base md:text-lg font-bold text-white">{teamB}</p>
          <p className="font-mono text-4xl md:text-5xl font-extrabold text-[#bbb] mt-1">{currentPointsTeamB}</p>
          <p className="text-xs text-[#555] mt-1 font-mono">{setWinsB} sets</p>
        </div>
      </div>

      {/* Set history */}
      {setsTeamA && setsTeamA.length > 0 && (
        <div className="rounded-lg bg-[#0d0d0d] p-3">
          <p className="text-[10px] text-[#555] uppercase tracking-wider mb-2">Set History</p>
          <div className="flex gap-3">
            {setsTeamA.map((s, i) => (
              <div key={i} className={cn("text-center", i === currentSet - 1 ? "opacity-100" : "opacity-40")}>
                <p className="text-[10px] text-[#555]">S{i+1}</p>
                <p className="font-mono text-sm font-bold text-white">{s}</p>
                <p className="font-mono text-sm text-[#888]">{setsTeamB[i]}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {match.summary && <p className="text-sm text-center text-[#666] italic pb-1">{match.summary}</p>}
      {status && <p className="text-xs text-center text-[#555] pt-1">{status}</p>}
    </div>
  );
}

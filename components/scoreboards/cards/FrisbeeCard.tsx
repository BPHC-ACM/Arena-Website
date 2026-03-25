import type { FrisbeeMatch } from "@/app/lib/types";

export function FrisbeeCard({ match }: { match: FrisbeeMatch }) {
  const { teamA, teamB, scoreA, scoreB, timeRemaining, pointCap, possession, status } = match;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
        <div>
          <p className="text-base md:text-lg font-bold text-white">{teamA}</p>
          <p className="font-mono text-4xl md:text-5xl font-extrabold text-white mt-1">{scoreA}</p>
          {possession === teamA && (
            <p className="text-xs mt-1" style={{ color: "#14b8a6" }}>◆ Possession</p>
          )}
        </div>
        <div className="text-center px-2">
          <p className="font-mono text-lg font-bold text-white">{timeRemaining}</p>
          <p className="text-[10px] text-[#555] mt-0.5">Cap {pointCap}</p>
        </div>
        <div className="text-right">
          <p className="text-base md:text-lg font-bold text-white">{teamB}</p>
          <p className="font-mono text-4xl md:text-5xl font-extrabold text-[#bbb] mt-1">{scoreB}</p>
          {possession === teamB && (
            <p className="text-xs mt-1" style={{ color: "#14b8a6" }}>◆ Possession</p>
          )}
        </div>
      </div>

      {match.summary && <p className="text-sm text-center text-[#666] italic pb-1">{match.summary}</p>}
      {status && <p className="text-xs text-center text-[#555] pt-1 border-t border-[#181818]">{status}</p>}
    </div>
  );
}

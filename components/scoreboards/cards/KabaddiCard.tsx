import type { KabaddiMatch } from "@/app/lib/types";

export function KabaddiCard({ match }: { match: KabaddiMatch }) {
  const { teamA, teamB, scoreA, scoreB, raidTimer, raidingTeam, bonusActive, superRaidActive, half, timeRemaining, status } = match;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
        <div>
          <p className="text-base md:text-lg font-bold text-white">{teamA}</p>
          <p className="font-mono text-4xl md:text-5xl font-extrabold text-white mt-1">{scoreA}</p>
        </div>
        <div className="text-center px-2">
          <p className="font-mono text-lg font-bold text-white">{raidTimer}s</p>
          <p className="text-[10px] text-[#555]">Raid</p>
          {timeRemaining && <p className="font-mono text-xs text-[#555] mt-1">{timeRemaining}</p>}
        </div>
        <div className="text-right">
          <p className="text-base md:text-lg font-bold text-white">{teamB}</p>
          <p className="font-mono text-4xl md:text-5xl font-extrabold text-[#bbb] mt-1">{scoreB}</p>
        </div>
      </div>

      {/* Raid info */}
      {(raidingTeam || bonusActive || superRaidActive || half) && (
        <div className="flex flex-wrap gap-2">
          {raidingTeam && (
            <span className="text-xs text-[#555] bg-[#0d0d0d] border border-[#1e1e1e] rounded-full px-2.5 py-0.5">
              Raiding: <span className="text-[#aaa]">{raidingTeam}</span>
            </span>
          )}
          {half && (
            <span className="text-xs text-[#555] bg-[#0d0d0d] border border-[#1e1e1e] rounded-full px-2.5 py-0.5">
              {half === 1 ? "1st Half" : "2nd Half"}
            </span>
          )}
          {bonusActive && (
            <span className="text-xs text-[#f97316] bg-[#1a0f05] border border-[#f9731630] rounded-full px-2.5 py-0.5">Bonus Active</span>
          )}
          {superRaidActive && (
            <span className="text-xs text-[#ef4444] bg-[#1a0505] border border-[#ef444430] rounded-full px-2.5 py-0.5">Super Raid</span>
          )}
        </div>
      )}

      {match.summary && <p className="text-sm text-center text-[#666] italic pb-1">{match.summary}</p>}
      {status && <p className="text-xs text-center text-[#555] pt-1">{status}</p>}
    </div>
  );
}

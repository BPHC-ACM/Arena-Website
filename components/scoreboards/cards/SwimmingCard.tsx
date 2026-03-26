import type { SwimmingMatch } from "@/app/lib/types";
import { cn } from "@/app/lib/utils";

export function SwimmingCard({ match }: { match: SwimmingMatch }) {
  const { swimmer1, swimmer2, time1, time2, distance, stroke, lane1, lane2, status } = match;

  const rows = [
    { name: swimmer1, time: time1, lane: lane1 },
    { name: swimmer2, time: time2, lane: lane2 },
  ];

  return (
    <div className="space-y-3">
      <div className="rounded-lg bg-[#0d0d0d] overflow-hidden">
        <div className="flex items-center gap-2 px-3 pt-2 pb-1">
          {distance && <span className="text-[10px] text-[#444] uppercase tracking-wider">{distance}</span>}
          {stroke && (
            <>
              {distance && <span className="text-[10px] text-[#444]">·</span>}
              <span className="text-[10px] text-[#444] uppercase tracking-wider">{stroke}</span>
            </>
          )}
        </div>

        {rows.map((s, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-3 border-t border-[#181818]">
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              {s.lane && <span className="text-xs text-[#666] font-mono mr-1">L{s.lane}</span>}
              <span className={cn("font-semibold text-sm truncate", i === 0 ? "text-white" : "text-[#aaa]")}>{s.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-2xl font-extrabold text-white">{s.time || "--:--"}</span>
            </div>
          </div>
        ))}
      </div>
      {match.summary && <p className="text-sm text-center text-[#666] italic pb-1">{match.summary}</p>}
      {status && <p className="text-xs text-center text-[#555]">{status}</p>}
    </div>
  );
}

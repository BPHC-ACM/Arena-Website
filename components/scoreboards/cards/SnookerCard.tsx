import type { SnookerMatch } from "@/app/lib/types";
import { cn } from "@/app/lib/utils";

export function SnookerCard({ match }: { match: SnookerMatch }) {
  const { player1, player2, framesPlayer1, framesPlayer2, currentFrame, currentScorePlayer1, currentScorePlayer2, bestOf, onTable, remainingPoints, status } = match;

  const rows = [
    { name: player1, frames: framesPlayer1, currentScore: currentScorePlayer1, atTable: onTable === 1 },
    { name: player2, frames: framesPlayer2, currentScore: currentScorePlayer2, atTable: onTable === 2 },
  ];

  return (
    <div className="space-y-3">
      <div className="rounded-lg bg-[#0d0d0d] overflow-hidden">
        <div className="flex items-center gap-2 px-3 pt-2 pb-1">
          <span className="text-[10px] text-[#444] uppercase tracking-wider">Best of {bestOf ?? 7}</span>
          <span className="text-[10px] text-[#444]">·</span>
          <span className="text-[10px] text-[#444] uppercase tracking-wider">Frame {currentFrame}</span>
          {remainingPoints !== undefined && (
            <>
              <span className="text-[10px] text-[#444]">·</span>
              <span className="text-[10px] text-[#57a639] uppercase tracking-wider">{remainingPoints} pts left</span>
            </>
          )}
        </div>

        {rows.map((p, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-3 border-t border-[#181818]">
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              {p.atTable && <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] flex-shrink-0" />}
              <span className={cn("font-semibold text-sm truncate", i === 0 ? "text-white" : "text-[#aaa]")}>{p.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-[#666]">Frames</div>
                <div className="font-mono text-base text-white">{p.frames}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-[#666]">Score</div>
                <span className="font-mono text-2xl font-extrabold text-white">{p.currentScore}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {match.summary && <p className="text-sm text-center text-[#666] italic pb-1">{match.summary}</p>}
      {status && <p className="text-xs text-center text-[#555]">{status}</p>}
    </div>
  );
}

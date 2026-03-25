import type { CarromMatch } from "@/app/lib/types";
import { cn } from "@/app/lib/utils";

export function CarromCard({ match }: { match: CarromMatch }) {
  const { player1, player2, scorePlayer1, scorePlayer2, currentBoard, boardsPlayer1, boardsPlayer2, bestOf, striker, status } = match;

  const rows = [
    { name: player1, score: scorePlayer1, boards: boardsPlayer1, isStriker: striker === 1 },
    { name: player2, score: scorePlayer2, boards: boardsPlayer2, isStriker: striker === 2 },
  ];

  return (
    <div className="space-y-3">
      <div className="rounded-lg bg-[#0d0d0d] border border-[#1a1a1a] overflow-hidden">
        <div className="flex items-center gap-2 px-3 pt-2 pb-1">
          <span className="text-[10px] text-[#444] uppercase tracking-wider">Best of {bestOf ?? 3}</span>
          <span className="text-[10px] text-[#444]">·</span>
          <span className="text-[10px] text-[#444] uppercase tracking-wider">Board {currentBoard}</span>
        </div>

        {rows.map((p, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-3 border-t border-[#181818]">
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              {p.isStriker && <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24] flex-shrink-0" />}
              <span className={cn("font-semibold text-sm truncate", i === 0 ? "text-white" : "text-[#aaa]")}>{p.name}</span>
            </div>
            <div className="flex items-center gap-2">
              {p.boards?.map((s, j) => (
                <span key={j} className={cn("font-mono text-base min-w-[20px] text-center",
                  j === currentBoard - 1 ? "text-white font-bold" : "text-[#333]")}>{s}</span>
              ))}
              <span className="font-mono text-3xl font-extrabold text-white ml-2 min-w-[40px] text-right">{p.score}</span>
            </div>
          </div>
        ))}
      </div>
      {match.summary && <p className="text-sm text-center text-[#666] italic pb-1">{match.summary}</p>}
      {status && <p className="text-xs text-center text-[#555]">{status}</p>}
    </div>
  );
}

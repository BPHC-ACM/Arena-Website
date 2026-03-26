import type { SquashMatch } from "@/app/lib/types";
import { cn } from "@/app/lib/utils";

export function SquashCard({ match }: { match: SquashMatch }) {
  const { player1, player2, gamesPlayer1, gamesPlayer2, currentGame, currentPointsPlayer1, currentPointsPlayer2, server, bestOf, status } = match;

  const rows = [
    { name: player1, games: gamesPlayer1, cur: currentPointsPlayer1, serving: server === 1 },
    { name: player2, games: gamesPlayer2, cur: currentPointsPlayer2, serving: server === 2 },
  ];

  return (
    <div className="space-y-3">
      <div className="rounded-lg bg-[#0d0d0d] overflow-hidden">
        <div className="flex items-center gap-2 px-3 pt-2 pb-1">
          <span className="text-[10px] text-[#444] uppercase tracking-wider">Best of {bestOf ?? 5}</span>
          <span className="text-[10px] text-[#444]">·</span>
          <span className="text-[10px] text-[#444] uppercase tracking-wider">Game {currentGame}</span>
        </div>

        {rows.map((p, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-3 border-t border-[#181818]">
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              {p.serving && <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7] flex-shrink-0" />}
              <span className={cn("font-semibold text-sm truncate", i === 0 ? "text-white" : "text-[#aaa]")}>{p.name}</span>
            </div>
            <div className="flex items-center gap-2">
              {p.games.map((s, j) => (
                <span key={j} className={cn("font-mono text-base min-w-[20px] text-center",
                  j === currentGame - 1 ? "text-white font-bold" : "text-[#333]")}>{s}</span>
              ))}
              <span className="font-mono text-3xl font-extrabold text-white ml-2 min-w-[40px] text-right">{p.cur}</span>
            </div>
          </div>
        ))}
      </div>
      {status && <p className="text-xs text-center text-[#555]">{status}</p>}
    </div>
  );
}

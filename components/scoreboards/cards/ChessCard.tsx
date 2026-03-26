import type { ChessMatch } from "@/app/lib/types";
import { cn } from "@/app/lib/utils";

export function ChessCard({ match }: { match: ChessMatch }) {
  const { player1, player2, timePlayer1, timePlayer2, moveCount, currentTurn, timeControl, result, status } = match;

  const rows = [
    { name: player1, time: timePlayer1, moves: moveCount, isTurn: currentTurn === 1 },
    { name: player2, time: timePlayer2, moves: moveCount, isTurn: currentTurn === 2 },
  ];

  return (
    <div className="space-y-3">
      <div className="rounded-lg bg-[#0d0d0d] overflow-hidden">
        <div className="flex items-center gap-2 px-3 pt-2 pb-1">
          {timeControl && <span className="text-[10px] text-[#444] uppercase tracking-wider">{timeControl}</span>}
          {result && (
            <>
              {timeControl && <span className="text-[10px] text-[#444]">·</span>}
              <span className="text-[10px] text-[#57a639] uppercase tracking-wider font-semibold">{result}</span>
            </>
          )}
        </div>

        {rows.map((p, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-3 border-t border-[#181818]">
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              {p.isTurn && <span className="w-1.5 h-1.5 rounded-full bg-[#57a639] flex-shrink-0" />}
              <span className={cn("font-semibold text-sm truncate", i === 0 ? "text-white" : "text-[#aaa]")}>{p.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-[#666]">Moves</div>
                <div className="font-mono text-sm text-white">{p.moves}</div>
              </div>
              <div className="font-mono text-2xl font-extrabold text-white min-w-[70px] text-right">{p.time}</div>
            </div>
          </div>
        ))}
      </div>
      {status && <p className="text-xs text-center text-[#555]">{status}</p>}
    </div>
  );
}

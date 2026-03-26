import type { TennisMatch } from "@/app/lib/types";
import { cn } from "@/app/lib/utils";

export function TennisCard({ match }: { match: TennisMatch }) {
  const { player1, player2, setsPlayer1, setsPlayer2, currentSet, currentGameScorePlayer1, currentGameScorePlayer2, server, surface, status } = match;

  const p1SetsWon = setsPlayer1.filter((s, i) => s > (setsPlayer2[i] || 0)).length;
  const p2SetsWon = setsPlayer2.filter((s, i) => s > (setsPlayer1[i] || 0)).length;

  const rows = [
    { name: player1, sets: setsPlayer1, setsWon: p1SetsWon, cur: currentGameScorePlayer1, serving: server === 1 },
    { name: player2, sets: setsPlayer2, setsWon: p2SetsWon, cur: currentGameScorePlayer2, serving: server === 2 },
  ];

  return (
    <div className="space-y-3">
      {surface && (
        <p className="text-[10px] text-[#555] uppercase tracking-wider">{surface} Court</p>
      )}

      {/* Score table */}
      <div className="rounded-lg bg-[#0d0d0d] overflow-hidden">
        {/* Header */}
        <div 
          className="grid gap-0 text-[10px] text-[#444] font-medium uppercase tracking-wider px-3 pt-2.5 pb-1.5"
          style={{ gridTemplateColumns: `1fr repeat(${setsPlayer1.length}, 36px) 36px 64px` }}
        >
          <div />
          {setsPlayer1.map((_, i) => <div key={i} className="text-center">S{i+1}</div>)}
          <div className="text-center">Sets</div>
          <div className="text-center">Game</div>
        </div>

        {rows.map((p, i) => (
          <div key={i} 
            className="grid gap-0 px-3 py-2.5 items-center border-t border-[#181818]"
            style={{ gridTemplateColumns: `1fr repeat(${setsPlayer1.length}, 36px) 36px 64px` }}
          >
            <div className="flex items-center gap-1.5">
              {p.serving && <span className="w-1.5 h-1.5 rounded-full bg-[#57a639]" />}
              <span className={cn("font-semibold text-sm leading-tight", i === 0 ? "text-white" : "text-[#aaa]")}>{p.name}</span>
            </div>
            {p.sets.map((s, j) => (
              <div key={j} className={cn("text-center font-mono text-sm",
                j === currentSet - 1 ? "text-white font-bold" : "text-[#444]")}>{s}</div>
            ))}
            <div className="text-center font-mono text-sm font-bold text-white bg-[#1a1a1a] rounded mx-1 py-0.5">
              {p.setsWon}
            </div>
            <div className="text-center font-mono text-2xl font-extrabold text-white">{p.cur}</div>
          </div>
        ))}
      </div>
      {status && <p className="text-xs text-center text-[#555]">{status}</p>}
    </div>
  );
}

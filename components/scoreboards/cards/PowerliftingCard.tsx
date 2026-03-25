import type { PowerliftingMatch } from "@/app/lib/types";
import { cn } from "@/app/lib/utils";

export function PowerliftingCard({ match }: { match: PowerliftingMatch }) {
  const { athlete1, athlete2, totalAthlete1, totalAthlete2, currentLift, weightClass, status } = match;

  const getBestLift = (a1?: number, a2?: number, a3?: number) => {
    const valid = [a1, a2, a3].filter(x => x !== undefined && x! > 0);
    return valid.length > 0 ? Math.max(...(valid as number[])) : 0;
  };

  const squatBest1 = getBestLift(match.squatAttempt1Athlete1, match.squatAttempt2Athlete1, match.squatAttempt3Athlete1);
  const benchBest1 = getBestLift(match.benchAttempt1Athlete1, match.benchAttempt2Athlete1, match.benchAttempt3Athlete1);
  const deadliftBest1 = getBestLift(match.deadliftAttempt1Athlete1, match.deadliftAttempt2Athlete1, match.deadliftAttempt3Athlete1);

  const squatBest2 = getBestLift(match.squatAttempt1Athlete2, match.squatAttempt2Athlete2, match.squatAttempt3Athlete2);
  const benchBest2 = getBestLift(match.benchAttempt1Athlete2, match.benchAttempt2Athlete2, match.benchAttempt3Athlete2);
  const deadliftBest2 = getBestLift(match.deadliftAttempt1Athlete2, match.deadliftAttempt2Athlete2, match.deadliftAttempt3Athlete2);

  const rows = [
    { name: athlete1, squat: squatBest1, bench: benchBest1, deadlift: deadliftBest1, total: totalAthlete1 },
    { name: athlete2, squat: squatBest2, bench: benchBest2, deadlift: deadliftBest2, total: totalAthlete2 },
  ];

  return (
    <div className="space-y-3">
      <div className="rounded-lg bg-[#0d0d0d] border border-[#1a1a1a] overflow-hidden">
        <div className="flex items-center gap-2 px-3 pt-2 pb-1">
          {weightClass && <span className="text-[10px] text-[#444] uppercase tracking-wider">{weightClass}</span>}
          {currentLift && (
            <>
              {weightClass && <span className="text-[10px] text-[#444]">·</span>}
              <span className="text-[10px] text-[#57a639] uppercase tracking-wider font-semibold">Current: {currentLift}</span>
            </>
          )}
        </div>

        {rows.map((a, i) => (
          <div key={i} className="px-3 py-3 border-t border-[#181818]">
            <div className="flex items-center justify-between mb-2">
              <span className={cn("font-semibold text-sm", i === 0 ? "text-white" : "text-[#aaa]")}>{a.name}</span>
              <span className="font-mono text-2xl font-extrabold text-white">{a.total} kg</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-[#0a0a0a] rounded p-1.5 text-center">
                <div className="text-[#666]">Squat</div>
                <div className="font-mono text-white font-semibold">{a.squat}</div>
              </div>
              <div className="bg-[#0a0a0a] rounded p-1.5 text-center">
                <div className="text-[#666]">Bench</div>
                <div className="font-mono text-white font-semibold">{a.bench}</div>
              </div>
              <div className="bg-[#0a0a0a] rounded p-1.5 text-center">
                <div className="text-[#666]">Deadlift</div>
                <div className="font-mono text-white font-semibold">{a.deadlift}</div>
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

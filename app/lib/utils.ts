import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isInProgress(match: Record<string, any>): boolean {
  const s = String(match?.status ?? "").toLowerCase();
  return (
    s.length > 0 &&
    !["won", "completed", "over", "ended", "finished", "full time"].some((w) =>
      s.includes(w)
    )
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function sortMatchesLiveFirst<T extends Record<string, any>>(
  matches: T[]
): T[] {
  return [...matches].sort((a, b) => {
    const aLive = isInProgress(a) ? 1 : 0;
    const bLive = isInProgress(b) ? 1 : 0;
    if (bLive !== aLive) return bLive - aLive;
    return (b.id ?? 0) - (a.id ?? 0);
  });
}

export function formatOvers(overs: string | number): string {
  return String(overs);
}

export function strikeRate(runs: number, balls: number): string {
  if (!balls) return "0.00";
  return ((runs / balls) * 100).toFixed(1);
}

export function economy(runs: number, overs: string | number): string {
  const ov = parseFloat(String(overs));
  if (!ov) return "0.00";
  const full = Math.floor(ov) + (ov % 1) * (10 / 6);
  return (runs / full).toFixed(2);
}

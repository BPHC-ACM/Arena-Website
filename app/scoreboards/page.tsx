import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scores | Arena 2026",
};

export default function ScoreboardsIndex() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <p className="text-sm md:text-base text-[#666] text-center">
        Select a sport from the left panel to view live scores.
      </p>
    </div>
  );
}

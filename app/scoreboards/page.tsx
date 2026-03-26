import SportGrid from "@/components/SportGrid";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scores | Arena 2026",
};

export default function ScoreboardsIndex() {
  return <SportGrid basePath="/scoreboards" />;
}

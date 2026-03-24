"use client"
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getWebSocketUrl, getWebSocketUrlForDisplay } from "./lib/websocket";

export default function Home() {
  const wsUrl = useMemo(() => getWebSocketUrl(), []);
  const wsUrlForDisplay = useMemo(() => getWebSocketUrlForDisplay(), []);
  const [socketStatus, setSocketStatus] = useState<"connecting" | "connected" | "disconnected">("connecting");

  useEffect(() => {
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      setSocketStatus("connected");
    };

    socket.onerror = () => {
      setSocketStatus("disconnected");
    };

    socket.onclose = () => {
      setSocketStatus("disconnected");
    };

    return () => {
      socket.close();
    };
  }, [wsUrl]);

  const statusClassName =
    socketStatus === "connected"
      ? "text-emerald-300"
      : socketStatus === "connecting"
      ? "text-amber-300"
      : "text-rose-300";

  const statusText =
    socketStatus === "connected"
      ? "Backend WebSocket is connected"
      : socketStatus === "connecting"
      ? "Connecting to backend WebSocket..."
      : "Backend WebSocket is disconnected";

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#EAEAEA]">
      <main className="mx-auto max-w-4xl px-6 py-20">
        <h1 className="text-5xl font-bold uppercase tracking-wide text-[rgb(186,196,92)]">
          Arena Scoreboards
        </h1>
        <p className="mt-4 max-w-2xl text-[#EAEAEA]/80">
          Live multi-sport scoreboards powered by a Next.js frontend and Express + WebSocket backend.
        </p>

        <div className="mt-8 border border-[rgb(135,86,36)] bg-[rgb(37,81,43)]/30 p-4">
          <p className={`text-sm font-semibold uppercase tracking-wider ${statusClassName}`}>{statusText}</p>
          <p className="mt-2 text-xs text-[#EAEAEA]/70">WebSocket URL: {wsUrlForDisplay}</p>
        </div>

        <div className="mt-10 flex gap-4">
          <Link
            href="/scoreboards"
            className="border border-[rgb(186,196,92)] bg-[rgb(50,64,21)] px-6 py-3 font-semibold uppercase tracking-wide text-[rgb(186,196,92)] transition-colors hover:bg-[rgb(186,196,92)] hover:text-[#0D0D0D]"
          >
            Open Scoreboards
          </Link>
        </div>
      </main>
    </div>
  );
}
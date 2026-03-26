'use client';
import { useState, useEffect } from 'react';
import { API_BASE_URL, getWebSocketUrl } from './websocket';
import { sortMatchesLiveFirst } from './utils';
import type { SportId } from './sports';

const WS_URL = getWebSocketUrl();

export function useMatchStream(sport: SportId) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wsConnected, setWsConnected] = useState(false);

  useEffect(() => {
    let dead = false;
    let ws: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    const fetchInitial = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/${sport}`, {
          cache: 'no-store',
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (!dead)
          setMatches(sortMatchesLiveFirst(Array.isArray(data) ? data : []));
      } catch {
        if (!dead)
          setError(
            `Could not load ${sport} matches. The backend may be unavailable.`,
          );
      } finally {
        if (!dead) setLoading(false);
      }
    };

    const connect = () => {
      if (dead) return;
      try {
        ws = new WebSocket(WS_URL);
        ws.onopen = () => {
          if (!dead) setWsConnected(true);
        };
        ws.onmessage = (e) => {
          if (dead) return;
          try {
            const msg = JSON.parse(e.data);
            if (msg.event === `${sport}_update`) {
              setMatches(
                sortMatchesLiveFirst(Array.isArray(msg.data) ? msg.data : []),
              );
              setLoading(false);
              setError(null);
            }
          } catch {
            /* ignore */
          }
        };
        ws.onerror = () => {
          if (!dead) setWsConnected(false);
        };
        ws.onclose = () => {
          if (!dead) {
            setWsConnected(false);
            reconnectTimer = setTimeout(connect, 2000);
          }
        };
      } catch {
        if (!dead) reconnectTimer = setTimeout(connect, 2000);
      }
    };

    fetchInitial();
    connect();

    return () => {
      dead = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (ws && (ws.readyState === 0 || ws.readyState === 1))
        ws.close(1000, 'unmounted');
    };
  }, [sport]);

  return { matches, loading, error, wsConnected };
}

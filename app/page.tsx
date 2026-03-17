"use client"
import { useEffect, useRef } from "react";

export default function Home() {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const token = "token-created-from-json-web-token-package";

    // after adding adding authentications will change it 
    const socket = new WebSocket(`ws://localhost:8080?token=${token}`);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onerror = (err) => {
      console.error("WebSocket error", err);
    };

    socket.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div>

      <h1>Hello</h1>
    </div>
  )
}
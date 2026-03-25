"use server"
import { WebSocketServer, WebSocket } from "ws";
// import jwt from "jsonwebtoken"; 
import dotenv from "dotenv";

// it will include functions to update database 
import { updateScoreTable } from "./updateScoreTable.js";

dotenv.config();

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws, req) => {
    try {
        const url = new URL(req.url, "http://localhost");

        // it shouldn't be like this while deploying 
        const token = url.searchParams.get("token");

        if (!token) {
            ws.close(1008, "Token missing");
            return;
        }

        // need to verify user first by clearly specifying admin roles and all
        // const user = jwt.verify(token, process.env.token);

        // for now this is the just for testing
        if (token === process.env.token) {
            console.log("Token verified successfully");
            ws.user = token; // Attach token to WebSocket for future reference
        } else {
            throw new Error("Invalid token ");
        }

        console.log("Client connected:", ws.user);

    } catch (err) {
        console.log(err.message);
        ws.close(1008, "Invalid token");
        return;
    }

    // Handle incoming messages
    ws.on("message", (message) => {
        try {
            // add additional layers for validation and security as who can send data
            const parsedData = JSON.parse(message.toString());
            updateScoreTable({scoringData: parsedData.scoringData}, matchId)         // contains scoringdata and match matchid 
            // this function updates database

            // Broadcast to all connected clients
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(parsedData),matchId);        // it will come from database for now just sending demo thing
                }
            });

        } catch (err) {
            console.log("Invalid JSON received", err.message);
        }
    });

    ws.on("close", () => {
        console.log("Client disconnected");
    });

    ws.on("error", (err) => {
        console.log("WebSocket error:", err.message);
    });
});

console.log("WebSocket server running on ws://localhost:8080");
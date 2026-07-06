import express from "express";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { createMcpServer } from "./mcp_server.js";
const app = express();
// --- STRICT SECURITY MIDDLEWARE ---
app.use((req, res, next) => {
    // 1. Read the key dynamically injected by Cloud Run at startup
    const API_KEY = process.env.MCP_API_KEY;
    // 2. Failsafe: Block everything if the secret wasn't loaded properly
    if (!API_KEY) {
        console.error("CRITICAL ERROR: MCP_API_KEY environment variable is missing.");
        return res
            .status(500)
            .json({ error: "Internal Server Error: Missing Configuration" });
    }
    // 3. Verify the incoming request header
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== `Bearer ${API_KEY}`) {
        console.warn(`Blocked unauthorized access attempt from ${req.ip}`);
        return res.status(401).json({ error: "Unauthorized" });
    }
    // 4. Key matches, proceed to the MCP logic
    next();
});
// ----------------------------------
const mcpServer = createMcpServer();
let transport;
// Endpoint for the initial SSE connection
app.get("/sse", async (req, res) => {
    transport = new SSEServerTransport("/messages", res);
    await transport.start();
    await mcpServer.connect(transport);
});
// Endpoint for receiving JSON-RPC messages
app.post("/messages", async (req, res) => {
    if (transport) {
        await transport.handlePostMessage(req, res);
    }
});
// Cloud Run injects its own PORT environment variable (default 8080)
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`SSE MCP Server securely listening on port ${PORT}`);
});

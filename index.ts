#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createMcpServer } from "./mcp_server.js";

async function runServer() {
	const server = createMcpServer();
	const transport = new StdioServerTransport();
	await server.connect(transport);
	console.error("Sequential Thinking MCP Server running on stdio");
}

runServer().catch((error) => {
	console.error("Fatal error running server:", error);
	process.exit(1);
});

const express = require('express');
const { TEST_MCP_SERVERS } = require('./mcp-test-servers');

const app = express();
const serverConfig = TEST_MCP_SERVERS.LOCALHOST;

// Mock SSE endpoint
app.get('/sse', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  // Send initial connection event
  res.write(`data: ${JSON.stringify({ status: 'connected' })}\n\n`);
  
  // Keep connection alive
  const interval = setInterval(() => {
    res.write(':ping\n\n');
  }, 30000);

  // Cleanup on client disconnect
  req.on('close', () => {
    clearInterval(interval);
    res.end();
  });
});

// Start server
app.listen(serverConfig.port, () => {
  console.log(`Test MCP server running at http://${serverConfig.address}:${serverConfig.port}`);
}); 
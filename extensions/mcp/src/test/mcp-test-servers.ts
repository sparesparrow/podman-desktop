/**
 * Test MCP server configurations for local development and testing
 */
export const TEST_MCP_SERVERS = {
  LOCALHOST: {
    name: 'Localhost Test Server',
    address: 'localhost',
    port: 3001,
    description: 'Local development server'
  },
  DOCKER: {
    name: 'Docker Test Server',
    address: 'host.docker.internal',
    port: 3001,
    description: 'Server running in Docker container'
  },
  MOCK: {
    name: 'Mock Server',
    address: '127.0.0.1',
    port: 3001,
    description: 'Mock server for unit tests'
  }
};

export type TestMcpServer = keyof typeof TEST_MCP_SERVERS;

/**
 * Get test server configuration
 */
export function getTestServer(server: TestMcpServer) {
  return TEST_MCP_SERVERS[server];
} 
import { vi } from 'vitest';
import { EventEmitter } from 'node:events';
import { TEST_MCP_SERVERS } from './mcp-test-servers';

declare global {
  // eslint-disable-next-line no-var
  var console: Console;
  // eslint-disable-next-line no-var
  var window: Window & typeof globalThis;
}

// Mock console methods
global.console = {
  ...console,
  log: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  info: vi.fn(),
  debug: vi.fn(),
} as Console;

// Mock window methods if needed
global.window = {
  ...window,
} as Window & typeof globalThis;

// Mock SSE transport
class MockSSETransport extends EventEmitter {
  connect() {
    return Promise.resolve();
  }
  disconnect() {
    return Promise.resolve();
  }
}

vi.mock('@modelcontextprotocol/sdk/client/sse.js', () => ({
  SSEClientTransport: MockSSETransport
}));

// Mock MCP server configurations
vi.mock('../main/mcp-provider', () => ({
  MCPProvider: vi.fn().mockImplementation(() => ({
    connect: vi.fn().mockImplementation((server: TestMcpServer = 'MOCK') => {
      const config = TEST_MCP_SERVERS[server];
      return Promise.resolve(config);
    }),
    disconnect: vi.fn(),
    dispose: vi.fn()
  }))
})); 
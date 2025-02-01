import { vi } from 'vitest';
import { EventEmitter } from 'node:events';
import { TEST_MCP_SERVERS } from './mcp-test-servers';

export function createMockExtensionContext() {
  return {
    subscriptions: [],
    storagePath: '/tmp/test',
    extensionPath: '/tmp/test',
    provider: {
      createProvider: vi.fn().mockReturnValue({
        registerLifecycle: vi.fn(),
        updateStatus: vi.fn()
      })
    },
    configuration: {
      getConfiguration: vi.fn().mockReturnValue({
        get: vi.fn()
      }),
      onDidChangeConfiguration: vi.fn()
    }
  };
}

export function createMockClient() {
  const mockClient = {
    connect: vi.fn(),
    disconnect: vi.fn(),
    listResources: vi.fn().mockReturnValue(new EventEmitter()),
    listTools: vi.fn().mockReturnValue(new EventEmitter()),
    listPrompts: vi.fn().mockReturnValue(new EventEmitter()),
    on: vi.fn() // For SSE event handling
  };
  return mockClient;
}

export function createMockServer(server: TestMcpServer = 'MOCK') {
  const config = TEST_MCP_SERVERS[server];
  return {
    ...config,
    start: vi.fn().mockResolvedValue(true),
    stop: vi.fn().mockResolvedValue(true),
    isRunning: vi.fn().mockReturnValue(true)
  };
} 
import { vi } from 'vitest';

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
  return {
    connect: vi.fn(),
    disconnect: vi.fn(),
    listResources: vi.fn(),
    listTools: vi.fn(),
    listPrompts: vi.fn()
  };
} 
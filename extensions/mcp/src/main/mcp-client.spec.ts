import { beforeEach, describe, expect, test, vi } from 'vitest';
import * as pd from '@podman-desktop/api';
import { activate, deactivate } from './mcp-client';
import { MCPProvider } from './mcp-provider';

vi.mock('./mcp-provider');
vi.mock('@podman-desktop/api', () => ({
  commands: {
    registerCommand: vi.fn()
  }
}));

describe('MCP Client Extension', () => {
  let extensionContext: pd.ExtensionContext;

  beforeEach(() => {
    extensionContext = {
      subscriptions: [],
    } as unknown as pd.ExtensionContext;

    vi.clearAllMocks();
  });

  test('should register provider on activation', async () => {
    await activate(extensionContext);
    expect(MCPProvider).toHaveBeenCalledWith(extensionContext);
    expect(extensionContext.subscriptions.length).toBeGreaterThan(0);
  });

  test('should register connect command', async () => {
    await activate(extensionContext);
    expect(pd.commands.registerCommand).toHaveBeenCalledWith(
      'mcp-client.connect',
      expect.any(Function)
    );
  });

  test('should cleanup on deactivation', async () => {
    await activate(extensionContext);
    const mockDispose = vi.fn();
    vi.mocked(MCPProvider).mockImplementation(() => ({
      dispose: mockDispose
    }) as unknown as MCPProvider);

    deactivate();
    expect(mockDispose).toHaveBeenCalled();
  });
}); 
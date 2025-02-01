import { beforeEach, describe, expect, test, vi } from 'vitest';
import { MCPProvider } from './mcp-provider';
import * as pd from '@podman-desktop/api';

// Mock the @podman-desktop/api
vi.mock('@podman-desktop/api', () => ({
  window: {
    createStatusBarItem: vi.fn().mockReturnValue({
      text: '',
      show: vi.fn(),
      dispose: vi.fn()
    }),
    showInformationMessage: vi.fn(),
    showErrorMessage: vi.fn()
  },
  StatusBarAlignment: {
    Left: 1
  }
}));

describe('MCPProvider', () => {
  let provider: MCPProvider;
  let extensionContext: pd.ExtensionContext;

  beforeEach(() => {
    extensionContext = {
      subscriptions: [],
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
    } as unknown as pd.ExtensionContext;

    provider = new MCPProvider(extensionContext);
  });

  test('should create status bar item on construction', () => {
    expect(pd.window.createStatusBarItem).toHaveBeenCalled();
  });

  test('should create provider on construction', () => {
    expect(extensionContext.provider.createProvider).toHaveBeenCalledWith({
      name: 'MCP Client',
      id: 'mcp-client',
      status: 'not-ready',
      emptyStateDescription: 'No MCP server connection configured'
    });
  });

  test('should handle connection errors', async () => {
    const mockError = new Error('Connection failed');
    vi.spyOn(console, 'error').mockImplementation(() => {});

    // Mock configuration to return invalid values
    extensionContext.configuration.getConfiguration = vi.fn().mockReturnValue({
      get: vi.fn().mockReturnValue(undefined)
    });

    await provider.connect();

    expect(pd.window.showErrorMessage).toHaveBeenCalledWith(
      expect.stringContaining('Failed to connect to MCP server')
    );
  });
}); 
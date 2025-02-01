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
  // Extend the pd.ExtensionContext type to include our custom properties for testing.
  let extensionContext: pd.ExtensionContext & {
    provider: {
      createProvider: Function;
    };
    configuration: {
      getConfiguration: Function;
      onDidChangeConfiguration: Function;
    };
  };

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
      },
      // Adding dummy properties to satisfy the pd.ExtensionContext interface
      storagePath: '',
      extensionUri: { fsPath: '' } as any,
      secrets: {
        get: vi.fn(),
        store: vi.fn(),
        delete: vi.fn(),
        onDidChange: vi.fn()
      }
    };
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
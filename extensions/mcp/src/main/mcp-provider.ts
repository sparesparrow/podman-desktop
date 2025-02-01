import * as pd from '@podman-desktop/api';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';
import { EventEmitter } from 'node:events';

export class MCPProvider implements pd.Disposable {
  private client: Client | undefined;
  private readonly statusBarItem: pd.StatusBarItem;
  private provider: pd.Provider;
  private configChangeEmitter = new EventEmitter(); // For config monitoring

  constructor(private readonly extensionContext: pd.ExtensionContext) {
    // Create status bar item for MCP connection status.
    this.statusBarItem = pd.window.createStatusBarItem(pd.StatusBarAlignLeft);
    this.statusBarItem.text = 'MCP';
    this.updateStatusBar('Not Connected');
    this.statusBarItem.show();

    // Create provider for MCP client.
    // Casting extensionContext to any to access provider property.
    this.provider = (this.extensionContext as any).provider.createProvider({
      name: 'MCP Client',
      id: 'mcp-client',
      status: 'not-ready',
      emptyStateDescription: 'No MCP server connection configured'
    });

    // Register lifecycle handlers for provider.
    // Fixed the "status" property to be a function returning a ProviderStatus.
    this.provider.registerLifecycle({
      status: () => 'not-ready' as pd.ProviderStatus,
      start: async () => {
        await this.connect();
      },
      stop: async () => {
        await this.disconnect();
      }
    });

    // Add config change listener with an explicit type on the event parameter.
    (this.extensionContext as any).configuration.onDidChangeConfiguration((e: any) => {
      if (e.affectsConfiguration('mcp')) {
        this.configChangeEmitter.emit('configChanged');
      }
    });
  }

  private updateStatusBar(status: string) {
    this.statusBarItem.text = `MCP: ${status}`;
  }

  // Establishes a connection with the configured MCP server.
  public async connect(): Promise<void> {
    try {
      const config = (this.extensionContext as any).configuration.getConfiguration('mcp');
      const address = config.get('serverAddress');
      const port = config.get('serverPort');

      if (!address || !port) {
        throw new Error('Server configuration missing');
      }

      // Create a new MCP client with proper capabilities
      this.client = new Client(
        { name: 'podman-desktop-mcp-client', version: '0.1.0' },
        {
          capabilities: {
            prompts: {},
            resources: {},
            tools: {}
          }
        }
      );

      // Create SSE transport with error handling.
      // Casting transport as any to use the on() method.
      const transport = new SSEClientTransport(new URL(`http://${address}:${port}/sse`));
      (transport as any).on('error', (err: any) => {
        this.handleConnectionError(err);
      });

      // Add reconnection logic on config changes
      this.configChangeEmitter.on('configChanged', async () => {
        await this.reconnect();
      });

      await this.client.connect(transport);
      
      // Update provider and status bar on successful connection.
      this.provider.updateStatus('ready' as pd.ProviderStatus);
      this.updateStatusBar('Connected');
      pd.window.showInformationMessage('Connected to MCP server');
    } catch (error) {
      if (error instanceof Error) {
        this.handleConnectionError(error);
      } else {
        this.handleConnectionError(new Error(String(error)));
      }
    }
  }

  private handleConnectionError(error: Error) {
    console.error('MCP connection error:', error);
    this.provider.updateStatus('error' as pd.ProviderStatus);
    this.updateStatusBar('Connection Error');
    pd.window.showErrorMessage(`MCP connection error: ${error.message}`);
  }

  // Disconnects from the MCP server.
  public async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.disconnect();
      this.client = undefined;
      this.provider.updateStatus('not-ready' as pd.ProviderStatus);
      this.updateStatusBar('Disconnected');
    }
  }

  // Reconnects to the MCP server.
  private async reconnect(): Promise<void> {
    await this.disconnect();
    await this.connect();
  }

  // Cleanup resources.
  public dispose(): void {
    this.statusBarItem.dispose();
    this.disconnect();
  }

  getClient(): Client | undefined {
    return this.client;
  }
}
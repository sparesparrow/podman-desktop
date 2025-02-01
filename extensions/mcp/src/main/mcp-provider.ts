import * as pd from '@podman-desktop/api';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';

export class MCPProvider implements pd.Disposable {
  private client: Client | undefined;
  private readonly statusBarItem: pd.StatusBarItem;
  private provider: pd.Provider;

  constructor(private readonly extensionContext: pd.ExtensionContext) {
    // Create status bar item for MCP connection status.
    this.statusBarItem = pd.window.createStatusBarItem(pd.StatusBarAlignment.Left);
    this.statusBarItem.text = 'MCP';
    this.updateStatusBar('Not Connected');
    this.statusBarItem.show();

    // Create provider for MCP client.
    this.provider = this.extensionContext.provider.createProvider({
      name: 'MCP Client',
      id: 'mcp-client',
      status: 'not-ready',
      emptyStateDescription: 'No MCP server connection configured'
    });

    // Register lifecycle handlers for provider.
    this.provider.registerLifecycle({
      start: async () => {
        await this.connect();
      },
      stop: async () => {
        await this.disconnect();
      }
    });

    // Monitor configuration changes to trigger reconnection.
    extensionContext.configuration.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration('mcp')) {
        this.reconnect();
      }
    });
  }

  private updateStatusBar(status: string) {
    this.statusBarItem.text = `MCP: ${status}`;
  }

  // Establishes a connection with the configured MCP server.
  public async connect(): Promise<void> {
    try {
      const config = this.extensionContext.configuration.getConfiguration('mcp');
      const address = config.get<string>('serverAddress');
      const port = config.get<number>('serverPort');

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

      // Setup client transport using SSE (make sure your MCP server supports SSE on the /sse endpoint)
      const transport = new SSEClientTransport(new URL(`http://${address}:${port}/sse`));
      await this.client.connect(transport);
      
      // Update provider and status bar on successful connection.
      this.provider.updateStatus('ready');
      this.updateStatusBar('Connected');
      pd.window.showInformationMessage('Connected to MCP server');
    } catch (error) {
      console.error('Failed to connect to MCP server:', error);
      this.provider.updateStatus('error');
      this.updateStatusBar('Connection Error');
      pd.window.showErrorMessage(`Failed to connect to MCP server: ${error}`);
    }
  }

  // Disconnects from the MCP server.
  public async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.disconnect();
      this.client = undefined;
      this.provider.updateStatus('not-ready');
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
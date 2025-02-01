import * as pd from '@podman-desktop/api';
import { MCPProvider } from './mcp-provider';

let provider: MCPProvider | undefined;

/**
 * Activate the MCP extension.
 */
export async function activate(extensionContext: pd.ExtensionContext): Promise<void> {
  provider = new MCPProvider(extensionContext);
  extensionContext.subscriptions.push(provider);

  // Register extension command to manually trigger connection.
  extensionContext.subscriptions.push(
    pd.commands.registerCommand('mcp-client.connect', async () => {
      await provider?.connect();
    })
  );
}

/**
 * Deactivate the MCP extension.
 */
export function deactivate(): void {
  provider?.dispose();
} 
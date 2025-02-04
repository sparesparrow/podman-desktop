/**
 * MCP Extension for Podman Desktop
 * 
 * Provides MCP server management capabilities through Podman Desktop's extension API.
 * Handles server lifecycle, configuration, and client communication.
 */

import { commands, window } from '@podman-desktop/api';
import type { ExtensionContext } from '@podman-desktop/api';
import { ConfigurationManager } from './services/ConfigurationManager';
import { AnthropicClient } from './services/AnthropicClient';
import type { McpClient } from './services/McpClient';
import type { ServerConfig, ServerStatus, Container } from './types/interfaces';
import { PodmanContainerManager } from './services/ContainerManager';

// Service instances
let configManager: ConfigurationManager;
let anthropicClient: AnthropicClient;
const mcpClients: Map<string, McpClient> = new Map();

// Container manager and active server containers map
let containerManager: PodmanContainerManager;
const serverContainers: Map<string, Container> = new Map();

export async function activate(context: ExtensionContext): Promise<void> {
  try {
    // Initialize services
    configManager = new ConfigurationManager();
    anthropicClient = new AnthropicClient();
    containerManager = new PodmanContainerManager();

    await configManager.initialize();
    await anthropicClient.initialize();

    // Register commands
    context.subscriptions.push(
      commands.registerCommand('mcp.setAnthropicApiKey', async () => {
        const apiKey = await window.showInputBox({
          prompt: 'Enter your Anthropic API key',
          password: true
        });

        if (apiKey) {
          await anthropicClient.setApiKey(apiKey);
          window.showInformationMessage('Anthropic API key has been set');
        }
      }),

      commands.registerCommand('mcp.addServer', async () => {
        try {
          const serverName = await window.showInputBox({
            prompt: 'Enter the name for the new MCP server',
            placeHolder: 'e.g., memory-server'
          });

          if (!serverName) {
            return;
          }

          const config: ServerConfig = {
            name: serverName,
            command: 'mcp-server',
            args: ['--name', serverName]
          };

          await configManager.addServer(serverName, config);
          window.showInformationMessage(`MCP server '${serverName}' has been added`);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          window.showErrorMessage(`Failed to add server: ${errorMessage}`);
        }
      }),

      commands.registerCommand('mcp.removeServer', async () => {
        try {
          const servers = configManager.getAllServers();
          const serverName = await window.showQuickPick(
            servers.map(s => s.name),
            { placeHolder: 'Select server to remove' }
          );

          if (serverName) {
            await configManager.removeServer(serverName);
            const client = mcpClients.get(serverName);
            if (client) {
              await client.disconnect();
              mcpClients.delete(serverName);
            }
            // Also stop and remove container if running
            const container = serverContainers.get(serverName);
            if (container) {
              await container.stop();
              await containerManager.removeContainer(serverName);
              serverContainers.delete(serverName);
            }
            window.showInformationMessage(`MCP server '${serverName}' has been removed`);
          }
        } catch (error: unknown) {
          const err = error instanceof Error ? error : new Error('Failed to remove server');
          window.showErrorMessage(`Error removing server: ${err.message}`);
        }
      }),

      commands.registerCommand('mcp.startServer', async () => {
        try {
          const servers = configManager.getAllServers();
          const serverName = await window.showQuickPick(
            servers.map(s => s.name),
            { placeHolder: 'Select server to start' }
          );

          if (!serverName) {
            return;
          }

          const container = await containerManager.startServer(serverName);
          if (container) {
            serverContainers.set(serverName, container);
            window.showInformationMessage(`Server '${serverName}' started successfully`);
          } else {
            window.showErrorMessage(`Failed to start server '${serverName}'`);
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          window.showErrorMessage(`Failed to start server: ${errorMessage}`);
        }
      }),

      commands.registerCommand('mcp.stopServer', async () => {
        try {
          const servers = configManager.getAllServers();
          const serverName = await window.showQuickPick(
            servers.map(s => s.name),
            { placeHolder: 'Select server to stop' }
          );

          if (serverName) {
            const container = serverContainers.get(serverName);
            if (container) {
              await container.stop();
              await containerManager.removeContainer(serverName);
              serverContainers.delete(serverName);
              window.showInformationMessage(`Stopped MCP server '${serverName}'`);
            } else {
              window.showErrorMessage(`Container for server '${serverName}' not found`);
            }
          }
        } catch (error: unknown) {
          const err = error instanceof Error ? error : new Error('Failed to stop server');
          window.showErrorMessage(`Error stopping server: ${err.message}`);
        }
      }),

      // New command to list all configured servers
      commands.registerCommand('mcp.listServers', async () => {
        try {
          const servers = configManager.getAllServers();
          if (servers.length === 0) {
            window.showInformationMessage('No MCP servers configured');
          } else {
            const names = servers.map(s => s.name).join(', ');
            window.showInformationMessage(`Configured MCP servers: ${names}`);
          }
        } catch (error: unknown) {
          const err = error instanceof Error ? error : new Error('Failed to list servers');
          window.showErrorMessage(`Error listing servers: ${err.message}`);
        }
      }),

      // New command to get status of a server
      commands.registerCommand('mcp.getServerStatus', async () => {
        try {
          const serverName = await window.showInputBox({ prompt: 'Enter server name to get status' });
          if (!serverName) return;
          const container = serverContainers.get(serverName);
          const status = container ? 'RUNNING' : 'STOPPED';
          window.showInformationMessage(`Server '${serverName}' status: ${status}`);
        } catch (error: unknown) {
          const err = error instanceof Error ? error : new Error('Failed to get server status');
          window.showErrorMessage(`Error getting server status: ${err.message}`);
        }
      })
    );

    // Initialize existing servers from configuration
    const servers = configManager.getAllServers();
    for (const server of servers) {
      // TODO: Implement server initialization logic if needed
      console.log(`Initializing MCP server: ${server.name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    window.showErrorMessage(`Failed to activate extension: ${errorMessage}`);
    throw error;
  }
}

export function deactivate(): void {
  // Clean up resources
  mcpClients.clear();
  
  for (const container of serverContainers.values()) {
    container.stop().catch(error => {
      const errorMessage = error instanceof Error ? error.message : String(error);
      window.showErrorMessage(`Failed to stop container: ${errorMessage}`);
    });
  }
  
  serverContainers.clear();
}
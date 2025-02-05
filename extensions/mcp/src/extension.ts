/**
 * MCP Extension for Podman Desktop
 * 
 * Provides MCP server management capabilities through Podman Desktop's extension API.
 * Handles server lifecycle, configuration, and client communication.
 */

import { commands, window, Uri } from '@podman-desktop/api';
import type { ExtensionContext } from '@podman-desktop/api';
import { ConfigurationManager } from './services/ConfigurationManager';
import { AnthropicClient } from './services/AnthropicClient';
import { McpProvider } from './services/McpProvider';
import type { McpClient } from './services/McpClient';
import type { ServerConfig, Container } from './types/interfaces';
import { PodmanContainerManager } from './services/ContainerManager';

// Service instances
let configManager: ConfigurationManager;
let anthropicClient: AnthropicClient;
let mcpProvider: McpProvider;
const mcpClients: Map<string, McpClient> = new Map();

// Container manager and active server containers map
let containerManager: PodmanContainerManager;
const serverContainers: Map<string, Container> = new Map();

export async function activate(context: ExtensionContext): Promise<void> {
  try {
    // Initialize provider
    mcpProvider = new McpProvider('MCP Server Manager', 'mcp-server-manager');
    context.subscriptions.push({ dispose: () => mcpProvider.dispose() });

    // Initialize services
    configManager = new ConfigurationManager();
    anthropicClient = new AnthropicClient();
    containerManager = new PodmanContainerManager();

    await Promise.all([
      configManager.initialize(),
      anthropicClient.initialize(),
      mcpProvider.initialize()
    ]);

    // Register commands
    const commandRegistrations = [
      commands.registerCommand('mcp.setAnthropicApiKey', handleSetAnthropicApiKey),
      commands.registerCommand('mcp.addServer', handleAddServer),
      commands.registerCommand('mcp.removeServer', handleRemoveServer),
      commands.registerCommand('mcp.startServer', handleStartServer),
      commands.registerCommand('mcp.stopServer', handleStopServer),
      commands.registerCommand('mcp.listServers', handleListServers),
      commands.registerCommand('mcp.getServerStatus', handleGetServerStatus)
    ];

    context.subscriptions.push(...commandRegistrations);

    // Initialize existing servers from configuration
    await initializeExistingServers();

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    window.showErrorMessage(`Failed to activate extension: ${errorMessage}`);
    throw error;
  }
}

async function handleSetAnthropicApiKey(): Promise<void> {
  const apiKey = await window.showInputBox({
    prompt: 'Enter your Anthropic API key',
    password: true
  });

  if (apiKey) {
    try {
      await anthropicClient.setApiKey(apiKey);
      window.showInformationMessage('Anthropic API key has been set');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      window.showErrorMessage(`Failed to set API key: ${errorMessage}`);
    }
  }
}

async function handleAddServer(): Promise<void> {
  try {
    const serverName = await window.showInputBox({
      prompt: 'Enter the name for the new MCP server',
      placeHolder: 'e.g., memory-server'
    });

    if (!serverName) {
      return;
    }

    const config: ServerConfig = {
      command: 'mcp-server',
      args: ['--name', serverName]
    };

    await configManager.addServer(serverName, config);
    window.showInformationMessage(`MCP server '${serverName}' has been added`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    window.showErrorMessage(`Failed to add server: ${errorMessage}`);
  }
}

async function handleRemoveServer(): Promise<void> {
  try {
    const servers = configManager.getAllServers();
    const serverName = await window.showQuickPick(
      servers.map(s => s.name),
      { placeHolder: 'Select server to remove' }
    );

    if (!serverName) {
      return;
    }

    await stopAndRemoveServer(serverName);
    await configManager.removeServer(serverName);
    window.showInformationMessage(`MCP server '${serverName}' has been removed`);
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Failed to remove server');
    window.showErrorMessage(`Error removing server: ${err.message}`);
  }
}

async function handleStartServer(): Promise<void> {
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
}

async function handleStopServer(): Promise<void> {
  try {
    const servers = configManager.getAllServers();
    const serverName = await window.showQuickPick(
      servers.map(s => s.name),
      { placeHolder: 'Select server to stop' }
    );

    if (!serverName) {
      return;
    }

    await stopAndRemoveServer(serverName);
    window.showInformationMessage(`Stopped MCP server '${serverName}'`);
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Failed to stop server');
    window.showErrorMessage(`Error stopping server: ${err.message}`);
  }
}

async function handleListServers(): Promise<void> {
  try {
    const servers = configManager.getAllServers();
    if (servers.length === 0) {
      window.showInformationMessage('No MCP servers configured');
    } else {
      const names = servers.map(s => s.name).join(', ');
      window.showInformationMessage(`Configured MCP servers: ${names}`);
    }
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Failed to list servers');
    window.showErrorMessage(`Error listing servers: ${err.message}`);
  }
}

async function handleGetServerStatus(): Promise<void> {
  try {
    const serverName = await window.showInputBox({ prompt: 'Enter server name to get status' });
    if (!serverName) {
      return;
    }

    const container = serverContainers.get(serverName);
    const status = container ? await container.status : 'STOPPED';
    window.showInformationMessage(`Server '${serverName}' status: ${status}`);
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Failed to get server status');
    window.showErrorMessage(`Error getting server status: ${err.message}`);
  }
}

async function stopAndRemoveServer(serverName: string): Promise<void> {
  const client = mcpClients.get(serverName);
  if (client) {
    await client.disconnect();
    mcpClients.delete(serverName);
  }

  const container = serverContainers.get(serverName);
  if (container) {
    await container.stop();
    await containerManager.removeContainer(serverName);
    serverContainers.delete(serverName);
  }
}

async function initializeExistingServers(): Promise<void> {
  const servers = configManager.getAllServers();
  for (const server of servers) {
    try {
      // TODO: Implement proper server initialization logic
      console.log(`Initializing MCP server: ${server.name}`);
    } catch (error) {
      console.error(`Failed to initialize server ${server.name}:`, error);
    }
  }
}

export async function deactivate(): Promise<void> {
  // Clean up resources
  mcpClients.clear();
  
  const stopPromises = Array.from(serverContainers.values()).map(container =>
    container.stop().catch(error => {
      const errorMessage = error instanceof Error ? error.message : String(error);
      window.showErrorMessage(`Failed to stop container: ${errorMessage}`);
    })
  );

  await Promise.all(stopPromises);
  serverContainers.clear();
}
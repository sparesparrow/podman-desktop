/**
 * ConfigurationManager
 *
 * Manages persistent storage of MCP server configurations using Podman Desktop's storage API.
 * Implements the IMcpConfig interface for consistent configuration management across the extension.
 * Handles loading, saving, and updating of server configurations with proper error handling.
 */

import { window } from '@podman-desktop/api';

interface Storage {
  setItem(key: string, value: string): Promise<void>;
  getItem(key: string): Promise<string | null>;
}

interface ExtendedWindow {
  getStorage(): Storage;
}

interface ServerConfig {
  command: string;
  args: string[];
}

interface McpConfig {
  servers: Record<string, ServerConfig>;
}

export interface IMcpConfig {
  getConfig(): IMcpConfig;
  updateServerConfig(serverName: string, config: ServerConfig): Promise<void>;
  addServer(serverName: string, config: ServerConfig): Promise<void>;
  removeServer(serverName: string): Promise<void>;
  getServerConfig(serverName: string): ServerConfig | undefined;
  getAllServers(): Array<{ name: string; config: ServerConfig }>;
}

export class ConfigurationManager implements IMcpConfig {
  private storage: Storage;
  private config: McpConfig = { servers: {} };
  private readonly CONFIG_KEY = 'mcp-config';

  constructor() {
    this.storage = (window as unknown as ExtendedWindow).getStorage();
  }

  async initialize(): Promise<void> {
    try {
      const storedConfig = await this.storage.getItem(this.CONFIG_KEY);
      if (storedConfig) {
        const parsedConfig = JSON.parse(storedConfig);
        if (this.validateConfig(parsedConfig)) {
          this.config = parsedConfig;
        } else {
          throw new Error('Invalid stored configuration format');
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      window.showErrorMessage(`Failed to initialize configuration: ${errorMessage}`);
      throw new Error(`Failed to initialize configuration: ${errorMessage}`);
    }
  }

  private validateConfig(config: unknown): config is McpConfig {
    if (!config || typeof config !== 'object') return false;
    const mcpConfig = config as McpConfig;
    if (typeof mcpConfig.servers !== 'object') return false;

    // Validate each server configuration
    for (const serverConfig of Object.values(mcpConfig.servers)) {
      if (!this.validateServerConfig(serverConfig)) {
        return false;
      }
    }

    return true;
  }

  private validateServerConfig(config: unknown): config is ServerConfig {
    if (!config || typeof config !== 'object') return false;
    const serverConfig = config as ServerConfig;
    return (
      typeof serverConfig.command === 'string' &&
      Array.isArray(serverConfig.args) &&
      serverConfig.args.every(arg => typeof arg === 'string')
    );
  }

  private async verifyPersistence(): Promise<void> {
    const storedConfig = await this.storage.getItem(this.CONFIG_KEY);
    if (!storedConfig) {
      throw new Error('Configuration was not persisted');
    }
    const parsedConfig = JSON.parse(storedConfig);
    if (JSON.stringify(parsedConfig) !== JSON.stringify(this.config)) {
      throw new Error('Persisted configuration does not match current configuration');
    }
  }

  async addServer(serverName: string, serverConfig: ServerConfig): Promise<void> {
    try {
      if (!this.validateServerConfig(serverConfig)) {
        throw new Error('Invalid configuration provided');
      }
      if (this.config.servers[serverName]) {
        throw new Error(`Server '${serverName}' already exists`);
      }

      const originalConfig = { ...this.config };
      this.config.servers[serverName] = serverConfig;

      try {
        await this.storage.setItem(this.CONFIG_KEY, JSON.stringify(this.config));
        await this.verifyPersistence();
      } catch (error) {
        // Rollback on persistence failure
        this.config = originalConfig;
        throw error;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      window.showErrorMessage(`Failed to add server '${serverName}': ${errorMessage}`);
      throw new Error(`Failed to add server '${serverName}': ${errorMessage}`);
    }
  }

  async removeServer(serverName: string): Promise<void> {
    try {
      if (!this.config.servers[serverName]) {
        throw new Error(`Server '${serverName}' not found`);
      }

      const originalConfig = { ...this.config };
      delete this.config.servers[serverName];

      try {
        await this.storage.setItem(this.CONFIG_KEY, JSON.stringify(this.config));
        await this.verifyPersistence();
      } catch (error) {
        // Rollback on persistence failure
        this.config = originalConfig;
        throw error;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      window.showErrorMessage(`Failed to remove server '${serverName}': ${errorMessage}`);
      throw new Error(`Failed to remove server '${serverName}': ${errorMessage}`);
    }
  }

  async updateServerConfig(serverName: string, newConfig: ServerConfig): Promise<void> {
    try {
      if (!this.validateServerConfig(newConfig)) {
        throw new Error('Invalid configuration provided');
      }
      if (!this.config.servers[serverName]) {
        throw new Error(`Cannot update non-existent server '${serverName}'`);
      }

      const originalConfig = { ...this.config };
      this.config.servers[serverName] = newConfig;

      try {
        await this.storage.setItem(this.CONFIG_KEY, JSON.stringify(this.config));
        await this.verifyPersistence();
      } catch (error) {
        // Rollback on persistence failure
        this.config = originalConfig;
        throw error;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      window.showErrorMessage(`Failed to update server '${serverName}': ${errorMessage}`);
      throw new Error(`Failed to update server '${serverName}': ${errorMessage}`);
    }
  }

  getConfig(): IMcpConfig {
    return this;
  }

  getServerConfig(serverName: string): ServerConfig | undefined {
    return this.config.servers[serverName];
  }

  getAllServers(): Array<{ name: string; config: ServerConfig }> {
    return Object.entries(this.config.servers).map(([name, config]) => ({ name, config }));
  }
} 
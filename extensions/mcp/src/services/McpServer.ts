import type { IMcpServer, ServerConfig, ServerCapabilities, Container, ServerOptions } from '../types/interfaces';
import { ServerStatus } from '../types/interfaces';
import type { ContainerManager } from '../types/interfaces';
import { window } from '@podman-desktop/api';

export class McpServer implements IMcpServer {
  private status: ServerStatus = ServerStatus.STOPPED;
  private container?: Container;
  private capabilities?: ServerCapabilities;
  private isRunning: boolean = false;
  private config: ServerConfig;

  constructor(
    private readonly name: string,
    config: ServerConfig,
    private readonly containerManager: ContainerManager
  ) {
    this.config = config;
  }

  async connect(options?: object): Promise<void> {
    try {
      if (this.status === ServerStatus.RUNNING) {
        return;
      }

      this.status = ServerStatus.STARTING;
      
      // Create and start container
      this.container = await this.containerManager.createContainer(this.name, {
        image: 'mcp-server:latest', // TODO: Make configurable
        command: this.config.command,
        args: this.config.args,
        env: this.config.env,
        workingDir: this.config.workingDir
      });

      await this.container.start();
      
      // Query server capabilities
      const result = await this.container.exec('mcp-query-capabilities');
      if (result.exitCode !== 0) {
        throw new Error(`Failed to query capabilities: ${result.stderr}`);
      }

      try {
        this.capabilities = JSON.parse(result.stdout);
      } catch (error) {
        throw new Error('Invalid capabilities format returned by server');
      }

      this.status = ServerStatus.RUNNING;
    } catch (error) {
      this.status = ServerStatus.ERROR;
      const errorMessage = error instanceof Error ? error.message : String(error);
      window.showErrorMessage(`Failed to start MCP server '${this.name}': ${errorMessage}`);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.status !== ServerStatus.RUNNING || !this.container) {
        return;
      }

      this.status = ServerStatus.STOPPING;
      await this.container.stop();
      await this.containerManager.removeContainer(this.name);
      this.container = undefined;
      this.status = ServerStatus.STOPPED;
    } catch (error) {
      this.status = ServerStatus.ERROR;
      const errorMessage = error instanceof Error ? error.message : String(error);
      window.showErrorMessage(`Failed to stop MCP server '${this.name}': ${errorMessage}`);
      throw error;
    }
  }

  getStatus(): ServerStatus {
    return this.status;
  }

  getCapabilities(): ServerCapabilities | undefined {
    return this.capabilities;
  }

  getName(): string {
    return this.name;
  }

  getConfig(): ServerConfig {
    return this.config;
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      return;
    }
    this.isRunning = true;
  }

  async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }
    this.isRunning = false;
  }

  isActive(): boolean {
    return this.isRunning;
  }

  getContainer(): Container | undefined {
    return this.container;
  }

  setContainer(container: Container): void {
    this.container = container;
  }
} 
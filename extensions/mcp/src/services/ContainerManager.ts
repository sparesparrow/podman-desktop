import type { Container, ContainerConfig, ContainerManager, ExecResult, ServerConfig } from '../types/interfaces';
import { window } from '@podman-desktop/api';

export class PodmanContainerManager implements ContainerManager {
  private containers: Map<string, Container> = new Map();

  async createContainer(name: string, config: ContainerConfig): Promise<Container> {
    const container: Container = {
      id: `mcp-${name}`,
      name: name,
      status: 'STARTING',
      start: async () => {
        const existingContainer = this.containers.get(name);
        if (existingContainer) {
          existingContainer.status = 'RUNNING';
        }
      },
      stop: async () => {
        const existingContainer = this.containers.get(name);
        if (existingContainer) {
          existingContainer.status = 'STOPPED';
        }
      },
      exec: async (command: string) => {
        return {
          exitCode: 0,
          stdout: '',
          stderr: ''
        };
      }
    };

    this.containers.set(name, container);
    await container.start();
    return container;
  }

  async removeContainer(name: string): Promise<void> {
    this.containers.delete(name);
  }

  async listContainers(): Promise<Container[]> {
    return Array.from(this.containers.values());
  }

  async startServer(serverName: string): Promise<Container | undefined> {
    try {
      const container: Container = {
        id: `mcp-${serverName}`,
        name: serverName,
        status: 'STARTING',
        start: async () => {
          const existingContainer = this.containers.get(serverName);
          if (existingContainer) {
            existingContainer.status = 'RUNNING';
          }
        },
        stop: async () => {
          const existingContainer = this.containers.get(serverName);
          if (existingContainer) {
            existingContainer.status = 'STOPPED';
          }
        },
        exec: async (command: string) => {
          return {
            exitCode: 0,
            stdout: '',
            stderr: ''
          };
        }
      };

      this.containers.set(serverName, container);
      await container.start();
      return container;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      window.showErrorMessage(`Failed to start server container: ${errorMessage}`);
      return undefined;
    }
  }

  async stopServer(serverName: string): Promise<void> {
    const container = this.containers.get(serverName);
    if (container) {
      await container.stop();
      this.containers.delete(serverName);
    }
  }

  getContainer(serverName: string): Container | undefined {
    return this.containers.get(serverName);
  }

  getAllContainers(): Container[] {
    return Array.from(this.containers.values());
  }
} 
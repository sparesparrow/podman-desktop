import type { IMcpClient } from '@podman-desktop-mcp/shared';
import type { Transport, Response } from '@modelcontextprotocol/sdk';
import { Client } from '@modelcontextprotocol/sdk';
import { window } from '@podman-desktop/api';

export class McpClient implements IMcpClient {
  private client: Client;
  private logger: typeof window;

  constructor(transport: Transport) {
    this.client = new Client(transport);
    this.logger = window;
  }

  private logError(context: string, error: unknown): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    this.logger.showErrorMessage(`[MCP Client] ${context}: ${errorMessage}`);
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
    } catch (error) {
      this.logError('Connection failed', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.client.disconnect();
    } catch (error) {
      this.logError('Disconnection failed', error);
      throw error;
    }
  }

  async processMessage(message: string): Promise<string> {
    try {
      const response = await this.sendRequest({
        type: 'process_message',
        payload: { message }
      }) as Response;
      
      if (typeof response.data === 'object' && response.data && 'message' in response.data) {
        return String(response.data.message);
      }
      throw new Error('Invalid response format');
    } catch (error) {
      throw new Error(`Failed to process message: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async sendRequest(request: unknown): Promise<unknown> {
    try {
      return await this.client.request(request);
    } catch (error) {
      throw new Error(`Failed to send request: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
} 
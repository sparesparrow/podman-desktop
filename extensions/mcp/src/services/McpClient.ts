import type { IMcpClient, IMcpMessage, McpRequest, McpResponse } from '../types/interfaces';
import type { Transport } from '@modelcontextprotocol/sdk';
import { Client } from '@modelcontextprotocol/sdk';
import { window } from '@podman-desktop/api';

interface McpResponse {
  result: string;
  metadata?: {
    timestamp: string;
    version: string;
  };
}

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

  private validateResponse(response: unknown): response is McpResponse {
    if (!response || typeof response !== 'object') {
      return false;
    }

    const mcpResponse = response as Partial<McpResponse>;
    return typeof mcpResponse.result === 'string';
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
    } catch (error) {
      this.logError('Connection failed', error);
      throw error;
    }
  }

  async processMessage(message: string): Promise<string> {
    try {
      const response = await this.sendRequest({
        type: 'process_message',
        payload: { message }
      });
      return response.data.message as string;
    } catch (error) {
      throw new Error(`Failed to process message: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async sendRequest(request: McpRequest): Promise<McpResponse> {
    try {
      const response = await this.client.request(request);
      return {
        status: 'success',
        data: response as Record<string, unknown>
      };
    } catch (error) {
      return {
        status: 'error',
        data: {},
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  async sendNotification(notification: IMcpMessage): Promise<void> {
    try {
      await this.client.notify({
        type: notification.type,
        payload: notification.payload
      });
    } catch (error) {
      this.logError('Notification failed', error);
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
} 
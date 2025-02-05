import type { IMcpClient, IMcpMessage, McpRequest, McpResponse } from '../types/interfaces';
import type { Transport } from '@modelcontextprotocol/sdk';
import { Client } from '@modelcontextprotocol/sdk';
import { window } from '@podman-desktop/api';

export interface McpClient {
  processMessage(message: string): Promise<McpResponse>;
  sendRequest<T>(request: unknown): Promise<T>;
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

  async processMessage(message: string): Promise<McpResponse> {
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

  async sendRequest<T>(request: unknown): Promise<T> {
    try {
      const response = await this.client.request(request);
      return response as T;
    } catch (error) {
      throw new Error(`Failed to send request: ${error instanceof Error ? error.message : String(error)}`);
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
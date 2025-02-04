import type { McpRequest, McpResponse, McpNotification } from '../../types/interfaces';

export class Client {
  connect = jest.fn().mockResolvedValue(undefined);
  request = jest.fn().mockResolvedValue({ status: 'success', data: {} });
  notify = jest.fn().mockResolvedValue(undefined);
  disconnect = jest.fn().mockResolvedValue(undefined);
}

export type Transport = {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  send(data: McpRequest | McpNotification): Promise<McpResponse | undefined>;
}; 
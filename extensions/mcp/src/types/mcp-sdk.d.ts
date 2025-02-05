declare module '@modelcontextprotocol/sdk' {
  export interface Transport {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    send(data: unknown): Promise<void>;
    receive(): Promise<unknown>;
  }

  export class Client {
    constructor(transport: Transport);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    request(data: unknown): Promise<unknown>;
    notify(data: unknown): Promise<void>;
  }

  export interface ServerCapabilities {
    version: string;
    features: string[];
  }

  export interface McpRequest {
    type: string;
    payload: Record<string, unknown>;
  }

  export interface McpResponse {
    result: string;
    metadata?: {
      timestamp: string;
      version: string;
    };
  }
} 
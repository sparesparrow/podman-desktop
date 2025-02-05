declare module '@modelcontextprotocol/sdk' {
  export interface Transport {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    send(data: unknown): Promise<void>;
    receive(): Promise<unknown>;
  }

  export interface ServerCapabilities {
    resources?: {
      subscribe?: boolean;
      listChanged?: boolean;
    };
    prompts?: {
      listChanged?: boolean;
    };
    tools?: {
      listChanged?: boolean;
    };
    logging?: Record<string, unknown>;
  }

  export interface Request {
    type: string;
    payload?: unknown;
  }

  export interface Response {
    type: string;
    data: unknown;
  }

  export interface Notification {
    type: string;
    payload?: unknown;
  }

  export class Client {
    constructor(transport: Transport);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    request(request: Request): Promise<Response>;
    notification(notification: Notification): Promise<void>;
  }
} 
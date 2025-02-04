/* Ambient declarations for missing modules and APIs */

import type { McpRequest, McpResponse, McpNotification } from './interfaces';

// Ambient declaration for '@modelcontextprotocol/sdk'
declare module '@modelcontextprotocol/sdk' {
  export interface Transport {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    send(data: McpRequest | McpNotification): Promise<McpResponse | undefined>;
  }

  export class Client {
    constructor(transport: Transport);
    connect(): Promise<void>;
    request(request: McpRequest): Promise<McpResponse>;
    notify(notification: McpNotification): Promise<void>;
    disconnect(): Promise<void>;
  }
}

// Ambient declaration for '@anthropic-ai/sdk'
declare module '@anthropic-ai/sdk' {
  export class Anthropic {
    constructor(config: { apiKey: string });
    messages: {
      create(params: {
        model: string;
        max_tokens: number;
        temperature: number;
        messages: { role: string; content: string }[];
      }): Promise<{
        content: Array<{ text: string }>;
        model: string;
        usage: {
          input_tokens: number;
          output_tokens: number;
        };
      }>;
    };
  }
}

// Extend the '@podman-desktop/api' module
declare module '@podman-desktop/api' {
  export interface Storage {
    get(key: string): Promise<string | undefined>;
    set(key: string, value: string): Promise<void>;
    delete(key: string): Promise<void>;
  }

  export interface Window {
    getStorage(): Storage;
  }
}

// Declare global window object
declare global {
  interface Window {
    getStorage(): Storage;
  }
} 
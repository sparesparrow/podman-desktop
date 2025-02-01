declare module '@podman-desktop/api' {
  // Re-export types from Podman Desktop API
  export * from '@podman-desktop/api';
}

declare module '@modelcontextprotocol/sdk/client/index.js' {
  export class Client {
    constructor(
      info: { name: string; version: string },
      capabilities: { capabilities: { prompts: {}; resources: {}; tools: {} } }
    );
    connect(transport: any): Promise<void>;
    disconnect(): Promise<void>;
  }
}

declare module '@modelcontextprotocol/sdk/client/sse.js' {
  export class SSEClientTransport {
    constructor(url: URL);
  }
} 
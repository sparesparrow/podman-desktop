import type { ProviderStatus } from '@podman-desktop/api';
import type { Resource, Tool, Prompt } from '@modelcontextprotocol/sdk/types.js';

export interface McpServerConfig {
  name: string;
  address: string;
  port: number;
}

export interface McpState extends McpServerConfig {
  resources: Resource[];
  tools: Tool[];
  prompts: Prompt[];
  status: ProviderStatus;
} 
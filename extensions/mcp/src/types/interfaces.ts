import type { Transport } from '@modelcontextprotocol/sdk';
import type { ProviderStatus } from '@podman-desktop/api';

// Core interfaces
export interface IMcpConfig {
  getConfig(): IMcpConfig;
  updateServerConfig(serverName: string, newConfig: ServerConfig): Promise<void>;
  addServer(serverName: string, config: ServerConfig): Promise<void>;
  removeServer(serverName: string): Promise<void>;
  getServerConfig(serverName: string): ServerConfig | undefined;
  getAllServers(): Array<{ name: string; config: ServerConfig }>;
}

export interface IMcpClient {
  processMessage(message: string): Promise<string>;
  sendRequest(request: McpRequest): Promise<McpResponse>;
}

export interface ILLMProvider {
  sendRequest(payload: LLMRequest): Promise<LLMResponse>;
  getResponse(): Promise<LLMResponse>;
}

// Server and Container types
export interface ServerConfig {
  command: string;
  args: string[];
  env?: Record<string, string>;
  workingDir?: string;
  resources?: ResourceConfig[];
  tools?: ToolConfig[];
}

export interface ServerOptions {
  capabilities?: string[];
  env?: Record<string, string>;
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

export type ServerStatus = 'STARTING' | 'RUNNING' | 'STOPPING' | 'STOPPED' | 'ERROR';

export interface Container {
  id: string;
  name: string;
  status: ProviderStatus;
  start(): Promise<void>;
  stop(): Promise<void>;
  exec(command: string): Promise<{ stdout: string; stderr: string }>;
}

export interface ContainerManager {
  createContainer(name: string, config: ContainerConfig): Promise<Container>;
  removeContainer(name: string): Promise<void>;
  listContainers(): Promise<Container[]>;
}

// Message types
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

export interface LLMRequest {
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  temperature?: number;
  model?: string;
}

export interface LLMResponse {
  content: string;
  role: 'assistant';
  metadata?: Record<string, unknown>;
}

// Configuration types
export interface ResourceConfig {
  name: string;
  type: string;
  config: Record<string, unknown>;
}

export interface ToolConfig {
  name: string;
  description: string;
  args: {
    name: string;
    type: string;
    description: string;
    required: boolean;
  }[];
}

export interface ContainerConfig {
  image: string;
  command: string;
  args?: string[];
  env?: Record<string, string>;
  workingDir?: string;
}

export interface ExecResult {
  exitCode: number;
  stdout: string;
  stderr: string;
}

export interface ServerInfo {
  name: string;
  status: ServerStatus;
  capabilities: ServerCapabilities;
  version: string;
}

export interface IMcpServer {
  getName(): string;
  getConfig(): ServerConfig;
  start(): Promise<void>;
  stop(): Promise<void>;
  isActive(): boolean;
  getStatus(): ServerStatus;
  getContainer(): Container | undefined;
  setContainer(container: Container): void;
}

export interface IMcpProvider {
  name: string;
  id: string;
  status: ProviderStatus;
  initialize(): Promise<void>;
  start(): Promise<void>;
  stop(): Promise<void>;
  getStatus(): Promise<ProviderStatus>;
}

export interface IMcpServerManager {
  startServer(name: string, config: ServerConfig): Promise<Container>;
  stopServer(name: string): Promise<void>;
  listServers(): Promise<ServerInfo[]>;
  getServerStatus(name: string): Promise<ServerStatus>;
}
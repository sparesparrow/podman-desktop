import type { Transport } from '@modelcontextprotocol/sdk';

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
  name: string;
  command: string;
  args: string[];
  env?: Record<string, string>;
  workingDir?: string;
  resources?: ResourceConfig[];
  tools?: ToolConfig[];
}

export type ServerStatus = 'STARTING' | 'RUNNING' | 'STOPPING' | 'STOPPED' | 'ERROR';

export interface ServerCapabilities {
  supportedTools: string[];
  maxConcurrentRequests: number;
  supportedTransports: string[];
}

export interface Container {
  id: string;
  name: string;
  status: ServerStatus;
  start(): Promise<void>;
  stop(): Promise<void>;
  exec(command: string): Promise<ExecResult>;
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
  status: 'success' | 'error';
  data: Record<string, unknown>;
  error?: string;
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
  type: string;
  path: string;
  options?: Record<string, unknown>;
}

export interface ToolConfig {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
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

export interface IMcpServer {
  connect(options?: ConnectionOptions): Promise<void>;
}

export interface IMcpServerFactory {
  createServer(config: ServerConfig): IMcpServer;
}

export interface IMcpTransport {
  send(data: TransportData): Promise<TransportResponse>;
  receive(): Promise<TransportData>;
}

export interface IMcpMessage {
  id: string;
  type: 'request' | 'response' | 'notification';
  payload: Record<string, unknown>;
}

export interface IMcpDao {
  save(message: IMcpMessage): Promise<void>;
  load(id: string): Promise<IMcpMessage>;
}

export interface McpNotification {
  type: string;
  payload: Record<string, unknown>;
}

export interface TransportData {
  type: 'request' | 'response' | 'notification';
  payload: Record<string, unknown>;
}

export interface TransportResponse {
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
}

export interface ConnectionOptions {
  timeout?: number;
  retryAttempts?: number;
  secure?: boolean;
}

export interface ServerInfo {
  name: string;
  status: ServerStatus;
  capabilities: ServerCapabilities;
  version: string;
}

export enum ErrorCode {
  SERVER_START_FAILED = 'SERVER_START_FAILED',
  SERVER_NOT_FOUND = 'SERVER_NOT_FOUND',
  CONTAINER_ERROR = 'CONTAINER_ERROR',
  COMMUNICATION_ERROR = 'COMMUNICATION_ERROR',
  INVALID_CONFIGURATION = 'INVALID_CONFIGURATION'
}

export interface McpError extends Error {
  code: ErrorCode;
  details?: unknown;
} 
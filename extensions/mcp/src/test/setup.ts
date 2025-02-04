/**
 * Global test setup for the MCP extension.
 * This file provides mock implementations and resets mocks before each test.
 */
/// <reference types="vitest/globals" />
import { vi } from 'vitest';

// Define a simple storage interface.
interface Storage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

// Define a mock window interface for displaying messages.
interface MockWindow {
  showInformationMessage: ReturnType<typeof vi.fn>;
  showErrorMessage: ReturnType<typeof vi.fn>;
  showInputBox: ReturnType<typeof vi.fn>;
  getStorage(): Storage;
}

// Define a mock transport interface for MCP communications.
interface MockTransport {
  connect: ReturnType<typeof vi.fn>;
  send: ReturnType<typeof vi.fn>;
  receive: ReturnType<typeof vi.fn>;
}

// Define a mock client interface for MCP communications.
interface MockClient {
  connect: ReturnType<typeof vi.fn>;
  request: ReturnType<typeof vi.fn>;
  processMessage: ReturnType<typeof vi.fn>;
}

// Reset mocks before every test.
beforeEach(() => {
  vi.resetAllMocks();
});

// Mock the Podman Desktop API.
vi.mock('@podman-desktop/api', async () => {
  const mockStorage: Storage = {
    getItem: vi.fn().mockResolvedValue(null),
    setItem: vi.fn().mockResolvedValue(undefined),
    removeItem: vi.fn().mockResolvedValue(undefined)
  };

  const windowMock: MockWindow = {
    showInformationMessage: vi.fn(),
    showErrorMessage: vi.fn(),
    showInputBox: vi.fn(),
    getStorage: vi.fn().mockReturnValue(mockStorage)
  };

  return {
    window: windowMock
  };
});

// Mock the Model Context Protocol SDK.
vi.mock('@modelcontextprotocol/sdk', async () => {
  const mockTransport: MockTransport = {
    connect: vi.fn().mockResolvedValue(undefined),
    send: vi.fn().mockResolvedValue(undefined),
    receive: vi.fn().mockResolvedValue(undefined)
  };

  const mockClient: MockClient = {
    connect: vi.fn().mockResolvedValue(undefined),
    request: vi.fn().mockResolvedValue({ result: 'test response' }),
    processMessage: vi.fn().mockResolvedValue('test response')
  };

  const TransportClass = vi.fn().mockImplementation(() => mockTransport);
  const ClientClass = vi.fn().mockImplementation(() => mockClient);

  return {
    Transport: TransportClass,
    Client: ClientClass,
    mockTransport,
    mockClient
  };
});

// Consolidated mocks are set up here instead of being spread out.
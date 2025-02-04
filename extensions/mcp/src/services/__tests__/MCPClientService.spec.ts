/// <reference types="vitest/globals" />
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { McpClient } from '../McpClient';
import { window } from '@podman-desktop/api';

interface MockClient {
  connect: ReturnType<typeof vi.fn>;
  request: ReturnType<typeof vi.fn>;
  notify: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
}

describe('McpClient', () => {
  let mcpClient: McpClient;
  let mockClient: MockClient;

  beforeEach(() => {
    vi.clearAllMocks();
    mockClient = {
      connect: vi.fn().mockResolvedValue(undefined),
      request: vi.fn().mockResolvedValue({ data: { message: 'test response' } }),
      notify: vi.fn().mockResolvedValue(undefined),
      disconnect: vi.fn().mockResolvedValue(undefined)
    };
    mcpClient = new McpClient({} as any);
    Object.defineProperty(mcpClient, 'client', {
      value: mockClient,
      writable: true
    });
  });

  describe('connect', () => {
    it('should connect successfully', async () => {
      await mcpClient.connect();
      expect(mockClient.connect).toHaveBeenCalled();
    });

    it('should handle connection errors', async () => {
      const error = new Error('Connection failed');
      mockClient.connect.mockRejectedValueOnce(error);
      await expect(mcpClient.connect()).rejects.toThrow('Connection failed');
      expect(window.showErrorMessage).toHaveBeenCalledWith('[MCP Client] Connection failed: Connection failed');
    });
  });

  describe('processMessage', () => {
    it('should process message successfully', async () => {
      const response = { data: { message: 'test response' } };
      mockClient.request.mockResolvedValueOnce(response);
      const result = await mcpClient.processMessage('test message');
      expect(result).toBe('test response');
      expect(mockClient.request).toHaveBeenCalledWith({
        type: 'process_message',
        payload: { message: 'test message' }
      });
    });

    it('should handle processing errors', async () => {
      mockClient.request.mockResolvedValueOnce({
        status: 'error',
        data: {},
        error: 'Processing failed'
      });
      await expect(mcpClient.processMessage('test')).rejects.toThrow('Failed to process message: Processing failed');
      expect(window.showErrorMessage).toHaveBeenCalledWith('[MCP Client] Message processing failed: Processing failed');
    });
  });

  describe('disconnect', () => {
    it('should disconnect successfully', async () => {
      await mcpClient.disconnect();
      expect(mockClient.disconnect).toHaveBeenCalled();
    });

    it('should handle disconnection errors', async () => {
      const error = new Error('Disconnection failed');
      mockClient.disconnect.mockRejectedValueOnce(error);
      await expect(mcpClient.disconnect()).rejects.toThrow('Disconnection failed');
      expect(window.showErrorMessage).toHaveBeenCalledWith('[MCP Client] Disconnection failed: Disconnection failed');
    });
  });
}); 
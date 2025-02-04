/// <reference types="@jest/globals" />

import { McpClient } from '../McpClient';
import { Client } from '@modelcontextprotocol/sdk';
import type { Transport } from '@modelcontextprotocol/sdk';
import { window } from '@podman-desktop/api';

jest.mock('@modelcontextprotocol/sdk', () => ({
  Client: jest.fn().mockImplementation(() => ({
    connect: jest.fn(),
    request: jest.fn(),
    notify: jest.fn(),
    disconnect: jest.fn()
  }))
}));

jest.mock('@podman-desktop/api', () => ({
  window: {
    showErrorMessage: jest.fn()
  }
}));

describe('McpClient', () => {
  let mockClient: jest.Mocked<Client>;
  let mcpClient: McpClient;
  let mockTransport: Transport;

  beforeEach(() => {
    jest.clearAllMocks();
    mockTransport = {} as Transport;
    mockClient = new Client(mockTransport) as jest.Mocked<Client>;
    mcpClient = new McpClient(mockTransport);
  });

  describe('connect', () => {
    it('should connect successfully', async () => {
      mockClient.connect.mockResolvedValue(undefined);
      await expect(mcpClient.connect()).resolves.not.toThrow();
    });

    it('should handle connection errors', async () => {
      const error = new Error('Connection failed');
      (Client as jest.Mock).mockImplementation(() => ({
        connect: jest.fn().mockRejectedValue(error),
        request: jest.fn(),
        notify: jest.fn(),
        disconnect: jest.fn()
      }));
      
      const client = new McpClient(mockTransport);
      await expect(client.connect()).rejects.toThrow('Connection failed');
      expect(window.showErrorMessage).toHaveBeenCalledWith(
        expect.stringContaining('Connection failed')
      );
    });
  });

  describe('processMessage', () => {
    it('should process messages correctly', async () => {
      const message = 'test message';
      const expectedResponse = { result: 'processed' };
      (Client as jest.Mock).mockImplementation(() => ({
        connect: jest.fn(),
        request: jest.fn().mockResolvedValue(expectedResponse),
        notify: jest.fn(),
        disconnect: jest.fn()
      }));

      const client = new McpClient(mockTransport);
      const result = await client.processMessage(message);
      expect(result).toBe('processed');
    });

    it('should handle invalid response format', async () => {
      const invalidResponse = { wrongField: 'value' };
      (Client as jest.Mock).mockImplementation(() => ({
        connect: jest.fn(),
        request: jest.fn().mockResolvedValue(invalidResponse),
        notify: jest.fn(),
        disconnect: jest.fn()
      }));

      const client = new McpClient(mockTransport);
      await expect(client.processMessage('test')).rejects.toThrow('Invalid response format');
      expect(window.showErrorMessage).toHaveBeenCalledWith(
        expect.stringContaining('Invalid response format')
      );
    });

    it('should handle processing errors', async () => {
      const error = new Error('Processing failed');
      (Client as jest.Mock).mockImplementation(() => ({
        connect: jest.fn(),
        request: jest.fn().mockRejectedValue(error),
        notify: jest.fn(),
        disconnect: jest.fn()
      }));

      const client = new McpClient(mockTransport);
      await expect(client.processMessage('test')).rejects.toThrow('Processing failed');
      expect(window.showErrorMessage).toHaveBeenCalledWith(
        expect.stringContaining('Processing failed')
      );
    });
  });

  describe('sendRequest', () => {
    it('should send requests correctly', async () => {
      const request = { type: 'test', payload: { data: 'test' } };
      const expectedResponse = { result: 'success' };
      (Client as jest.Mock).mockImplementation(() => ({
        connect: jest.fn(),
        request: jest.fn().mockResolvedValue(expectedResponse),
        notify: jest.fn(),
        disconnect: jest.fn()
      }));

      const client = new McpClient(mockTransport);
      const result = await client.sendRequest(request);
      expect(result).toEqual(expectedResponse);
    });

    it('should handle request errors', async () => {
      const error = new Error('Request failed');
      (Client as jest.Mock).mockImplementation(() => ({
        connect: jest.fn(),
        request: jest.fn().mockRejectedValue(error),
        notify: jest.fn(),
        disconnect: jest.fn()
      }));

      const client = new McpClient(mockTransport);
      await expect(client.sendRequest({})).rejects.toThrow('Request failed');
      expect(window.showErrorMessage).toHaveBeenCalledWith(
        expect.stringContaining('Request failed')
      );
    });
  });

  describe('disconnect', () => {
    it('should disconnect successfully', async () => {
      mockClient.disconnect.mockResolvedValue(undefined);
      await expect(mcpClient.disconnect()).resolves.not.toThrow();
    });

    it('should handle disconnection errors', async () => {
      const error = new Error('Disconnection failed');
      (Client as jest.Mock).mockImplementation(() => ({
        connect: jest.fn(),
        request: jest.fn(),
        notify: jest.fn(),
        disconnect: jest.fn().mockRejectedValue(error)
      }));

      const client = new McpClient(mockTransport);
      await expect(client.disconnect()).rejects.toThrow('Disconnection failed');
      expect(window.showErrorMessage).toHaveBeenCalledWith(
        expect.stringContaining('Disconnection failed')
      );
    });
  });
}); 
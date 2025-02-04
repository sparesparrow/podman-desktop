/// <reference types="@jest/globals" />

import { McpServer } from '../McpServer';
import type { ServerConfig, Container, ContainerManager, ExecResult } from '../../types/interfaces';
import { ServerStatus } from '../../types/interfaces';
import { window } from '@podman-desktop/api';

jest.mock('@podman-desktop/api', () => ({
  window: {
    showErrorMessage: jest.fn()
  }
}));

describe('McpServer', () => {
  let server: McpServer;
  let mockContainerManager: jest.Mocked<ContainerManager>;
  let mockContainer: jest.Mocked<Container>;
  let config: ServerConfig;

  beforeEach(() => {
    jest.clearAllMocks();

    mockContainer = {
      start: jest.fn(),
      stop: jest.fn(),
      exec: jest.fn()
    };

    mockContainerManager = {
      createContainer: jest.fn().mockResolvedValue(mockContainer),
      removeContainer: jest.fn(),
      listContainers: jest.fn()
    };

    config = {
      command: 'test-command',
      args: ['--test'],
      env: { TEST: 'true' },
      workingDir: '/test'
    };

    server = new McpServer('test-server', config, mockContainerManager);
  });

  describe('connect', () => {
    it('should start container and query capabilities', async () => {
      const mockCapabilities = {
        supportedTools: ['tool1', 'tool2'],
        maxConcurrentRequests: 10,
        supportedTransports: ['http', 'websocket']
      };

      mockContainer.exec.mockResolvedValue({
        stdout: JSON.stringify(mockCapabilities),
        stderr: '',
        exitCode: 0
      } as ExecResult);

      await server.connect();

      expect(mockContainerManager.createContainer).toHaveBeenCalledWith('test-server', {
        image: 'mcp-server:latest',
        command: config.command,
        args: config.args,
        env: config.env,
        workingDir: config.workingDir
      });

      expect(mockContainer.start).toHaveBeenCalled();
      expect(mockContainer.exec).toHaveBeenCalledWith('mcp-query-capabilities');
      expect(server.getStatus()).toBe(ServerStatus.RUNNING);
      expect(server.getCapabilities()).toEqual(mockCapabilities);
    });

    it('should handle container creation failure', async () => {
      const error = new Error('Container creation failed');
      mockContainerManager.createContainer.mockRejectedValue(error);

      await expect(server.connect()).rejects.toThrow('Container creation failed');
      expect(server.getStatus()).toBe(ServerStatus.ERROR);
      expect(window.showErrorMessage).toHaveBeenCalledWith(
        expect.stringContaining('Container creation failed')
      );
    });

    it('should handle invalid capabilities response', async () => {
      mockContainer.exec.mockResolvedValue({
        stdout: 'invalid-json',
        stderr: '',
        exitCode: 0
      } as ExecResult);

      await expect(server.connect()).rejects.toThrow('Invalid capabilities format');
      expect(server.getStatus()).toBe(ServerStatus.ERROR);
    });

    it('should handle capabilities query failure', async () => {
      mockContainer.exec.mockResolvedValue({
        stdout: '',
        stderr: 'Query failed',
        exitCode: 1
      } as ExecResult);

      await expect(server.connect()).rejects.toThrow('Failed to query capabilities');
      expect(server.getStatus()).toBe(ServerStatus.ERROR);
    });
  });

  describe('disconnect', () => {
    beforeEach(async () => {
      mockContainer.exec.mockResolvedValue({
        stdout: '{}',
        stderr: '',
        exitCode: 0
      } as ExecResult);
      await server.connect();
    });

    it('should stop and remove container', async () => {
      await server.disconnect();

      expect(mockContainer.stop).toHaveBeenCalled();
      expect(mockContainerManager.removeContainer).toHaveBeenCalledWith('test-server');
      expect(server.getStatus()).toBe(ServerStatus.STOPPED);
    });

    it('should handle stop failure', async () => {
      const error = new Error('Stop failed');
      mockContainer.stop.mockRejectedValue(error);

      await expect(server.disconnect()).rejects.toThrow('Stop failed');
      expect(server.getStatus()).toBe(ServerStatus.ERROR);
      expect(window.showErrorMessage).toHaveBeenCalledWith(
        expect.stringContaining('Stop failed')
      );
    });
  });

  describe('getters', () => {
    it('should return server name', () => {
      expect(server.getName()).toBe('test-server');
    });

    it('should return server config', () => {
      expect(server.getConfig()).toEqual(config);
    });

    it('should return initial status', () => {
      expect(server.getStatus()).toBe(ServerStatus.STOPPED);
    });

    it('should return undefined capabilities before connect', () => {
      expect(server.getCapabilities()).toBeUndefined();
    });
  });
}); 
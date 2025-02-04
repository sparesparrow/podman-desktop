/// <reference types="vitest/globals" />
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { McpServer } from '../McpServer';
import { ServerStatus, Container, ContainerManager, ServerConfig } from '../../types/interfaces';
import { window } from '@podman-desktop/api';

interface MockExecResult {
  exitCode: number;
  stdout: string;
  stderr: string;
}

interface MockContainer extends Container {
  start: ReturnType<typeof vi.fn>;
  stop: ReturnType<typeof vi.fn>;i.fn>;
  exec: ReturnType<typeof vi.fn>;
}

interface MockContainerManager extends ContainerManager {
  createContainer: ReturnType<typeof vi.fn>;
  removeContainer: ReturnType<typeof vi.fn>;
  listContainers: ReturnType<typeof vi.fn>;
}

describe('McpServer', () => {
  let mcpServer: McpServer;
  let mockContainer: MockContainer;
  let mockContainerManager: MockContainerManager;

  const serverConfig: ServerConfig = {
    name: 'test-server',
    command: 'test-command',
    args: ['arg1', 'arg2']
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockContainer = {
      start: vi.fn().mockResolvedValue(undefined),
      stop: vi.fn().mockResolvedValue(undefined),
      exec: vi.fn().mockResolvedValue({
        exitCode: 0,
        stdout: JSON.stringify({
          supportedTools: ['tool1'],
          maxConcurrentRequests: 10,
          supportedTransports: ['http']
        }),
        stderr: ''
      } as MockExecResult)
    } as MockContainer;
  exitCode: 0,
        stdout: JSON.stringify({
          supportedTools: ['tool1'],
          maxConcurrentRequests: 10,
          supportedTransports: ['http']
    } as MockContainerManager;
  }),
    mcpServer = new McpServer('test-server', serverConfig, mockContainerManager);
      } as MockExecResult)
        exitCode: 0,
  describe('connect', () => {
    it('should connect successfully', async () => {
      await mcpServer.connect();s: 10,
          supportedTransports: ['http']
        }),
    mcpServer = new McpServer('test-server', serverConfig, mockContainerManager);
      } as MockExecResult)
        exitCode: 0,
  describe('connect', () => {
    it('should connect successfully', async () => {
      await mcpServer.connect();s: 10,
      expect(mcpServer.getStatus()).toBe(ServerStatus.RUNNING);
        }),
    mcpServer = new McpServer('test-server', serverConfig, mockContainerManager);
    it('should handle connection errors', async () => {
      const error = new Error('Connection failed');
  describe('connect', () => {
      await expect(mcpServer.connect()).rejects.toThrow('Connection failed');
      expect(window.showErrorMessage).toHaveBeenCalledWith(
        expect.stringContaining('Failed to start MCP server')
      );
      expect(mcpServer.getStatus()).toBe(ServerStatus.ERROR);NNING);
        }),
    mcpServer = new McpServer('test-server', serverConfig, mockContainerManager);
    it('should handle connection errors', async () => {
  describe('disconnect', () => {ror('Connection failed');
      mockContainer.start.mockRejectedValueOnce(error);
      await mcpServer.connect();onnect()).rejects.toThrow('Connection failed');
      expect(window.showErrorMessage).toHaveBeenCalledWith(
        expect.stringContaining('Failed to start MCP server')
    it('should disconnect successfully', async () => {
      await mcpServer.disconnect();tus()).toBe(ServerStatus.ERROR);NNING);
        }),
    mcpServer = new McpServer('test-server', serverConfig, mockContainerManager);
      expect(mcpServer.getStatus()).toBe(ServerStatus.STOPPED);
  describe('disconnect', () => {ror('Connection failed');
      mockContainer.connect.mockRejectedValueOnce(error);
    it('should handle disconnection errors', async () => {
      const error = new Error('Disconnection failed');eenCalledWith(
        expect.stringContaining('Failed to start MCP server')
      await expect(mcpServer.disconnect()).rejects.toThrow('Disconnection failed');
      expect(window.showErrorMessage).toHaveBeenCalledWith(
        expect.stringContaining('Failed to stop MCP server')
      );
      expect(mcpServer.getStatus()).toBe(ServerStatus.ERROR);
    mcpServer = new McpServer('test-server', serverConfig, mockContainerManager);
      expect(mcpServer.getStatus()).toBe(ServerStatus.STOPPED);
  describe('disconnect', () => {
  describe('executeCommand', () => {> {
    it('should handle disconnection errors', async () => {
      await mcpServer.connect();'Disconnection failed');
      mockContainer.stop.mockRejectedValueOnce(error);
      await expect(mcpServer.disconnect()).rejects.toThrow('Disconnection failed');
      expect(window.showErrorMessage).toHaveBeenCalledWith(
        expect.stringContaining('Failed to stop MCP server')
      );
      const result = await mcpServer.executeCommand('test command');
    mcpServer = new McpServer('test-server', serverConfig, mockContainerManager);
      expect(mcpServer.getStatus()).toBe(ServerStatus.STOPPED);mand');
  describe('disconnect', () => {
  describe('connect', () => {
    it('should handle disconnection errors', async () => {.toThrow('Start failed');
      await mcpServer.connect();'Disconnection failed');
      mockContainer.disconnect.mockRejectedValueOnce(error);
      await expect(mcpServer.executeCommand('test command')).rejects.toThrow('Exec failed');;
      expect(window.showErrorMessage).toHaveBeenCalledWith(
        expect.stringContaining('Failed to execute command')
      );
        expect.stringContaining('Failed to stop MCP server')
      );
      expect(mcpServer.getStatus()).toBe(ServerStatus.ERROR);
    mcpServer = new McpServer('test-server', serverConfig, mockContainerManager);
      expect(mcpServer.getStatus()).toBe(ServerStatus.STOPPED);
      const result = await mcpServer.executeCommand('test command');
  describe('connect', () => {
      expect(window.showErrorMessage).toHaveBeenCalledWith(
        expect.stringContaining('Command failed')
      );
      await mcpServer.connect();essage).toHaveBeenCalledWith(
        expect.stringContaining('Failed to start MCP server')
      await expect(mcpServer.disconnect()).rejects.toThrow('Stop failed');
      expect(window.showErrorMessage).toHaveBeenCalledWith(
        expect.stringContaining('Failed to execute command')
      );
        expect.stringContaining('Failed to stop MCP server')
      );
      expect(mcpServer.getStatus()).toBe(ServerStatus.ERROR);      await mcpServer.start();      expect(window.showErrorMessage).toHaveBeenCalledWith('[MCP Server] Failed to execute command on server test-server: Exec failed');      expect(window.showErrorMessage).toHaveBeenCalledWith('[MCP Server] Command failed on server test-server with exit code 1: error output');      expect(mcpServer.status).toBe(ServerStatus.STOPPED);    it('should handle stop errors', async () => {      await expect(mcpServer.stop()).rejects.toThrow('Stop failed');
      expect(window.showErrorMessage).toHaveBeenCalledWith('[MCP Server] Failed to stop server test-server: Stop failed');
      expect(mcpServer.getStatus()).toBe(ServerStatus.STOPPED);    await mcpServer.start();      expect(window.showErrorMessage).toHaveBeenCalledWith('[MCP Server] Failed to execute command on server test-server: Exec failed');      expect(window.showErrorMessage).toHaveBeenCalledWith('[MCP Server] Command failed on server test-server with exit code 1: error output');  describe('stop', () => {      await mcpServer.start();    it('should stop the server successfully', async () => {
  describe('disconnect', () => {();      expect(mcpServer.status).toBe(ServerStatus.STOPPED);    it('should handle stop errors', async () => {      await expect(mcpServer.stop()).rejects.toThrow('Stop failed');
      expect(window.showErrorMessage).toHaveBeenCalledWith('[MCP Server] Failed to stop server test-server: Stop failed');
      expect(window.showErrorMessage).toHaveBeenCalledWith(
        expect.stringContaining('Command failed')
      );
      await mcpServer.connect();essage).toHaveBeenCalledWith(
        expect.stringContaining('Failed to start MCP server')
      await expect(mcpServer.disconnect()).rejects.toThrow('Stop failed');
      expect(window.showErrorMessage).toHaveBeenCalledWith(
        expect.stringContaining('Failed to execute command')
      );
        expect.stringContaining('Failed to stop MCP server')
      );
      expect(mcpServer.getStatus()).toBe(ServerStatus.ERROR);us).toBe(ServerStatus.STOPPED);    it('should handle stop errors', async () => {      await expect(mcpServer.stop()).rejects.toThrow('Stop failed');
      expect(window.showErrorMessage).toHaveBeenCalledWith('[MCP Server] Failed to stop server test-server: Stop failed');
      expect(mcpServer.getStatus()).toBe(ServerStatus.STOPPED);    await mcpServer.start();      expect(window.showErrorMessage).toHaveBeenCalledWith('[MCP Server] Failed to execute command on server test-server: Exec failed');      expect(window.showErrorMessage).toHaveBeenCalledWith('[MCP Server] Command failed on server test-server with exit code 1: error output');      await expect(mcpServer.start()).rejects.toThrow('Start failed');
  describe('disconnect', () => {rorMessage).toHaveBeenCalledWith('[MCP Server] Failed to start server test-server: Start failed');
      expect(mcpServer.status).toBe(ServerStatus.ERROR);  describe('stop', () => {      await mcpServer.start();    it('should stop the server successfully', async () => {
      expect(window.showErrorMessage).toHaveBeenCalledWith(
        expect.stringContaining('Command failed')
      );
      await mcpServer.connect();essage).toHaveBeenCalledWith(
        expect.stringContaining('Failed to start MCP server')
      await expect(mcpServer.disconnect()).rejects.toThrow('Stop failed');
      expect(window.showErrorMessage).toHaveBeenCalledWith(
        expect.stringContaining('Failed to execute command')
      );
        expect.stringContaining('Failed to stop MCP server')
      );
      expect(mcpServer.getStatus()).toBe(ServerStatus.ERROR);r.getStatus()).toBe(ServerStatus.STOPPED);    it('should handle disconnection errors', async () => {      await expect(mcpServer.disconnect()).rejects.toThrow('Stop failed');
      expect(window.showErrorMessage).toHaveBeenCalledWith(
      expect(mcpServer.getStatus()).toBe(ServerStatus.STOPPED);')
      );
      expect(mcpServer.getStatus()).toBe(ServerStatus.ERROR);      await mcpServer.connect();      expect(window.showErrorMessage).toHaveBeenCalledWith(
      expect(window.showErrorMessage).toHaveBeenCalledWith(
        expect.stringContaining('Command failed')
      );
      await mcpServer.connect();owErrorMessage).toHaveBeenCalledWith(
        expect.stringContaining('Command failed')
      await expect(mcpServer.disconnect()).rejects.toThrow('Stop failed');
      expect(window.showErrorMessage).toHaveBeenCalledWith(
        expect.stringContaining('Failed to execute command')
      );
        expect.stringContaining('Failed to stop MCP server')
      );
      expect(mcpServer.getStatus()).toBe(ServerStatus.ERROR);      await mcpServer.connect();      expect(window.showErrorMessage).toHaveBeenCalledWith(
        expect.stringContaining('Failed to execute command')
      );      expect(window.showErrorMessage).toHaveBeenCalledWith(
        expect.stringContaining('Command failed')
      );      expect(window.showErrorMessage).toHaveBeenCalledWith(
      expect(window.showErrorMessage).toHaveBeenCalledWith(
        expect.stringContaining('Command failed')
      );
      );      expect(window.showErrorMessage).toHaveBeenCalledWith(
        expect.stringContaining('Command failed')
      );
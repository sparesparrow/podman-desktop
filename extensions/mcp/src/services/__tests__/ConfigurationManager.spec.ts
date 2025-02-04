/// <reference types="vitest/globals" />
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ConfigurationManager } from '../ConfigurationManager';
import { window } from '@podman-desktop/api';

interface Storage {
  setItem(key: string, value: string): Promise<void>;
  getItem(key: string): Promise<string | null>;
}

interface ExtendedWindow {
  getStorage(): Storage;
}

describe('ConfigurationManager', () => {
  let configManager: ConfigurationManager;
  let mockStorage: Storage;
  let storedConfig: string | null = null;

  beforeEach(() => {
    vi.clearAllMocks();
    storedConfig = null;
    mockStorage = {
      getItem: vi.fn().mockImplementation(async () => storedConfig),
      setItem: vi.fn().mockImplementation(async (key: string, value: string) => {
        storedConfig = value;
      })
    };
    vi.spyOn(window as unknown as ExtendedWindow, 'getStorage').mockReturnValue(mockStorage);
    configManager = new ConfigurationManager();
  });

  describe('initialize', () => {
    it('should initialize with empty config when no stored configuration exists', async () => {
      await configManager.initialize();
      expect(mockStorage.getItem).toHaveBeenCalledWith('mcp-config');
    });

    it('should load stored configuration on initialization', async () => {
      const initialConfig = {
        servers: {
          'test-server': {
            name: 'test-server',
            command: 'test-command',
            args: ['arg1', 'arg2']
          }
        }
      };
      storedConfig = JSON.stringify(initialConfig);
      await configManager.initialize();
      expect(mockStorage.getItem).toHaveBeenCalledWith('mcp-config');
    });

    it('should handle invalid stored configuration format', async () => {
      storedConfig = 'invalid-json';
      await expect(configManager.initialize()).rejects.toThrow('Unexpected token');
      expect(window.showErrorMessage).toHaveBeenCalledWith(
        expect.stringContaining('Failed to initialize configuration')
      );
    });

    it('should validate stored server configurations', async () => {
      const invalidConfig = {
        servers: {
          'test-server': {
            // Missing required fields.
          }
        }
      };
      storedConfig = JSON.stringify(invalidConfig);
      await expect(configManager.initialize()).rejects.toThrow('Invalid stored configuration format');
      expect(window.showErrorMessage).toHaveBeenCalledWith(
        expect.stringContaining('Failed to initialize configuration')
      );
    });
  });

  describe('addServer', () => {
    const validServerConfig = {
      name: 'test-server',
      command: 'test-command',
      args: ['arg1', 'arg2']
    };

    beforeEach(async () => {
      await configManager.initialize();
    });

    it('should add a new server configuration', async () => {
      await configManager.addServer('test-server', validServerConfig);
      expect(mockStorage.setItem).toHaveBeenCalledWith(
        'mcp-config',
        expect.stringContaining('test-server')
      );
      const savedConfig = JSON.parse(storedConfig!);
      expect(savedConfig.servers['test-server']).toEqual(validServerConfig);
    });

    it('should prevent duplicate server names', async () => {
      storedConfig = JSON.stringify({
        servers: {
          'test-server': validServerConfig
        }
      });
      await configManager.initialize();
      await expect(configManager.addServer('test-server', validServerConfig))
        .rejects.toThrow("Server 'test-server' already exists");
    });

    it('should validate server configuration before adding', async () => {
      const invalidConfig = {
        someField: 'value'
      } as any;
      await expect(configManager.addServer('test-server', invalidConfig))
        .rejects.toThrow('Invalid configuration provided');
      expect(window.showErrorMessage).toHaveBeenCalledWith(
        expect.stringContaining('Failed to add server')
      );
    });
  });

  describe('removeServer', () => {
    const serverConfig = {
      name: 'test-server',
      command: 'test-command',
      args: ['arg1', 'arg2']
    };

    beforeEach(async () => {
      storedConfig = JSON.stringify({
        servers: {
          'test-server': serverConfig
        }
      });
      await configManager.initialize();
    });

    it('should remove an existing server', async () => {
      await configManager.removeServer('test-server');
      expect(mockStorage.setItem).toHaveBeenCalledWith(
        'mcp-config',
        expect.not.stringContaining('test-server')
      );
      const savedConfig = JSON.parse(storedConfig!);
      expect(savedConfig.servers['test-server']).toBeUndefined();
    });

    it('should throw error when removing a non-existent server', async () => {
      await expect(configManager.removeServer('non-existent'))
        .rejects.toThrow("Server 'non-existent' not found");
      expect(window.showErrorMessage).toHaveBeenCalledWith(
        expect.stringContaining('Failed to remove server')
      );
    });
  });

  describe('updateServerConfig', () => {
    const serverConfig = {
      name: 'test-server',
      command: 'test-command',
      args: ['arg1', 'arg2']
    };

    beforeEach(async () => {
      storedConfig = JSON.stringify({
        servers: {
          'test-server': serverConfig
        }
      });
      await configManager.initialize();
    });

    it('should update an existing server configuration', async () => {
      const newConfig = {
        name: 'test-server',
        command: 'new-command',
        args: ['new-arg']
      };
      await configManager.updateServerConfig('test-server', newConfig);
      expect(mockStorage.setItem).toHaveBeenCalledWith(
        'mcp-config',
        expect.stringContaining('new-command')
      );
      const savedConfig = JSON.parse(storedConfig!);
      expect(savedConfig.servers['test-server']).toEqual(newConfig);
    });

    it('should throw an error when updating a non-existent server', async () => {
      const newConfig = {
        name: 'non-existent',
        command: 'new-command',
        args: ['new-arg']
      };
      await expect(configManager.updateServerConfig('non-existent', newConfig))
        .rejects.toThrow("Cannot update non-existent server 'non-existent'");
      expect(window.showErrorMessage).toHaveBeenCalledWith(
        expect.stringContaining('Failed to update server')
      );
    });
  });
}); 
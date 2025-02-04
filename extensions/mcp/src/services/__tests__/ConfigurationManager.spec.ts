/// <reference types="@jest/globals" />

import { ConfigurationManager } from '../ConfigurationManager';
import type { Storage } from '@podman-desktop/api';
import type { ServerConfig } from '../../types/interfaces';
import { window } from '@podman-desktop/api';

jest.mock('@podman-desktop/api', () => ({
  window: {
    showErrorMessage: jest.fn(),
    getStorage: jest.fn(),
  },
}));

describe('ConfigurationManager', () => {
  let configManager: ConfigurationManager;
  let mockStorage: jest.Mocked<Storage>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockStorage = {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn()
    } as jest.Mocked<Storage>;

    (mockStorage.get as jest.Mock).mockImplementation(() => Promise.resolve(undefined));
    (mockStorage.set as jest.Mock).mockImplementation(() => Promise.resolve());
    (mockStorage.delete as jest.Mock).mockImplementation(() => Promise.resolve());

    const windowWithStorage = window as unknown as { getStorage(): Storage };
    windowWithStorage.getStorage = jest.fn().mockReturnValue(mockStorage);
    configManager = new ConfigurationManager();
  });

  describe('initialize', () => {
    it('should initialize with empty config when no stored config exists', async () => {
      await configManager.initialize();
      expect(mockStorage.get).toHaveBeenCalledWith('mcp-config');
    });

    it('should load stored configuration on initialization', async () => {
      const storedConfig = {
        servers: {
          'test-server': {
            command: 'test-command',
            args: ['arg1', 'arg2'],
          },
        },
      };
      (mockStorage.get as jest.Mock).mockImplementation(() => Promise.resolve(JSON.stringify(storedConfig)));
      await configManager.initialize();
      expect(configManager.getServerConfig('test-server')).toEqual(storedConfig.servers['test-server']);
    });

    it('should handle invalid stored configuration format', async () => {
      (mockStorage.get as jest.Mock).mockImplementation(() => Promise.resolve('invalid-json'));
      await expect(configManager.initialize()).rejects.toThrow('Unexpected token');
      expect(window.showErrorMessage).toHaveBeenCalledWith(
        expect.stringContaining('Failed to initialize configuration')
      );
    });

    it('should validate stored server configurations', async () => {
      const invalidConfig = {
        servers: {
          'test-server': {
            // Missing required fields
          },
        },
      };
      (mockStorage.get as jest.Mock).mockImplementation(() => Promise.resolve(JSON.stringify(invalidConfig)));
      await expect(configManager.initialize()).rejects.toThrow('Invalid stored configuration format');
      expect(window.showErrorMessage).toHaveBeenCalledWith(
        expect.stringContaining('Failed to initialize configuration')
      );
    });
  });

  describe('addServer', () => {
    beforeEach(async () => {
      await configManager.initialize();
    });

    it('should add a new server configuration', async () => {
      const serverConfig = {
        command: 'test-command',
        args: ['arg1', 'arg2'],
      };
      (mockStorage.set as jest.Mock).mockImplementation(() => Promise.resolve());
      (mockStorage.get as jest.Mock).mockImplementation(() => Promise.resolve(JSON.stringify({
        servers: {
          'test-server': serverConfig,
        },
      })));

      await configManager.addServer('test-server', serverConfig);
      expect((mockStorage.set as jest.Mock).mock.calls[0][0]).toEqual(
        'mcp-config'
      );
    });

    it('should prevent duplicate server names and preserve existing configuration', async () => {
      const serverConfig = {
        command: 'test-command',
        args: ['arg1', 'arg2'],
      };
      (mockStorage.set as jest.Mock).mockImplementation(() => Promise.resolve());
      (mockStorage.get as jest.Mock).mockImplementation(() => Promise.resolve(JSON.stringify({
        servers: {
          'test-server': serverConfig,
        },
      })));

      await configManager.addServer('test-server', serverConfig);
      await expect(configManager.addServer('test-server', serverConfig))
        .rejects.toThrow("Server 'test-server' already exists");
    });

    it('should validate server configuration before adding', async () => {
      const invalidConfig = {
        someField: 'value'
      } as unknown as ServerConfig;
      await expect(configManager.addServer('test-server', invalidConfig))
        .rejects.toThrow('Invalid configuration provided');
      expect(window.showErrorMessage).toHaveBeenCalledWith(
        expect.stringContaining('Failed to add server')
      );
    });

    it('should verify persistence after adding server', async () => {
      const serverConfig = {
        command: 'test-command',
        args: ['arg1', 'arg2'],
      };
      (mockStorage.set as jest.Mock).mockImplementation(() => Promise.resolve());
      (mockStorage.get as jest.Mock).mockImplementation(() => Promise.resolve(JSON.stringify({
        servers: {
          'test-server': serverConfig,
        },
      })));

      await configManager.addServer('test-server', serverConfig);
      expect((mockStorage.set as jest.Mock).mock.calls.length).toBeGreaterThan(0);
      expect((mockStorage.get as jest.Mock).mock.calls.length).toBeGreaterThan(0);
    });
  });

  describe('removeServer', () => {
    const serverConfig = {
      command: 'test-command',
      args: ['arg1', 'arg2'],
    };

    beforeEach(async () => {
      (mockStorage.get as jest.Mock).mockImplementation(() => Promise.resolve(JSON.stringify({
        servers: {
          'test-server': serverConfig,
        },
      })));
      await configManager.initialize();
    });

    it('should remove an existing server', async () => {
      (mockStorage.delete as jest.Mock).mockImplementation(() => Promise.resolve());
      (mockStorage.get as jest.Mock).mockImplementation(() => Promise.resolve(JSON.stringify({
        servers: {},
      })));

      await configManager.removeServer('test-server');
      expect((mockStorage.delete as jest.Mock).mock.calls.length).toBeGreaterThan(0);
    });

    it('should throw error when removing non-existent server', async () => {
      await expect(configManager.removeServer('non-existent'))
        .rejects.toThrow("Server 'non-existent' not found");
      expect(window.showErrorMessage).toHaveBeenCalledWith(
        expect.stringContaining('Failed to remove server')
      );
    });

    it('should verify persistence after removing server', async () => {
      mockStorage.delete.mockResolvedValue();
      mockStorage.get.mockResolvedValue(JSON.stringify({
        servers: {},
      }));

      await configManager.removeServer('test-server');
      expect(mockStorage.delete).toHaveBeenCalled();
      expect(mockStorage.get).toHaveBeenCalled();
    });
  });

  describe('updateServerConfig', () => {
    const serverConfig = {
      command: 'test-command',
      args: ['arg1', 'arg2'],
    };

    beforeEach(async () => {
      mockStorage.get.mockResolvedValue(JSON.stringify({
        servers: {
          'test-server': serverConfig,
        },
      }));
      await configManager.initialize();
    });

    it('should update existing server configuration', async () => {
      const newConfig = {
        command: 'new-command',
        args: ['new-arg'],
      };
      mockStorage.set.mockResolvedValue();
      mockStorage.get.mockResolvedValue(JSON.stringify({
        servers: {
          'test-server': newConfig,
        },
      }));

      await configManager.updateServerConfig('test-server', newConfig);
      expect(mockStorage.set).toHaveBeenCalledWith(
        'mcp-config',
        expect.stringContaining('new-command')
      );
    });

    it('should throw error when updating non-existent server', async () => {
      const newConfig = {
        command: 'new-command',
        args: ['new-arg'],
      };
      await expect(configManager.updateServerConfig('non-existent', newConfig))
        .rejects.toThrow("Cannot update non-existent server 'non-existent'");
      expect(window.showErrorMessage).toHaveBeenCalledWith(
        expect.stringContaining('Failed to update server')
      );
    });

    it('should verify persistence after updating server', async () => {
      const newConfig = {
        command: 'new-command',
        args: ['new-arg'],
      };
      mockStorage.set.mockResolvedValue();
      mockStorage.get.mockResolvedValue(JSON.stringify({
        servers: {
          'test-server': newConfig,
        },
      }));

      await configManager.updateServerConfig('test-server', newConfig);
      expect(mockStorage.set).toHaveBeenCalled();
      expect(mockStorage.get).toHaveBeenCalled();
    });
  });
}); 
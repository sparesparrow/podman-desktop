/// <reference types="@jest/globals" />

import { PodmanContainerManager } from '../ContainerManager';
import type { ContainerConfig } from '../../types/interfaces';

describe('PodmanContainerManager', () => {
  let containerManager: PodmanContainerManager;

  beforeEach(() => {
    containerManager = new PodmanContainerManager();
  });

  describe('createContainer', () => {
    it('should create a new container', async () => {
      const config: ContainerConfig = {
        image: 'test-image',
        command: 'test-command',
        args: ['--test']
      };

      const container = await containerManager.createContainer('test-container', config);
      expect(container).toBeDefined();
      expect(container.start).toBeDefined();
      expect(container.stop).toBeDefined();
      expect(container.exec).toBeDefined();
    });

    it('should create containers with unique names', async () => {
      const config: ContainerConfig = {
        image: 'test-image',
        command: 'test-command'
      };

      const container1 = await containerManager.createContainer('container1', config);
      const container2 = await containerManager.createContainer('container2', config);
      expect(container1).not.toBe(container2);
    });
  });

  describe('listContainers', () => {
    it('should list all created containers', async () => {
      const config: ContainerConfig = {
        image: 'test-image',
        command: 'test-command'
      };

      await containerManager.createContainer('container1', config);
      await containerManager.createContainer('container2', config);

      const containers = await containerManager.listContainers();
      expect(containers).toHaveLength(2);
    });

    it('should return empty list when no containers exist', async () => {
      const containers = await containerManager.listContainers();
      expect(containers).toHaveLength(0);
    });
  });

  describe('removeContainer', () => {
    it('should remove a container', async () => {
      const config: ContainerConfig = {
        image: 'test-image',
        command: 'test-command'
      };

      await containerManager.createContainer('test-container', config);
      await containerManager.removeContainer('test-container');

      const containers = await containerManager.listContainers();
      expect(containers).toHaveLength(0);
    });

    it('should handle removing non-existent container', async () => {
      await expect(containerManager.removeContainer('non-existent')).resolves.not.toThrow();
    });
  });

  describe('container operations', () => {
    it('should start container successfully', async () => {
      const config: ContainerConfig = {
        image: 'test-image',
        command: 'test-command'
      };

      const container = await containerManager.createContainer('test-container', config);
      await expect(container.start()).resolves.not.toThrow();
    });

    it('should stop container successfully', async () => {
      const config: ContainerConfig = {
        image: 'test-image',
        command: 'test-command'
      };

      const container = await containerManager.createContainer('test-container', config);
      await expect(container.stop()).resolves.not.toThrow();
    });

    it('should execute commands in container', async () => {
      const config: ContainerConfig = {
        image: 'test-image',
        command: 'test-command'
      };

      const container = await containerManager.createContainer('test-container', config);
      const result = await container.exec('test-command');
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toBeDefined();
      expect(result.stderr).toBeDefined();
    });
  });
}); 
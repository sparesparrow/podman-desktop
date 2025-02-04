import { window } from '@podman-desktop/api';

declare module '@podman-desktop/api' {
  interface Storage {
    get(key: string): Promise<string | undefined>;
    set(key: string, value: string): Promise<void>;
    delete(key: string): Promise<void>;
  }

  interface Window {
    getStorage(): Storage;
  }
}

// Augment the window object
declare global {
  interface Window {
    getStorage(): Storage;
  }
} 
declare module '@podman-desktop/api' {
  export interface ExtensionContext {
    subscriptions: { dispose(): void }[];
    extensionPath: string;
    storagePath: string;
  }

  export interface Storage {
    get<T>(key: string): T | undefined;
    set<T>(key: string, value: T): void;
    delete(key: string): void;
  }

  export interface Window {
    showInformationMessage(message: string): Promise<void>;
    showErrorMessage(message: string): Promise<void>;
  }

  export const window: Window;
  export const storage: Storage;
}

// Augment the window object
declare global {
  interface Window {
    getStorage(): Storage;
  }
} 
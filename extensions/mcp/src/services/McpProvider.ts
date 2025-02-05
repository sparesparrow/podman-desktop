import { provider } from '@podman-desktop/api';
import type { ProviderStatus } from '@podman-desktop/api';
import type { IMcpProvider } from '../types/interfaces';

export class McpProvider implements IMcpProvider {
  private _status: ProviderStatus = 'not-installed';
  private readonly _provider;

  constructor(
    public readonly name: string,
    public readonly id: string,
  ) {
    this._provider = provider.createProvider({
      name: this.name,
      id: this.id,
      status: this._status,
      images: {
        icon: './resources/icon.png',
        logo: './resources/logo.png',
      },
    });
  }

  public get status(): ProviderStatus {
    return this._status;
  }

  private setStatus(status: ProviderStatus): void {
    this._status = status;
    this._provider.updateStatus(status);
  }

  public async initialize(): Promise<void> {
    try {
      this.setStatus('starting');
      // Add initialization logic here
      this.setStatus('started');
    } catch (error) {
      this.setStatus('error');
      throw error;
    }
  }

  public async start(): Promise<void> {
    try {
      this.setStatus('starting');
      // Add startup logic here
      this.setStatus('started');
    } catch (error) {
      this.setStatus('error');
      throw error;
    }
  }

  public async stop(): Promise<void> {
    try {
      this.setStatus('stopping');
      // Add shutdown logic here
      this.setStatus('stopped');
    } catch (error) {
      this.setStatus('error');
      throw error;
    }
  }

  public async getStatus(): Promise<ProviderStatus> {
    return this._status;
  }

  public dispose(): void {
    this._provider.dispose();
  }
} 
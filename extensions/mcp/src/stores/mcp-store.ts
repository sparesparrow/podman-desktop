import { writable, get } from 'svelte/store';
import type { McpState } from '../types/mcp-types';
import type { Client } from '@modelcontextprotocol/sdk/client/index.js';

export class McpStore {
  private providers = writable<Map<string, McpState>>(new Map());
  private clients = writable<Map<string, Client>>(new Map());

  subscribeToProvider(id: string, callback: (state: McpState | undefined) => void) {
    return this.providers.subscribe(map => callback(map.get(id)));
  }

  setProvider(id: string, state: McpState) {
    this.providers.update(map => {
      map.set(id, state);
      return map;
    });
  }

  getClient(id: string): Client | undefined {
    const clientMap = get(this.clients);
    return clientMap.get(id);
  }

  setClient(id: string, client: Client) {
    this.clients.update(map => {
      map.set(id, client);
      return map;
    });
  }
}

export const mcpStore = new McpStore(); 
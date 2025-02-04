/// <reference path="../types/ambient.d.ts" />

/**
 * AnthropicClient
 * 
 * Implements the ILLMProvider interface to handle LLM operations via Anthropic's SDK.
 * Manages secure storage and retrieval of API keys, and provides a clean interface
 * for making requests to the Anthropic API.
 */

import { Anthropic } from '@anthropic-ai/sdk';
import type { ILLMProvider, LLMRequest, LLMResponse } from '../types/interfaces';
import { window } from '@podman-desktop/api';

export class AnthropicClient implements ILLMProvider {
  private static readonly API_KEY_STORAGE_KEY = 'mcp.anthropic.apiKey';
  private client: Anthropic | undefined;

  async initialize(): Promise<void> {
    try {
      const storage = window.getStorage();
      const apiKey = await storage.get(AnthropicClient.API_KEY_STORAGE_KEY);
      if (!apiKey) {
        throw new Error('API key not found. Please set it using setApiKey().');
      }
      this.client = new Anthropic({ apiKey });
    } catch (error) {
      throw new Error(`Failed to initialize Anthropic client: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async setApiKey(apiKey: string): Promise<void> {
    try {
      const storage = window.getStorage();
      await storage.set(AnthropicClient.API_KEY_STORAGE_KEY, apiKey);
      this.client = new Anthropic({ apiKey });
    } catch (error) {
      throw new Error(`Failed to set API key: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async sendRequest({
    messages,
    temperature = 0.7,
    model = 'claude-3-opus-20240229'
  }: LLMRequest): Promise<LLMResponse> {
    if (!this.client) {
      throw new Error('Anthropic client not initialized. Please call initialize() and set API key first.');
    }

    try {
      const response = await this.client.messages.create({
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        model,
        temperature,
        max_tokens: 4096
      });

      return {
        content: response.content[0].text,
        role: 'assistant',
        metadata: {
          model: response.model,
          usage: response.usage
        }
      };
    } catch (error) {
      throw new Error(`Failed to send request to Anthropic: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async getResponse(): Promise<LLMResponse> {
    throw new Error('Method not implemented - use sendRequest instead');
  }
} 
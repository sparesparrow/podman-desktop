/// <reference types="svelte" />

{#if loading}
  <div class="loading">Loading...</div>
{:else}
<div class="chat-container" bind:this={chatContainer}>
  <div class="server-list">
    {#each servers as server}
      <div class="server-status">
        <span class="server-name">{server.name}</span>
        <span class="status-indicator" class:active={server.status === 'RUNNING'}></span>
      </div>
    {/each}
  </div>
  <div class="chat-history">
    {#each chatHistory as message}
      <div class="message">{message}</div>
    {/each}
  </div>
  <div class="input-container">
    <textarea
      bind:value={inputMessage}
      on:keypress={handleKeyPress}
      placeholder="Type your message..."
    />
    <button on:click={sendMessage}>Send</button>
  </div>
</div>
{/if}

<script lang="ts">
  import { onMount } from 'svelte';
  import type { ServerInfo } from '../types/interfaces';

  let loading = true;
  let inputMessage = '';
  let chatHistory: string[] = [];
  let chatContainer: HTMLElement;
  let servers: ServerInfo[] = [];

  onMount(async () => {
    try {
      // Initialize chat interface
      servers = await loadServers();
      loading = false;
      scrollToBottom();
    } catch (error) {
      console.error('Failed to load servers:', error);
      loading = false;
    }
  });

  async function loadServers(): Promise<ServerInfo[]> {
    // Implementation
    return [];
  }

  function scrollToBottom() {
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  async function sendMessage() {
    if (!inputMessage.trim()) return;

    chatHistory = [...chatHistory, `User: ${inputMessage}`];
    const message = inputMessage;
    inputMessage = '';

    setTimeout(scrollToBottom, 0);

    try {
      // Process message and get response
      const response = await processMessage(message);
      chatHistory = [...chatHistory, `Assistant: ${response}`];
      setTimeout(scrollToBottom, 0);
    } catch (error) {
      console.error('Error processing message:', error);
      chatHistory = [...chatHistory, 'Error: Failed to process message'];
    }
  }

  async function processMessage(message: string): Promise<string> {
    // Implementation
    return `Response to: ${message}`;
  }
</script>

<style>
  .chat-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 1rem;
  }

  .server-list {
    margin-bottom: 1rem;
    padding: 0.5rem;
    border-bottom: 1px solid var(--border-color, #ccc);
  }

  .server-status {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.25rem 0;
  }

  .status-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--status-inactive, #ccc);
  }

  .status-indicator.active {
    background: var(--status-active, #28a745);
  }

  .chat-history {
    flex: 1;
    overflow-y: auto;
    margin-bottom: 1rem;
  }

  .message {
    margin: 0.5rem 0;
    padding: 0.5rem;
    border-radius: 4px;
    background: var(--background-color, #f5f5f5);
  }

  .input-container {
    display: flex;
    gap: 0.5rem;
  }

  textarea {
    flex: 1;
    min-height: 60px;
    padding: 0.5rem;
    border: 1px solid var(--border-color, #ccc);
    border-radius: 4px;
    resize: vertical;
  }

  button {
    padding: 0.5rem 1rem;
    background: var(--primary-color, #007bff);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background: var(--primary-color-hover, #0056b3);
  }

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-size: 1.2rem;
    color: var(--text-secondary);
  }
</style> 
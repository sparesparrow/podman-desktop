/// <reference types="svelte" />

{#if loading}
  <div class="loading">Loading...</div>
{:else}
<div class="chat-container">
  <div class="server-list">
    {#each servers as server}
      <div class="server-icon" role="button" tabindex="0" class:active={server.status === 'RUNNING'} 
           on:click={() => selectServer(server.name)}
           on:keydown={e => e.key === 'Enter' && selectServer(server.name)}>
        <div class="icon-status" class:running={server.status === 'RUNNING'} />
        <span>{server.name}</span>
      </div>
    {/each}
  </div>

  <div class="chat-main">
    <div class="message-history" bind:this={messageContainer}>
      {#each messages as message}
        <div class="message {message.role}">
          <div class="message-content">{message.content}</div>
          <div class="message-time">{formatTime(message.timestamp)}</div>
        </div>
      {/each}
    </div>

    <div class="input-container">
      <textarea
        bind:value={currentMessage}
        on:keydown={handleKeyDown}
        placeholder="Type your message..."
        rows="3"
      ></textarea>
      <button on:click={sendMessage} disabled={!currentMessage || !selectedServer}>
        Send
      </button>
    </div>
  </div>
</div>
{/if}

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { ServerInfo } from '../types/interfaces';

  export let onSendMessage: (message: string, serverName: string) => Promise<void>;
  export let onServerSelect: (serverName: string) => void;

  let loading = true;
  const servers: ServerInfo[] = [];
  let messages: Array<{ role: 'user' | 'assistant'; content: string; timestamp: Date }> = [];
  let currentMessage = '';
  let selectedServer: string | null = null;
  let messageContainer: HTMLElement;

  onMount(async () => {
    // TODO: Load initial state
    loading = false;
  });

  function selectServer(serverName: string) {
    selectedServer = serverName;
    onServerSelect(serverName);
  }

  async function sendMessage() {
    if (!currentMessage.trim() || !selectedServer) return;

    const message = {
      role: 'user' as const,
      content: currentMessage,
      timestamp: new Date()
    };

    messages = [...messages, message];
    const tempMessage = currentMessage;
    currentMessage = '';

    try {
      await onSendMessage(tempMessage, selectedServer);
    } catch (error) {
      console.error('Failed to send message:', error);
      // TODO: Show error in UI
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  function formatTime(date: Date): string {
    return date.toLocaleTimeString();
  }

  $: if (messageContainer && messages.length) {
    setTimeout(() => {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }, 0);
  }
</script>

<style>
  .chat-container {
    display: flex;
    height: 100%;
    background: var(--background-color);
    color: var(--text-color);
  }

  .server-list {
    width: 200px;
    padding: 1rem;
    border-right: 1px solid var(--border-color);
    background: var(--sidebar-background);
  }

  .server-icon {
    display: flex;
    align-items: center;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .server-icon:hover {
    background: var(--hover-background);
  }

  .icon-status {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 0.5rem;
    background: var(--status-inactive);
  }

  .icon-status.running {
    background: var(--status-active);
  }

  .chat-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
  }

  .message-history {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .message {
    margin-bottom: 1rem;
    padding: 0.5rem;
    border-radius: 4px;
  }

  .message.user {
    background: var(--message-user-background);
    margin-left: 2rem;
  }

  .message.assistant {
    background: var(--message-assistant-background);
    margin-right: 2rem;
  }

  .message-time {
    font-size: 0.8rem;
    color: var(--text-secondary);
    margin-top: 0.25rem;
  }

  .input-container {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    background: var(--input-background);
    border-top: 1px solid var(--border-color);
  }

  textarea {
    flex: 1;
    resize: none;
    padding: 0.5rem;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background: var(--input-field-background);
    color: var(--text-color);
  }

  button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    background: var(--primary-color);
    color: white;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  button:hover:not(:disabled) {
    background: var(--primary-color-hover);
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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
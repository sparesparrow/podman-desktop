import { Client } from '@modelcontextprotocol/sdk/client/index.js';

/**
 * Fetches resources, tools, and prompts via the MCP client.
 */
export async function fetchMcpResources(client: Client) {
  // These methods must be implemented in the MCP SDK; adjust names as needed.
  const resources = await client.listResources();
  const tools = await client.listTools();
  const prompts = await client.listPrompts();
  return { resources, tools, prompts };
} 
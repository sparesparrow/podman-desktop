import { Client } from '@modelcontextprotocol/sdk/client/index.js';

/**
 * Fetches resources, tools, and prompts via the MCP client.
 * 
 * Updated for @modelcontextprotocol/sdk@1.4.1:
 * - Removed ResourceStream (it is no longer exported)
 * - Replaced listResources/listTools/listPrompts with getResources/getTools/getPrompts
 * - Uses async iterables instead of EventEmitter for streaming
 *
 * Note: The new getResources/getTools/getPrompts methods are not yet declared in the Client type.
 * As a temporary fix until the type definitions (@workspace.d.ts, @mcp-types.d.ts, @global.d.ts) are updated,
 * we cast the client to any.
 */
export async function fetchMcpResources(client: Client) {
  try {
    // Cast client to any to bypass type errors until proper type definitions are provided
    const asyncClient = client as any;
    
    // Use the new SDK methods which return async iterables
    const resourcesIterable = asyncClient.getResources({ stream: true });
    const toolsIterable = asyncClient.getTools({ stream: true });
    const promptsIterable = asyncClient.getPrompts({ stream: true });

    // Process streaming resources using async iteration
    const resources: any[] = [];
    for await (const resource of resourcesIterable) {
      console.log('Received resource:', resource);
      resources.push(resource);
    }

    const tools: any[] = [];
    for await (const tool of toolsIterable) {
      console.log('Received tool:', tool);
      tools.push(tool);
    }

    const prompts: any[] = [];
    for await (const prompt of promptsIterable) {
      console.log('Received prompt:', prompt);
      prompts.push(prompt);
    }
    
    return { resources, tools, prompts };
  } catch (error) {
    console.error('Error fetching MCP resources:', error);
    throw error;
  }
}
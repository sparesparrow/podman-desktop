# MCP Client Extension

## Overview
The MCP Client Extension (`@podman-desktop/mcp`) allows Podman Desktop to connect to an MCP (Model Context Protocol) server. It enables users to retrieve and interact with resources, tools, and prompts exposed by the MCP server. The extension integrates seamlessly into Podman Desktop, providing visual status updates and lifecycle management for MCP connections.

## Features
- **MCP Connection:** Connects to a remote MCP server using configurable server address and port.
- **Resource Interaction:** Fetches available resources, tools, and prompts from the MCP server.
- **Status Updates:** Displays connection status through the integrated status bar.
- **Lifecycle Management:** Automatically handles activation, reconnection on configuration changes, and graceful deactivation.

## Installation
1. Ensure you have Podman Desktop installed.
2. Clone or add the extension to your Podman Desktop extensions folder.
3. Navigate to the extension directory:

   ```sh
   cd extensions/mcp
   ```

4. Install dependencies using your package manager:

   ```sh
   pnpm install
   ```

5. Build the extension:

   ```sh
   pnpm build
   ```

## Configuration
The extension uses the following configuration properties which can be modified within Podman Desktop's configuration panel:
- **`mcp.serverAddress`**  
  *Type:* string  
  *Default:* `localhost`  
  *Description:* MCP server address.
  
- **`mcp.serverPort`**  
  *Type:* number  
  *Default:* `3001`  
  *Description:* MCP server port.

## Usage
- **Activate the Extension:**  
  The extension activates automatically when Podman Desktop starts. It creates an MCP provider that registers lifecycle events for connection and disconnection.
  
- **Connect Manually:**  
  Use the command palette in Podman Desktop and run the `mcp-client.connect` command to manually trigger a connection to the MCP server.

- **Status Bar:**  
  The extension displays the current MCP connection status on the Podman Desktop status bar, updating as the connection state changes.

## Testing
To run the tests for this extension, execute:

```sh
pnpm test
```

## Contribution
Contributions are welcome! Please follow the guidelines detailed in [CONTRIBUTING.md](../../CONTRIBUTING.md) and use Conventional Commits for your changes (e.g., `feat:`, `fix:`).

## License
This project is licensed under the Apache-2.0 license. 
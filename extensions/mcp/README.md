# MCP Client Extension

## Overview

The MCP Client Extension (`@podman-desktop/mcp`) allows Podman Desktop to connect to an MCP (Model Context Protocol) server. It enables users to retrieve and interact with resources, tools, and prompts exposed by the MCP server. The extension integrates seamlessly into Podman Desktop, providing visual status updates and lifecycle management for MCP connections.

## Features

- **MCP Connection:** Connects to a remote MCP server using configurable server address and port.
- **Resource Interaction:** Fetches available resources, tools, and prompts from the MCP server.
- **Status Updates:** Displays connection status through the integrated status bar.
- **Lifecycle Management:** Automatically handles activation, reconnection on configuration changes, and graceful deactivation.
- **SSE Transport:** Uses Server-Sent Events (SSE) for real-time communication with the MCP server.
- **Configuration Monitoring:** Automatically reconnects when server configuration changes.

## Installation

1. Ensure you have Node.js 20+ installed
2. Install pnpm globally (if not already installed):
   ```bash
   corepack enable
   corepack prepare pnpm@latest --activate
   ```
3. Clone or add the extension to your Podman Desktop extensions folder
4. Navigate to the extension directory:
   ```bash
   cd extensions/mcp
   ```
5. Install dependencies:
   ```bash
   pnpm install
   ```
6. Build the extension:
   ```bash
   pnpm build
   ```

## Troubleshooting

If you receive an error like:

Command 'pnpm' not found

this indicates that the pnpm CLI is not installed or not available in your PATH.

### Workaround 1: Install pnpm globally

Install pnpm by running:

```bash
npm install -g pnpm
```

### Workaround 2: Using corepack (Node.js 16+)

If you're using Node.js 16 or later, you can enable pnpm via corepack. Run:

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

Then try reinstalling dependencies:

```bash
pnpm install
```

Following these steps should resolve the missing pnpm command issue.

If you see an error like "corepack: command not found" when trying to enable corepack, it means that your installation of Node.js does not include corepack. In that case, please install pnpm globally by running:

```bash
npm install -g pnpm
```

**Note:** On Unix-based systems, you might encounter a permission error (EACCES) when installing pnpm globally. If you see an error like:

```
EACCES: permission denied, mkdir '/usr/local/lib/node_modules/pnpm'
```

then you can try one of the following approaches:

### Option 1: Install with sudo

```bash
sudo npm install -g pnpm
```

### Option 2: Configure npm to use a different global directory

Follow the instructions from npm's documentation here:
https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally

## Configuration

The extension uses the following configuration properties which can be modified within Podman Desktop's configuration panel:

- **`mcp.serverAddress`**  
  _Type:_ string  
  _Default:_ `localhost`  
  _Description:_ MCP server address.
- **`mcp.serverPort`**  
  _Type:_ number  
  _Default:_ `3001`  
  _Description:_ MCP server port.

## Usage

### Activation

The extension activates automatically when Podman Desktop starts. It creates an MCP provider that registers lifecycle events for connection and disconnection.

### Manual Connection

Use the command palette in Podman Desktop and run the `mcp-client.connect` command to manually trigger a connection to the MCP server.

### Status Bar

The extension displays the current MCP connection status on the Podman Desktop status bar, updating as the connection state changes. Possible states:

- **Not Connected:** Initial state before connection
- **Connected:** Successfully connected to MCP server
- **Connection Error:** Failed to connect or maintain connection
- **Disconnected:** Manually disconnected from server

### Resource Management

Once connected, you can:

- View available resources through the MCP Client dashboard
- Access tools and prompts exposed by the MCP server
- Monitor resource usage and status

## Development

### Testing

To run the tests for this extension, execute:

```sh
pnpm test
```

### Debugging

The extension provides detailed logging through the Podman Desktop console. Key events are logged including:

- Connection attempts
- Configuration changes
- Resource updates
- Error conditions

## Contribution

Contributions are welcome! Please follow the guidelines detailed in [CONTRIBUTING.md](../../CONTRIBUTING.md) and use Conventional Commits for your changes (e.g., `feat:`, `fix:`).

## Known Issues

- Connection stability with unstable network conditions
- Limited error recovery for certain MCP server states
- Basic authentication support only (future enhancement)

## Roadmap

- [ ] Add support for secure connections (TLS/SSL)
- [ ] Implement authentication mechanisms
- [ ] Add resource monitoring capabilities
- [ ] Improve error handling and recovery

## License

This project is licensed under the Apache-2.0 license.

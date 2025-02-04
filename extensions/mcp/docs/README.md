# MCP Extension for Podman Desktop

## Overview

This extension implements MCP (Model Context Protocol) server management for Podman Desktop, enabling AI-powered container management features through Anthropic's Claude models.

## Architecture

The extension follows a layered architecture:

- **MCP Client Layer**: Core protocol implementation using @modelcontextprotocol/sdk
- **LLM Integration**: Anthropic client integration via @anthropic-ai/sdk
- **Container Management**: Manages MCP server containers using Podman Desktop's API

## Components

### Core Services

- `AnthropicClient`: LLM provider implementation
- `ConfigurationManager`: Handles server configurations
- `ContainerManager`: Manages container lifecycle
- `McpClient`: Implements MCP protocol
- `McpServer`: Server instance management

### UI Components

- `ChatInterface`: Svelte-based chat interface using Podman Desktop's theming

## Development

### Prerequisites

- Node.js 20+
- pnpm 9.x
- Podman Desktop development environment

### Setup

1. Install dependencies:
```bash
pnpm install
```

2. Build the extension:
```bash
pnpm build
```

3. Run in development mode:
```bash
pnpm watch
```

### Testing

Run unit tests:
```bash
pnpm test
```

## Configuration

Server configurations are managed through the extension's configuration panel. Each MCP server requires:

- Name
- Command
- Arguments
- Optional environment variables and working directory

## Security

- API keys are stored securely using Podman Desktop's storage API
- Containers run with appropriate isolation
- Error messages are sanitized to prevent information leakage

## Contributing

Follow Podman Desktop's contribution guidelines and ensure:

1. Code follows SOLID principles
2. Changes are properly tested
3. Documentation is updated
4. UI components use Podman Desktop's theming system 
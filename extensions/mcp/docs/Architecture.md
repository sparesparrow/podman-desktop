# Architecture & Design

## Overview

The extension follows a layered architecture built upon SOLID design principles. It separates:

- **MCP Client Logic:** Implements core MCP protocol methods and server communication.
- **LLM Integration:** Encapsulated within the Anthropic client to allow future provider switching.
- **Container Management:** Each MCP server runs in its own isolated container, managed via a dedicated service.

## Core Components

- **Extension Framework:** Uses Podman Desktop's extension API for lifecycle management and command registration.
- **MCP Server Manager:** Coordinates container instantiation and server state (refer to `mcp-manager-design.md` for detailed flow charts).
- **Configuration Manager:** Separates sensitive data (API keys) from general configuration data.

## Design Details

### Integration Layers

1. **Generic MCP Client Layer**

   - Based on `@modelcontextprotocol/sdk`.
   - Provides message processing and request handling.

2. **LLM Provider Integration**

   - Implemented in `AnthropicClient.ts`.
   - Abstracts LLM-specific operations to easily switch providers.

3. **Container Lifecycle Management**
   - Managed in `ContainerManager.ts`.
   - Tracks container start-up, runtime operations, and shutdown sequences.

## Diagrams

**Architecture Diagram Placeholder:**  
![Architecture Diagram Placeholder](path/to/architecture_diagram.png)

**Sequence Flow for Request Handling:**  
![Sequence Flow Placeholder](path/to/sequence_flow_diagram.png)

---

This design leverages the detailed insights from the MCP Manager design document and ensures the code remains modular, testable, and maintainable.

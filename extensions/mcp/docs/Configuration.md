# Configuration Management

## Overview

The configuration system handles:

- MCP server configurations
- Secure API key management
- User preferences

It uses Podman Desktop's storage API along with Electron's secure storage for sensitive data.

## Configuration Manager

The `ConfigurationManager.ts` implements:

- **Persistent Storage:** Uses a dedicated key (`mcp.servers.config`) for saving server configurations.
- **Secure Retrieval:** Accesses API keys (e.g., for Anthropic) through Electron's secure storage interface.
- **Validation & Error Handling:** Performs comprehensive checks when loading and saving configurations.

### Key Features

- **Dynamic Server Updates:** Ability to add, update, or remove server configurations on the fly.
- **Data Isolation:** Ensures configuration data for the MCP servers does not leak into other system areas.

## Code Reference

- Look into the implementation of `persistConfig()` in `ConfigurationManager.ts` for details on JSON serialization and storage interaction.
- Configuration validation rules can be found in the accompanying [ConfigurationManagementSystem.md](../../extensions/mcp/docs/ConfigurationManagementSystem.md).

## Screenshots & Diagrams

**Configuration UI Screenshot Placeholder:**  
![Configuration UI Placeholder](path/to/configuration_ui.png)

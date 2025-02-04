Podman Desktop MCP Extension

Software Requirements, Design Decisions & Development Plan

---

1. Introduction

The purpose of this document is to outline a complete plan for implementing an MCP (Model Context Protocol) extension for Podman Desktop. This extension will allow integration with Anthropic’s MCP server implementations, providing AI-powered container management features similar to those found in Claude Desktop. The design emphasizes maintainability, code isolation, and adherence to SOLID and KISS principles. Integration is achieved through Podman Desktop’s extension API without altering unrelated parts of the codebase.

---

2. Software Requirements

Functional Requirements

MCP Client Integration:

Integrate with Anthropic’s SDK (@anthropic-ai/sdk) and the MCP client library (@modelcontextprotocol/sdk).

Provide a command (e.g., “Start MCP Chat”) that initializes the MCP client and displays a chat interface.

Allow configuration of MCP servers (with commands and arguments) via an extension configuration panel.

User Interface:

Implement a simple and responsive chat interface.

Provide a file system browser (if necessary) and status monitoring within the extension’s UI.

Reuse Podman Desktop’s UI components where possible (leveraging Svelte and Tailwind CSS).

Security & API Key Management:

Store API keys securely using available Electron or Podman Desktop secure storage mechanisms.

Maintain rootless container security by aligning with Podman Desktop’s design.

Non-Functional Requirements

Modularity:

The extension must reside within its own folder (e.g., extensions/mcp) to ensure that its code changes do not affect unrelated parts of the application.

Maintainability:

Follow SOLID principles for object-oriented design.

Use KISS (Keep It Simple, Stupid) to ensure the code is easy to understand and modify.

Performance:

The extension should load quickly and operate efficiently within the Podman Desktop environment.

Testability:

Unit, integration, and end-to-end tests must be provided. Use the existing test commands from the root (e.g., pnpm test:extensions) to ensure compatibility.

---

3. Design Decisions

3.1 Architecture and Integration

Extension API:

The extension will use the Podman Desktop Extension API provided by @podman-desktop/api. This ensures that the extension lifecycle (activation, deactivation, UI integration) is managed by the host application.

Folder Organization:

Location: Place all MCP extension code in a dedicated folder under extensions/mcp/.

Structure:

extensions/mcp/src/ – Contains the TypeScript source files.

extensions/mcp/package.json – Defines the extension’s metadata and dependencies.

extensions/mcp/README.md – Documents the extension usage and setup.

Dependency Management:

Use the versions specified in the root package.json wherever applicable. New dependencies (e.g., @modelcontextprotocol/sdk and @anthropic-ai/sdk) should be added in the extension’s package.json if they do not already exist in the root. When possible, reference root dependencies with workspace notation to avoid duplication.

SOLID and KISS Principles:

Single Responsibility: Each module (e.g., UI components, configuration management, MCP client initialization) is responsible for one well-defined task.

Open/Closed: Design modules so that new MCP server types or UI changes can be added without modifying existing code.

Liskov Substitution & Interface Segregation: Define clear interfaces for MCP client interactions and configuration management.

Dependency Inversion: Depend on abstractions (interfaces) rather than concrete implementations.

Keep It Simple: The extension’s design and code should be straightforward and modular, avoiding overengineering.

3.2 UI and Command Registration

UI Components:

Create a simple chat interface (using Svelte components) and integrate with existing Podman Desktop UI theming (via Tailwind CSS and the color registry).

Command Registration:

Register a command (e.g., mcp-extension.startChat) during extension activation so that users can launch the MCP chat interface directly from Podman Desktop.

---

4. Development Plan

4.1 Phase 1: Environment Setup and Scaffolding

1. Fork and Clone the Repository

git clone https://github.com/<your-username>/podman-desktop && cd podman-desktop

2. Install Dependencies
   Use the root-level dependency management with pnpm:

pnpm install

3. Create Extension Folder
   Create a new folder for the MCP extension:

mkdir -p extensions/mcp/src

4. Initialize Package File
   Create extensions/mcp/package.json that references the Podman Desktop engine and reuses common dependencies:

{
"name": "mcp-extension",
"version": "1.0.0",
"description": "An extension for Podman Desktop implementing Model Context Protocol (MCP) client integration",
"main": "./dist/extension.js",
"engines": {
"podman-desktop": "^0.x.x"
},
"scripts": {
"build": "vite build",
"watch": "vite build --watch",
"test": "vitest"
},
"dependencies": {
"@podman-desktop/api": "workspace:\*",
"@modelcontextprotocol/sdk": "^<target-version>",
"@anthropic-ai/sdk": "^<target-version>"
},
"devDependencies": {
"vite": "^6.0.11",
"vitest": "^2.1.6",
"typescript": "5.6.3"
}
}

(Replace <target-version> with the recommended versions compatible with the root package.json.)

4.2 Phase 2: Core Extension Implementation

1. Extension Activation Module
   Create extensions/mcp/src/extension.ts:

import { ExtensionContext, commands } from '@podman-desktop/api';
import { McpClient } from '@modelcontextprotocol/sdk';
import { Client as AnthropicClient } from '@anthropic-ai/sdk';

export async function activate(context: ExtensionContext) {
console.log('MCP Extension activated');

// Initialize the MCP client with any necessary configuration
const mcpClient = new McpClient();
const anthropicClient = new AnthropicClient('your-anthropic-api-key'); // Securely load the key

// Register a command to open the MCP chat interface
context.subscriptions.push(
commands.registerCommand('mcp-extension.startChat', () => {
// This is where you call the function to open your chat UI
openChatInterface();
})
);
}

function openChatInterface() {
// Implementation for opening the chat UI (using Svelte and existing Podman Desktop theming)
console.log('Opening MCP Chat Interface...');
}

2. Configuration Management
   Define an interface and module for handling MCP server settings. For example, in extensions/mcp/src/configuration.ts:

export interface McpConfig {
mcpServers: {
[key: string]: {
command: string;
args: string[];
};
};
}

export class ConfigurationManager {
private config: McpConfig;

constructor() {
// Load configuration from storage (could be integrated with Podman Desktop configuration APIs)
this.config = { mcpServers: {} };
}

public getConfig(): McpConfig {
return this.config;
}

public updateServerConfig(serverName: string, config: { command: string; args: string[] }): void {
this.config.mcpServers[serverName] = config;
// Persist the configuration change using the Podman Desktop API
}
}

3. UI Component Implementation
   Create simple Svelte components under extensions/mcp/src/components/. A sample component might be ChatInterface.svelte that implements the chat window. Make sure to use existing CSS variables from Podman Desktop (e.g., var(--pd-button-primary-bg)).

4.3 Phase 3: Integration and Testing

1. Integration with Podman Desktop UI

Register your extension in Podman Desktop’s extension registry (via the extension API).

Test that the command mcp-extension.startChat appears and functions as expected.

2. Build and Watch Commands

Use the extension’s pnpm run watch command to monitor changes.

From the root of the repository, run:

pnpm run build:extensions

This command already builds the other extensions and will include your MCP extension if properly configured.

3. Testing

Unit Tests: Write unit tests for configuration management and MCP client initialization.

Integration Tests: Use Vitest and Podman Desktop’s testing commands:

pnpm test:extensions

End-to-End Tests: Leverage Playwright (already configured in the root) to test UI workflows.

4.4 Phase 4: Code Isolation and Best Practices

1. Module Isolation:

Ensure that all new code is confined to the extensions/mcp folder.

Avoid modifying core files in packages/main, packages/renderer, or other shared folders.

2. Code Reviews and Linting:

Use existing lint and format scripts from the root:

pnpm lint:check && pnpm format:check

Run type checks to ensure no unintended side effects:

pnpm typecheck

3. Adherence to SOLID & KISS:

Keep each module focused on a single responsibility (e.g., one module for configuration, one for MCP client interactions, and one for UI).

Write small, reusable functions and interfaces.

4. Continuous Integration:

Verify that your extension passes all CI tests (unit, integration, E2E) by running:

pnpm test

---

5. Summary of Setup Commands

1. Clone the repository:

git clone https://github.com/podman-desktop/podman-desktop.git
cd podman-desktop

2. Install all dependencies:

pnpm install

3. Create and set up the MCP extension folder:

mkdir -p extensions/mcp/src

# Create package.json as described and add source files

4. Build the entire codebase (including extensions):

pnpm run build

5. Run in watch mode for development:

pnpm watch

6. Run tests to validate changes:

pnpm test:extensions
pnpm test:e2e

# MCP Server Manager Extension for Podman Desktop

## Overview

This extension manages MCP servers by running each server in its own container. It follows design principles such as SOLID and KISS and uses dependency injection, MVC patterns, and a modular approach with Svelte and TypeScript.

## Recent Changes

- **Version Update:** The extension version is now **1.0.0**.
- **Dependency Update:** Package dependencies in `package.json` and lock file `pnpm-lock.yaml` have been revised.
- **Build & Test Enhancements:**  
  - Build scripts now use Vite for faster compilation.
  - Tests have been updated to use Vitest, with improved mocks and error handling.
- **Error Handling Improvements:** Error messages are now standardized to offer clear user feedback.
- **Text-to-Speech Optimization:** This document and the code files use short, clear sentences and simple language to improve accessibility for text-to-speech users.

## Review and Action Steps

1. **Dependency Verification:**  
   Review `package.json` and `pnpm-lock.yaml` to ensure all dependencies are correctly installed and compatible.

2. **Build Process:**  
   Run `pnpm build` to verify that the production build is generated in the `dist` folder with source maps.

3. **Testing:**  
   Execute `pnpm test` to run all unit tests. Confirm that tests for the MCP client, server, and configuration manager complete without errors.

4. **Error Handling Check:**  
   Verify that error messages (e.g. for connection failures) are clear and consistent as per the updated test expectations.

5. **Accessibility Review:**  
   Use a text-to-speech tool to read this document. Ensure that the language is simple and that each step is easy to follow.

6. **Quality Assurance:**  
   Run `pnpm lint:check`, `pnpm format:check`, and `pnpm typecheck` to ensure code quality before committing changes.

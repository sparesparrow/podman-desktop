export function deactivate(): void {
  // Clean up resources
  mcpClients.clear();
  
  for (const container of serverContainers.values()) {
    container.stop().catch((error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : String(error);
      window.showErrorMessage(`Failed to stop container: ${errorMessage}`);
    });
  }
  
  serverContainers.clear();
} 
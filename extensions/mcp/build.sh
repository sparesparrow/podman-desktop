#!/bin/bash

# Exit on error
set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}Starting MCP Server Manager Extension build process...${NC}"

# Run QA checks
echo -e "\n${GREEN}Running QA checks...${NC}"
pnpm run qa

# Build the extension
echo -e "\n${GREEN}Building extension...${NC}"
pnpm run build

# Build container image
echo -e "\n${GREEN}Building container image...${NC}"
podman build -f Dockerfile -t quay.io/podman-desktop/mcp-server-manager-extension:dev .

# Test the extension locally
echo -e "\n${GREEN}Testing extension in Podman Desktop...${NC}"
echo "To test the extension, run:"
echo "podman-desktop --extension-folder ./dist"

echo -e "\n${GREEN}Build process completed successfully!${NC}"
echo "You can now:"
echo "1. Run the extension locally with: podman-desktop --extension-folder ./dist"
echo "2. Push the container image with: podman push quay.io/podman-desktop/mcp-server-manager-extension:dev" 
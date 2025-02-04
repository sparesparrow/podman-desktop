#!/bin/bash

# Exit on error
set -e

# Build the container image
echo "Building container image..."
podman build -t mcp-extension-builder .

# Create a volume for the build output
echo "Creating output volume..."
podman volume create mcp-extension-dist

# Run the container to build the extension
echo "Building extension..."
podman run --rm \
  -v mcp-extension-dist:/dist \
  mcp-extension-builder

# Copy the built extension to the current directory
echo "Copying built extension..."
podman run --rm \
  -v mcp-extension-dist:/dist \
  -v "$(pwd)/dist:/output" \
  alpine \
  cp -r /dist/* /output/

echo "Build complete! The extension package is in the dist directory." 
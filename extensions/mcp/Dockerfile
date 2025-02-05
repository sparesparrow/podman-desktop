# Use scratch as the base image since the extension is self-contained
FROM scratch

# Copy the necessary files
COPY package.json ./
COPY dist/ ./dist
COPY resources/ ./resources

# Add metadata labels
LABEL org.opencontainers.image.title="MCP Server Manager Extension" \
      org.opencontainers.image.description="MCP Server Manager Extension for Podman Desktop" \
      org.opencontainers.image.vendor="Podman Desktop" \
      org.opencontainers.image.version="1.0.0" \
      org.opencontainers.image.url="https://podman-desktop.io" \
      org.opencontainers.image.documentation="https://podman-desktop.io/docs/extensions" \
      org.opencontainers.image.source="https://github.com/containers/podman-desktop" \
      org.opencontainers.image.licenses="Apache-2.0" 
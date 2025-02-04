# Use Node.js LTS as the base image
FROM node:20-slim

# Install pnpm
RUN npm install -g pnpm@8.15.4

# Install necessary build dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source files
COPY . .

# Build the extension
RUN pnpm build

# Create the extension package
RUN pnpm package

# The final package will be in the dist directory
VOLUME /dist
CMD ["cp", "-r", "dist/", "/dist/"] 
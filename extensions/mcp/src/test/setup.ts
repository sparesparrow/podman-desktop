import { vi } from 'vitest';

declare global {
  // eslint-disable-next-line no-var
  var console: Console;
  // eslint-disable-next-line no-var
  var window: Window & typeof globalThis;
}

// Mock console methods
global.console = {
  ...console,
  log: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  info: vi.fn(),
  debug: vi.fn(),
} as Console;

// Mock window methods if needed
global.window = {
  ...window,
} as Window & typeof globalThis; 
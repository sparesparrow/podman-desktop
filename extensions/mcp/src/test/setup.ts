/// <reference types="vitest/globals" />

// Configure global test setup
beforeEach(() => {
  vi.resetAllMocks();
});

// Import mocks from a single location
import './mocks';

// The mocks are now handled by the moduleNameMapper configuration in package.json
// and the mock files in src/test/mocks/ 
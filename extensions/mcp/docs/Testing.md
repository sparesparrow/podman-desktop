# Testing and Quality Assurance

## Testing Strategy

We use Vitest for unit tests and integration tests to ensure complete coverage and robust error handling. Our guidelines include:

- **Unit Tests:** Test individual service methods, utility functions, and Svelte components.
  - For example, `ChatInterface` tests include verifying loading states, server list updates, and message stream processing.
- **Integration Tests:** Verify end-to-end workflows. (Use Playwright or similar tools where needed.)
- **Error Handling Tests:** Every asynchronous operation is covered by try/catch blocks. Tests ensure that user-friendly error messages are displayed.

## Testing Best Practices

- Use `vi.mocked` to ensure accurate type checks on mocks. See examples in the guidelines from [Guidelines for Podman Desktop Code](../../extensions/mcp/docs/notepad_was_cursorrules.md).
- Spy on functions selectively using `vi.spyOn` for precise verification.
- Always reset mocks between tests with `vi.resetAllMocks()` or `vi.restoreAllMocks()`.

## Example Test Snippet

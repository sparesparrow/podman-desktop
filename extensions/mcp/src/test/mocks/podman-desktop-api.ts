export const window = {
  getStorage: jest.fn().mockReturnValue({
    get: jest.fn(),
    set: jest.fn()
  }),
  showInputBox: jest.fn(),
  showQuickPick: jest.fn(),
  showInformationMessage: jest.fn(),
  showErrorMessage: jest.fn()
};

export const commands = {
  registerCommand: jest.fn()
}; 
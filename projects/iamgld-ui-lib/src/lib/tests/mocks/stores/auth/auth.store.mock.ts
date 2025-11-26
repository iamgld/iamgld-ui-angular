export const mockAuthStore: Partial<jest.Mocked<{ signin: jest.Mock; signout: jest.Mock }>> = {
  signin: jest.fn(),
  signout: jest.fn(),
}

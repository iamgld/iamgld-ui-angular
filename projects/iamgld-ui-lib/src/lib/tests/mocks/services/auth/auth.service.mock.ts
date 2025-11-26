interface AuthServiceMock {
  signin: jest.Mock
  signout: jest.Mock
}

export const mockAuthService: Partial<jest.Mocked<AuthServiceMock>> = {
  signin: jest.fn(),
  signout: jest.fn(),
}

module.export = {
  roots: ['<rootDir>/src/'],
  clearMocks: true,
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
}

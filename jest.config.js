module.exports = {
    preset: 'ts-jest',
    setupFiles: [],
    moduleFileExtensions: [
        'web.ts',
        'ts',
        'web.tsx',
        'tsx',
        'web.js',
        'js',
        'web.jsx',
        'jsx',
        'json',
    ],
    testEnvironment: 'jsdom',
    moduleDirectories: ['node_modules', 'src', 'jest'],
    transform: {
        '^.+\\.pdf$': '<rootDir>/jest/jest-binary.js',
        '^.+\\.(js|ts|tsx)$': 'ts-jest',
    },
    transformIgnorePatterns: [
        '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$',
    ],
    setupFiles: ['<rootDir>/jest/setupTests.js'],
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.json',
            isolatedModules: true,
        },
    },
};

module.exports = {
    preset: 'ts-jest',
    // collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],
    setupFiles: [],
    moduleFileExtensions: ['web.ts', 'ts', 'web.tsx', 'tsx', 'web.js', 'js', 'web.jsx', 'jsx', 'json'],
    testEnvironment: 'jsdom',
    moduleDirectories: ['node_modules', 'src', 'jest'],
    transform: {
        '^.+\\.pdf$': '<rootDir>/jest/jest-binary.js',
        '^.+\\.(js|ts|tsx)$': 'ts-jest',
    },
    transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$'],
    globals: {
        'ts-jest': {
            tsConfig: 'tsconfig.json',
            isolatedModules: true,
        },
    },
};

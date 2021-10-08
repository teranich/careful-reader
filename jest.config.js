/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    module: {
        loaders: [{ loader: 'binary-loader', test: /\.pdf$/ }],
    },
    preset: 'ts-jest',
    collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],
    setupFiles: [],
    moduleFileExtensions: ['web.ts', 'ts', 'web.tsx', 'tsx', 'web.js', 'js', 'web.jsx', 'jsx', 'json'],
    testEnvironment: 'jsdom',
    moduleDirectories: ['node_modules', 'src'],
    transform: {
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

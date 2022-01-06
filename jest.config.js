/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: 'ts-jest/presets/js-with-ts', // or other ESM presets
    // extensionsToTreatAsEsm: ['.ts'],
    globals: {
        'ts-jest': {
            // useESM: true,
            isolatedModules: true,
            // tsconfig: '<rootDir>/tsconfig.json',
        },
    },
    // transform: {
    //     '^.+\\.jsx?$': 'babel-jest',
    //     '^.+\\.tsx?$': 'ts-jest',
    // },
    // moduleNameMapper: {
    //     '^(\\.{1,2}/.*)\\.js$': '$1',
    // },
    // moduleDirectories: ['node_modules'],
    // moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    transformIgnorePatterns: ['node_modules/better-sqlite3'],
};

import * as cloud from './cloud';
jest.mock('./common');

beforeEach(() => {
    Object.defineProperty(window, 'gapi', {
        writable: true,
        value: {
            load: (a, f) => f(),
            client: {
                init: () => {
                    return Promise.resolve();
                },
            },
        },
    });
});

describe('cloud', () => {
    test('loadGapi', () => {
        cloud.loadGapi().then((result) => {
            expect(result).toBe(true);
        });
    });
    test('load', () => {
        return cloud.load().then((result) => {
            expect(result).toBe(true);
        });
    });
    describe('drive', () => {
        test('exists', () => {
            expect(cloud.drive).toBeDefined();
        });
    });
    describe('appFolder', () => {
        test('exists', () => {
            expect(cloud.appFolder).toBeDefined();
        });
    });
});

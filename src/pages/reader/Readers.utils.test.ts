import { getRendersFrame, usePagesManager } from './Readers.utils';

describe('Readers utils test', () => {
    describe('render frame', () => {
        it('should ', () => {
            expect(getRendersFrame(2, 3)).toEqual([1, 2, 3]);
        });
    });
    describe('usePagesManager', () => {
        test('usePagesManager should run', () => {
            const { pages, goToPage } = usePagesManager([], 100);
            expect(pages).toEqual([]);
        });

        test('usePagesManager goToPage', () => {
            const { pages, goToPage } = usePagesManager([], 100);
            goToPage(3);
            expect(pages).toEqual([1, 2, 3]);
        });
    });
});

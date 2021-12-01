import { getRendersFrame } from './Readers.utils';

describe('Readers utils test', () => {
    describe('render frame', () => {
        it('should ', () => {
            expect(getRendersFrame(2, 3)).toEqual([1,2,3]);
        });
    });
});

import { getRendersFrame, usePagesManager } from './Readers.utils';
import { shallow } from 'enzyme';

describe('Readers utils tests', () => {
    describe('render frame', () => {
        test('should return valid frame in begin', () => {
            expect(getRendersFrame(1, 100)).toEqual([1, 2, 3, 4]);
        });

        test('should return valid frame', () => {
            expect(getRendersFrame(2, 100)).toEqual([1, 2, 3, 4, 5]);
        });

        test('should return valid frame in middle', () => {
            expect(getRendersFrame(50, 100)).toEqual([49, 50, 51, 52, 53]);
        });

        test('should return valid frame in end', () => {
            expect(getRendersFrame(99, 100)).toEqual([98, 99, 100]);
        });

        test('should return valid frame out of range', () => {
            expect(getRendersFrame(101, 100)).toEqual([100]);
        });

        test('should return valid frame above zero', () => {
            expect(getRendersFrame(-1, 100)).toEqual([1, 2]);
        });

        test('should return valid frame above zero in one pages document', () => {
            expect(getRendersFrame(-1, 1)).toEqual([1]);
        });

        test('should return valid frame above zero in zero page document', () => {
            expect(getRendersFrame(-1, 0)).toEqual([]);
        });
    });

    type TPageHookParams = {
        initPages: number[];
    };

    type TGotoPageHookParams = TPageHookParams & {
        gotoPageNumber: number;
    };

    const GotoPageHook = ({
        initPages,
        gotoPageNumber,
    }: TGotoPageHookParams) => {
        const { pages, goToPage } = usePagesManager(initPages, 100);

        return (
            <>
                <button onClick={() => goToPage(gotoPageNumber)} />
                <div className="result">{pages.join(',')}</div>
            </>
        );
    };

    const NextPageHook = ({ initPages }: TPageHookParams) => {
        const { pages, next } = usePagesManager(initPages, 100);

        return (
            <>
                <button onClick={() => next()} />
                <div className="result">{pages.join(',')}</div>
            </>
        );
    };

    const PrevPageHook = ({ initPages }: TPageHookParams) => {
        const { pages, prev } = usePagesManager(initPages, 100);

        return (
            <>
                <button onClick={() => prev()} />
                <div className="result">{pages.join(',')}</div>
            </>
        );
    };

    describe('usePagesManager', () => {
        test('usePagesManager`s hook should run', () => {
            const wrapper = shallow(
                <GotoPageHook initPages={[2, 3]} gotoPageNumber={2} />,
            );

            wrapper.find('button').simulate('click');
            expect(wrapper.find('.result').text()).toBe('1,2,3,4,5');
        });

        test('method: next should change frame', () => {
            const wrapper = shallow(<NextPageHook initPages={[10]} />);

            wrapper.find('button').simulate('click');
            expect(wrapper.find('.result').text()).toBe('10,11,12,13,14');
        });

        test('method: prev should change frame', () => {
            const wrapper = shallow(<PrevPageHook initPages={[10]} />);

            wrapper.find('button').simulate('click');
            expect(wrapper.find('.result').text()).toBe('8,9,10,11,12');
        });
    });
});

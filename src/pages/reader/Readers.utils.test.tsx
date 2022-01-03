import { useEffect } from 'react';
import { getRendersFrame, usePagesManager } from './Readers.utils';
import { shallow } from 'enzyme';

const GotoPageHook = ({ init, gotoPageNumber }) => {
    const { pages, goToPage } = usePagesManager(init, 100);

    return (
        <>
            <button onClick={() => goToPage(gotoPageNumber)}>goto</button>
            <div className="result">{pages.join(',')}</div>
        </>
    );
};

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
    });

    describe('usePagesManager', () => {
        test('usePagesManager`s hook should run', () => {
            const wrapper = shallow(
                <GotoPageHook init={[2, 3]} gotoPageNumber={2} />,
            );
            wrapper.find('button').simulate('click');
            expect(wrapper.find('.result').text()).toBe('1,2,3,4,5');
        });
    });
});

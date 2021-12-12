import { getRendersFrame, usePagesManager } from './Readers.utils';
import { shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme from 'enzyme';

Enzyme.configure({ adapter: new Adapter() });

const Hook = ({init, goTo}) => {
    const {pages, goToPage} = usePagesManager(init, 100)
    goTo = goToPage
    return <>{pages}</>
}

describe('Readers utils test', () => {
    describe('render frame', () => {
        it('should ', () => {
            expect(getRendersFrame(2, 3)).toEqual([1, 2, 3]);
        });
    });
    describe('usePagesManager', () => {
        test('usePagesManager should run', () => {
            let goTo = () => {}
            const wrapper = shallow(<Hook init={[]} goTo={goTo}/>);
            goTo(2)
            expect(wrapper).toEqual([]);
        });

        // test('usePagesManager goToPage', () => {
        //     const { pages, goToPage } = usePagesManager([], 100);
        //     goToPage(3);
        //     expect(pages).toEqual([1, 2, 3]);
        // });
    });
});

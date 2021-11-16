import { isOnScreen } from './styler';

let gapEl = document.createElement('div')
gapEl.innerHTML='Simeple Text'
gapEl.style.marginTop = '1000px'
document.body.append(gapEl);
let el = document.createElement('div')
el.innerHTML='Simeple Text'
el.style.marginTop = '1000px'
document.body.append(el);
beforeAll(() => {});

describe('styler utils fot html elements', () => {
    it('isOnScreen', () => {
        console.log('document', document);
        const result = isOnScreen(el, document);
        expect(result).toBe(false);
    });
});

import jestBinary from './jest-binary'

describe('jest binary transformer', () => {
    it('first', () => {
        const source = 'text'
        const filename = '../src/mocks/book.pdf'
        const res = jestBinary.process(source)

        expect(res).toBe(source, filename, {})
    })
})
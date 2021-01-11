import { importScript } from './common'
import * as cloud from './cloud'
jest.mock('./common')

beforeEach(()=> {
    window.gapi = {}
    window.gapi.load = (a, f) => f();
    window.gapi.client = {
        init: () => {
            return Promise.resolve()
        }
    }

    importScript.mockImplementation((src) => {
        return Promise.resolve(src)
    })
})

describe('cloud', () => {
    test('loadGapi', () => {
        cloud.loadGapi().then((result) => {
            expect(result).toBe(true)
        })
    })
    test('load', () => {
        return cloud.load().then(result => {
            expect(result).toBe(true)
        })
    })
})

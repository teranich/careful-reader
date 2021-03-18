import { RootStore } from './RootStore';
import RemoteLibraryStore from './RemoteLibraryStore'

jest.mock('../utils/cloud')


function getStoreInstance() {
    const rootStore = new RootStore()
    return new RemoteLibraryStore(rootStore)
}
describe('Remote library store', () => {
    let store = getStoreInstance()
    beforeEach(async ()=> {
        store = getStoreInstance()
        await store.load()
    })
    
    test.skip('load', async () => {
        const store = getStoreInstance()
        expect(store.isLoggedIn).toBeFalsy()
        await store.load()
        expect(store.isLoggedIn).toBeTruthy()

    })
    test('fetch remote books list', async () => {
        const list = await store.fetchBooksListAction()
        expect(list).toHaveLength(1)
     })
})

import React, { useEffect } from 'react'
import './App.scss'
import Shelves from './components/shelves'
import Reader from './components/reader'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { observer, useLocalStore } from 'mobx-react'
import LibraryStoreContext, { LibraryStore } from './store/LibraryStore'
import RemoteLibraryStoreContext, {
  RemoteLibraryStore,
} from './store/RemoteLibraryStore'
import { Feed } from './components/feed'
import { Details } from './components/details'

const App = observer(function App() {
  const store = useLocalStore(LibraryStore)
  const remoteStore = useLocalStore(RemoteLibraryStore)
  const basename =
    process.env.NODE_ENV === 'development' ? '/' : process.env.PUBLIC_URL
  const { isLoggedIn } = remoteStore

  useEffect(() => {
    store.fetchBooksListAction()
  }, [])

  const fetchBooks = async () => {
    if (isLoggedIn) await remoteStore.fetchBooksListAction()
  }
  useEffect(() => {
    fetchBooks()
  }, [isLoggedIn])

  return (
    <LibraryStoreContext.Provider value={store}>
      <RemoteLibraryStoreContext.Provider value={remoteStore}>
        <Router basename={basename}>
          <Switch>
            <Route exact path="/">
              <Feed />
            </Route>
            <Route exact path="/read/:bookId">
              <Reader />
            </Route>
            <Route exact path="/details/:bookId">
              <Details />
            </Route>
            <Route exact path="/shelves">
              <Shelves />
            </Route>
          </Switch>
        </Router>
      </RemoteLibraryStoreContext.Provider>
    </LibraryStoreContext.Provider>
  )
})

export default App

import React from 'react'
import './App.scss'
import Shelves from './components/shelves'
import Reader from './components/reader'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import { observer, useLocalStore } from 'mobx-react'
import LibraryStoreContext, { LibraryStore } from './store/LibraryStore'
import RemoteLibraryStoreContext, {
  RemoteLibraryStore,
} from './store/RemoteLibraryStore'
import { Feed } from './components/feed'

const App = observer(function App() {
  const store = useLocalStore(LibraryStore)
  const remoteStore = useLocalStore(RemoteLibraryStore)
  const basename =
    process.env.NODE_ENV === 'development' ? '/' : process.env.PUBLIC_URL

  return (
    <LibraryStoreContext.Provider value={store}>
      <RemoteLibraryStoreContext.Provider value={remoteStore}>
        <Router basename={basename}>
          <Switch>
            <Route exact path="/">
              <Feed></Feed>
            </Route>
            <Route exact path="/read/:bookId">
              <Reader></Reader>
            </Route>
            <Route exact path="/shelves">
              <Shelves></Shelves>
            </Route>
          </Switch>
        </Router>
      </RemoteLibraryStoreContext.Provider>
    </LibraryStoreContext.Provider>
  )
})

export default App

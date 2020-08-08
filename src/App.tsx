import React from 'react'
import './App.scss'
import Bookshelf from './components/bookshelf'
import Reader from './components/reader'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { observer, useLocalStore } from 'mobx-react'
import LibraryStoreContext, { LibraryStore } from './store/LibraryStore'

const App = observer(function App() {
  const store = useLocalStore(LibraryStore)
  const basename =
    process.env.NODE_ENV === 'development' ? '/' : process.env.PUBLIC_URL

  return (
    <LibraryStoreContext.Provider value={store}>
      <Router basename={basename}>
        <Switch>
          <Route path="/read/:bookId">
            <Reader />
          </Route>
          <Route path="/">
            <Bookshelf />
          </Route>
        </Switch>
      </Router>
    </LibraryStoreContext.Provider>
  )
})

export default App

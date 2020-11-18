import React, { useEffect } from 'react'
import './App.scss'
import Shelves from './pages/shelves'
import Reader from './pages/reader'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { observer, useLocalStore } from 'mobx-react'
import LibraryStoreContext, { LibraryStore } from './store/LibraryStore'
import RemoteLibraryStoreContext, {
  RemoteLibraryStore,
} from './store/RemoteLibraryStore'
import { Feed } from './pages/feed'
import { Details } from './pages/details'
import { IntlProvider } from 'react-intl'
import AppStoreContext, { AppStore } from './store/AppStore'
import { Settings } from './pages/settings'

const App = observer(function App() {
  const libraryStore = useLocalStore(LibraryStore)
  const remoteStore = useLocalStore(RemoteLibraryStore)
  const appStore = useLocalStore(AppStore)
  const basename =
    process.env.NODE_ENV === 'development' ? '/' : process.env.PUBLIC_URL
  const { isLoggedIn } = remoteStore
  const messages = appStore.getLocaleMessages()

  useEffect(() => {
    libraryStore.fetchBooksListAction()
  }, [])

  const fetchBooks = async () => {
    if (isLoggedIn) await remoteStore.fetchBooksListAction()
  }
  useEffect(() => {
    fetchBooks()
  }, [isLoggedIn])

  return (
    <AppStoreContext.Provider value={appStore}>
      <LibraryStoreContext.Provider value={libraryStore}>
        <RemoteLibraryStoreContext.Provider value={remoteStore}>
          <IntlProvider locale={appStore.locale} defaultLocale={appStore.defaultLocale} messages={messages}>
            <Router basename={basename}>
              <Switch>
                {/* <Route exact path="/">
                  <Feed />
                </Route> */}
                <Route exact path="/">
                  <Shelves />
                </Route>
                <Route exact path="/read/:bookId">
                  <Reader />
                </Route>
                <Route exact path="/details/:bookId">
                  <Details />
                </Route>
                <Route exact path="/settings">
                  <Settings />
                </Route>
              </Switch>
            </Router>
          </IntlProvider>
        </RemoteLibraryStoreContext.Provider>
      </LibraryStoreContext.Provider>
    </AppStoreContext.Provider>
  )
})

export default App

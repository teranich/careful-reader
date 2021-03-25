import React, { useEffect } from 'react'
import './App.scss'
import Shelves from './pages/shelves'
import Reader from './pages/reader'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { observer } from 'mobx-react'
import { RootStoreContext, RootStore } from './store/RootStore'
import { IntlProvider } from 'react-intl'
import { Settings } from './pages/settings'
import Notifications from './components/Notifications'

const rootStore = new RootStore()

const App = observer(function App() {
  const basename =
    process.env.NODE_ENV === 'development' ? '/' : process.env.PUBLIC_URL
  const { appStore, libraryStore, remoteLibraryStore } = rootStore
  const { isLoggedIn } = remoteLibraryStore
  const messages = appStore.getLocaleMessages()

  useEffect(() => {
    Promise.all([appStore.load(), remoteLibraryStore.load()]).then(() => {
      libraryStore.fetchBooksListAction()
    })
  }, [])

  const fetchBooks = async () => {
    if (isLoggedIn) await remoteLibraryStore.fetchBooksListAction()
  }
  useEffect(() => {
    fetchBooks()
  }, [isLoggedIn])

  return (
    <RootStoreContext.Provider value={rootStore}>
      <IntlProvider
        locale={appStore.locale}
        defaultLocale={appStore.defaultLocale}
        messages={messages}
      >
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
            <Route exact path="/settings">
              <Settings />
            </Route>
          </Switch>
        </Router>
        <Notifications />
      </IntlProvider>
    </RootStoreContext.Provider>
  )
})

export default App

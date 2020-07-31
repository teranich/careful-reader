import React, { useEffect, useState } from 'react'
import './App.scss'
import Bookshelf from './components/bookshelf/Bookshelf'
import Reader from './components/reader/Reader'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import useBooksReducer, { AppState } from './store/BooksReducer'

export const StateContext = React.createContext<AppState>([])
export const DispatchContext = React.createContext<React.Dispatch<any>>(
  (value: any) => {}
)

function useGoogleAuth() {
  const [loaded, setLoaded] = useState(false)
  const [googleAuth, setGoogleAuth] = useState<gapi.auth2.GoogleAuth>()

  useEffect(() => {
    window.gapi?.load('auth2', () => {
      window.gapi?.auth2
        .init({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          scope: 'https://www.googleapis.com/auth/drive.appdata',
        })
        .then(oauth2ok, oauth2Error)
    })

    function oauth2ok(auth2: gapi.auth2.GoogleAuth) {
      if (auth2) {
        setGoogleAuth(auth2)
        setLoaded(true)
      }
    }

    function oauth2Error() {}
  }, [])

  const signIn = () => googleAuth?.signIn()
  const signOut = () => googleAuth?.signOut()

  return { signIn, signOut, loaded }
}

function App() {
  const [state, dispatch] = useBooksReducer()
  const { signIn, signOut, loaded } = useGoogleAuth()

  useEffect(() => {
    dispatch({ type: 'fetch_books_list' })
    console.log('app loaded', loaded)
  }, [dispatch])

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <div className={loaded ? '' : 'hidden'}>
          <button onClick={signIn}>LogIn</button>
          <button onClick={signOut}>LogOut</button>
        </div>
        <Router basename={process.env.PUBLIC_URL}>
          <Switch>
            <Route path="/read/:bookId">
              <Reader books={state} />
            </Route>
            <Route path="/">
              <Bookshelf books={state} />
            </Route>
          </Switch>
        </Router>
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

export default App

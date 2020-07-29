import React, { useEffect } from 'react'
import './App.scss'
import Bookshelf from './components/bookshelf/Bookshelf'
import Reader from './components/reader/Reader'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import useBooksReducer, { AppState } from './store/BooksReducer'

export const StateContext = React.createContext<AppState>([])
export const DispatchContext = React.createContext<React.Dispatch<any>>(
  (value: any) => {}
)

function App() {
  const [state, dispatch] = useBooksReducer()
  useEffect(() => {
    dispatch({ type: 'fetch_books_list' })
  }, [dispatch])

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <Router basename={process.env.PUBLIC_URL}>
          <Switch>
            <Route path="/read/:bookId">
              <Reader />
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

import React from 'react';
import './App.scss';
import Bookshelf from './components/bookshelf/Bookshelf'
import Reader from "./components/reader/Reader";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { useDispatch } from 'react-redux';
import { fetchBooksList } from './store/actions';
import { init } from './uitls/database';

function App() {
  const dispatch = useDispatch()
  init()
    .then(() => {
      dispatch(fetchBooksList())
    })

  return (
    <div className="reader-app">
      <Router>
        <Switch>
          <Route path="/read/:bookId">
            <Reader />
          </Route>
          <Route path="/">
            <Bookshelf />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;

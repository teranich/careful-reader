import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker'
import 'normalize.css'

const app = <App />

ReactDOM.render(app, document.getElementById('root'))
serviceWorker.register()

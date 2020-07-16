import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { initDB } from './uitls/database'

initDB()

const app = <App />

ReactDOM.render(app, document.getElementById('root'))

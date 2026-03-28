import React from 'react'
import { StrictMode } from 'react'
import { createRoot, ReactDOM } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './components/App/App';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)

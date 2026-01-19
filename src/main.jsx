import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import ProjectOnePage from './components/ProjectOnePage.jsx'

// import './index.css'
import 'bootstrap' // loads Bootstrap's JavaScript plugins
import './assets/all.scss'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

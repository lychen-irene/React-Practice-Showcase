import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ProjectOnePage from './components/ProjectOnePage.jsx'

import 'bootstrap'
import './assets/all.scss'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProjectOnePage />
  </StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ProjectOnePage from './projectOnePage'

import '../../src/assets/all.scss'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProjectOnePage />
  </StrictMode>,
)

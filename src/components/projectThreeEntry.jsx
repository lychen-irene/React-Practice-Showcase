import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ProjectThreePage from './projectThreePage'

import '../../src/assets/all.scss'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProjectThreePage />
  </StrictMode>,
)

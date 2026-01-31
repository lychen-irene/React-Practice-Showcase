import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ProjectThreePage from './ProjectThreePage'

import '../../assets/all.scss'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProjectThreePage />
  </StrictMode>,
)

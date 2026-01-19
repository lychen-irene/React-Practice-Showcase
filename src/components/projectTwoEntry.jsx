import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ProjectTwoPage from './ProjectTwoPage'

import 'bootstrap' // loads Bootstrap's JavaScript plugins
import '../../src/assets/all.scss'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProjectTwoPage />
  </StrictMode>,
)

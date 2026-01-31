import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import About from './About'

import '../../assets/all.scss'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <About />
  </StrictMode>,
)

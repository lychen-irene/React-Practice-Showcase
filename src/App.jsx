import { useState } from 'react'

import 'bootstrap'
import Navbar, { titles } from './components/Navbar'
import DefaultPage from './components/page/DefaultPage'
import Footer from './components/Footer'

function App() {
  const [count, setCount] = useState(0)
  return (
    <>
      <Navbar title={{ titles }} />
      <DefaultPage count={count} setCount={setCount} />
      <Footer />
    </>
  )
}

export default App

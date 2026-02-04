import { useState } from 'react'

import 'bootstrap'
import Navbar, { titles } from '../../components/Navbar'
import DefaultPage from '../../components/DefaultPage'
import Footer from '../../components/Navbar'

function Home() {
  const [count, setCount] = useState(0)
  return (
    <>
      <Navbar title={{ titles }} />
      <DefaultPage count={count} setCount={setCount} />
      <Footer />
    </>
  )
}

export default Home

import { useState } from 'react'

import 'bootstrap'
import Navbar, { titles } from '../Navbar'
import DefaultPage from './DefaultPage'
import Footer from '../Footer'

function About() {
  const [count, setCount] = useState(0)
  return (
    <>
      <Navbar title={{ titles }} />
      <DefaultPage
        count={count}
        setCount={setCount}
      />
      <Footer />
    </>
  )
}

export default About

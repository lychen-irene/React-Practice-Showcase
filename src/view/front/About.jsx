// import { useState } from 'react'

import 'bootstrap'
import Navbar, { titles } from '../../components/Navbar'
import Footer from '../../components/Footer'

function About() {
  // const [count, setCount] = useState(0)
  return (
    <>
      <Navbar title={{ titles }} />
      <div>
        <h2>About Page</h2>
      </div>
      <Footer />
    </>
  )
}

export default About

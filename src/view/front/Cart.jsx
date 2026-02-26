// import { useState } from 'react'

import 'bootstrap'
import Navbar, { titles } from '../../components/Navbar'
import DefaultPage from '../../components/DefaultPage'
import Footer from '../../components/Navbar'

function Cart() {
  // const [count, setCount] = useState(0)
  return (
    <>
      <Navbar title={{ titles }} />
      <div>
        <h2>Cart Page</h2>
      </div>

      <Footer />
    </>
  )
}

export default Cart

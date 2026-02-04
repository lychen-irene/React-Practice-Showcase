import { Outlet, Link } from 'react-router'
import Navbar, { titles } from '../components/Navbar'
import Footer from '../components/Footer'

const FrontendLayout = function () {
  return (
    <>
      <Navbar title={{ titles }} />
      <Outlet />
      <Footer />
    </>
  )
}

export default FrontendLayout

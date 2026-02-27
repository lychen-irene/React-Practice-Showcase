import { Outlet, Link } from 'react-router'
import Navbar from '../components/Navbar'
import { titles } from '../components/navTitles'
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

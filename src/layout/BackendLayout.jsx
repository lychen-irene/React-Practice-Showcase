import { Outlet, Link } from 'react-router'
import Navbar from '../components/Navbar'
import { titles } from '../components/navTitles'
import Footer from '../components/Footer'

const BackendLayout = function () {
  return (
    <>
      <Navbar title={{ titles }} />
      <Outlet />
      <Footer />
    </>
  )
}

export default BackendLayout

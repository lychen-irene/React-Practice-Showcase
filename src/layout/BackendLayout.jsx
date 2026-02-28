import { Outlet, Link } from 'react-router'
import { titles } from '../components/navTitles'
import Footer from '../components/Footer'
import BackendNavbar from '../components/BackendNavbar'

const BackendLayout = function () {
  return (
    <>
      <BackendNavbar title={{ titles }} />
      <Outlet />
      <Footer />
    </>
  )
}

export default BackendLayout

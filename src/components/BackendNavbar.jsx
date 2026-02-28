import { NavLink } from 'react-router'
import { titles } from './navTitles'

const BackendNavbar = () => {
  return (
    <>
      <nav className="navbar fixed-top navbar-expand-lg navbar-dark">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/">
            Liang's React Project Showcase
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse"
            id="navbarSupportedContent"
          >
            {/* Admin product and order */}
            <ul className="navbar-nav me-auto">
              {titles.filter(item => item.id >= 20 && item.id <= 90).map((item) => {
                return (
                  <li className="nav-item" key={item.id}>
                    <NavLink
                      className="nav-link"
                      to={item.url}
                    >
                      {item.title}
                    </NavLink>
                  </li>
                )
              })}

            </ul>
            {/* Logout */}
            <ul className="navbar-nav ms-auto">

              {titles.filter(item => item.title === 'Logout').map((item) => {
                return (
                  <li className="nav-item" key={item.id}>
                    <NavLink
                      className="nav-link"
                      to={item.url}
                    >
                      {item.title}
                    </NavLink>
                  </li>
                )
              })}

            </ul>
          </div>
        </div>
      </nav>
    </>
  )
}

export default BackendNavbar

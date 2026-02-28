import { NavLink } from 'react-router'
import { titles } from './navTitles'

const Navbar = () => {
  return (
    <>
      <nav className="navbar fixed-top navbar-expand-lg navbar-dark">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/">
            Liang's React Project Showcase
          </NavLink>
          {/* toggle for RWD */}
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
            {/* navlink */}
            <ul className="navbar-nav me-auto">
              {titles.filter(item => item.id <= 4).map((item) => {
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

            {/* Project dropdown */}
            <ul className="navbar-nav ms-auto">
              {titles.filter(item => item.title === 'Login').map((item) => {
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
              <li className="nav-item dropdown" key={0}>
                <NavLink
                  className="nav-link dropdown-toggle"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Project
                </NavLink>
                <ul className="dropdown-menu dropdown-menu-end">
                  {titles.filter(item => item.id >= 11 && item.id <= 20).map((item) => {
                    return (
                      <li key={item.id}>
                        <NavLink
                          className="dropdown-item"
                          to={item.url}
                        >
                          {item.title}
                        </NavLink>
                      </li>
                    )
                  })}
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar

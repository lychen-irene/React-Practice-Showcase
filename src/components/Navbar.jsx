import { NavLink } from 'react-router'

// const basePath = import.meta.env.VITE_PROJECT_PATH || ''

// eslint-disable-next-line
export const titles = [
  { id: 1, title: 'About', url: '/about' },
  { id: 2, title: 'Product', url: '/product' },
  { id: 3, title: 'Cart', url: '/cart' },
  { id: 11, title: 'Project-1', url: '/projectOne' },
  { id: 12, title: 'Project-2', url: '/admin/projectTwo' },
  { id: 13, title: 'Project-3', url: '/admin/projectThird' },
  { id: 14, title: 'Project-4', url: '/admin/projectFourth' },
]

const Navbar = () => {
  return (
    <>
      <nav className="navbar fixed-top navbar-expand-lg navbar-dark">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/">
            Liang's React Project Showcase
          </NavLink>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto">
              {titles.map((item) => {
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

export default Navbar

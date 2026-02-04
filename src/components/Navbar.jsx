import { NavLink } from 'react-router'

// const basePath = import.meta.env.VITE_PROJECT_PATH || ''

// export const titles = [
//   { id: 1, title: 'About', url: `${basePath}/about` },
//   { id: 2, title: 'Project-1', url: `${basePath}/projectOne` },
//   { id: 3, title: 'Project-2', url: `${basePath}/projectTwo` },
//   { id: 4, title: 'Project-3', url: `${basePath}/projectThird` },
//   { id: 5, title: 'Project-4', url: `${basePath}/projectFourth` },
// ]
// eslint-disable-next-line
export const titles = [
  { id: 1, title: 'About', url: '/about' },
  { id: 2, title: 'Project-1', url: '/projectOne' },
  { id: 3, title: 'Project-2', url: '/projectTwo' },
  { id: 4, title: 'Project-3', url: '/projectThird' },
  { id: 5, title: 'Project-4', url: '/projectFourth' },
]

const Navbar = () => {
  return (
    <>
      <nav className="navbar fixed-top navbar-expand-sm navbar-dark">
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

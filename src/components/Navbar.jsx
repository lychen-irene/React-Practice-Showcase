const basePath = import.meta.env.VITE_PROJECT_PATH || ''
// eslint-disable-next-line
export const titles = [
  { id: 1, title: 'About', url: `${basePath}/` },
  { id: 2, title: 'Project-1', url: `${basePath}/projectOne.html` },
  { id: 3, title: 'Project-2', url: `${basePath}/` },
]

const Navbar = ({ children }) => {
  return (
    <>
      <nav className="navbar fixed-top navbar-expand-sm navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            Liang's React Project Showcase
          </a>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <ul className="navbar-nav">{children}</ul>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar

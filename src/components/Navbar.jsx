const basePath = import.meta.env.VITE_PROJECT_PATH || ''
// eslint-disable-next-line
export const titles = [
  { id: 1, title: 'About', url: `${basePath}/about.html` },
  { id: 2, title: 'Project-1', url: `${basePath}/projectOne.html` },
  { id: 3, title: 'Project-2', url: `${basePath}/projectTwo.html` },
  { id: 4, title: 'Project-3', url: `${basePath}/projectThree.html` },
]

const Navbar = ({ children }) => {
  return (
    <>
      <nav className="navbar fixed-top navbar-expand-sm navbar-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href={`${basePath}/`}>
            Liang's React Project Showcase
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto">{children}</ul>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar

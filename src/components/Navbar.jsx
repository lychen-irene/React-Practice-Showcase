const Navbar = ({ children }) => {
  return (
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
  )
}

export default Navbar

const basePath = import.meta.env.VITE_PROJECT_PATH || ''
// eslint-disable-next-line
export const titles = [
  { id: 1, title: 'About', url: `${basePath}/about.html` },
  { id: 2, title: 'Project-1', url: `${basePath}/projectOne.html` },
  { id: 3, title: 'Project-2', url: `${basePath}/projectTwo.html` },
  { id: 4, title: 'Project-3', url: `${basePath}/projectThree.html` },
  { id: 5, title: 'Project-4', url: `${basePath}/projectFourth.html` },
]

const Navbar = () => {
  const handleActive = function (item) {
    return (
      `${window.location.pathname === item.url ? 'nav-link active' : 'nav-link'}`
    )
  }

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
            <ul className="navbar-nav me-auto">
              {titles.map((item) => {
                return (
                  <li className="nav-item" key={item.id}>
                    {
                      item.title === 'About'
                        ? (
                            <a className={handleActive(item)} aria-current="page" href={item.url}>
                              {item.title}
                            </a>
                          )
                        : (
                            <a className={handleActive(item)} href={item.url}>
                              {item.title}
                            </a>
                          )
                    }

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

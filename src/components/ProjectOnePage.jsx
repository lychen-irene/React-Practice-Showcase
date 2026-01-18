// import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'

const basePath = import.meta.env.VITE_PROJECT_PATH || ''
const titles = [
  { id: 1, title: 'Home', url: `${basePath}/` },
  { id: 2, title: 'About', url: `${basePath}/` },
  { id: 3, title: 'Project-1', url: `${basePath}/projectOne.html` },
]

const ProjectOnePage = () => {
  return (
    <>
      <Navbar>
        {titles.map((item) => {
          return (
            <li className="nav-item" key={item.id}>
              <a className="nav-link " href={item.url}>{item.title}</a>
            </li>
          )
        })}
      </Navbar>
      <div className="container" style={{ paddingTop: '80px' }}>
        <h1>Project One</h1>
        <p>This is the page for Project One</p>
      </div>
    </>
  )
}

export default ProjectOnePage

// import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'

const titles = [
  { id: 1, title: 'Home', url: '/' },
  { id: 2, title: 'About', url: '/' },
  { id: 3, title: 'Project-1', url: '/projectOne.html' },
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

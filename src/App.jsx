// eslint-disable-next-line
import { useEffect, useState } from 'react'
// eslint-disable-next-line
import axios from 'axios'

import Navbar, { titles } from './components/Navbar'
import Footer from './components/Footer'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
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
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card-sample">
        <button className="btn btn-primary" onClick={() => setCount(count => count + 1)}>
          count is
          {' '}
          {count}
        </button>
        <p>
          Edit
          {' '}
          <code>src/App.jsx</code>
          {' '}
          and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      <Footer />
    </>
  )
}

export default App

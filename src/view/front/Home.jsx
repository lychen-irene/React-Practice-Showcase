import { useLocation } from 'react-router'

import 'bootstrap'

function Home() {
  const location = useLocation()
  console.log(location.state)

  return (
    <>
      <div>
        <h2>Home Page</h2>
        <p>{location.state?.message}</p>
      </div>
    </>
  )
}

export default Home

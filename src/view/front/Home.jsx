import { useLocation } from 'react-router'

import 'bootstrap'
import Navbar, { titles } from '../../components/Navbar'
import Footer from '../../components/Navbar'

function Home() {
  // const [count, setCount] = useState(0)
  const location = useLocation()
  console.log(location.state)

  return (
    <>
      <Navbar title={{ titles }} />
      <div>
        <h2>Home Page</h2>
        <p>{location.state?.message}</p>
      </div>
      <Footer />
    </>
  )
}

export default Home

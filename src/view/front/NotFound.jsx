import 'bootstrap'
import Navbar, { titles } from '../../components/Navbar'
import DefaultPage from '../../components/DefaultPage'
import Footer from '../../components/Footer'

function NotFound() {
  // const [count, setCount] = useState(0)
  return (
    <>
      <Navbar title={{ titles }} />
      <div>
        <h2>404 Not Found</h2>
      </div>
      <Footer />
    </>
  )
}

export default NotFound

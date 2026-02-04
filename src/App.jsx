import { Suspense } from 'react'
import { RouterProvider } from 'react-router'
import { router } from './router'

function App() {
  return (
    <Suspense fallback={<div>載入中...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  )
}

export default App
// import { useState } from 'react'

// import 'bootstrap'
// import Navbar, { titles } from './components/Navbar'
// import DefaultPage from './view/front/DefaultPage'
// import Footer from './components/Footer'

// function App() {
//   const [count, setCount] = useState(0)
//   return (
//     <>
//       <Navbar title={{ titles }} />
//       <DefaultPage count={count} setCount={setCount} />
//       <Footer />
//     </>
//   )
// }

// export default App

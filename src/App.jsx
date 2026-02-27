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

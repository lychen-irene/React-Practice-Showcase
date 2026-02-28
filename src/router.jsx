import { useState, useEffect } from 'react'
import { Navigate } from 'react-router'
import { lazy } from 'react'
import { createHashRouter } from 'react-router'

import axios from 'axios'
import { getToken } from './utils/auth'

import FrontendLayout from './layout/FrontendLayout'
import BackendLayout from './layout/BackendLayout'
import Home from './view/front/Home'
import About from './view/front/About'
import NotFound from './view/front/NotFound'
import AdminOrders from './view/back/AdminOrders'
import AdminHome from './view/back/AdminHome'
import Loading from './components/Loading'

const Product = lazy(() => import('./view/front/Product'))
const SingleProduct = lazy(() => import('./components/SingleProduct'))
const Cart = lazy(() => import('./view/front/Cart'))
const Checkout = lazy(() => import('./view/front/Checkout'))
const LoginPage = lazy(() => import('./view/front/LoginPage'))

const AdminProducts = lazy(() => import('./view/back/AdminProducts'))

const ProjectOnePage = lazy(() => import('./view/front/ProjectOnePage'))
const ProjectTwoPage = lazy(() => import('./view/back/ProjectTwoPage'))
const ProjectThirdPage = lazy(() => import('./view/back/ProjectThirdPage'))
const ProjectFourthPage = lazy(() => import('./view/back/ProjectFourthPage'))

// ProtectedRoute 就是一個普通元件
const ProtectedRoute = function ({ children }) {
  const [status, setStatus] = useState('checking') // 'checking' | 'auth' | 'unauth'
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
  useEffect(() => {
    const token = getToken()
    if (!token) {
      setStatus('unauth') // eslint-disable-line react-hooks/set-state-in-effect
      return
    }
    axios.defaults.headers.common['Authorization'] = token
    axios.post(`${apiBaseUrl}/api/user/check`)
      .then(() => setStatus('auth'))
      .catch(() => setStatus('unauth'))
  }, [apiBaseUrl])

  if (status === 'checking') return <Loading /> // 跳轉
  if (status === 'unauth') return <Navigate to="/login" replace />
  return children // 放行
}
export const router = createHashRouter([
  {
    path: '/',
    element: <FrontendLayout />,
    children: [
      {
        index: true, // 預設首頁
        element: <Home />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'product',
        element: <Product />,
      },
      {
        path: 'product/:id',
        element: <SingleProduct />,
      },
      {
        path: 'cart',
        element: <Cart />,
      },
      {
        path: 'checkout',
        element: <Checkout />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'projectOne',
        element: <ProjectOnePage />,
      },
    ],
  },
  {
    path: '/admin',
    element: <ProtectedRoute><BackendLayout /></ProtectedRoute>,
    children: [
      {
        index: true, // 預設首頁
        element: <AdminHome />,
      },
      {
        path: 'products',
        element: <AdminProducts />,
      },
      {
        path: 'orders',
        element: <AdminOrders />,
      },
      {
        path: 'projectTwo',
        element: <ProjectTwoPage />,
      },
      {
        path: 'projectThird',
        element: <ProjectThirdPage />,
      },
      {
        path: 'projectFourth',
        element: <ProjectFourthPage />,
      },
    ],
  },
  {
    path: '*', // 404 頁面
    element: <NotFound />,
  },
])

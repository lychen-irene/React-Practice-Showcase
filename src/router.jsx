import { lazy } from 'react'
import { createHashRouter } from 'react-router'

import FrontendLayout from './layout/FrontendLayout'
import BackendLayout from './layout/BackendLayout'
import Home from './view/front/Home'
import About from './view/front/About'
import NotFound from './view/front/NotFound'

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
    element: <BackendLayout />,
    children: [
      {
        path: 'products',
        element: <AdminProducts />,
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

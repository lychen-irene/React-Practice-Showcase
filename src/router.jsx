import { lazy } from 'react'
import { createHashRouter } from 'react-router'
import FrontendLayout from './layout/FrontendLayout'
import BackendLayout from './layout/BackendLayout'

const ProjectOnePage = lazy(() => import('./view/front/ProjectOnePage'))
const ProjectTwoPage = lazy(() => import('./view/back/ProjectTwoPage'))
const ProjectThirdPage = lazy(() => import('./view/back/ProjectThirdPage'))
const ProjectFourthPage = lazy(() => import('./view/back/ProjectFourthPage'))
import Home from './view/front/Home'
import About from './view/front/About'
import Product from './view/front/Product'
import SingleProduct from './components/SingleProduct'
import Cart from './view/front/Cart'
import NotFound from './view/front/NotFound'

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

import { lazy } from 'react'
import { createHashRouter } from 'react-router'
import FrontendLayout from './layout/FrontendLayout'

// const Home = lazy(() => import('./view/front/Home'))
// const About = lazy(() => import('./view/front/About'))
const ProjectOnePage = lazy(() => import('./view/front/ProjectOnePage'))
const ProjectTwoPage = lazy(() => import('./view/front/ProjectTwoPage'))
const ProjectThirdPage = lazy(() => import('./view/back/ProjectThirdPage'))
const ProjectFourthPage = lazy(() => import('./view/back/ProjectFourthPage'))
import Home from './view/front/Home'
import About from './view/front/About'
// import ProjectOnePage from './view/front/ProjectOnePage'
// import ProjectTwoPage from './view/front/ProjectTwoPage'
// import ProjectThirdPage from './view/back/ProjectThirdPage'
// import ProjectFourthPage from './view/back/ProjectFourthPage'

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
        path: 'projectOne',
        element: <ProjectOnePage />,
      },
      //   {
      //     path: 'product/:id', // 動態參數
      //     element: <SingleProduct />,
      //   },
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
//   {
//     path: '*', // 404 頁面
//     element: <NotFound />,
//   },
])

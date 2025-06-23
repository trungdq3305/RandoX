import Homepage from '../components/Home/HomePage'
import CustomerLayout from '../layout/CustomerLayout/CustomerLayout'
import LoginRegisterLayout from '../layout/LoginRegisterLayout'
import MainLayout from '../layout/MainLayout/MainLayout'
import Login from '../pages/Login/Login'
import ProductDetail from '../pages/ProductDetail/productDetail'
import RandomWheel from '../pages/RandomWheel/RandomWheel'
import SessionDetail from '../pages/SessionDetail/sessionDetail'
import type { LayoutRoute } from '../types/routes'

const routes: LayoutRoute[] = [
  {
    layout: LoginRegisterLayout,
    data: [
      {
        path: '/login',
        component: Login,
      },
      // {
      //   path: '/register',
      //   component: Register,
      // },
    ],
  },
  {
    layout: MainLayout,
    data: [
      {
        path: '/',
        component: Homepage,
        exact: true,
      },
    ],
  },
  {
    layout: CustomerLayout,
    data: [
      {
        path: '/products/:id',
        component: ProductDetail,
        exact: true,
      },
    ],
  },
  {
    layout: CustomerLayout,
    data: [
      {
        path: '/sessions/:id',
        component: SessionDetail,
        exact: true,
      },
    ],
  },
  {
    layout: CustomerLayout,
    data: [
      {
        path: '/RandomWheel',
        component: RandomWheel,
        exact: true,
      },
    ],
  },
]

export default routes

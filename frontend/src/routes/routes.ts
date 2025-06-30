import Homepage from '../components/Home/HomePage'
import AdminLayout from '../layout/AdminLayout/AdminLayout'

import CustomerLayout from '../layout/CustomerLayout/CustomerLayout'
import LoginRegisterLayout from '../layout/LoginRegisterLayout'
import MainLayout from '../layout/MainLayout/MainLayout'
import ManagerLayout from '../layout/ManagerLayout/ManagerLayout'
import AdminDashboard from '../pages/Admin/AdminDashboard'

import Login from '../pages/Login/Login'
import ProductDetail from '../pages/ProductDetail/productDetail'
import ManagerDashboard from '../pages/Manager/ManagerDashboard'


import RandomWheel from '../pages/RandomWheel/RandomWheel'
import SessionDetail from '../pages/SessionDetail/sessionDetail'
import type { LayoutRoute } from '../types/routes'
import DashboardPage from '../pages/Admin/DashboardPage'
import Cart from '../pages/Cart/cart'
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
        path: '/cart',
        component: Cart,
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
  {
    layout: AdminLayout,
    data: [
      {
        path: '/admin/dashboard',
        component: DashboardPage, // hoặc DashboardPage nếu có
        exact: true,
      },
      {
        path: '/admin/users',
        component: AdminDashboard,
        exact: true,
      },
    ],
  },
  {
    layout: ManagerLayout,
    data: [
      {
        path: '/manager/products',
        component: ManagerDashboard,
        exact: true,
      },
    ],
  },
]

export default routes

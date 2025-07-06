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

import ProductManager from '../components/Manager/ProductManager'
import RandomWheel from '../pages/RandomWheel/RandomWheel'
import SessionDetail from '../pages/SessionDetail/sessionDetail'
import type { LayoutRoute } from '../types/routes'
import DashboardPage from '../pages/Admin/DashboardPage'
import CategoryManager from '../components/Manager/CategoryManager'
import PromotionVoucherManager from '../components/Manager/PromotionVoucherManager'
import RevenueDashboard from '../pages/Admin/RevenueDashboard'
import AdminAccountManager from '../pages/Admin/AdminAccountManager'
import SpinWheelHistoryManager from '../pages/Manager/SpinWheelHistoryManager'
import AuctionCreatePage from '../pages/Auction/AuctionCreatePage';
import ShippingConfirmPage from '../pages/Auction/ShippingConfirmPage';
import ManagerApprovalPage from '../pages/Auction/ManagerApprovalPage';
import AdminShippingCompletePage from '../pages/Auction/AdminShippingCompletePage';
import ActiveSessionsPage from '../pages/Auction/ActiveSessionsPage'

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
      {
        path: '/sessions/:id',
        component: SessionDetail,
        exact: true,
      },
      {
      path: '/auction/create',
      component: AuctionCreatePage,
      exact: true,
      },
      {
        path: '/shipping/:sessionId',
        component: ShippingConfirmPage,
        exact: true,
      },
      {
        path: '/RandomWheel',
        component: RandomWheel,
        exact: true,
      },
      {
      path: '/sessions',
      component: ActiveSessionsPage,
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
    {
      path: '/admin/revenue',
      component: RevenueDashboard, // <-- thêm dòng này
      exact: true,
    },
    {
      path: '/admin/accounts',
      component: AdminAccountManager,
      exact: true,
    },

  ],
},
  {
    layout: ManagerLayout,
    data: [
      {
      path: '/manager/products',
      component: ProductManager, // sửa từ ManagerDashboard thành ProductManager
      exact: true,
    },
      {
        path: '/manager/categories',
        component: CategoryManager,
        exact: true,
      },
    {
      path: '/manager/promotions-vouchers',
      component: PromotionVoucherManager,
      exact: true,
    },
    
    {
      path: '/manager/spinwheel-history',
      component: SpinWheelHistoryManager,
      exact: true,
    },
    {
      path: '/manager/approval',
      component: ManagerApprovalPage,
      exact: true,
    },
    {
      path: '/manager/confirm-shipping',
      component: AdminShippingCompletePage,
      exact: true,
    },
    ],
  },
]

export default routes

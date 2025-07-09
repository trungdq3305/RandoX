import { Outlet } from 'react-router-dom'
import { Layout } from 'antd'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
const { Content } = Layout
import { useEffect } from 'react'
import Navbar from '../Navbar/Navbar'
import AppFooter from '../Footer/Footer'
import CustomHeader from '../Header/Header'
import './MainLayout.css'
function MainLayout() {
  const navigate = useNavigate()

  const userData = Cookies.get('userData')
    ? JSON.parse(Cookies.get('userData') as string)
    : null

  useEffect(() => {
    if (userData) {
      if (userData.Role === 'Customer') {
        if (!userData?.PhoneNumber || !userData?.Address) {
          navigate('/force-update')
        }
      }
    }
  }, [userData, navigate])

  return (
    <Layout className='main-layout'>
      <Navbar />
      <CustomHeader />
      <Content className='main-content'>
        <Outlet />
      </Content>
      <AppFooter />
    </Layout>
  )
}

export default MainLayout

import React, { useState } from 'react'
import {
  Input,
  Typography,
  Flex,
  Space,
  Divider,
  Spin,
  Drawer,
  Button,
} from 'antd'
import {
  SearchOutlined,
  ShoppingOutlined,
  UserOutlined,
  MenuOutlined,
  LoadingOutlined,
} from '@ant-design/icons'
import './Navbar.css'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import type { Wallet } from '../../types/wallet'
import { useGetWalletBalanceQuery } from '../../features/wallet/walletAPI'

const { Link, Text } = Typography

interface WalletBalanceResponse {
  data: {
    data: Wallet
  }
  isLoading: boolean
}

const Navbar: React.FC = () => {
  const navigate = useNavigate()
  const userData = Cookies.get('userData')
    ? JSON.parse(Cookies.get('userData') as string)
    : null

  const { data, isLoading } =
    useGetWalletBalanceQuery<WalletBalanceResponse>({})
  const balance = data?.data?.balance

  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    Cookies.remove('userData')
    Cookies.remove('userToken')
    navigate('/login')
  }

  // if (isLoading) {
  //   return (
  //     <div
  //       style={{
  //         display: 'flex',
  //         justifyContent: 'center',
  //         alignItems: 'center',
  //         height: '100vh',
  //       }}
  //     >
  //       <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
  //     </div>
  //   )
  // }

  const NavLinks = (
    <>
      <Link href='#' className='main-nav-link'>
        Blind box
      </Link>
      <Link href='/RandomWheel' className='main-nav-link'>
        Lucky Draws
      </Link>
      <Link href='/sessions' className='main-nav-link'>
        Autions
      </Link>
      <Link href='#' className='main-nav-link'>
        Livestream
      </Link>
    </>
  )

  const TopBarLinks = (
    <Space split={<Divider type='vertical' />}>
      {userData ? (
        <Link
          className='top-bar-link'
          onClick={handleLogout}
        >
          Logout
        </Link>
      ) : (
        <Link href='/login' className='top-bar-link'>
          Login
        </Link>
      )}
      <Link href='#' className='top-bar-link'>
        About
      </Link>
      <Link href='#' className='top-bar-link'>
        Contact
      </Link>
      <Link href='#' className='top-bar-link'>
        Support
      </Link>
      <Link href='#' className='top-bar-link'>
        Notification
      </Link>
    </Space>
  )

  return (
    <header className='navbar-container'>
      {/* === Top Bar === */}
      <div className='top-bar'>
        <Flex justify='space-between' align='center' wrap='wrap'>
          {/* Left Side */}
          <Space split={<Divider type='vertical' />}>
            <Link href='#' className='top-bar-link'>
              Seller Channel
            </Link>
            <Link href='#' className='top-bar-link'>
              Connect
            </Link>
          </Space>

          {/* Right Side */}
          <div className='top-bar-links'>
            {TopBarLinks}
          </div>
        </Flex>
      </div>

      {/* === Main Nav === */}
      <div className='main-nav'>
        <Flex justify='space-between' align='center' wrap='wrap'>
          {/* Left: Logo and desktop nav */}
          <Flex align='center' gap='large'>
            <Link href='/' className='logo-link'>
              <div className='logo-placeholder'>
                <img
                  src='/Logo.png'
                  alt='Logo'
                  className='logo-image'
                />
              </div>
            </Link>

            {/* Desktop Links */}
            <div className='desktop-nav-links'>
              <Space size='large'>{NavLinks}</Space>
            </div>
          </Flex>

          {/* Right: Search + icons */}
          <Flex align='center' gap='large'>
            <Input
              placeholder='Tìm kiếm'
              suffix={<SearchOutlined />}
              style={{ width: 250 }}
              className='nav-search'
            />
            <Space size='large' align='center'>
              <Link href='/cart' className='nav-icon-link'>
                <ShoppingOutlined className='nav-icon' />
              </Link>
              {userData && (
                <Flex align='center' gap={8}>
                  <UserOutlined className='nav-icon' />
                  <span style={{ fontWeight: 500 }}>
                    {balance?.toLocaleString()}₫
                  </span>
                </Flex>
              )}
              {/* Hamburger icon for mobile */}
              <Button
                type='text'
                icon={<MenuOutlined />}
                className='mobile-menu-button'
                onClick={() => setMobileOpen(true)}
              />
            </Space>
          </Flex>
        </Flex>
      </div>

      {/* Mobile Drawer */}
      <Drawer
        title={
          <Link href='/' className='logo-link'>
            <img
              src='/Logo.png'
              alt='Logo'
              className='logo-image'
              style={{ width: 100 }}
            />
          </Link>
        }
        placement='right'
        onClose={() => setMobileOpen(false)}
        open={mobileOpen}
      >
        <Space direction='vertical' size='middle' style={{ width: '100%' }}>
          {NavLinks}
          <Divider />
          {TopBarLinks}
          <Divider />
          <Input
            placeholder='Tìm kiếm'
            suffix={<SearchOutlined />}
            style={{ width: '100%' }}
          />
          <Link href='/cart' className='nav-icon-link'>
            <ShoppingOutlined className='nav-icon' />
          </Link>
          {userData && (
            <Flex align='center' gap={8}>
              <UserOutlined className='nav-icon' />
              {isLoading ? (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                  }}
                >
                  <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
                </div>) : (
                <Text strong>
                  {balance?.toLocaleString()}₫
                </Text>
              )}
            </Flex>
          )}
        </Space>
      </Drawer>
    </header>
  )
}

export default Navbar

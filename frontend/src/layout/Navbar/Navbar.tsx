import React from 'react'
import { Input, Typography, Flex, Space, Divider } from 'antd'
import {
  SearchOutlined,
  HeartOutlined,
  ShoppingOutlined,
} from '@ant-design/icons'
import './Navbar.css' // File CSS để tùy chỉnh thêm

const { Link } = Typography

const Navbar: React.FC = () => {
  return (
    <header className='navbar-container'>
      {/* ===== Thanh thông tin phụ ở trên ===== */}
      <div className='top-bar'>
        <Flex justify='space-between' align='center'>
          {/* Top-bar bên trái */}
          <Space split={<Divider type='vertical' />}>
            <Link href='#' className='top-bar-link'>
              Seller Channel 
            </Link>
            <Link href='#' className='top-bar-link'>
              Connect
            </Link>
          </Space>

          {/* Top-bar bên phải */}
          <Space split={<Divider type='vertical' />}>
            <Link href='/login' className='top-bar-link'>
              Login
            </Link>
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
        </Flex>
      </div>

      {/* ===== Thanh điều hướng chính ===== */}
      <div className='main-nav'>
        <Flex justify='space-between' align='center'>
          {/* Phần bên trái: Logo và Menu */}
          <Flex align='center' gap='large'>
            <Link href='/' className='logo-link'>
              <div className='logo-placeholder'>
                {/* ---------> Chèn component Logo của bạn vào đây <--------- */}
                <img
                  src='/Logo.png'
                  alt='Logo'
                  className='logo-image'
                  style={{ width: '150px' }}
                />
              </div>
            </Link>
            <Space size='large'>
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
            </Space>
          </Flex>

          {/* Phần bên phải: Tìm kiếm và Icons */}
          <Flex align='center' gap='large'>
            <Input
              placeholder='Tìm kiếm'
              suffix={<SearchOutlined />}
              style={{ width: 250 }}
            />
            <Space size='large'>
              <HeartOutlined className='nav-icon' />
              <Link href='/cart' className='nav-icon-link'>
                <ShoppingOutlined className='nav-icon' />
              </Link>
            </Space>
          </Flex>
        </Flex>
      </div>
    </header>
  )
}

export default Navbar

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
              Kênh người bán
            </Link>
            <Link href='#' className='top-bar-link'>
              Kết nối
            </Link>
          </Space>

          {/* Top-bar bên phải */}
          <Space split={<Divider type='vertical' />}>
            <Link href='/login' className='top-bar-link'>
              Đăng nhập
            </Link>
            <Link href='#' className='top-bar-link'>
              Giới thiệu
            </Link>
            <Link href='#' className='top-bar-link'>
              Liên hệ
            </Link>
            <Link href='#' className='top-bar-link'>
              Hỗ trợ
            </Link>
            <Link href='#' className='top-bar-link'>
              Thông báo
            </Link>
          </Space>
        </Flex>
      </div>

      {/* ===== Thanh điều hướng chính ===== */}
      <div className='main-nav'>
        <Flex justify='space-between' align='center'>
          {/* Phần bên trái: Logo và Menu */}
          <Flex align='center' gap='large'>
            <div className='logo-placeholder'>
              {/* ---------> Chèn component Logo của bạn vào đây <--------- */}
              <img
                src='/Logo.png'
                alt='Logo'
                className='logo-image'
                style={{ width: '150px' }}
              />
            </div>
            <Space size='large'>
              <Link href='/blind-box' className='main-nav-link'>
                Blind box
              </Link>
              <Link href='#' className='main-nav-link'>
                Vòng quay may mắn 
              </Link>
              <Link href='#' className='main-nav-link'>
                Đấu giá
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
              <ShoppingOutlined className='nav-icon' />
            </Space>
          </Flex>
        </Flex>
      </div>
    </header>
  )
}

export default Navbar

// src/components/SideFilters.tsx
import React from 'react'
import { Menu, Button, Typography, Space } from 'antd'

const { Title } = Typography

const SideFilters: React.FC = () => {
  // Dữ liệu mẫu cho các bộ lọc
  const categories = [
    'All products',
    'Blind box series',
    'Baby Three',
    'Smiski',
    'Display Box',
  ]
  const locations = [
    'TP. Hồ Chí Minh',
    'TP. Đà Nẵng',
    'Hà Nội',
    'Bình Dương',
    'Vũng Tàu',
  ]
  const conditions = ['Mới', 'Đã sử dụng']

  return (
    <div style={{ padding: '20px 10px' }}>
      <Space direction='vertical' size='large' style={{ width: '100%' }}>
        <div>
          <Title level={5}>Theo danh mục</Title>
          <Menu mode='inline' defaultSelectedKeys={['0']}>
            {categories.map((cat, index) => (
              <Menu.Item key={index.toString()}>{cat}</Menu.Item>
            ))}
          </Menu>
        </div>

        <div>
          <Title level={5}>Nơi bán</Title>
          <Menu mode='inline'>
            {locations.map((loc, index) => (
              <Menu.Item key={index.toString()}>{loc}</Menu.Item>
            ))}
          </Menu>
        </div>

        <div>
          <Title level={5}>Tình trạng</Title>
          <Menu mode='inline'>
            {conditions.map((con, index) => (
              <Menu.Item key={index.toString()}>{con}</Menu.Item>
            ))}
          </Menu>
        </div>

        <Button type='primary' danger block>
          Xoá tất cả
        </Button>
      </Space>
    </div>
  )
}

export default SideFilters

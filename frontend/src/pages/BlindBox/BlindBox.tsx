// src/pages/BlindBox.tsx
import React from 'react'
import { Layout } from 'antd'
import SideFilters from '../../components/BlindBox/SideFilter'
import ProductDisplay from '../../components/BlindBox/ProductDisplay'
// 1. Import hình ảnh từ thư mục assets
import image1 from '../../assets/image1.png'
import image2 from '../../assets/image2.png'
import image3 from '../../assets/image3.png'
const { Sider, Content } = Layout

// Định nghĩa kiểu dữ liệu cho sản phẩm
interface Product {
  id: number
  name: string
  price: number
  image: string
}

// Dữ liệu sản phẩm mẫu
const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Baby Three Lucky Bag Plush Blindbox',
    price: 280000,
    image: image1,
  },
  {
    id: 2,
    name: 'Baby Three Tết - New Year Plush Blindbox',
    price: 280000,
    image: image2,
  },
  {
    id: 3,
    name: 'Baby Three Macaron Little Rabbit 2 Macaron Version 2',
    price: 280000,
    image: image3,
  },
  {
    id: 4,
    name: 'Baby Three Lucky Bag Plush Blindbox',
    price: 280000,
    image: image1,
  },
  {
    id: 5,
    name: 'Baby Three Tết - New Year Plush Blindbox',
    price: 280000,
    image: image2,
  },
  {
    id: 6,
    name: 'Baby Three Macaron Little Rabbit 2 Macaron Version 2',
    price: 280000,
    image: image3,
  },
  {
    id: 7,
    name: 'Baby Three Lucky Bag Plush Blindbox',
    price: 280000,
    image: image1,
  },
  {
    id: 8,
    name: 'Baby Three Tết - New Year Plush Blindbox',
    price: 280000,
    image: image2,
  },
  {
    id: 9,
    name: 'Baby Three Macaron Little Rabbit 2 Macaron Version 2',
    price: 280000,
    image: image3,
  },
]

const BlindBox: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Sider width={250} style={{ background: '#fff' }}>
        <SideFilters />
      </Sider>
      <Layout>
        <Content>
          <ProductDisplay products={mockProducts} />
        </Content>
      </Layout>
    </Layout>
  )
}

export default BlindBox

// src/components/ProductCard.tsx
import React from 'react'
import { Card, Button, Typography } from 'antd'
import { HeartOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Meta } = Card
const { Text } = Typography

// Định nghĩa kiểu dữ liệu cho một sản phẩm
interface Product {
  id: number
  name: string
  price: number
  image: string
}

// Định nghĩa props cho component ProductCard
interface ProductCardProps {
  product: Product
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate()
  // Định dạng giá tiền sang kiểu Việt Nam Đồng
  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(product.price)

  return (
    <Card
      hoverable
      cover={
        <img
          alt={product.name}
          src={product.image}
          style={{
            width: '400px',
            objectFit: 'cover',
          }}
        />
      }
      actions={[
        <Button type='primary' key='buy' block style={{ margin: '0 8px' }}>
          Mua ngay
        </Button>,
        <HeartOutlined key='favorite' style={{ fontSize: '20px' }} />,
      ]}
      style={{
        width: '400px',
        margin: '16px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
      onClick={() => navigate(`/blind-box/${product.id}`)}
    >
      <Meta
        title={product.name}
        description={
          <Text strong style={{ color: '#d0021b', fontSize: '16px' }}>
            {formattedPrice}
          </Text>
        }
      />
    </Card>
  )
}

export default ProductCard

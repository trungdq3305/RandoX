// src/components/ProductDisplay.tsx
import React from 'react'
import { Input, List, Pagination, Row, Col } from 'antd'
import ProductCard from './ProductCard'
const { Search } = Input

// Định nghĩa kiểu dữ liệu cho sản phẩm
interface Product {
  id: number
  name: string
  price: number
  image: string
}

// Định nghĩa props cho component ProductDisplay
interface ProductDisplayProps {
  products: Product[]
}

const ProductDisplay: React.FC<ProductDisplayProps> = ({ products }) => {
  return (
    <div style={{ padding: '20px' }}>
      <Row
        justify='space-between'
        align='middle'
        style={{ marginBottom: '24px' }}
      >
        <Col span={24}>
          <Search
            placeholder='Tìm kiếm'
            allowClear
            onSearch={(value) => console.log(value)}
            className='custom-search'
          />
        </Col>
      </Row>

      <List
        grid={{
          gutter: 24,
          xs: 1,
          sm: 2,
          md: 2,
          lg: 3,
          xl: 3,
          xxl: 3,
        }}
        dataSource={products}
        renderItem={(product) => (
          <List.Item key={product.id}>
            <ProductCard product={product} />
          </List.Item>
        )}
      />

      <Row justify='end' style={{ marginTop: '24px' }}>
        <Pagination defaultCurrent={1} total={50} />
      </Row>
    </div>
  )
}

export default ProductDisplay

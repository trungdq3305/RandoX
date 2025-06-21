// src/pages/BlindBoxDetailPage.tsx
import React, { useState } from 'react'
import {
  Layout,
  Row,
  Col,
  Image,
  Typography,
  Button,
  InputNumber,
  Divider,
  Space,
  Tag,
  List,
} from 'antd'
// import { HeartOutlined } from '@ant-design/icons'
import ProductCard from '../../components/BlindBox/ProductCard'
import image1 from '../../assets/image1.png'
import image2 from '../../assets/image2.png'
import image3 from '../../assets/image3.png'
const { Content } = Layout
const { Title, Text, Paragraph } = Typography

// --- Định nghĩa kiểu dữ liệu ---
interface ProductDimension {
  width: string
  height: string
  depth: string
}

interface ProductDetail {
  id: number
  name: string
  brand: string
  status: string
  images: string[]
  colors: string[]
  price: number
  description: string
  year: number
  dimensions: ProductDimension
}

interface Product {
  id: number
  name: string
  price: number
  image: string
}

// --- Dữ liệu mẫu ---
const mainProduct: ProductDetail = {
  id: 101,
  name: 'Baby Three Lucky Bag Plush BlindBox',
  brand: 'Baby Three',
  status: 'Còn hàng',
  images: [
    image2, // Ảnh chính
    image1,
    image3,
  ],
  colors: ['#3B82F6', '#F59E0B', '#10B981', '#EF4444'],
  price: 280000,
  description:
    'Giới thiệu về blind box là đây là blindbox (hộp mù) ngẫu nhiên người mua sẽ không xác định được bên trong là gì nhưng khi mua nhiều sản phẩm trên cùng 1 đơn hàng thì sẽ không bị trùng mẫu, có tỷ lệ nhỏ ra SECRET.',
  year: 2024,
  dimensions: {
    width: '20cm',
    height: '5cm',
    depth: '10cm',
  },
}

const relatedProducts: Product[] = [
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
    image: image1,
  },
  {
    id: 3,
    name: 'Baby Three Macaron Little Rabbit',
    price: 280000,
    image: image1,
  },
  {
    id: 4,
    name: 'Baby Three Macaron Little Rabbit',
    price: 280000,
    image: image1,
  },
]

// --- Component Trang Chi Tiết Sản Phẩm ---
const BlindBoxDetailPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState(mainProduct.images[0])
  const [selectedColor, setSelectedColor] = useState(mainProduct.colors[0])
  const [quantity, setQuantity] = useState(1)

  return (
    <Layout>
      <Content style={{ padding: '24px', background: '#fff' }}>
        <Row gutter={[32, 32]}>
          {/* CỘT BÊN TRÁI: THƯ VIỆN ẢNH */}
          <Col xs={24} md={10}>
            <Image
              width='100%'
              src={selectedImage}
              preview={{ src: selectedImage }}
            />
            <List
              grid={{ gutter: 8, column: 5 }}
              dataSource={mainProduct.images}
              renderItem={(image) => (
                <List.Item>
                  <Image
                    src={image}
                    preview={false}
                    onClick={() => setSelectedImage(image)}
                    style={{
                      cursor: 'pointer',
                      border:
                        selectedImage === image
                          ? '2px solid #1890ff'
                          : '2px solid transparent',
                      borderRadius: '4px',
                    }}
                  />
                </List.Item>
              )}
            />
          </Col>

          {/* CỘT BÊN PHẢI: THÔNG TIN SẢN PHẨM VÀ HÀNH ĐỘNG */}
          <Col xs={24} md={14}>
            <Space direction='vertical' size='middle' style={{ width: '100%' }}>
              <Title level={2}>{mainProduct.name}</Title>

              <Row justify='space-between'>
                <Text>
                  Thương hiệu: <Text strong>{mainProduct.brand}</Text>
                </Text>
                <Text>
                  Tình trạng: <Tag color='green'>{mainProduct.status}</Tag>
                </Text>
              </Row>

              <div>
                <Text>Màu sắc:</Text>
                <Space wrap style={{ marginTop: 8 }}>
                  {mainProduct.colors.map((color) => (
                    <div
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      style={{
                        width: 32,
                        height: 32,
                        backgroundColor: color,
                        borderRadius: '50%',
                        cursor: 'pointer',
                        border:
                          selectedColor === color
                            ? '3px solid #1890ff'
                            : '3px solid #d9d9d9',
                        padding: 2,
                      }}
                    />
                  ))}
                </Space>
              </div>

              <div>
                <Text>Số lượng:</Text>
                <InputNumber
                  min={1}
                  max={99}
                  defaultValue={1}
                  onChange={(value) => setQuantity(value || 1)}
                  style={{ marginLeft: 16 }}
                />
              </div>

              <Divider />

              <Text
                style={{ fontSize: 28, fontWeight: 'bold', color: '#d0021b' }}
              >
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(mainProduct.price)}
              </Text>

              <Space direction='vertical' style={{ width: '100%' }}>
                <Button type='primary' size='large' block>
                  Mua ngay
                </Button>
                <Button size='large' block>
                  Thêm vào giỏ hàng
                </Button>
              </Space>
            </Space>
          </Col>
        </Row>

        <Divider />

        {/* PHẦN CHI TIẾT SẢN PHẨM */}
        <div style={{ marginTop: 32 }}>
          <Title level={3}>Chi tiết</Title>
          <Title level={5}>Mô tả</Title>
          <Paragraph>{mainProduct.description}</Paragraph>

          <Title level={5}>Năm</Title>
          <Text>{mainProduct.year}</Text>

          <Title level={5} style={{ marginTop: 16 }}>
            Kích thước
          </Title>
          <Text>Chiều cao: {mainProduct.dimensions.height}</Text>
          <br />
          <Text>Chiều rộng: {mainProduct.dimensions.width}</Text>
          <br />
          <Text>Chiều dài: {mainProduct.dimensions.depth}</Text>
        </div>

        <Divider />

        {/* PHẦN SẢN PHẨM TƯƠNG TỰ */}
        <div style={{ marginTop: 32 }}>
          <Title level={3}>Có thể bạn sẽ thích</Title>
          <List
            grid={{ gutter: 16, xs: 2, sm: 2, md: 4, lg: 4, xl: 4, xxl: 4 }}
            dataSource={relatedProducts}
            renderItem={(product) => (
              <List.Item>
                <ProductCard product={product} />
              </List.Item>
            )}
          />
        </div>
      </Content>
    </Layout>
  )
}

export default BlindBoxDetailPage

import React from 'react'
import { Layout, Row, Col, Typography } from 'antd'

const { Footer } = Layout
const { Title, Text } = Typography

const AppFooter: React.FC = () => {
  return (
    <Footer
      style={{
        background: 'linear-gradient(to bottom, #1e90ff, #2596be)',
        color: 'white',
        padding: '50px 80px',
      }}
    >
      <Row justify='space-between' gutter={[32, 32]}>
        {/* Cột 1: Logo + liên hệ */}
        <Col xs={24} md={6}>
          <img src='/Logo.png' alt='RandoX' height={50} />
          <div style={{ marginTop: 16 }}>
            <p style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ color: 'red', marginRight: 8 }}>📞</span>
              <Text style={{ color: 'white' }}>xxxxxxxxxx</Text>
            </p>
            <p style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: 8 }}>📧</span>
              <Text style={{ color: 'white' }}>RandoX@gmail.com</Text>
            </p>
          </div>
        </Col>

        {/* Cột 2: Chính sách */}
        <Col xs={24} md={6}>
          <Title level={4} style={{ color: 'white' }}>
            Chính sách
          </Title>
          <ul style={{ listStyle: 'none', padding: 0, color: 'white' }}>
            <li>Chính sách bảo mật</li>
            <li>Chính sách vận chuyển</li>
            <li>Chính sách đổi trả</li>
          </ul>
        </Col>

        {/* Cột 3: Quy chế */}
        <Col xs={24} md={6}>
          <Title level={4} style={{ color: 'white' }}>
            Quy chế hoạt động
          </Title>
          <ul style={{ listStyle: 'none', padding: 0, color: 'white' }}>
            <li>Hướng dẫn giao hàng</li>
            <li>Hướng dẫn thanh toán</li>
            <li>Hướng dẫn đấu giá</li>
            <li>Điều khoản dịch vụ</li>
          </ul>
        </Col>

        {/* Cột 4: Thanh toán + vận chuyển */}
        <Col xs={24} md={6}>
          <Title level={4} style={{ color: 'white' }}>
            Thanh toán
          </Title>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <img src='/src/assets/vnpay.jpg' alt='vnpay' height={30} />
            <img src='/src/assets/cash.jpg' alt='cash' height={30} />
          </div>
          <Title level={4} style={{ color: 'white', marginTop: 20 }}>
            Đơn vị vận chuyển
          </Title>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <img src='/src/assets/spx.png' alt='spx' height={30} />
            <img src='/src/assets/jt.png' alt='jt' height={30} />
            <img src='/src/assets/viettel.jpg' alt='viettel' height={30} />
          </div>
        </Col>
      </Row>
    </Footer>
  )
}

export default AppFooter

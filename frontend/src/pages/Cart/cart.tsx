import React from 'react'
import { Layout } from 'antd'
import CartPage from '../../components/Cart/cartComponent'

const { Content } = Layout

const Cart: React.FC = () => {
  return (
    <Layout>
      <Content>
        <CartPage />
      </Content>
    </Layout>
  )
}

export default Cart

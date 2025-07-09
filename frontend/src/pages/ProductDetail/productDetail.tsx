import { Layout } from 'antd'
import React from 'react'
import DetailProduct from '../../components/productDetail/detailProduct'
const { Content } = Layout
const ProductDetail: React.FC = () => {
  return (
    <Layout>
      <Content>
        <DetailProduct />
      </Content>
    </Layout>
  )
}

export default ProductDetail

import { Layout } from 'antd'
import React from 'react'
import SetDetail from '../../components/productSetDetail/setDetail'
const { Content } = Layout
const ProductSetDetail: React.FC = () => {
  return (
    <Layout>
      <Content>
        <SetDetail />
      </Content>
    </Layout>
  )
}

export default ProductSetDetail

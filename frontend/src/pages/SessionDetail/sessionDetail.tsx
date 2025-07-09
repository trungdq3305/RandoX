import { Layout } from 'antd'
import React from 'react'
import DetailSession from '../../components/DetailSession/auctionDetail'
const { Content } = Layout
const SessionDetail: React.FC = () => {
  return (
    <Layout>
      <Content>
        <DetailSession />
      </Content>
    </Layout>
  )
}

export default SessionDetail

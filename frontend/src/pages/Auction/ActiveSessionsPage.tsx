import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetActiveSessionsQuery } from '../../features/auction/auctionAPI'
import {
  Card,
  Col,
  Row,
  Typography,
  Spin,
  Button,
  Empty,
  Tag,
  Tooltip,
  Space,
  Flex,
} from 'antd'
import './ActiveSessionsPage.css'

const { Title, Text } = Typography

const ActiveSessionsPage: React.FC = () => {
  const { data: sessions = [], isLoading } = useGetActiveSessionsQuery()
  const navigate = useNavigate()

  return (
    <div className='active-sessions-container'>
      <Title level={2} className='page-title'>
        Active Auction Sessions
      </Title>

      <Flex align='center' justify='space-between' className='header-actions'>
        <Space>
          <a href='/auction/create' className='create-auction-btn'>
            + Create Auction Item
          </a>
        </Space>
      </Flex>

      {isLoading ? (
        <Spin tip='Loading auction sessions...' />
      ) : sessions.length === 0 ? (
        <Empty description='No active auctions found.' />
      ) : (
        <Row gutter={[24, 24]}>
          {sessions.map((session: any) => {
            const item = session.auctionItem
            const imageUrl =
              item?.imageUrl && item.imageUrl !== 'string'
                ? item.imageUrl
                : '/no-image.png'

            return (
              <Col xs={24} sm={12} md={8} lg={6} key={session.id}>
                <Card
                  hoverable
                  bordered={false}
                  className='auction-card'
                  cover={
                    <img
                      alt={item?.name || 'Unnamed item'}
                      src={imageUrl}
                      className='card-image'
                    />
                  }
                  bodyStyle={{ padding: 16 }}
                >
                  <Title level={4} ellipsis className='card-title'>
                    {item?.name !== 'string' ? item?.name : 'Unnamed item'}
                  </Title>

                  <Text>
                    Starting Price:{' '}
                    <strong className='price-start'>
                      {item?.startPrice?.toLocaleString('vi-VN')}₫
                    </strong>
                  </Text>
                  <br />
                  <Text>
                    Reserve Price:{' '}
                    <strong className='price-reserve'>
                      {item?.reservePrice?.toLocaleString('vi-VN')}₫
                    </strong>
                  </Text>
                  <br />

                  <Tooltip title='Auction ends at'>
                    <Tag className='tag-endtime'>
                      ⏰ {new Date(session.endTime).toLocaleString('vi-VN')}
                    </Tag>
                  </Tooltip>

                  <Button
                    block
                    className='join-btn'
                    onClick={() => navigate(`/sessions/${session.id}`)}
                  >
                    Join Auction
                  </Button>
                </Card>
              </Col>
            )
          })}
        </Row>
      )}
    </div>
  )
}

export default ActiveSessionsPage

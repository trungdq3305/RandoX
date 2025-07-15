import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  useGetSessionDetailQuery,
  usePlaceBidMutation,
} from '../../features/auction/auctionAPI'
import {
  notification,
  Button,
  Form,
  InputNumber,
  Statistic,
  List,
  Avatar,
  Divider,
  Typography,
  Card,
  Space,
  Tag,
} from 'antd'
import {
  connectToAuctionHub,
  disconnectFromAuctionHub,
} from '../../realtime/auctionHub'
import {
  ClockCircleOutlined,
  TrophyOutlined,
  DollarOutlined,
} from '@ant-design/icons'
import './DetailSession.css'

const { Countdown } = Statistic
const { Text, Title } = Typography

interface Bid {
  id: string
  amount: number
  createdAt: string
  userId: string
  user?: {
    email: string
  }
}

const DetailSession: React.FC = () => {
  const { id: sessionId } = useParams<{ id: string }>()
  const { data, isLoading, error, refetch } = useGetSessionDetailQuery(
    sessionId!
  )

  const [placeBid] = usePlaceBidMutation()
  const [api, contextHolder] = notification.useNotification()
  const [isExpired, setIsExpired] = useState(false)
  const [endTime, setEndTime] = useState<number | null>(null)

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(5) // You can change this to control how many bids per page

  // Form state
  const [form] = Form.useForm()

  useEffect(() => {
    if (data?.session?.endTime) {
      setEndTime(new Date(data.session.endTime).getTime())
    }
  }, [data])

  // ✅ Kết nối SignalR
  useEffect(() => {
    if (!sessionId || sessionId === 'undefined') return

    connectToAuctionHub(
      sessionId,
      (newEndTime) => {
        const extended = new Date(newEndTime).getTime()
        setEndTime(extended)
        api.info({
          message: 'Gia hạn phiên thêm 5 phút',
        })
      },
      (error: any) => {
        api.error({
          message: 'Lỗi kết nối phiên đấu giá',
          description: error?.message || 'Đã xảy ra lỗi khi kết nối.',
        })
      },
      () => { } // Add an empty callback or appropriate handler as the fourth argument
    )

    return () => {
      disconnectFromAuctionHub(sessionId)
    }
  }, [sessionId])

  const openNotification = (type: 'success' | 'error', message: string) => {
    api[type]({
      message: type === 'success' ? 'Thành công' : 'Lỗi',
      description: message,
      duration: 3,
      placement: 'topRight',
    })
  }

  const onFinish = async (values: any) => {
    try {
      await placeBid({
        sessionId: sessionId!,
        amount: values.bidPrice,
      }).unwrap()
      openNotification('success', 'Đặt giá thành công!')

      // Reset form fields after successful bid
      form.resetFields()

      refetch()
    } catch (err: any) {
      openNotification('error', err?.data || 'Đặt giá thất bại!')
    }
  }

  if (isLoading)
    return <div className='loading-container'>Đang tải phiên đấu giá...</div>
  if (error || !data?.session)
    return <div className='error-container'>Không tìm thấy phiên đấu giá.</div>

  const session = data.session
  const item = session.auctionItem
  const bids: Bid[] = (data.bids || [])
    .slice()
    .sort(
      (a: Bid, b: Bid) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

  const highestBid =
    bids.length > 0 ? Math.max(...bids.map((b) => b.amount)) : null
  const stepPrice = data?.session?.auctionItem?.stepPrice || null

  // Handle pagination
  const paginatedBids = bids.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <div className='auction-container'>
      {contextHolder}

      <div className='auction-header'>
        <Title level={1} className='auction-title'>
          {item?.name}
        </Title>
      </div>

      <div className='auction-content'>
        <div className='auction-main'>
          <Card className='item-card'>
            <div style={{ display: "flex" }}>
              <div className='item-image-container'>
                <img
                  src={item?.imageUrl || '/no-image.png'}
                  alt='Ảnh sản phẩm'
                  className='item-image'
                />
                <p><Text className='item-description'>{item?.description}</Text></p>
              </div>
              <div className='item-details'>
                <div className='price-info'>
                  <div className='price-item'>
                    <DollarOutlined className='price-icon' />
                    <span>
                      Giá khởi điểm:{' '}
                      <>{item?.startPrice?.toLocaleString()}đ</>
                    </span>
                  </div>
                  <div className='price-item'>
                    <TrophyOutlined className='price-icon' />
                    <span>
                      Giá chốt:{' '}
                      <>{item?.reservePrice?.toLocaleString()}đ</>
                    </span>
                  </div>
                  <div className='price-item'>
                    <span>
                      Bước nhảy:{' '}
                      <>{item?.stepPrice?.toLocaleString()}đ</>
                    </span>
                  </div>
                  <div className='countdown-section'>
                    <ClockCircleOutlined className='countdown-icon' />
                    <Text className='countdown-label'>Thời gian còn lại:</Text>
                    {endTime && !isExpired ? (
                      <Countdown
                        value={endTime}
                        format='HH:mm:ss'
                        onFinish={() => setIsExpired(true)}
                        className='countdown-timer'
                      />
                    ) : (
                      <Tag color='red' className='expired-tag'>
                        Phiên đấu giá đã kết thúc
                      </Tag>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
          <Card className='bid-form-card'>
            <Title level={3} className='bid-form-title'>
              Đặt giá ngay
            </Title>
            <Form
              name='bidForm'
              onFinish={onFinish}
              layout='vertical'
              className='bid-form'
              form={form}  // Thêm form vào đây để sử dụng resetFields
            >
              <Form.Item
                label='Giá đặt (VND)'
                name='bidPrice'
                rules={[
                  { required: true, message: 'Nhập giá đặt!' },
                  {
                    type: 'number',
                    min: (highestBid ?? 0) + (stepPrice ?? 0),
                    message: `Giá đặt phải lớn hơn hoặc bằng ${((highestBid ?? 0) + (stepPrice ?? 0)).toLocaleString()}đ`
                  }
                ]}
              >
                <InputNumber
                  min={item?.startPrice}
                  className='bid-input'
                  disabled={isExpired}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  parser={(value) => value!.replace(/(,*)/g, '')}
                  placeholder='Nhập số tiền'
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type='primary'
                  htmlType='submit'
                  disabled={isExpired}
                  className='bid-button'
                  size='large'
                >
                  Đặt giá ngay
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>

        <div className='auction-sidebar'>
          <Card className='bids-card'>
            <Title level={3} className='bids-title'>
              Lịch sử đặt giá
            </Title>
            <List
              itemLayout='horizontal'
              dataSource={paginatedBids}
              locale={{ emptyText: 'Chưa có lượt đặt giá nào.' }}
              className='bids-list'
              renderItem={(bid) => {
                const isHighest = bid.amount === highestBid
                return (
                  <List.Item
                    className={`bid-item ${isHighest ? 'highest-bid' : ''}`}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar className='bid-avatar'>
                          {bid.user?.email?.charAt(0).toUpperCase() || '?'}
                        </Avatar>
                      }
                      title={
                        <div className='bid-user'>
                          {bid.user?.email || 'Người dùng ẩn danh'}
                          {isHighest && (
                            <Tag color='gold' className='highest-tag'>
                              Giá cao nhất
                            </Tag>
                          )}
                        </div>
                      }
                      description={
                        <div className='bid-info'>
                          <div className='bid-amount'>
                            {bid.amount.toLocaleString()} đ
                          </div>
                          <div className='bid-time'>
                            {new Date(bid.createdAt).toLocaleString('vi-VN')}
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )
              }}
              pagination={{
                current: currentPage,
                pageSize,
                total: bids.length,
                onChange: (page) => setCurrentPage(page),
              }}
            />
          </Card>
        </div>
      </div>
    </div>
  )
}

export default DetailSession

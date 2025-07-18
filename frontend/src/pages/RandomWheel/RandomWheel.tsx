import React, { useState } from 'react'
import {
  useGetAllWheelsQuery,
  useGetWheelByIdQuery,
  useGetUserSpinHistoryQuery,
  useSpinWheelMutation,
} from '../../features/spinwheel/spinWheelAPI'
import { Modal, Button, Table, Spin, message } from 'antd'
import './RandomWheel.css'
import blindboxSpin from '../../assets/blindbox-spin.webp'
import freeSpin from '../../assets/free-spin.png'
import SpinAnimationModal from '../../components/SpinWheel/SpinAnimationModal'

interface SpinItem {
  rewardName: string
  rewardValue: number
  probability: number
  rewardType: string
}

interface SpinWheelDetail {
  id: string
  name: string
  price: number
  type: string
  items: SpinItem[]
}

const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? decodeURIComponent(match[2]) : null
}

export default function RandomWheel() {
  const token = getCookie('userToken')
  const { data: wheels, isLoading } = useGetAllWheelsQuery()
  const [selectedWheelId, setSelectedWheelId] = useState<string | null>(null)
  const [openModal, setOpenModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'wheel' | 'history'>('wheel')
  const [isSpinning, setIsSpinning] = useState(false)
  const [rewardResult, setRewardResult] = useState<any>(null)
  const [spinWheelAPI] = useSpinWheelMutation()

  const { data: wheelDetail, isFetching } = useGetWheelByIdQuery(
    selectedWheelId!,
    {
      skip: !selectedWheelId,
    }
  ) as { data: SpinWheelDetail | undefined; isFetching: boolean }

  const { data: spinHistory, isLoading: isLoadingHistory } =
    useGetUserSpinHistoryQuery(undefined, {
      skip: !token,
    })

  const handleDetailClick = (wheelId: string) => {
    setSelectedWheelId(wheelId)
    setOpenModal(true)
  }

  const hasSpunFreeToday = (wheel: any) => {
    if (!spinHistory) return false
    const today = new Date()
    return spinHistory.some((item) => {
      const spunDate = new Date(item.createdAt)
      return (
        item.wheelName === wheel.name &&
        item.pricePaid == 0 &&
        spunDate.getDate() === today.getDate() &&
        spunDate.getMonth() === today.getMonth() &&
        spunDate.getFullYear() === today.getFullYear()
      )
    })
  }

  const handleSpinClick = async (wheel: any) => {
    if (!token) {
      console.log(token)
      message.warning('Vui lòng đăng nhập để quay thưởng')
      return
    }

    if (wheel.price === 0 && hasSpunFreeToday(wheel)) {
      message.warning('Hôm nay bạn đã quay miễn phí rồi')
      return
    }

    try {
      setRewardResult(null)
      setIsSpinning(true)
      const response = await spinWheelAPI(wheel.id).unwrap()
      const reward = response?.data ?? response
      if (!reward?.rewardName) throw new Error('Không có phần thưởng trả về')
      setRewardResult(reward)
    } catch (error) {
      console.error('Spin error:', error)
      setIsSpinning(false)
      message.error('Quay không thành công')
    }
  }

  const handleChangeTab = (tab: 'wheel' | 'history') => {
    if (!token) {
      message.warning('Vui lòng đăng nhập để sử dụng tính năng này')
      return
    }
    setActiveTab(tab)
  }

  return (
    <div className='background'>
      <div className='random-wheel-container'>
        <div className='tab-header'>
          <span
            className={activeTab === 'wheel' ? 'active' : ''}
            onClick={() => setActiveTab('wheel')}
          >
            Wheel of fortune
          </span>
          <span
            className={activeTab === 'history' ? 'active' : ''}
            onClick={() => handleChangeTab('history')}
          >
            History of the draw
          </span>
        </div>

        {activeTab === 'wheel' && (
          <div className='wheel-content'>
            {isLoading ? (
              <Spin />
            ) : (
              wheels?.map((wheel) => {
                const alreadySpunToday = hasSpunFreeToday(wheel)
                return (
                  <div className='wheel-box' key={wheel.id}>
                    <div className='wheel-title'>
                      <strong>{wheel.name}</strong>
                    </div>
                    <button
                      className='detail-button'
                      onClick={() => handleDetailClick(wheel.id)}
                    >
                      Detail
                    </button>
                    <img
                      className='wheel-image'
                      src={wheel.type === 'product' ? blindboxSpin : freeSpin}
                      alt={wheel.name}
                    />
                    <button
                      className='random-button'
                      onClick={() => handleSpinClick(wheel)}
                    >
                      Draw now
                    </button>
                    {wheel.price !== 0 && (
                      <p
                        style={{
                          color: 'green',
                          fontWeight: 'bold',
                          marginTop: '5px',
                        }}
                      >
                        Price: {wheel.price.toLocaleString()} VNĐ
                      </p>
                    )}
                    {wheel.price === 0 && !alreadySpunToday && (
                      <p
                        style={{
                          color: 'green',
                          fontWeight: 'bold',
                          marginTop: '5px',
                        }}
                      >
                        Lượt quay miễn phí hôm nay còn 1
                      </p>
                    )}
                  </div>
                )
              })
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className='history-content'>
            <h3>Your Spin History</h3>
            {isLoadingHistory ? (
              <Spin />
            ) : (
              <Table
                dataSource={spinHistory ?? []}
                columns={[
                  { title: 'Wheel', dataIndex: 'wheelName', key: 'wheelName' },
                  {
                    title: 'Reward',
                    dataIndex: 'rewardName',
                    key: 'rewardName',
                  },
                  {
                    title: 'Reward Type',
                    dataIndex: 'rewardType',
                    key: 'rewardType',
                  },
                  {
                    title: 'Reward Value',
                    dataIndex: 'rewardValue',
                    key: 'rewardValue',
                    render: (val: number) => `${val.toLocaleString()} VNĐ`,
                  },
                  {
                    title: 'Price Paid',
                    dataIndex: 'pricePaid',
                    key: 'pricePaid',
                    render: (val: number) => `${val.toLocaleString()} VNĐ`,
                  },
                  {
                    title: 'Time',
                    dataIndex: 'createdAt',
                    key: 'createdAt',
                    render: (val: string) =>
                      new Date(val).toLocaleString('vi-VN', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      }),
                  },
                ]}
                rowKey={(record) =>
                  record.wheelName + record.rewardName + record.createdAt
                }
                pagination={{ pageSize: 5 }}
              />
            )}
          </div>
        )}
      </div>

      <Modal
        open={openModal}
        title='Wheel details'
        onCancel={() => setOpenModal(false)}
        footer={<Button onClick={() => setOpenModal(false)}>Close</Button>}
        width={700}
      >
        {isFetching || !wheelDetail ? (
          <Spin />
        ) : (
          <>
            <h3>{wheelDetail.name}</h3>
            <p>Draw price: {wheelDetail.price.toLocaleString()} VNĐ</p>
            <Table
              columns={[
                {
                  title: 'Reward name',
                  dataIndex: 'rewardName',
                  key: 'rewardName',
                },
                {
                  title: 'Price value (VNĐ)',
                  dataIndex: 'rewardValue',
                  key: 'rewardValue',
                },
                {
                  title: 'Ratio (%)',
                  dataIndex: 'probability',
                  key: 'probability',
                  render: (value: number) => `${(value * 100).toFixed(2)}%`,
                },
                { title: 'Type', dataIndex: 'rewardType', key: 'rewardType' },
              ]}
              dataSource={wheelDetail?.items ?? []}
              pagination={false}
              rowKey={(record) => record.rewardName + record.rewardValue}
            />
          </>
        )}
      </Modal>

      <SpinAnimationModal
        visible={!!rewardResult || isSpinning}
        reward={rewardResult}
        onFinish={() => {
          setIsSpinning(false)
          setRewardResult(null)
        }}
      />
    </div>
  )
}

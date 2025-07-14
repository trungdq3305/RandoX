// src/pages/Manager/SpinWheelHistoryManager.tsx
import React from 'react'
import { Table, Tag, Typography } from 'antd'
import { useGetSpinWheelHistoryQuery } from '../../features/spinwheel/spinWheelAPI'
import moment from 'moment'
import './ManagerDashboard.css'
const SpinWheelHistoryManager: React.FC = () => {
  const { data = [], isLoading } = useGetSpinWheelHistoryQuery()

  const columns = [
    {
      title: 'Wheel',
      dataIndex: 'wheelName',
      key: 'wheelName',
      align: 'center' as const,
    },
    {
      title: 'Reward',
      dataIndex: 'rewardName',
      key: 'rewardName',
      align: 'center' as const,
    },
    {
      title: 'Type',
      dataIndex: 'rewardType',
      key: 'rewardType',
      align: 'center' as const,
      render: (type: string) => {
        const color = type === 'product' ? 'blue' : 'green'
        return (
          <Tag color={color}>{type === 'product' ? 'Product' : 'Voucher'}</Tag>
        )
      },
    },
    {
      title: 'Value',
      dataIndex: 'rewardValue',
      key: 'rewardValue',
      align: 'center' as const,
      render: (value: number) => value?.toLocaleString() + ' VND',
    },
    {
      title: 'Spin Price',
      dataIndex: 'pricePaid',
      key: 'pricePaid',
      align: 'center' as const,
      render: (value: number) => value?.toLocaleString() + ' VND',
    },
    {
      title: 'User',
      dataIndex: 'userEmail',
      key: 'userEmail',
      align: 'center' as const,
    },
    {
      title: 'Time',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center' as const,
      render: (date: string) => moment(date).format('DD/MM/YYYY HH:mm'),
    },
  ]

  return (
    <div>
      <Typography.Title level={3}>📜 Spin Wheel History</Typography.Title>
      <Table
        dataSource={data}
        columns={columns}
        loading={isLoading}
        rowKey={(record) =>
          `${record.userEmail}-${record.rewardName}-${record.createdAt}`
        }
        pagination={{ pageSize: 10 }}
        className='container-table'
      />
    </div>
  )
}

export default SpinWheelHistoryManager

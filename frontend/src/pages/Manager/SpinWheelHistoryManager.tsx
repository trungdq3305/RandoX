// src/pages/Manager/SpinWheelHistoryManager.tsx
import React from 'react';
import { Table, Tag, Typography } from 'antd';
import { useGetSpinWheelHistoryQuery } from '../../features/spinwheel/spinWheelAPI';
import moment from 'moment';

const SpinWheelHistoryManager: React.FC = () => {
  const { data = [], isLoading } = useGetSpinWheelHistoryQuery();

  const columns = [
    {
      title: 'Vòng quay',
      dataIndex: 'wheelName',
      key: 'wheelName',
      align: 'center' as const,
    },
    {
      title: 'Phần thưởng',
      dataIndex: 'rewardName',
      key: 'rewardName',
      align: 'center' as const,
    },
    {
      title: 'Loại',
      dataIndex: 'rewardType',
      key: 'rewardType',
      align: 'center' as const,
      render: (type: string) => {
        const color = type === 'product' ? 'blue' : 'green';
        return <Tag color={color}>{type === 'product' ? 'Sản phẩm' : 'Voucher'}</Tag>;
      },
    },
    {
      title: 'Giá trị',
      dataIndex: 'rewardValue',
      key: 'rewardValue',
      align: 'center' as const,
      render: (value: number) => value?.toLocaleString() + ' đ',
    },
    {
      title: 'Giá quay',
      dataIndex: 'pricePaid',
      key: 'pricePaid',
      align: 'center' as const,
      render: (value: number) => value?.toLocaleString() + ' đ',
    },
    {
      title: 'Người dùng',
      dataIndex: 'userEmail',
      key: 'userEmail',
      align: 'center' as const,
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center' as const,
      render: (date: string) => moment(date).format('DD/MM/YYYY HH:mm'),
    },
  ];

  return (
    <div>
      <Typography.Title level={3}>📜 Lịch sử quay vòng</Typography.Title>
      <Table
        dataSource={data}
        columns={columns}
        loading={isLoading}
        rowKey={(record) =>
          `${record.userEmail}-${record.rewardName}-${record.createdAt}`
        }
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default SpinWheelHistoryManager;

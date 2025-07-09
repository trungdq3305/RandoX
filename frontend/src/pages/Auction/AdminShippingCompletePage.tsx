import React from 'react'
import {
  useGetWonAuctionsQuery,
  useGetShippingInfoQuery,
  useConfirmDeliveryCompleteMutation,
} from '../../features/auction/auctionAPI'
import { Table, Button, notification, Typography } from 'antd'

const { Paragraph } = Typography

const AdminShippingCompletePage: React.FC = () => {
  const { data: sessions = [], isLoading } = useGetWonAuctionsQuery()
  const [confirmDelivery] = useConfirmDeliveryCompleteMutation()

  const handleConfirm = async (sessionId: string) => {
    try {
      await confirmDelivery(sessionId).unwrap()
      notification.success({
        message: 'Delivery confirmed and payment sent to seller',
      })
    } catch {
      notification.error({ message: 'Confirmation failed' })
    }
  }

  return (
    <>
      <h2>Completed Auction Sessions Awaiting Delivery Confirmation</h2>
      <Table
        dataSource={sessions}
        loading={isLoading}
        rowKey='id'
        pagination={{ pageSize: 5 }}
        expandable={{
          expandedRowRender: (record) => <ShippingInfo sessionId={record.id} />,
        }}
      >
        <Table.Column title='Item Name' dataIndex={['auctionItem', 'name']} />
        <Table.Column title='Final Price' dataIndex='finalPrice' />
        <Table.Column
          title='Ended At'
          dataIndex='endTime'
          render={(text) => new Date(text).toLocaleString()}
        />
        <Table.Column
          title='Action'
          render={(_, record) => (
            <Button type='primary' onClick={() => handleConfirm(record.id)}>
              Confirm Delivery
            </Button>
          )}
        />
      </Table>
    </>
  )
}

// 👉 Sub-component to display shipping address
const ShippingInfo: React.FC<{ sessionId: string }> = ({ sessionId }) => {
  const { data, isLoading } = useGetShippingInfoQuery(sessionId)

  if (isLoading) return <p>Loading shipping info...</p>
  if (!data)
    return <p style={{ color: 'red' }}>❌ No confirmed address available</p>

  return (
    <div style={{ paddingLeft: 16 }}>
      <Paragraph strong>Shipping Address:</Paragraph>
      <Paragraph>{data.address}</Paragraph>
      <Paragraph italic>Recipient Email: {data.email}</Paragraph>
      <Paragraph>
        Confirmed At: {new Date(data.confirmedAt).toLocaleString()}
      </Paragraph>
    </div>
  )
}

export default AdminShippingCompletePage

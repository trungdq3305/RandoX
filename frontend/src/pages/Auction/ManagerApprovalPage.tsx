import React, { useState } from 'react'
import {
  useGetPendingItemsQuery,
  useApproveAuctionItemMutation,
  useRejectAuctionItemMutation,
} from '../../features/auction/auctionAPI'
import {
  Table,
  Button,
  Input,
  Modal,
  InputNumber,
  Space,
  notification,
  Typography,
  Popconfirm,
} from 'antd'

const { Paragraph } = Typography

const ManagerApprovalPage: React.FC = () => {
  const { data: items = [], isLoading, refetch } = useGetPendingItemsQuery()
  const [approveItem] = useApproveAuctionItemMutation()
  const [rejectItem] = useRejectAuctionItemMutation()
  const [rejectModal, setRejectModal] = useState<{
    itemId: string
    visible: boolean
  }>({ itemId: '', visible: false })
  const [rejectReason, setRejectReason] = useState('')
  const [durationMap, setDurationMap] = useState<Record<string, number>>({})

  const handleApprove = async (itemId: string) => {
    const duration = durationMap[itemId] || 10 // default 10 minutes
    try {
      await approveItem({ itemId, durationMinutes: duration }).unwrap()
      notification.success({ message: 'Item approved' })
      refetch()
    } catch {
      notification.error({ message: 'Approval failed' })
    }
  }

  const handleReject = async () => {
    try {
      await rejectItem({
        itemId: rejectModal.itemId,
        reason: rejectReason,
      }).unwrap()
      notification.success({ message: 'Item rejected' })
      setRejectModal({ itemId: '', visible: false })
      setRejectReason('')
      refetch()
    } catch (err: any) {
      console.error('Reject error:', err)
      notification.error({ message: 'Rejection failed' })
    }
  }

  return (
    <>
      <h2>Pending Auction Items</h2>
      <Table
        dataSource={items}
        loading={isLoading}
        rowKey='id'
        pagination={{ pageSize: 5 }}
      >
        <Table.Column title='Item Name' dataIndex='name' />
        <Table.Column
          title='Description'
          dataIndex='description'
          render={(text) => (
            <Paragraph ellipsis={{ rows: 2 }}>{text}</Paragraph>
          )}
        />
        <Table.Column
          title='Image'
          dataIndex='imageUrl'
          render={(url: string) => (
            <img src={url} alt='preview' style={{ width: 80 }} />
          )}
        />
        <Table.Column title='Starting Price' dataIndex='startPrice' />
        <Table.Column title='Reserve Price' dataIndex='reservePrice' />
        <Table.Column title='Step Price' dataIndex='stepPrice' />
        <Table.Column
          title='Auction Duration (minutes)'
          render={(_, record: any) => (
            <InputNumber
              min={5}
              defaultValue={10}
              onChange={(val) =>
                setDurationMap((prev) => ({ ...prev, [record.id]: val || 10 }))
              }
            />
          )}
        />
        <Table.Column
          title="Actions"
          render={(_, record: any) => (
            <Space>
              <Popconfirm
                title="Are you sure to approve this task?"
                onConfirm={() => handleApprove(record.id)}
                okText="Confirm"
                cancelText="Cancel"
              >
                <Button>Approve</Button>
              </Popconfirm>

              <Button
                danger
                onClick={() =>
                  setRejectModal({ itemId: record.id, visible: true })
                }
              >
                Reject
              </Button>
            </Space>
          )}
        />

      </Table>

      <Modal
        title='Reason for Rejection'
        open={rejectModal.visible}
        onCancel={() => setRejectModal({ itemId: '', visible: false })}
        onOk={handleReject}
        okText='Confirm'
      >
        <Input.TextArea
          rows={4}
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder='Enter reason for rejection'
        />
      </Modal>
    </>
  )
}

export default ManagerApprovalPage

// src/components/Manager/PromotionVoucherManager.tsx
import React, { useState } from 'react'
import {
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Table,
  Tabs,
  Space,
  message,
} from 'antd'
import {
  useGetAllPromotionsQuery,
  useCreatePromotionMutation,
  useUpdatePromotionMutation,
  useDeletePromotionMutation,
} from '../../features/promotion/promotionAPI'
import {
  useGetAllVouchersQuery,
  useCreateVoucherMutation,
  useUpdateVoucherMutation,
  useDeleteVoucherMutation,
} from '../../features/voucher/voucherAPI'
import dayjs from 'dayjs'
import './productManager.css'
const PromotionVoucherManager: React.FC = () => {
  const [form] = Form.useForm()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'promotion' | 'voucher'>(
    'promotion'
  )

  const { data: promotionData, refetch: refetchPromotion } =
    useGetAllPromotionsQuery()
  const { data: voucherData, refetch: refetchVoucher } =
    useGetAllVouchersQuery()

  const [createPromotion] = useCreatePromotionMutation()
  const [updatePromotion] = useUpdatePromotionMutation()
  const [deletePromotion] = useDeletePromotionMutation()

  const [createVoucher] = useCreateVoucherMutation()
  const [updateVoucher] = useUpdateVoucherMutation()
  const [deleteVoucher] = useDeleteVoucherMutation()

  const handleSubmit = async (values: any) => {
    try {
      const payload = {
        ...values,
        startDate: values.startDate.format('YYYY-MM-DD'),
        endDate: values.endDate.format('YYYY-MM-DD'),
      }

      if (editing) {
        activeTab === 'promotion'
          ? await updatePromotion({ id: editing.id, body: payload }).unwrap()
          : await updateVoucher({ id: editing.id, body: payload }).unwrap()
        message.success('Updated successfully')
      } else {
        activeTab === 'promotion'
          ? await createPromotion(payload).unwrap()
          : await createVoucher(payload).unwrap()
        message.success('Created successfully')
      }

      setOpen(false)
      setEditing(null)
      form.resetFields()
      refetchPromotion()
      refetchVoucher()
    } catch (err) {
      message.error('Error saving')
      console.error(err)
    }
  }

  const handleEdit = (record: any, tab: 'promotion' | 'voucher') => {
    setActiveTab(tab)
    setEditing(record)
    setOpen(true)
    form.setFieldsValue({
      ...record,
      startDate: record.startDate ? dayjs(record.startDate) : undefined,
      endDate: record.endDate ? dayjs(record.endDate) : undefined,
    })
  }

  const handleDelete = async (id: string, tab: 'promotion' | 'voucher') => {
    try {
      tab === 'promotion'
        ? await deletePromotion(id).unwrap()
        : await deleteVoucher(id).unwrap()
      message.success('Deleted successfully')
      refetchPromotion()
      refetchVoucher()
    } catch {
      message.error('Delete failed')
    }
  }

  const tabItems = [
    {
      key: 'promotion',
      label: '🎯 Promotions',
      children: (
        <>
          <Button
            type='primary'
            onClick={() => {
              setOpen(true)
              setEditing(null)
              setActiveTab('promotion')
            }}
            className='add-category-btn'
          >
            ➕ Add Promotion
          </Button>
          <Table
            dataSource={promotionData?.data?.items || []}
            rowKey='id'
            style={{ marginTop: 16 }}
            className='container-products'

          >
            <Table.Column title='Event' dataIndex='event' />
            <Table.Column title='Start Date' dataIndex='startDate' />
            <Table.Column title='End Date' dataIndex='endDate' />
            <Table.Column
              title='Discount (%)'
              dataIndex='percentageDiscountValue'
              render={(v) => `${v}%`}
            />
            <Table.Column
              title='Discount Value'
              dataIndex='discountValue'
              render={(v) => `${v * 100}%`}
            />
            <Table.Column
              title='Actions'
              render={(record: any) => (
                <Space>
                  <Button onClick={() => handleEdit(record, 'promotion')}>
                    ✏️
                  </Button>
                  <Button
                    danger
                    onClick={() => handleDelete(record.id, 'promotion')}
                  >
                    🗑️
                  </Button>
                </Space>
              )}
            />
          </Table>
        </>
      ),
    },
    {
      key: 'voucher',
      label: '🎫 Vouchers',
      children: (
        <>
          <Button
            type='primary'
            onClick={() => {
              setOpen(true)
              setEditing(null)
              setActiveTab('voucher')
            }}
            className='add-category-btn'
          >
            ➕ Add Voucher
          </Button>
          <Table
            dataSource={voucherData?.data?.items || []}
            rowKey='id'
            style={{ marginTop: 16 }}
            className='container-products'
          >
            <Table.Column title='Voucher Name' dataIndex='voucherName' />
            <Table.Column
              title='Discount (VND)'
              dataIndex='voucherDiscountAmount'
            />
            <Table.Column title='Quantity' dataIndex='amount' />
            <Table.Column title='Start Date' dataIndex='startDate' />
            <Table.Column title='End Date' dataIndex='endDate' />
            <Table.Column
              title='Actions'
              render={(record: any) => (
                <Space>
                  <Button onClick={() => handleEdit(record, 'voucher')}>
                    ✏️
                  </Button>
                  <Button
                    danger
                    onClick={() => handleDelete(record.id, 'voucher')}
                  >
                    🗑️
                  </Button>
                </Space>
              )}
            />
          </Table>
        </>
      ),
    },
  ]

  return (
    <>
      <h2>Promotion & Voucher Management</h2>
      <Tabs
        defaultActiveKey='promotion'
        items={tabItems}
        onChange={(key) => setActiveTab(key as any)}
      />

      <Modal
        title={editing ? 'Edit' : 'Create'}
        open={open}
        onCancel={() => {
          setOpen(false)
          setEditing(null)
        }}
        onOk={() => form.submit()}
      >
        <Form form={form} layout='vertical' onFinish={handleSubmit}>
          {activeTab === 'promotion' ? (
            <>
              <Form.Item
                name='event'
                label='Event Name'
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name='startDate'
                label='Start Date'
                rules={[{ required: true }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                name='endDate'
                label='End Date'
                rules={[{ required: true }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                name='percentageDiscountValue'
                label='Discount (%)'
                rules={[{ required: true }]}
              >
                <InputNumber min={0} max={100} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                name='discountValue'
                label='Discount Value'
                rules={[{ required: true }]}
              >
                <InputNumber
                  min={0}
                  max={1}
                  step={0.01}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </>
          ) : (
            <>
              <Form.Item
                name='voucherName'
                label='Voucher Name'
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name='voucherDiscountAmount'
                label='Discount (%)'
                rules={[{ required: true }]}
              >
                <InputNumber min={0} max={100} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                name='amount'
                label='Quantity'
                rules={[{ required: true }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                name='startDate'
                label='Start Date'
                rules={[{ required: true }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                name='endDate'
                label='End Date'
                rules={[{ required: true }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </>
  )
}

export default PromotionVoucherManager

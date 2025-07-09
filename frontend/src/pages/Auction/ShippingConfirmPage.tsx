import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Form, Input, notification, Typography } from 'antd'
import { useConfirmShippingMutation } from '../../features/auction/auctionAPI'

const { Title, Paragraph } = Typography

const ShippingConfirmPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>()
  const [form] = Form.useForm()
  const [confirmShipping, { isLoading }] = useConfirmShippingMutation()

  const onFinish = async (values: { address: string }) => {
    try {
      await confirmShipping({
        sessionId: sessionId!,
        address: values.address,
      }).unwrap()
      notification.success({ message: 'Xác nhận địa chỉ thành công' })
      form.resetFields()
    } catch {
      notification.error({ message: 'Xác nhận thất bại' })
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <Title level={2}>Xác nhận địa chỉ giao hàng</Title>
      <Paragraph>
        Bạn là người chiến thắng trong phiên đấu giá. Vui lòng xác nhận địa chỉ
        để chúng tôi tiến hành giao hàng.
      </Paragraph>

      <Form form={form} onFinish={onFinish} layout='vertical'>
        <Form.Item
          name='address'
          label='Địa chỉ nhận hàng'
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit' loading={isLoading}>
            Xác nhận
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default ShippingConfirmPage

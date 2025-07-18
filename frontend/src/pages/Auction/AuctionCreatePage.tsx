import { Button, Form, Input, InputNumber, notification } from 'antd'
import React from 'react'
import { useSubmitAuctionItemMutation } from '../../features/auction/auctionAPI'
const AuctionCreatePage: React.FC = () => {
  const [form] = Form.useForm()
  const [submitAuctionItem] = useSubmitAuctionItemMutation()

  const onFinish = async (values: any) => {
    try {
      const formData = new FormData()
      formData.append('name', values.name)
      formData.append('description', values.description)
      formData.append('condition', values.condition)
      formData.append('startPrice', String(values.startPrice))
      formData.append('reservePrice', String(values.reservePrice))
      formData.append('stepPrice', String(values.stepPrice))
      if (values.image instanceof File) {
        formData.append('image', values.image)
      }

      await submitAuctionItem(formData).unwrap()
      notification.success({ message: 'Đã gửi vật phẩm thành công' })
      form.resetFields()
    } catch {
      notification.error({ message: 'Gửi thất bại' })
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '80%',
          padding: '24px',
          margin: '0 auto',
          marginTop: "20px",
          background: '#fff',
          borderRadius: "20px"
        }}
      >
        <Form
          form={form}
          onFinish={onFinish}
          layout='vertical'
          style={{ maxWidth: 600, margin: '0 auto' }}
          className='container-form-auction'
        >
          <Form.Item name='name' label='Tên vật phẩm' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name='description' label='Mô tả' rules={[{ required: true }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name='image'
            label='Hình ảnh'
            valuePropName='file'
            getValueFromEvent={(e) => e?.target?.files?.[0]}
            rules={[{ required: true, message: 'Vui lòng chọn ảnh' }]}
          >
            <Input type='file' accept='image/*' />
          </Form.Item>
          <Form.Item
            name='condition'
            label='Tình trạng'
            rules={[{ required: true }]}
          >
            <Input placeholder='Ví dụ: Mới 100%, Đã qua sử dụng...' />
          </Form.Item>
          <Form.Item
            name='startPrice'
            label='Giá khởi điểm'
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="reservePrice"
            label="Giá chốt"
            dependencies={['startPrice']}
            rules={[
              { required: true, message: 'Vui lòng nhập giá chốt' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const startPrice = getFieldValue('startPrice');
                  if (value === undefined || startPrice === undefined) {
                    return Promise.resolve();
                  }
                  if (value < startPrice) {
                    return Promise.reject(
                      new Error('Giá chốt phải lớn hơn hoặc bằng giá khởi điểm')
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name='stepPrice'
            label='Bước nhảy tối thiểu'
            rules={[{ required: true }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit' className='btn-send-auction-item'>
              Gửi vật phẩm
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default AuctionCreatePage

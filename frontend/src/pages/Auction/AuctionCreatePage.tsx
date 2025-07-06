import { Button, Form, Input, InputNumber, notification } from 'antd';
import React from 'react';
import { useSubmitAuctionItemMutation } from '../../features/auction/auctionAPI';

const AuctionCreatePage: React.FC = () => {
  const [form] = Form.useForm();
  const [submitAuctionItem] = useSubmitAuctionItemMutation();

  const onFinish = async (values: any) => {
    try {
      await submitAuctionItem(values).unwrap();
      notification.success({ message: 'Đã gửi vật phẩm thành công' });
      form.resetFields();
    } catch {
      notification.error({ message: 'Gửi thất bại' });
    }
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical" style={{ maxWidth: 600, margin: '0 auto' }}>
      <Form.Item name="name" label="Tên vật phẩm" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="description" label="Mô tả" rules={[{ required: true }]}>
        <Input.TextArea />
      </Form.Item>
      <Form.Item name="imageUrl" label="Hình ảnh URL" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="condition" label="Tình trạng" rules={[{ required: true }]}>
  <Input placeholder="Ví dụ: Mới 100%, Đã qua sử dụng..." />
</Form.Item>
      <Form.Item name="startPrice" label="Giá khởi điểm" rules={[{ required: true }]}>
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="reservePrice" label="Giá chốt" rules={[{ required: true }]}>
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="stepPrice" label="Bước nhảy tối thiểu" rules={[{ required: true }]}>
        <InputNumber min={1} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">Gửi vật phẩm</Button>
      </Form.Item>
    </Form>
  );
};

export default AuctionCreatePage;

// src/components/Manager/PromotionVoucherManager.tsx
import React, { useState } from 'react';
import { Button, Modal, Form, Input, InputNumber, DatePicker, Table, Tabs, Space, message } from 'antd';
import {
  useGetAllPromotionsQuery,
  useCreatePromotionMutation,
  useUpdatePromotionMutation,
  useDeletePromotionMutation
} from '../../features/promotion/promotionAPI';
import {
  useGetAllVouchersQuery,
  useCreateVoucherMutation,
  useUpdateVoucherMutation,
  useDeleteVoucherMutation
} from '../../features/voucher/voucherAPI';
import dayjs from 'dayjs';
const PromotionVoucherManager: React.FC = () => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'promotion' | 'voucher'>('promotion');

  const { data: promotionData, refetch: refetchPromotion } = useGetAllPromotionsQuery();
  const { data: voucherData, refetch: refetchVoucher } = useGetAllVouchersQuery();

  const [createPromotion] = useCreatePromotionMutation();
  const [updatePromotion] = useUpdatePromotionMutation();
  const [deletePromotion] = useDeletePromotionMutation();

  const [createVoucher] = useCreateVoucherMutation();
  const [updateVoucher] = useUpdateVoucherMutation();
  const [deleteVoucher] = useDeleteVoucherMutation();

  const handleSubmit = async (values: any) => {
    try {
      const payload = {
        ...values,
        startDate: values.startDate.format('YYYY-MM-DD'),
        endDate: values.endDate.format('YYYY-MM-DD'),
      };

      if (editing) {
        activeTab === 'promotion'
          ? await updatePromotion({ id: editing.id, body: payload }).unwrap()
          : await updateVoucher({ id: editing.id, body: payload }).unwrap();
        message.success('Cập nhật thành công');
      } else {
        activeTab === 'promotion'
          ? await createPromotion(payload).unwrap()
          : await createVoucher(payload).unwrap();
        message.success('Thêm thành công');
      }

      setOpen(false);
      setEditing(null);
      form.resetFields();
      refetchPromotion();
      refetchVoucher();
    } catch (err) {
      message.error('Lỗi khi lưu');
      console.error(err);
    }
  };

  const handleEdit = (record: any, tab: 'promotion' | 'voucher') => {
    setActiveTab(tab);
    setEditing(record);
    setOpen(true);
    form.setFieldsValue({
      ...record,
      startDate: record.startDate ? dayjs(record.startDate) : undefined,
      endDate: record.endDate ? dayjs(record.endDate) : undefined,
    });
  };

  const handleDelete = async (id: string, tab: 'promotion' | 'voucher') => {
    try {
      tab === 'promotion'
        ? await deletePromotion(id).unwrap()
        : await deleteVoucher(id).unwrap();
      message.success('Đã xoá');
      refetchPromotion();
      refetchVoucher();
    } catch {
      message.error('Xoá thất bại');
    }
  };

  const tabItems = [
    {
      key: 'promotion',
      label: '🎯 Khuyến mãi',
      children: (
        <>
          <Button type="primary" className="add-category-btn" onClick={() => { setOpen(true); setEditing(null); setActiveTab('promotion'); }}>
            ➕ Thêm khuyến mãi
          </Button>
          <Table
            dataSource={promotionData?.data?.items || []}
            rowKey="id"
            style={{ marginTop: 16 }}
          >
            <Table.Column title="Sự kiện" dataIndex="event" />
            <Table.Column title="Từ ngày" dataIndex="startDate" />
            <Table.Column title="Đến ngày" dataIndex="endDate" />
            <Table.Column title="% giảm" dataIndex="percentageDiscountValue" render={(v) => `${v}%`} />
            <Table.Column title="Giảm giá" dataIndex="discountValue" render={(v) => `${v * 100}%`} />
            <Table.Column title="Thao tác" render={(record: any) => (
              <Space>
                <Button onClick={() => handleEdit(record, 'promotion')}>✏️</Button>
                <Button danger onClick={() => handleDelete(record.id, 'promotion')}>🗑️</Button>
              </Space>
            )} />
          </Table>
        </>
      )
    },
    {
      key: 'voucher',
      label: '🎫 Voucher',
      children: (
        <>
          <Button type="primary" onClick={() => { setOpen(true); setEditing(null); setActiveTab('voucher'); }}>
            ➕ Thêm voucher
          </Button>
          <Table
            dataSource={voucherData?.data?.items || []}
            rowKey="id"
            style={{ marginTop: 16 }}
          >
            <Table.Column title="Tên voucher" dataIndex="voucherName" />
            <Table.Column title="Giảm (VND)" dataIndex="voucherDiscountAmount" />
            <Table.Column title="Số lượng" dataIndex="amount" />
            <Table.Column title="Từ ngày" dataIndex="startDate" />
            <Table.Column title="Đến ngày" dataIndex="endDate" />
            <Table.Column title="Thao tác" render={(record: any) => (
              <Space>
                <Button onClick={() => handleEdit(record, 'voucher')}>✏️</Button>
                <Button danger onClick={() => handleDelete(record.id, 'voucher')}>🗑️</Button>
              </Space>
            )} />
          </Table>
        </>
      )
    }
  ];

  return (
    <>
      <h2>Quản lý Khuyến mãi & Voucher</h2>
      <Tabs defaultActiveKey="promotion" items={tabItems} onChange={(key) => setActiveTab(key as any)} />

      <Modal
        title={editing ? 'Chỉnh sửa' : 'Thêm mới'}
        open={open}
        onCancel={() => { setOpen(false); setEditing(null); }}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {activeTab === 'promotion' ? (
            <>
              <Form.Item name="event" label="Tên sự kiện" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="startDate" label="Từ ngày" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="endDate" label="Đến ngày" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="percentageDiscountValue" label="% giảm" rules={[{ required: true }]}>
                <InputNumber min={0} max={100} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="discountValue" label="Giá trị giảm" rules={[{ required: true }]}>
                <InputNumber min={0} max={1} step={0.01} style={{ width: '100%' }} />
              </Form.Item>
            </>
          ) : (
            <>
              <Form.Item name="voucherName" label="Tên voucher" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="voucherDiscountAmount" label="Giảm (%)" rules={[{ required: true }]}>
                <InputNumber min={0} max={100} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="amount" label="Số lượng" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="startDate" label="Từ ngày" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="endDate" label="Đến ngày" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default PromotionVoucherManager;

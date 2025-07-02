// src/components/Manager/CategoryManager.tsx
import React, { useState } from 'react';
import { Button, Modal, Table, Form, Input, Space, message } from 'antd';
import {
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from '../../features/category/categoryAPI';

const CategoryManager: React.FC = () => {
  const { data, isLoading, refetch } = useGetAllCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const handleSubmit = async (values: any) => {
    try {
      if (editing) {
        await updateCategory({ id: editing.id, ...values }).unwrap();
        message.success('Đã cập nhật danh mục');
      } else {
        await createCategory(values).unwrap();
        message.success('Đã thêm danh mục');
      }
      refetch();
      setOpen(false);
      form.resetFields();
      setEditing(null);
    } catch (err) {
      message.error('Lỗi khi lưu danh mục');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id).unwrap();
      message.success('Đã xóa danh mục');
      refetch();
    } catch {
      message.error('Không thể xóa danh mục');
    }
  };

  return (
    <div>
      <h2>Quản lý danh mục</h2>
      <Button
  type="primary"
  className="add-category-btn"
  onClick={() => setOpen(true)}
  style={{ marginBottom: 16 }}
>
  ➕ Thêm danh mục
</Button>


      <Table
  loading={isLoading}
  dataSource={data?.data?.items || []}
  rowKey="id"
  pagination={{ pageSize: 10 }}
>
  <Table.Column title="ID" dataIndex="id" />
  <Table.Column title="Tên danh mục" dataIndex="categoryName" />
  <Table.Column title="Mô tả" dataIndex="description" />
  <Table.Column
    title="Kích hoạt"
    dataIndex="isActive"
    render={(value: boolean) => (value ? '✅' : '❌')}
  />
  <Table.Column
    title="Ngày tạo"
    dataIndex="createdAt"
    render={(value: string) => new Date(value).toLocaleString()}
  />
  <Table.Column
    title="Ngày cập nhật"
    dataIndex="updatedAt"
    render={(value: string) => new Date(value).toLocaleString()}
  />
  
  <Table.Column
    title="Hành động"
    render={(record: any) => (
      <Space>
        <Button onClick={() => { setEditing(record); form.setFieldsValue({
  categoryName: record.categoryName,
  description: record.description,
});
; setOpen(true); }}>
          ✏️ Sửa
        </Button>
        <Button danger onClick={() => handleDelete(record.id)}>
          🗑️ Xoá
        </Button>
      </Space>
    )}
  />
</Table>


      <Modal
        title={editing ? 'Chỉnh sửa danh mục' : 'Thêm danh mục'}
        open={open}
        onCancel={() => { setOpen(false); setEditing(null); }}
        onOk={() => form.submit()}
        okText={editing ? 'Cập nhật' : 'Thêm'}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
  <Form.Item
    label="Tên danh mục"
    name="categoryName"
    rules={[{ required: true, message: 'Không được bỏ trống tên danh mục' }]}
  >
    <Input />
  </Form.Item>

  <Form.Item
    label="Mô tả"
    name="description"
    rules={[{ required: true, message: 'Không được bỏ trống mô tả' }]}
  >
    <Input.TextArea rows={3} />
  </Form.Item>
</Form>

      </Modal>
    </div>
  );
};

export default CategoryManager;

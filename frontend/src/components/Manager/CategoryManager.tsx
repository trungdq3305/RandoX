// src/components/Manager/CategoryManager.tsx
import React, { useState } from 'react'
import { Button, Modal, Table, Form, Input, Space, message } from 'antd'
import {
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from '../../features/category/categoryAPI'
import './productManager.css'
const CategoryManager: React.FC = () => {
  const { data, isLoading, refetch } = useGetAllCategoriesQuery()
  const [createCategory] = useCreateCategoryMutation()
  const [updateCategory] = useUpdateCategoryMutation()
  const [deleteCategory] = useDeleteCategoryMutation()

  const [form] = Form.useForm()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)

  const handleSubmit = async (values: any) => {
    try {
      if (editing) {
        await updateCategory({ id: editing.id, ...values }).unwrap()
        message.success('Category updated successfully')
      } else {
        await createCategory(values).unwrap()
        message.success('Category added successfully')
      }
      refetch()
      setOpen(false)
      form.resetFields()
      setEditing(null)
    } catch (err) {
      message.error('Error saving category')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id).unwrap()
      message.success('Category deleted successfully')
      refetch()
    } catch {
      message.error('Unable to delete category')
    }
  }

  return (
    <div>
      <h2>Category Management</h2>
      <Button
        type='primary'
        className='add-category-btn'
        onClick={() => setOpen(true)}
        style={{ marginBottom: 16 }}
      >
        ➕ Add Category
      </Button>

      <Table
        loading={isLoading}
        dataSource={data?.data?.items || []}
        rowKey='id'
        pagination={{ pageSize: 10 }}
        className='container-products'

      >
        <Table.Column title='Category Name' dataIndex='categoryName' />
        <Table.Column title='Description' dataIndex='description' />
        <Table.Column
          title='Active'
          dataIndex='isActive'
          render={(value: boolean) => (value ? '✅' : '❌')}
        />
        <Table.Column
          title='Created At'
          dataIndex='createdAt'
          render={(value: string) => new Date(value).toLocaleString()}
        />
        <Table.Column
          title='Updated At'
          dataIndex='updatedAt'
          render={(value: string) => new Date(value).toLocaleString()}
        />
        <Table.Column
          title='Actions'
          render={(record: any) => (
            <Space>
              <Button
                onClick={() => {
                  setEditing(record)
                  form.setFieldsValue({
                    categoryName: record.categoryName,
                    description: record.description,
                  })
                  setOpen(true)
                }}
              >
                ✏️ Edit
              </Button>
              <Button danger onClick={() => handleDelete(record.id)}>
                🗑️ Delete
              </Button>
            </Space>
          )}
        />
      </Table>

      <Modal
        title={editing ? 'Edit Category' : 'Add Category'}
        open={open}
        onCancel={() => {
          setOpen(false)
          setEditing(null)
        }}
        onOk={() => form.submit()}
        okText={editing ? 'Update' : 'Add'}
        cancelText='Cancel'
      >
        <Form form={form} layout='vertical' onFinish={handleSubmit}>
          <Form.Item
            label='Category Name'
            name='categoryName'
            rules={[{ required: true, message: 'Category name is required' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label='Description'
            name='description'
            rules={[{ required: true, message: 'Description is required' }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default CategoryManager

// src/components/Manager/ProductManager.tsx
import React, { useState } from 'react'
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Space,
  message,
  Tabs,
  Select,
} from 'antd'
import {
  useGetAllProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from '../../features/product/productAPI'

import {
  useGetAllProductSetsQuery,
  useCreateProductSetMutation,
  useUpdateProductSetMutation,
  useDeleteProductSetMutation,
} from '../../features/productSet/productSetAPI'
import { useGetAllManufacturersQuery } from '../../features/manufacturer/manufacturerAPI'
import { useGetAllCategoriesQuery } from '../../features/category/categoryAPI'
import { useGetAllProductsDropdownQuery } from '../../features/product/productAPI'
import './productManager.css'
const { TabPane } = Tabs

const ProductManager: React.FC = () => {
  const {
    data: productData,
    isLoading: loadingProduct,
    refetch: refetchProduct,
  } = useGetAllProductsQuery()
  const { data: manufacturerData } = useGetAllManufacturersQuery()
  const { data: categoryData } = useGetAllCategoriesQuery()
  const { data: productDropdownData } = useGetAllProductsDropdownQuery()
  const {
    data: productSetData,
    isLoading: loadingProductSet,
    refetch: refetchProductSet,
  } = useGetAllProductSetsQuery()

  const [createProduct] = useCreateProductMutation()
  const [updateProduct] = useUpdateProductMutation()
  const [deleteProduct] = useDeleteProductMutation()

  const [createProductSet] = useCreateProductSetMutation()
  const [updateProductSet] = useUpdateProductSetMutation()
  const [deleteProductSet] = useDeleteProductSetMutation()

  const [form] = Form.useForm()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'product' | 'productSet'>(
    'product'
  )

  const handleSubmit = async (values: any) => {
    try {
      const formData = new FormData()

      for (const key in values) {
        if (key === 'image') {
          const file = values[key]
          if (file && file instanceof File) {
            formData.append('image', file)
          }
        } else {
          const value = values[key]
          if (value !== undefined && value !== null) {
            formData.append(key, String(value))
          }
        }
      }

      if (editing) {
        if (activeTab === 'product') {
          await updateProduct({ id: editing.id, body: formData }).unwrap()
        } else {
          await updateProductSet({ id: editing.id, ...values }).unwrap() // productSet chưa hỗ trợ image
        }
        message.success('Update successful')
      } else {
        if (activeTab === 'product') {
          await createProduct(formData).unwrap()
        } else {
          await createProductSet(values).unwrap()
        }
        message.success('Add successful')
      }

      setOpen(false)
      setEditing(null)
      form.resetFields()
      refetchProduct()
      refetchProductSet()
    } catch (err) {
      console.error(err)
      message.error('Adding error')
    }
  }

  const handleEdit = (record: any, tab: 'product' | 'productSet') => {
    setActiveTab(tab)
    setEditing(record)
    setOpen(true)

    const values = { ...record }

    if (tab === 'product') {
      const matchedManu = manufacturerData?.data?.items.find(
        (m: any) => m.manufacturerName === record.manufacturerName
      )
      const matchedCate = categoryData?.data?.items.find(
        (c: any) => c.categoryName === record.categoryName
      )

      values.manufacturerId = matchedManu?.id
      values.categoryId = matchedCate?.id
    } else {
      const matchedProduct = productDropdownData?.data?.items.find(
        (p: any) => p.productName === record.productName
      )
      values.productId = matchedProduct?.id
    }

    form.setFieldsValue(values)
  }

  const handleDelete = async (id: string, tab: 'product' | 'productSet') => {
    try {
      if (tab === 'product') {
        await deleteProduct(id).unwrap()
        refetchProduct()
      } else {
        await deleteProductSet(id).unwrap()
        refetchProductSet()
      }
      message.success('Deleted')
    } catch {
      message.error('Delete Error')
    }
  }

  return (
    <div>
      <h2>Product & Product Set Management</h2>
      <Tabs
        defaultActiveKey='product'
        onChange={(key) => setActiveTab(key as 'product' | 'productSet')}

      >
        <TabPane tab='Product' key='product'>
          <Button
            type='primary'
            className='add-category-btn'
            onClick={() => {
              setEditing(null)
              setOpen(true)
              setActiveTab('product')
            }}
          >
            ➕ Add Product
          </Button>
          <Table
            loading={loadingProduct}
            dataSource={productData?.data?.items || []}
            rowKey='id'
            style={{ marginTop: 16 }}
            className='container-products'
          >
            <Table.Column title='Product Name' dataIndex='productName' />
            <Table.Column title='Description' dataIndex='description' />
            <Table.Column title='Quantity' dataIndex='quantity' />
            <Table.Column title='Price' dataIndex='price' />
            <Table.Column title='Manufacturer' dataIndex='manufacturerName' />
            <Table.Column title='Category' dataIndex='categoryName' />
            <Table.Column title='Promotion' dataIndex='promotionEvent' />
            <Table.Column
              title='% Discount'
              dataIndex='percentageDiscountValue'
              render={(v) => `${v}%`}
            />
            <Table.Column
              title='Discount value'
              dataIndex='discountValue'
              render={(v) => `${v * 100}%`}
            />
            <Table.Column
              title='Actions'
              render={(record: any) => (
                <Space>
                  <Button onClick={() => handleEdit(record, 'product')}>
                    ✏️
                  </Button>
                  <Button
                    danger
                    onClick={() => handleDelete(record.id, 'product')}
                  >
                    🗑️
                  </Button>
                </Space>
              )}
            />
          </Table>
        </TabPane>

        <TabPane tab='Product Set' key='productSet'>
          <Button
            type='primary'
            className='add-category-btn'
            onClick={() => {
              setEditing(null)
              setOpen(true)
              setActiveTab('productSet')
            }}
          >
            ➕ Add Product Set
          </Button>
          <Table
            loading={loadingProductSet}
            dataSource={productSetData?.data?.items || []}
            rowKey='id'
            style={{ marginTop: 16 }}
          >
            <Table.Column title='Set Name' dataIndex='productSetName' />
            <Table.Column title='Description' dataIndex='description' />
            <Table.Column title='Product Quantity' dataIndex='setQuantity' />
            <Table.Column title='Quantity' dataIndex='quantity' />
            <Table.Column title='Price' dataIndex='price' />
            <Table.Column title='Promotion' dataIndex='promotionEvent' />
            <Table.Column
              title='% discount'
              dataIndex='percentageDiscountValue'
              render={(v) => `${v}%`}
            />
            <Table.Column
              title='Discount Value'
              dataIndex='discountValue'
              render={(v) => `${v * 100}%`}
            />
            <Table.Column title='Product' dataIndex='productName' />
            <Table.Column
              title='Actions'
              render={(record: any) => (
                <Space>
                  <Button onClick={() => handleEdit(record, 'productSet')}>
                    ✏️
                  </Button>
                  <Button
                    danger
                    onClick={() => handleDelete(record.id, 'productSet')}
                  >
                    🗑️
                  </Button>
                </Space>
              )}
            />
          </Table>
        </TabPane>
      </Tabs>

      <Modal
        title={editing ? 'Update' : 'Add'}
        open={open}
        onCancel={() => {
          setOpen(false)
          setEditing(null)
        }}
        onOk={() => form.submit()}
        okText={editing ? 'Update' : 'Add'}
      >
        <Form form={form} layout='vertical' onFinish={handleSubmit}>
          <Form.Item
            name={activeTab === 'product' ? 'productName' : 'productSetName'}
            label='Tên'
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name='description'
            label='Description'
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name='quantity'
            label='Quantity'
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          {activeTab === 'productSet' && (
            <Form.Item
              name='setQuantity'
              label='Quantity'
              rules={[{ required: true }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          )}
          <Form.Item name='price' label='Price' rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          {/* Nếu cần dropdown, sẽ thêm ở đây sau */}
          <Form.Item
            name='image'
            label='Image'
            valuePropName='file'
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) return e
              return e?.target?.files?.[0]
            }}
          >
            <Input type='file' accept='image/*' />
          </Form.Item>

          {activeTab === 'product' && (
            <>
              <Form.Item
                name='manufacturerId'
                label='Manufacturer'
                rules={[{ required: true }]}
              >
                <Select
                  placeholder='Choose manufacturer'
                  options={(manufacturerData?.data?.items || []).map(
                    (item: any) => ({
                      label: item.manufacturerName,
                      value: item.id,
                    })
                  )}
                />
              </Form.Item>

              <Form.Item
                name='categoryId'
                label='Category'
                rules={[{ required: true }]}
              >
                <Select
                  placeholder='Choose category'
                  options={(categoryData?.data?.items || []).map(
                    (item: any) => ({
                      label: item.categoryName,
                      value: item.id,
                    })
                  )}
                />
              </Form.Item>
            </>
          )}
          {activeTab === 'productSet' && (
            <Form.Item
              name='productId'
              label='Product'
              rules={[{ required: true }]}
            >
              <Select
                placeholder='Choose Product'
                options={(productDropdownData?.data?.items || []).map(
                  (item: any) => ({
                    label: item.productName,
                    value: item.id,
                  })
                )}
              />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  )
}

export default ProductManager

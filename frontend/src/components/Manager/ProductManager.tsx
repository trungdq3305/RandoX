// src/components/Manager/ProductManager.tsx
import React, { useState } from 'react';
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
  Select
} from 'antd';
import {
  useGetAllProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation
} from '../../features/product/productAPI';

import {
  useGetAllProductSetsQuery,
  useCreateProductSetMutation,
  useUpdateProductSetMutation,
  useDeleteProductSetMutation
} from '../../features/productSet/productSetAPI';
import { useGetAllManufacturersQuery } from '../../features/manufacturer/manufacturerAPI';
import { useGetAllCategoriesQuery } from '../../features/category/categoryAPI';
import { useGetAllProductsDropdownQuery } from '../../features/product/productAPI';

const { TabPane } = Tabs;


const ProductManager: React.FC = () => {
  const {
    data: productData,
    isLoading: loadingProduct,
    refetch: refetchProduct
  } = useGetAllProductsQuery();
const { data: manufacturerData } = useGetAllManufacturersQuery();
const { data: categoryData } = useGetAllCategoriesQuery();
const { data: productDropdownData } = useGetAllProductsDropdownQuery();
  const {
    data: productSetData,
    isLoading: loadingProductSet,
    refetch: refetchProductSet
  } = useGetAllProductSetsQuery();

  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [createProductSet] = useCreateProductSetMutation();
  const [updateProductSet] = useUpdateProductSetMutation();
  const [deleteProductSet] = useDeleteProductSetMutation();

  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'product' | 'productSet'>('product');

  const handleSubmit = async (values: any) => {
  try {
    const formData = new FormData();

    for (const key in values) {
      if (key === 'image') {
        const file = values[key];
        if (file && file instanceof File) {
          formData.append('image', file);
        }
      } else {
        const value = values[key];
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      }
    }

    if (editing) {
      if (activeTab === 'product') {
        await updateProduct({ id: editing.id, body: formData }).unwrap();
      } else {
        await updateProductSet({ id: editing.id, ...values }).unwrap(); // productSet chưa hỗ trợ image
      }
      message.success('Cập nhật thành công');
    } else {
      if (activeTab === 'product') {
        await createProduct(formData).unwrap();
      } else {
        await createProductSet(values).unwrap();
      }
      message.success('Thêm thành công');
    }

    setOpen(false);
    setEditing(null);
    form.resetFields();
    refetchProduct();
    refetchProductSet();
  } catch (err) {
    console.error(err);
    message.error('Lỗi khi lưu dữ liệu');
  }
};




  const handleEdit = (record: any, tab: 'product' | 'productSet') => {
  setActiveTab(tab);
  setEditing(record);
  setOpen(true);

  const values = { ...record };

  if (tab === 'product') {
    const matchedManu = manufacturerData?.data?.items.find(
      (m: any) => m.manufacturerName === record.manufacturerName
    );
    const matchedCate = categoryData?.data?.items.find(
      (c: any) => c.categoryName === record.categoryName
    );

    values.manufacturerId = matchedManu?.id;
    values.categoryId = matchedCate?.id;
  } else {
    const matchedProduct = productDropdownData?.data?.items.find(
      (p: any) => p.productName === record.productName
    );
    values.productId = matchedProduct?.id;
  }

  form.setFieldsValue(values);
};


  const handleDelete = async (id: string, tab: 'product' | 'productSet') => {
    try {
      if (tab === 'product') {
        await deleteProduct(id).unwrap();
        refetchProduct();
      } else {
        await deleteProductSet(id).unwrap();
        refetchProductSet();
      }
      message.success('Đã xoá');
    } catch {
      message.error('Xoá thất bại');
    }
  };

  return (
    <div>
      <h2>Quản lý Sản phẩm & Bộ sản phẩm</h2>
      <Tabs defaultActiveKey="product" onChange={(key) => setActiveTab(key as 'product' | 'productSet')}>
        <TabPane tab="Sản phẩm" key="product" >
          <Button type="primary" className="add-category-btn" onClick={() => { setEditing(null); setOpen(true); setActiveTab('product'); }}>
            ➕ Thêm sản phẩm
          </Button>
          <Table
  loading={loadingProduct}
  dataSource={productData?.data?.items || []}
  rowKey="id"
  style={{ marginTop: 16 }}
>
  <Table.Column title="Tên sản phẩm" dataIndex="productName" />
  <Table.Column title="Mô tả" dataIndex="description" />
  <Table.Column title="Số lượng" dataIndex="quantity" />
  <Table.Column title="Giá" dataIndex="price" />
  <Table.Column title="Hãng sản xuất" dataIndex="manufacturerName" />
  <Table.Column title="Danh mục" dataIndex="categoryName" />
  <Table.Column title="Sự kiện khuyến mãi" dataIndex="promotionEvent" />
  <Table.Column title="% giảm" dataIndex="percentageDiscountValue" render={(v) => `${v}%`} />
  <Table.Column title="Giảm giá" dataIndex="discountValue" render={(v) => `${v * 100}%`} />
  <Table.Column
    title="Thao tác"
    render={(record: any) => (
      <Space>
        <Button onClick={() => handleEdit(record, 'product')}>✏️</Button>
        <Button danger onClick={() => handleDelete(record.id, 'product')}>🗑️</Button>
      </Space>
    )}
  />
</Table>

        </TabPane>

        <TabPane tab="Bộ sản phẩm" key="productSet">
          <Button type="primary" className="add-category-btn" onClick={() => { setEditing(null); setOpen(true); setActiveTab('productSet'); }}>
            ➕ Thêm bộ sản phẩm
          </Button>
          <Table
  loading={loadingProductSet}
  dataSource={productSetData?.data?.items || []}
  rowKey="id"
  style={{ marginTop: 16 }}
>
  <Table.Column title="Tên bộ" dataIndex="productSetName" />
  <Table.Column title="Mô tả" dataIndex="description" />
  <Table.Column title="Số lượng bộ" dataIndex="setQuantity" />
  <Table.Column title="Tổng sản phẩm" dataIndex="quantity" />
  <Table.Column title="Giá bộ" dataIndex="price" />
  <Table.Column title="Sự kiện khuyến mãi" dataIndex="promotionEvent" />
  <Table.Column title="% giảm" dataIndex="percentageDiscountValue" render={(v) => `${v}%`} />
  <Table.Column title="Giảm giá" dataIndex="discountValue" render={(v) => `${v * 100}%`} />
  <Table.Column title="Tên sản phẩm chính" dataIndex="productName" />
  <Table.Column
    title="Thao tác"
    render={(record: any) => (
      <Space>
        <Button onClick={() => handleEdit(record, 'productSet')}>✏️</Button>
        <Button danger onClick={() => handleDelete(record.id, 'productSet')}>🗑️</Button>
      </Space>
    )}
  />
</Table>

        </TabPane>
      </Tabs>

      <Modal
        title={editing ? 'Chỉnh sửa' : 'Thêm mới'}
        open={open}
        onCancel={() => { setOpen(false); setEditing(null); }}
        onOk={() => form.submit()}
        okText={editing ? 'Cập nhật' : 'Thêm'}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name={activeTab === 'product' ? 'productName' : 'productSetName'} label="Tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="quantity" label="Số lượng" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          {activeTab === 'productSet' && (
            <Form.Item name="setQuantity" label="Số lượng bộ" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          )}
          <Form.Item name="price" label="Giá" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          {/* Nếu cần dropdown, sẽ thêm ở đây sau */}
          <Form.Item
  name="image"
  label="Ảnh sản phẩm"
  valuePropName="file"
  getValueFromEvent={(e) => {
    if (Array.isArray(e)) return e;
    return e?.target?.files?.[0];
  }}
>
  <Input type="file" accept="image/*" />
</Form.Item>


          {activeTab === 'product' && (
  <>
    <Form.Item name="manufacturerId" label="Hãng sản xuất" rules={[{ required: true }]}>
      <Select
        placeholder="Chọn hãng"
        options={(manufacturerData?.data?.items || []).map((item: any) => ({
          label: item.manufacturerName,
          value: item.id,
        }))}
      />
    </Form.Item>

    <Form.Item name="categoryId" label="Danh mục" rules={[{ required: true }]}>
      <Select
        placeholder="Chọn danh mục"
        options={(categoryData?.data?.items || []).map((item: any) => ({
          label: item.categoryName,
          value: item.id,
        }))}
      />
    </Form.Item>
  </>
)}
{activeTab === 'productSet' && (
  <Form.Item name="productId" label="Sản phẩm gốc" rules={[{ required: true }]}>
    <Select
      placeholder="Chọn sản phẩm"
      options={(productDropdownData?.data?.items || []).map((item: any) => ({
        label: item.productName,
        value: item.id,
      }))}
    />
  </Form.Item>
)}


        </Form>
      </Modal>
    </div>
  );
};

export default ProductManager;

// src/pages/Manager/ManagerDashboard.tsx
import React, { useState } from 'react'
import './ManagerDashboard.css'
import { Tabs } from 'antd'
import CategoryManager from '../../components/Manager/CategoryManager'

const { TabPane } = Tabs

interface Product {
  id: number
  name: string
  category: string
  price: number
  stock: number
  status: 'available' | 'out_of_stock' | 'discontinued'
  image: string
  description: string
}

const ManagerDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: 'THE MONSTERS × One Piece Figure',
      category: 'Figure',
      price: 280000,
      stock: 15,
      status: 'available',
      image: '🏴‍☠️',
      description: 'Mô hình One Piece cao cấp',
    },
    {
      id: 2,
      name: 'League of Legends: Arcane Vi',
      category: 'Figure',
      price: 280000,
      stock: 8,
      status: 'available',
      image: '⚔️',
      description: 'Mô hình Vi từ Arcane',
    },
    {
      id: 3,
      name: 'MOLLY Peekaboo 1/8 Art Toy',
      category: 'Art Toy',
      price: 1500000,
      stock: 0,
      status: 'out_of_stock',
      image: '🎀',
      description: 'Đồ chơi nghệ thuật MOLLY',
    },
    {
      id: 4,
      name: 'Blind Box Mystery Series',
      category: 'Blind Box',
      price: 150000,
      stock: 25,
      status: 'available',
      image: '📦',
      description: 'Hộp bí ẩn với nhiều bất ngờ',
    },
  ])

  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setShowModal(true)
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      setProducts((prev) => prev.filter((product) => product.id !== id))
    }
  }

  const handleAdd = () => {
    setEditingProduct(null)
    setShowModal(true)
  }

  const handleSave = (productData: Product) => {
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === editingProduct.id ? productData : product
        )
      )
    } else {
      const newProduct = { ...productData, id: Date.now() }
      setProducts((prev) => [...prev, newProduct])
    }
    setShowModal(false)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price)
  }

  const stats = [
    {
      title: 'Tổng sản phẩm',
      value: products.length,
      icon: '📦',
      color: '#f093fb',
    },
    {
      title: 'Sản phẩm có sẵn',
      value: products.filter((p) => p.status === 'available').length,
      icon: '✅',
      color: '#4caf50',
    },
    {
      title: 'Hết hàng',
      value: products.filter((p) => p.status === 'out_of_stock').length,
      icon: '⚠️',
      color: '#ff9800',
    },
    {
      title: 'Tổng giá trị kho',
      value: formatPrice(
        products.reduce((sum, p) => sum + p.price * p.stock, 0)
      ),
      icon: '💎',
      color: '#e91e63',
    },
  ]

  return (
    <div className='manager-dashboard'>
      <div className='stats-grid'>
        {stats.map((stat, index) => (
          <div key={index} className='stat-card'>
            <div className='stat-icon' style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <div className='stat-content'>
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <Tabs defaultActiveKey='1'>
        <TabPane tab='Danh mục' key='1'>
          <CategoryManager />
        </TabPane>

        <TabPane tab='Sản phẩm' key='2'>
          <div className='table-container'>
            <div className='table-header'>
              <h2>Quản lý sản phẩm</h2>
              <div className='table-actions'>
                <div className='search-box'>
                  <input
                    type='text'
                    placeholder='Tìm kiếm sản phẩm...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <span className='search-icon'>🔍</span>
                </div>
                <button className='add-btn' onClick={handleAdd}>
                  ➕ Thêm sản phẩm
                </button>
              </div>
            </div>

            <div className='table-wrapper'>
              <table className='management-table'>
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Danh mục</th>
                    <th>Giá</th>
                    <th>Tồn kho</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div className='product-info'>
                          <span className='product-image'>{product.image}</span>
                          <div className='product-details'>
                            <span className='product-name'>{product.name}</span>
                            <span className='product-description'>
                              {product.description}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`category-badge ${product.category.toLowerCase().replace(' ', '-')}`}
                        >
                          {product.category}
                        </span>
                      </td>
                      <td className='price'>{formatPrice(product.price)}</td>
                      <td>
                        <span
                          className={`stock-badge ${product.stock > 10 ? 'high' : product.stock > 0 ? 'medium' : 'low'}`}
                        >
                          {product.stock} sản phẩm
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${product.status}`}>
                          {product.status === 'available'
                            ? 'Có sẵn'
                            : product.status === 'out_of_stock'
                              ? 'Hết hàng'
                              : 'Ngừng bán'}
                        </span>
                      </td>
                      <td>
                        <div className='action-buttons'>
                          <button
                            className='action-btn view-btn'
                            title='Xem chi tiết'
                          >
                            👁️
                          </button>
                          <button
                            className='action-btn edit-btn'
                            onClick={() => handleEdit(product)}
                            title='Chỉnh sửa'
                          >
                            ✏️
                          </button>
                          <button
                            className='action-btn delete-btn'
                            onClick={() => handleDelete(product.id)}
                            title='Xóa'
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {showModal && (
            <div className='modal-overlay'>
              <div className='modal'>
                <div className='modal-header'>
                  <h3>
                    {editingProduct
                      ? 'Chỉnh sửa sản phẩm'
                      : 'Thêm sản phẩm mới'}
                  </h3>
                  <button
                    className='close-btn'
                    onClick={() => setShowModal(false)}
                  >
                    ✕
                  </button>
                </div>
                <div className='modal-body'>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      const formData = new FormData(e.target as HTMLFormElement)
                      const productData: Product = {
                        id: editingProduct?.id || 0,
                        name: formData.get('name') as string,
                        category: formData.get('category') as string,
                        price: Number(formData.get('price')),
                        stock: Number(formData.get('stock')),
                        status: formData.get('status') as
                          | 'available'
                          | 'out_of_stock'
                          | 'discontinued',
                        image: formData.get('image') as string,
                        description: formData.get('description') as string,
                      }
                      handleSave(productData)
                    }}
                  >
                    <div className='form-row'>
                      <div className='form-group'>
                        <label>Tên sản phẩm:</label>
                        <input
                          type='text'
                          name='name'
                          defaultValue={editingProduct?.name || ''}
                          required
                        />
                      </div>
                      <div className='form-group'>
                        <label>Danh mục:</label>
                        <select
                          name='category'
                          defaultValue={editingProduct?.category || 'Figure'}
                        >
                          <option value='Figure'>Figure</option>
                          <option value='Art Toy'>Art Toy</option>
                          <option value='Blind Box'>Blind Box</option>
                          <option value='Collectible'>Collectible</option>
                        </select>
                      </div>
                    </div>

                    <div className='form-row'>
                      <div className='form-group'>
                        <label>Giá (VND):</label>
                        <input
                          type='number'
                          name='price'
                          defaultValue={editingProduct?.price || ''}
                          required
                        />
                      </div>
                      <div className='form-group'>
                        <label>Tồn kho:</label>
                        <input
                          type='number'
                          name='stock'
                          defaultValue={editingProduct?.stock || ''}
                          required
                        />
                      </div>
                    </div>

                    <div className='form-row'>
                      <div className='form-group'>
                        <label>Trạng thái:</label>
                        <select
                          name='status'
                          defaultValue={editingProduct?.status || 'available'}
                        >
                          <option value='available'>Có sẵn</option>
                          <option value='out_of_stock'>Hết hàng</option>
                          <option value='discontinued'>Ngừng bán</option>
                        </select>
                      </div>
                      <div className='form-group'>
                        <label>Icon:</label>
                        <input
                          type='text'
                          name='image'
                          defaultValue={editingProduct?.image || '🎁'}
                          placeholder='🎁'
                        />
                      </div>
                    </div>

                    <div className='form-group'>
                      <label>Mô tả:</label>
                      <textarea
                        name='description'
                        defaultValue={editingProduct?.description || ''}
                        rows={3}
                      />
                    </div>

                    <div className='form-actions'>
                      <button
                        type='button'
                        onClick={() => setShowModal(false)}
                        className='cancel-btn'
                      >
                        Hủy
                      </button>
                      <button type='submit' className='save-btn'>
                        {editingProduct ? 'Cập nhật' : 'Thêm mới'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </TabPane>
      </Tabs>
    </div>
  )
}

export default ManagerDashboard

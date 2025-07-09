// AdminDashboard.tsx
import React, { useState } from 'react'
import './AdminDashboard.css'
interface User {
  id: number
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
  joinDate: string
  avatar: string
}

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@example.com',
      role: 'Customer',
      status: 'active',
      joinDate: '2024-01-15',
      avatar: '👤',
    },
    {
      id: 2,
      name: 'Trần Thị B',
      email: 'tranthib@example.com',
      role: 'Manager',
      status: 'active',
      joinDate: '2024-02-20',
      avatar: '👩',
    },
    {
      id: 3,
      name: 'Lê Văn C',
      email: 'levanc@example.com',
      role: 'Customer',
      status: 'inactive',
      joinDate: '2024-03-10',
      avatar: '👨',
    },
    {
      id: 4,
      name: 'Phạm Thị D',
      email: 'phamthid@example.com',
      role: 'Customer',
      status: 'active',
      joinDate: '2024-04-05',
      avatar: '👩‍💼',
    },
  ])

  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setShowModal(true)
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      setUsers((prev) => prev.filter((user) => user.id !== id))
    }
  }

  const handleAdd = () => {
    setEditingUser(null)
    setShowModal(true)
  }

  const handleSave = (userData: User) => {
    if (editingUser) {
      setUsers((prev) =>
        prev.map((user) => (user.id === editingUser.id ? userData : user))
      )
    } else {
      const newUser = { ...userData, id: Date.now() }
      setUsers((prev) => [...prev, newUser])
    }
    setShowModal(false)
  }

  const stats = [
    {
      title: 'Tổng người dùng',
      value: users.length,
      icon: '👥',
      color: '#667eea',
    },
    {
      title: 'Người dùng hoạt động',
      value: users.filter((u) => u.status === 'active').length,
      icon: '✅',
      color: '#4caf50',
    },
    { title: 'Sản phẩm', value: 245, icon: '🎁', color: '#ff9800' },
    {
      title: 'Doanh thu hôm nay',
      value: '2.5M VND',
      icon: '💰',
      color: '#e91e63',
    },
  ]

  return (
    <div className='admin-dashboard'>
      {/* Stats Cards */}
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

      {/* Management Table */}
      <div className='table-container'>
        <div className='table-header'>
          <h2>Quản lý người dùng</h2>
          <div className='table-actions'>
            <div className='search-box'>
              <input
                type='text'
                placeholder='Tìm kiếm người dùng...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className='search-icon'>🔍</span>
            </div>
            <button className='add-btn' onClick={handleAdd}>
              ➕ Thêm người dùng
            </button>
          </div>
        </div>

        <div className='table-wrapper'>
          <table className='management-table'>
            <thead>
              <tr>
                <th>Người dùng</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Ngày tham gia</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className='user-info'>
                      <span className='user-avatar'>{user.avatar}</span>
                      <span className='user-name'>{user.name}</span>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role.toLowerCase()}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${user.status}`}>
                      {user.status === 'active'
                        ? 'Hoạt động'
                        : 'Không hoạt động'}
                    </span>
                  </td>
                  <td>{user.joinDate}</td>
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
                        onClick={() => handleEdit(user)}
                        title='Chỉnh sửa'
                      >
                        ✏️
                      </button>
                      <button
                        className='action-btn delete-btn'
                        onClick={() => handleDelete(user.id)}
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

      {/* Modal */}
      {showModal && (
        <div className='modal-overlay'>
          <div className='modal'>
            <div className='modal-header'>
              <h3>
                {editingUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
              </h3>
              <button className='close-btn' onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>
            <div className='modal-body'>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.target as HTMLFormElement)
                  const userData: User = {
                    id: editingUser?.id || 0,
                    name: formData.get('name') as string,
                    email: formData.get('email') as string,
                    role: formData.get('role') as string,
                    status: formData.get('status') as 'active' | 'inactive',
                    joinDate:
                      editingUser?.joinDate ||
                      new Date().toISOString().split('T')[0],
                    avatar: editingUser?.avatar || '👤',
                  }
                  handleSave(userData)
                }}
              >
                <div className='form-group'>
                  <label>Tên:</label>
                  <input
                    type='text'
                    name='name'
                    defaultValue={editingUser?.name || ''}
                    required
                  />
                </div>
                <div className='form-group'>
                  <label>Email:</label>
                  <input
                    type='email'
                    name='email'
                    defaultValue={editingUser?.email || ''}
                    required
                  />
                </div>
                <div className='form-group'>
                  <label>Vai trò:</label>
                  <select
                    name='role'
                    defaultValue={editingUser?.role || 'Customer'}
                  >
                    <option value='Customer'>Customer</option>
                    <option value='Manager'>Manager</option>
                    <option value='Admin'>Admin</option>
                  </select>
                </div>
                <div className='form-group'>
                  <label>Trạng thái:</label>
                  <select
                    name='status'
                    defaultValue={editingUser?.status || 'active'}
                  >
                    <option value='active'>Hoạt động</option>
                    <option value='inactive'>Không hoạt động</option>
                  </select>
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
                    {editingUser ? 'Cập nhật' : 'Thêm mới'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard

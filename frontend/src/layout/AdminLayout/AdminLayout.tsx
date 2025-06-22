// AdminLayout.tsx
import React, { useState } from 'react'
import { Link, useLocation, Outlet } from 'react-router-dom'
import './AdminLayout.css'

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/admin/dashboard' },
    { icon: '👥', label: 'Quản lý người dùng', path: '/admin/users' },
    { icon: '⚙️', label: 'Cài đặt hệ thống', path: '/admin/settings' },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="admin-layout">
      <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🎲</span>
            {!collapsed && <span className="logo-text">RandoX Admin</span>}
          </div>
          <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? '→' : '←'}
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item, index) => (
            <Link key={index} to={item.path} className={`nav-item ${isActive(item.path) ? 'active' : ''}`}>
              <span className="nav-icon">{item.icon}</span>
              {!collapsed && <span className="nav-label">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="avatar">👤</div>
            {!collapsed && (
              <div className="user-details">
                <div className="username">Admin</div>
                <div className="role">Quản trị viên</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="main-content">
        <header className="top-header">
          <div className="header-left"><h1>Bảng điều khiển Admin</h1></div>
          <div className="header-right">
            <button className="notification-btn">🔔</button>
            <button className="profile-btn">👤</button>
            <button className="logout-btn">Đăng xuất</button>
          </div>
        </header>

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout

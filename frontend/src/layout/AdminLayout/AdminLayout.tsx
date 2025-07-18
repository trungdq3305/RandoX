// AdminLayout.tsx
import React, { useState } from 'react'
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom'
import './AdminLayout.css'
import Cookies from 'js-cookie'
const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const menuItems = [
    { icon: '💰', label: 'Revenue Dashboard', path: '/admin/revenue' },
    { icon: '👥', label: 'User Management', path: '/admin/accounts' },
    { icon: '⚙️', label: 'System Settings', path: '/admin/settings' },
  ]

  const isActive = (path: string) => location.pathname === path
  const handleLogout = () => {
    Cookies.remove('userData')
    Cookies.remove('userToken')
    navigate('/login')
  }
  return (
    <div className='admin-layout'>
      <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className='sidebar-header'>
          <div className='logo'>
            <span className='logo-icon'>🎲</span>
            {!collapsed && <span className='logo-text'>RandoX Admin</span>}
          </div>
          <button
            className='collapse-btn'
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? '→' : '←'}
          </button>
        </div>

        <nav className='sidebar-nav'>
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            >
              <span className='nav-icon'>{item.icon}</span>
              {!collapsed && <span className='nav-label'>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className='sidebar-footer'>
          <div className='user-info'>
            <div className='avatar'>👤</div>
            {!collapsed && (
              <div className='user-details'>
                <div className='username'>Admin</div>
                <div className='role'>Administrator</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className='main-content'>
        <header className='top-header'>
          <div className='header-left'>
            <h1>Admin Dashboard</h1>
          </div>
          <div className='header-right'>
            <button className='notification-btn'>🔔</button>
            <button className='profile-btn'>👤</button>
            <button className='logout-btn' onClick={handleLogout}>Logout</button>
          </div>
        </header>

        <main className='content'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout

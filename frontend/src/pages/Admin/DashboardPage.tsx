import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import './AdminDashboard.css'

const revenueData = [
  { name: 'T1', revenue: 120 },
  { name: 'T2', revenue: 180 },
  { name: 'T3', revenue: 75 },
  { name: 'T4', revenue: 210 },
  { name: 'T5', revenue: 160 },
  { name: 'T6', revenue: 230 },
]

const userRoleData = [
  { name: 'Admin', value: 2 },
  { name: 'Manager', value: 4 },
  { name: 'Customer', value: 15 },
]

const COLORS = ['#8884d8', '#82ca9d', '#ffc658']

const DashboardPage: React.FC = () => {
  return (
    <div className='admin-dashboard'>
      <div className='stats-grid'>
        <div className='stat-card'>
          <div className='stat-icon' style={{ color: '#3b82f6' }}>
            💰
          </div>
          <div className='stat-content'>
            <h3>6.75M</h3>
            <p>Tổng doanh thu</p>
          </div>
        </div>
        <div className='stat-card'>
          <div className='stat-icon' style={{ color: '#10b981' }}>
            👥
          </div>
          <div className='stat-content'>
            <h3>21</h3>
            <p>Tổng người dùng</p>
          </div>
        </div>
      </div>

      <div className='table-container' style={{ marginTop: 40 }}>
        <div className='table-header'>
          <h2>Biểu đồ tổng quan</h2>
        </div>
        <div
          style={{ display: 'flex', flexWrap: 'wrap', padding: 20, gap: 40 }}
        >
          <div style={{ flex: 1, minWidth: 300 }}>
            <h3 style={{ marginBottom: 10 }}>
              Doanh thu theo tháng (triệu VND)
            </h3>
            <ResponsiveContainer width='100%' height={250}>
              <BarChart data={revenueData}>
                <XAxis dataKey='name' />
                <YAxis />
                <Tooltip />
                <Bar dataKey='revenue' fill='#8884d8' radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ flex: 1, minWidth: 300 }}>
            <h3 style={{ marginBottom: 10 }}>Tỉ lệ vai trò người dùng</h3>
            <ResponsiveContainer width='100%' height={250}>
              <PieChart>
                <Pie
                  data={userRoleData}
                  dataKey='value'
                  nameKey='name'
                  cx='50%'
                  cy='50%'
                  outerRadius={80}
                  label
                >
                  {userRoleData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage

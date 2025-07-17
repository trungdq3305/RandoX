import React, { useState } from 'react'
import {
  Card,
  Col,
  Row,
  Statistic,
  Typography,
  Divider,
  Select,
  Button,
  message,
} from 'antd'
import {
  useGetRevenueSummaryQuery,
  useGetRevenueOverTimeQuery,
  useGetRevenueByLocationQuery,
  useGetRevenueByCategoryQuery,
  useGetTopProductsQuery,
  useGetTopUsersQuery,
  useGetSpinRevenueQuery,
} from '../../features/dashboard/dashboardAPI'
import { DownloadOutlined } from '@ant-design/icons'
import { Line, Pie, Column, Bar, Funnel } from '@ant-design/charts'
import './RevenueDashboard.css'

const RevenueDashboard: React.FC = () => {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month')

  const { data: summary } = useGetRevenueSummaryQuery()
  const { data: overtime } = useGetRevenueOverTimeQuery(period)
  const { data: location } = useGetRevenueByLocationQuery()
  const { data: category } = useGetRevenueByCategoryQuery()
  const { data: topProducts } = useGetTopProductsQuery()
  const { data: topUsers } = useGetTopUsersQuery()
  const { data: spinRevenue } = useGetSpinRevenueQuery()

  const exportExcel = () => {
    fetch('/api/Dashboard/export-excel')
      .then((res) => {
        if (res.ok) return res.blob()
        throw new Error('Export failed')
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `revenue-report-${new Date().toISOString().slice(0, 10)}.xlsx`
        link.click()
      })
      .catch(() => message.error('Failed to export report.'))
  }

  return (
    <div className='revenue-dashboard'>
      <Typography.Title level={2} className='dashboard-title'>
        📊 Revenue Dashboard
      </Typography.Title>

      <Row justify='space-between' align='middle' style={{ marginBottom: 16 }}>
        <Col>
          <Select value={period} onChange={setPeriod}>
            <Select.Option value='week'>Week</Select.Option>
            <Select.Option value='month'>Month</Select.Option>
            <Select.Option value='year'>Year</Select.Option>
          </Select>
        </Col>
        <Col>
          <Button
            icon={<DownloadOutlined />}
            type='primary'
            onClick={exportExcel}
          >
            Export Excel
          </Button>
        </Col>
      </Row>

      <Row gutter={16} className='summary-row'>
        <Col span={6}>
          <Card className='summary-card purple'>
            <Statistic
              title='Total Revenue'
              value={summary?.totalRevenue || 0}
              suffix='₫'
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className='summary-card blue'>
            <Statistic title='Total Orders' value={summary?.totalOrders || 0} />
          </Card>
        </Col>
      </Row>

      <Divider />

      <Row gutter={16}>
        <Col span={16}>
          <Card title='📈 Revenue Over Time'>
            <Line
              data={overtime || []}
              xField='period'
              yField='revenue'
              height={300}
              point={{ size: 5 }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title='📍 Revenue by Location'>
            {Array.isArray(location) && location.length > 0 ? (
              <Pie
                data={location}
                angleField='revenue'
                colorField='location'
                radius={1}
                height={300}
                label={{ type: 'spider' }}
              />
            ) : (
              <Typography.Text>No data available</Typography.Text>
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={12}>
          <Card title='📦 Revenue by Product Category'>
            <Column
              data={category || []}
              xField='categoryName'
              yField='revenue'
              height={300}
              colorField='categoryName'
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title='🎰 Revenue from Lucky Wheel'>
            <Bar
              data={[
                {
                  wheelName: 'Total Spins',
                  revenue: spinRevenue?.totalSpinRevenue || 0,
                },
              ]}
              xField='revenue'
              yField='wheelName'
              height={300}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={12}>
          <Card title='🔥 Top Revenue-Generating Products'>
            <Bar
              data={topProducts || []}
              xField='totalRevenue'
              yField='productName'
              height={300}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title='👑 Top Spending Users'>
            <Funnel
              data={topUsers || []}
              xField='email'
              yField='totalSpent'
              height={300}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default RevenueDashboard

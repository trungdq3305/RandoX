import React, { useState } from 'react'
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Popconfirm,
  Tag,
  message,
} from 'antd'
import moment from 'moment'
import {
  useGetAllAccountsQuery,
  useUpdateAccountMutation,
  useDeleteAccountMutation,
} from '../../features/account/accountAPI'
import type { ColumnsType } from 'antd/es/table'

const { Option } = Select

const ROLE_MAP: { [key: string]: string } = {
  'C6AF9EEA-C011-4B98-9963-009A859D060B': 'Admin',
  '532FCF02-916F-4F2D-A095-60ED4DA8924E': 'Manager',
  'A1FDB0C2-0DAF-4BB0-B075-A3CC0B2FEBEB': 'Customer',
  '59E7061E-5B9C-4DFA-93D2-BAEA9717F37A': 'Staff',
}
const ROLE_OPTIONS = [
  { label: 'Admin', value: 'c6af9eea-c011-4b98-9963-009a859d060b' },
  { label: 'Manager', value: '532fcf02-916f-4f2d-a095-60ed4da8924e' },
  { label: 'Customer', value: 'a1fdb0c2-0daf-4bb0-b075-a3cc0b2febeb' },
  { label: 'Staff', value: '59e7061e-5b9c-4dfa-93d2-baea9717f37a' },
]

const ROLE_COLOR: { [key: string]: string } = {
  Admin: 'purple',
  Manager: 'blue',
  Customer: 'green',
  Staff: 'orange',
}

const AdminAccountManager: React.FC = () => {
  const { data: accounts = [], refetch } = useGetAllAccountsQuery()
  const [updateAccount] = useUpdateAccountMutation()
  const [deleteAccount] = useDeleteAccountMutation()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<any>(null)
  const [form] = Form.useForm()

  const showEditModal = (account: any) => {
    setSelectedAccount(account)
    form.setFieldsValue({
      ...account,
      dob: account.dob ? moment(account.dob) : null,
      roleId: account.roleId?.toLowerCase(),
    })
    setIsModalVisible(true)
  }

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields()
      await updateAccount({
        id: selectedAccount.id,
        body: {
          ...values,
          dob: values.dob?.format('YYYY-MM-DD'),
        },
      }).unwrap()
      message.success('Account updated successfully')
      setIsModalVisible(false)
      refetch()
    } catch (error) {
      message.error('Failed to update account')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteAccount(id).unwrap()
      message.success('Account deleted successfully')
      refetch()
    } catch {
      message.error('Failed to delete account')
    }
  }

  const columns: ColumnsType<any> = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      align: 'center',
    },
    {
      title: 'Date of Birth',
      dataIndex: 'dob',
      key: 'dob',
      align: 'center',
      render: (dob: string) => (dob ? moment(dob).format('DD/MM/YYYY') : '---'),
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      align: 'center',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status: number) =>
        status === 1 ? (
          <Tag color='green'>Active</Tag>
        ) : (
          <Tag color='red'>Locked</Tag>
        ),
    },
    {
      title: 'Role',
      dataIndex: 'roleName',
      key: 'roleName',
      align: 'center',
      render: (roleName: string) => {
        const colorMap: Record<string, string> = {
          Admin: 'geekblue',
          Manager: 'gold',
          Customer: 'cyan',
          Staff: 'purple',
        }
        const color = colorMap[roleName] || 'default'
        return <Tag color={color}>{roleName || 'Other'}</Tag>
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center',
      render: (_: any, record: any) => (
        <Space>
          <Button onClick={() => showEditModal(record)}>Edit</Button>
          <Popconfirm
            title='Are you sure to delete this account?'
            onConfirm={() => handleDelete(record.id)}
            okText='Delete'
            cancelText='Cancel'
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <h2>🛠️ Account Management</h2>
      <Table dataSource={accounts} columns={columns} rowKey='id' />

      <Modal
        title='Edit Account'
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleUpdate}
        okText='Save'
        cancelText='Cancel'
      >
        <Form form={form} layout='vertical'>
          <Form.Item name='phoneNumber' label='Phone Number'>
            <Input />
          </Form.Item>
          <Form.Item name='dob' label='Date of Birth'>
            <DatePicker format='YYYY-MM-DD' />
          </Form.Item>
          <Form.Item name='status' label='Status'>
            <Select>
              <Option value={1}>Active</Option>
              <Option value={0}>Locked</Option>
            </Select>
          </Form.Item>
          <Form.Item name='roleId' label='Role'>
            <Select placeholder='Select role'>
              {ROLE_OPTIONS.map((r) => (
                <Option key={r.value} value={r.value}>
                  {r.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default AdminAccountManager

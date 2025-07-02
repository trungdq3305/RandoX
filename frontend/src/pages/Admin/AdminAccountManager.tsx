import React, { useState } from 'react';
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
} from 'antd';
import moment from 'moment';
import {
  useGetAllAccountsQuery,
  useUpdateAccountMutation,
  useDeleteAccountMutation,
} from '../../features/account/accountAPI';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;

const ROLE_MAP: { [key: string]: string } = {
  'C6AF9EEA-C011-4B98-9963-009A859D060B': 'Admin',
  '532FCF02-916F-4F2D-A095-60ED4DA8924E': 'Manager',
  'A1FDB0C2-0DAF-4BB0-B075-A3CC0B2FEBEB': 'Customer',
  '59E7061E-5B9C-4DFA-93D2-BAEA9717F37A': 'Staff',
};
const ROLE_OPTIONS = [
  { label: 'Admin', value: 'c6af9eea-c011-4b98-9963-009a859d060b' },
  { label: 'Manager', value: '532fcf02-916f-4f2d-a095-60ed4da8924e' },
  { label: 'Customer', value: 'a1fdb0c2-0daf-4bb0-b075-a3cc0b2febeb' },
  { label: 'Staff', value: '59e7061e-5b9c-4dfa-93d2-baea9717f37a' },
];


const ROLE_COLOR: { [key: string]: string } = {
  Admin: 'purple',
  Manager: 'blue',
  Customer: 'green',
  Staff: 'orange',
};

const AdminAccountManager: React.FC = () => {
  const { data: accounts = [], refetch } = useGetAllAccountsQuery();
  const [updateAccount] = useUpdateAccountMutation();
  const [deleteAccount] = useDeleteAccountMutation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [form] = Form.useForm();

  const showEditModal = (account: any) => {
  setSelectedAccount(account);
  form.setFieldsValue({
  ...account,
  dob: account.dob ? moment(account.dob) : null,
  roleId: account.roleId?.toLowerCase(), // Đồng bộ với value ở trên
});

  setIsModalVisible(true);
};


  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      await updateAccount({
        id: selectedAccount.id,
        body: {
          ...values,
          dob: values.dob?.format('YYYY-MM-DD'),
        },
      }).unwrap();
      message.success('Cập nhật tài khoản thành công');
      setIsModalVisible(false);
      refetch();
    } catch (error) {
      message.error('Cập nhật thất bại');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAccount(id).unwrap();
      message.success('Xoá tài khoản thành công');
      refetch();
    } catch {
      message.error('Xoá tài khoản thất bại');
    }
  };

  const columns: ColumnsType<any> = [
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    align: 'center',
  },
  {
    title: 'Ngày sinh',
    dataIndex: 'dob',
    key: 'dob',
    align: 'center',
    render: (dob: string) => (dob ? moment(dob).format('DD/MM/YYYY') : '---'),
  },
  {
    title: 'Số điện thoại',
    dataIndex: 'phoneNumber',
    key: 'phoneNumber',
    align: 'center',
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    align: 'center',
    render: (status: number) =>
      status === 1 ? <Tag color="green">Hoạt động</Tag> : <Tag color="red">Khoá</Tag>,
  },
  {
  title: 'Vai trò',
  dataIndex: 'roleName',
  key: 'roleName',
  align: 'center',
  render: (roleName: string) => {
    const colorMap: Record<string, string> = {
      Admin: 'geekblue',
      Manager: 'gold',
      Customer: 'cyan',
      Staff: 'purple',
    };
    const color = colorMap[roleName] || 'default';
    return <Tag color={color}>{roleName || 'Khác'}</Tag>;
  },
}
,
  {
    title: 'Thao tác',
    key: 'actions',
    align: 'center',
    render: (_: any, record: any) => (
      <Space>
        <Button onClick={() => showEditModal(record)}>Sửa</Button>
        <Popconfirm
          title="Bạn có chắc muốn xoá?"
          onConfirm={() => handleDelete(record.id)}
          okText="Xoá"
          cancelText="Huỷ"
        >
          <Button danger>Xoá</Button>
        </Popconfirm>
      </Space>
    ),
  },
];


  return (
    <div>
      <h2>🛠️ Quản lý tài khoản</h2>
      <Table dataSource={accounts} columns={columns} rowKey="id" />

      <Modal
        title="Chỉnh sửa tài khoản"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleUpdate}
        okText="Lưu"
        cancelText="Huỷ"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="phoneNumber" label="Số điện thoại">
            <Input />
          </Form.Item>
          <Form.Item name="dob" label="Ngày sinh">
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái">
            <Select>
              <Option value={1}>Hoạt động</Option>
              <Option value={0}>Khoá</Option>
            </Select>
          </Form.Item>
          <Form.Item name="roleId" label="Vai trò">
  <Select placeholder="Chọn vai trò">
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
  );
};

export default AdminAccountManager;

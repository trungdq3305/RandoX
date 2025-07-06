import React, { useState } from 'react';
import {
  useGetPendingItemsQuery,
  useApproveAuctionItemMutation,
  useRejectAuctionItemMutation,
} from '../../features/auction/auctionAPI';
import {
  Table,
  Button,
  Input,
  Modal,
  InputNumber,
  Space,
  notification,
  Popconfirm,
  Typography,
} from 'antd';

const { Paragraph } = Typography;

const ManagerApprovalPage: React.FC = () => {
  const { data: items = [], isLoading, refetch } = useGetPendingItemsQuery();
  const [approveItem] = useApproveAuctionItemMutation();
  const [rejectItem] = useRejectAuctionItemMutation();
  const [rejectModal, setRejectModal] = useState<{ itemId: string; visible: boolean }>({ itemId: '', visible: false });
  const [rejectReason, setRejectReason] = useState('');
  const [durationMap, setDurationMap] = useState<Record<string, number>>({});

  const handleApprove = async (itemId: string) => {
    const duration = durationMap[itemId] || 10; // default 10 phút
    try {
      await approveItem({ itemId, durationMinutes: duration }).unwrap();
      notification.success({ message: 'Đã duyệt vật phẩm' });
      refetch();
    } catch {
      notification.error({ message: 'Duyệt thất bại' });
    }
  };

  const handleReject = async () => {
    try {
      await rejectItem({ itemId: rejectModal.itemId, reason: rejectReason }).unwrap();
      notification.success({ message: 'Đã từ chối vật phẩm' });
      setRejectModal({ itemId: '', visible: false });
      setRejectReason('');
      refetch();
    } catch (err: any) {
  console.error('Reject error:', err);
  notification.error({ message: 'Từ chối thất bại' });
}
  };

  return (
    <>
      <h2>Danh sách vật phẩm chờ duyệt</h2>
      <Table
        dataSource={items}
        loading={isLoading}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      >
        <Table.Column title="Tên vật phẩm" dataIndex="name" />
        <Table.Column
          title="Mô tả"
          dataIndex="description"
          render={(text) => <Paragraph ellipsis={{ rows: 2 }}>{text}</Paragraph>}
        />
        <Table.Column
          title="Hình ảnh"
          dataIndex="imageUrl"
          render={(url: string) => <img src={url} alt="preview" style={{ width: 80 }} />}
        />
        <Table.Column title="Giá khởi điểm" dataIndex={['startPrice']} />
        <Table.Column title="Giá chốt" dataIndex={['reservePrice']} />
        <Table.Column title="Bước nhảy" dataIndex={['stepPrice']} />
        <Table.Column
          title="Thời gian đấu giá (phút)"
          render={(_, record: any) => (
            <InputNumber
              min={5}
              defaultValue={10}
              onChange={(val) => setDurationMap((prev) => ({ ...prev, [record.id]: val || 10 }))}
            />
          )}
        />
        <Table.Column
          title="Hành động"
          render={(_, record: any) => (
            <Space>
              <Button type="primary" onClick={() => handleApprove(record.id)}>
                Duyệt
              </Button>
              <Button danger onClick={() => setRejectModal({ itemId: record.id, visible: true })}>
                Từ chối
              </Button>
            </Space>
          )}
        />
      </Table>

      <Modal
        title="Lý do từ chối vật phẩm"
        open={rejectModal.visible}
        onCancel={() => setRejectModal({ itemId: '', visible: false })}
        onOk={handleReject}
        okText="Xác nhận"
      >
        <Input.TextArea
          rows={4}
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="Nhập lý do từ chối"
        />
      </Modal>
    </>
  );
};

export default ManagerApprovalPage;

import React from 'react';
import {
  useGetWonAuctionsQuery,
  useGetShippingInfoQuery,
  useConfirmDeliveryCompleteMutation,
} from '../../features/auction/auctionAPI';
import { Table, Button, notification, Typography } from 'antd';

const { Paragraph } = Typography;

const AdminShippingCompletePage: React.FC = () => {
  const { data: sessions = [], isLoading } = useGetWonAuctionsQuery();
  const [confirmDelivery] = useConfirmDeliveryCompleteMutation();

  const handleConfirm = async (sessionId: string) => {
    try {
      await confirmDelivery(sessionId).unwrap();
      notification.success({ message: 'Đã xác nhận giao hàng và chuyển tiền cho người bán' });
    } catch {
      notification.error({ message: 'Xác nhận thất bại' });
    }
  };

  return (
    <>
      <h2>Phiên đã kết thúc chờ xác nhận giao hàng</h2>
      <Table
        dataSource={sessions}
        loading={isLoading}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        expandable={{
          expandedRowRender: (record) => (
            <ShippingInfo sessionId={record.id} />
          ),
        }}
      >
        <Table.Column title="Tên vật phẩm" dataIndex={['auctionItem', 'name']} />
        <Table.Column title="Giá cuối" dataIndex="finalPrice" />
        <Table.Column title="Kết thúc lúc" dataIndex="endTime" render={(text) => new Date(text).toLocaleString()} />
        <Table.Column
          title="Thao tác"
          render={(_, record) => (
            <Button type="primary" onClick={() => handleConfirm(record.id)}>
              Xác nhận giao hàng
            </Button>
          )}
        />
      </Table>
    </>
  );
};

// 👉 Sub-component để hiển thị địa chỉ giao hàng
const ShippingInfo: React.FC<{ sessionId: string }> = ({ sessionId }) => {
  const { data, isLoading } = useGetShippingInfoQuery(sessionId);

  if (isLoading) return <p>Đang tải thông tin giao hàng...</p>;
  if (!data) return <p style={{ color: 'red' }}>❌ Chưa có địa chỉ xác nhận</p>;

  return (
    <div style={{ paddingLeft: 16 }}>
      <Paragraph strong>Địa chỉ nhận hàng:</Paragraph>
      <Paragraph>{data.address}</Paragraph>
      <Paragraph italic>Email người nhận: {data.email}</Paragraph>
      <Paragraph>Thời gian xác nhận: {new Date(data.confirmedAt).toLocaleString()}</Paragraph>
    </div>
  );
};

export default AdminShippingCompletePage;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  useGetSessionDetailQuery,
  usePlaceBidMutation,
} from '../../features/auction/auctionAPI';
import {
  notification,
  Button,
  Form,
  InputNumber,
  Statistic,
  List,
  Avatar,
  Divider,
  Typography,
} from 'antd';
import {
  connectToAuctionHub,
  disconnectFromAuctionHub,
} from '../../realtime/auctionHub';

const { Countdown } = Statistic;
const { Text } = Typography;

interface Bid {
  id: string;
  amount: number;
  createdAt: string;
  userId: string;
  user?: {
    email: string;
  };
}

const DetailSession: React.FC = () => {
  const { id: sessionId } = useParams<{ id: string }>();
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useGetSessionDetailQuery(sessionId!);

  const [placeBid] = usePlaceBidMutation();
  const [api, contextHolder] = notification.useNotification();
  const [isExpired, setIsExpired] = useState(false);
  const [endTime, setEndTime] = useState<number | null>(null);

  useEffect(() => {
    if (data?.session?.endTime) {
      setEndTime(new Date(data.session.endTime).getTime());
    }
  }, [data]);

  // ✅ Kết nối SignalR
  useEffect(() => {
    if (!sessionId || sessionId === 'undefined') return;

    connectToAuctionHub(
      sessionId,
      (bidderName, amount) => {
        api.info({
          message: `${bidderName} vừa đặt giá mới: ${amount.toLocaleString()}₫`,
        });
        refetch();
      },
      (winnerName, finalAmount) => {
        setIsExpired(true);
        api.success({
          message: 'Phiên đấu giá đã kết thúc',
          description: `${winnerName} thắng với giá ${finalAmount.toLocaleString()}₫`,
        });
      },
      (newEndTime) => {
        const extended = new Date(newEndTime).getTime();
        setEndTime(extended);
        api.info({
          message: 'Gia hạn phiên thêm 5 phút',
        });
      }
    );

    return () => {
      disconnectFromAuctionHub(sessionId);
    };
  }, [sessionId]);

  const openNotification = (type: 'success' | 'error', message: string) => {
    api[type]({
      message: type === 'success' ? 'Thành công' : 'Lỗi',
      description: message,
      duration: 3,
      placement: 'topRight',
    });
  };

  const onFinish = async (values: any) => {
    try {
      await placeBid({ sessionId: sessionId!, amount: values.bidPrice }).unwrap();
      openNotification('success', 'Đặt giá thành công!');
      refetch();
    } catch (err: any) {
      openNotification('error', err?.data || 'Đặt giá thất bại!');
    }
  };

  if (isLoading) return <div>Đang tải phiên đấu giá...</div>;
  if (error || !data?.session) return <div>Không tìm thấy phiên đấu giá.</div>;

  const session = data.session;
  const item = session.auctionItem;
  const bids: Bid[] = (data.bids || []).slice().sort(
    (a: Bid, b: Bid) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const highestBid = bids.length > 0 ? Math.max(...bids.map((b) => b.amount)) : null;

  return (
    <div style={{ maxWidth: '80%', margin: '0 auto', padding: 24 }}>
      {contextHolder}
      <h2>{item?.name}</h2>
      <img src={item?.imageUrl || '/no-image.png'} alt="Ảnh" style={{ width: 300 }} />
      <p>{item?.description}</p>
      <p>Giá khởi điểm: {item?.startPrice?.toLocaleString()} đ</p>
      <p>Giá chốt: {item?.reservePrice?.toLocaleString()} đ</p>
      <p>Bước nhảy: {item?.stepPrice?.toLocaleString()} đ</p>

      <p><strong>Thời gian còn lại:</strong></p>
      {endTime && !isExpired ? (
        <Countdown
          value={endTime}
          format="HH:mm:ss"
          onFinish={() => setIsExpired(true)}
        />
      ) : (
        <Text type="danger"><strong>Phiên đấu giá đã kết thúc.</strong></Text>
      )}

      <Form name="bidForm" onFinish={onFinish} layout="horizontal" style={{ marginTop: 24 }}>
        <Form.Item
          label="Giá đặt"
          name="bidPrice"
          rules={[{ required: true, message: 'Nhập giá đặt!' }]}
        >
          <InputNumber
            min={item?.startPrice}
            style={{ width: 200 }}
            disabled={isExpired}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value!.replace(/(,*)/g, '')}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={isExpired}>
            Đặt giá ngay
          </Button>
        </Form.Item>
      </Form>

      <Divider>Danh sách lượt đặt giá</Divider>

      <List
        itemLayout="horizontal"
        dataSource={bids}
        locale={{ emptyText: 'Chưa có lượt đặt giá nào.' }}
        renderItem={(bid) => {
          const isHighest = bid.amount === highestBid;
          return (
            <List.Item
              style={isHighest ? { backgroundColor: '#fff7e6', border: '1px solid #ffa940' } : {}}
            >
              <List.Item.Meta
                avatar={<Avatar>{bid.user?.email?.charAt(0).toUpperCase() || '?'}</Avatar>}
                title={
                  <>
                    {bid.user?.email || 'Người dùng ẩn danh'}
                    {isHighest && (
                      <Text type="warning" style={{ marginLeft: 8 }}>(Giá cao nhất)</Text>
                    )}
                  </>
                }
                description={`Giá đặt: ${bid.amount.toLocaleString()} đ - Lúc: ${new Date(
                  bid.createdAt
                ).toLocaleString('vi-VN')}`}
              />
            </List.Item>
          );
        }}
      />
    </div>
  );
};

export default DetailSession;

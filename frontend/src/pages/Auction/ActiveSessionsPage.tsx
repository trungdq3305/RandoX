// pages/SessionList/ActiveSessionsPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetActiveSessionsQuery } from '../../features/auction/auctionAPI';
import {
  Card,
  Col,
  Row,
  Typography,
  Spin,
  Button,
  Empty,
  Tag,
  Tooltip,
} from 'antd';

const { Title, Text } = Typography;

const ActiveSessionsPage: React.FC = () => {
  const { data: sessions = [], isLoading } = useGetActiveSessionsQuery();
  const navigate = useNavigate();

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>🎯 Các phiên đấu giá đang diễn ra</Title>

      {isLoading ? (
        <Spin tip="Đang tải phiên đấu giá..." />
      ) : sessions.length === 0 ? (
        <Empty description="Không có phiên nào đang diễn ra" />
      ) : (
        <Row gutter={[16, 16]}>
          {sessions.map((session: any) => {
            const item = session.auctionItem;
            const imageUrl =
              item?.imageUrl && item.imageUrl !== 'string'
                ? item.imageUrl
                : '/no-image.png';

            return (
              <Col xs={24} sm={12} md={8} lg={6} key={session.id}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={item?.name || 'Vật phẩm'}
                      src={imageUrl}
                      style={{ height: 200, objectFit: 'cover' }}
                    />
                  }
                >
                  <Title level={4} ellipsis>
                    {item?.name !== 'string' ? item?.name : 'Vật phẩm không tên'}
                  </Title>

                  <Text>
                    Giá khởi điểm:{' '}
                    <strong>
                      {item?.startPrice?.toLocaleString('vi-VN') || 0}₫
                    </strong>
                  </Text>
                  <br />
                  <Text>
                    Giá chốt:{' '}
                    <strong>
                      {item?.reservePrice?.toLocaleString('vi-VN') || 0}₫
                    </strong>
                  </Text>
                  <br />
                  <Tooltip title="Thời gian kết thúc">
                    <Tag color="blue" style={{ marginTop: 8 }}>
                      ⏰ {new Date(session.endTime).toLocaleString('vi-VN')}
                    </Tag>
                  </Tooltip>

                  <Button
                    type="primary"
                    block
                    style={{ marginTop: 12 }}
                    onClick={() => navigate(`/sessions/${session.id}`)}
                  >
                    Vào đấu giá
                  </Button>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </div>
  );
};

export default ActiveSessionsPage;

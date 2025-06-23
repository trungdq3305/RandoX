import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './auctionDetail.css';
import auctions from '../../data/auction.json';
import Content from '../Content/content';
import AuctionSlider from '../auctionSlider/auctionSlider';
import { notification, Button, Form, InputNumber, Statistic } from 'antd';
const { Timer } = Statistic;

interface Auction {
    id: number;
    name: string;
    initialPrice: number;
    image: string;
    description: string;
    available: boolean;
    brand: string;
    size: string;
    material: string;
    filling: string;
    setNumber: number;
    auctionStartTime: string;
}

const DetailSession: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [auction, setAuction] = useState<Auction | null>(null);
    const [deadline, setDeadline] = useState<number | null>(null);
    const [api, contextHolder] = notification.useNotification();

    const openNotification = (type: 'success' | 'error', message: string) => {
        api[type]({
            message: type === 'success' ? 'Thành công' : 'Lỗi',
            description: message,
            duration: 3, // Notification disappears after 3 seconds
            placement: 'topRight', // Position at top right
        });
    };
    useEffect(() => {
        const selectedAuction = auctions.find((p) => p.id === Number(id));
        setAuction(selectedAuction || null);

        // Calculate the deadline for the countdown
        if (selectedAuction) {
            const startTime = new Date(selectedAuction.auctionStartTime).getTime();
            const now = new Date().getTime();
            const timeLeft = startTime - now; // Time left in milliseconds
            setDeadline(timeLeft > 0 ? timeLeft : 0); // Ensure deadline is not negative
        }
    }, [id]);
    if (!auction) return <div>Session not found</div>;
    const onFinish = (values: any) => {
        const bidPrice = values.bidPrice;
        if (bidPrice < auction.initialPrice) {
            openNotification('error', `Giá đặt phải lớn hơn hoặc bằng giá khởi điểm (${auction.initialPrice.toLocaleString('vi-VN')} đ)!`);
        } else {
            openNotification('success', 'Đặt giá thành công!');
            console.log('Submitted bid:', values);
            // Add your bid submission logic here
        }
    };

    return (
        <div
            style={{
                width: '100%',
                maxWidth: '80%',
                padding: '24px',
                margin: '0 auto',
                position: 'relative',
            }}
        >
            {contextHolder} {/* Notification context holder */}
            <div className="product-detail-container"
                style={{
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}>
                <div className="product-images">
                    {/* Thumbnail images using the same product image */}
                    {[1, 2, 3, 4].map((img) => (
                        <img
                            key={img}
                            src={auction.image}
                            alt={`${auction.name} thumbnail ${img}`}
                            className="thumbnail"
                        />
                    ))}
                </div>
                <div className="product-main">
                    <img src={auction.image} alt={auction.name} className="main-image" />
                </div>
                <div className="product-info">
                    <div className="new-tag">NEW</div>
                    <h1>{auction.name}</h1>
                    <p className="price">{auction.initialPrice.toLocaleString('vi-VN')} đ</p>
                    <div className="details-section">
                        <h3>Details</h3>
                        <p><strong>Brand:</strong> {auction.brand}</p>
                        <p><strong>PRODUCT SIZE:</strong> Height about {auction.size}</p>
                        <p><strong>Material:</strong> {auction.material}</p>
                        <p><strong>Filling:</strong> {auction.filling}</p>
                        {deadline !== null && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <p style={{ margin: 0 }}><strong>Phiên đấu giá bắt đầu: </strong></p>
                                <Timer
                                    type="countdown"
                                    value={Date.now() + deadline}
                                    format="DD ngày HH:mm:ss"
                                    onFinish={() => setDeadline(0)}
                                />
                            </div>
                        )}
                    </div>
                    <div style={{ marginTop: '20px' }}>
                        <Form
                            name="bidForm"
                            onFinish={onFinish}
                            layout="horizontal"
                        >
                            <Form.Item
                                label="Đặt giá"
                                name="bidPrice"
                                rules={[{ required: true, message: 'Vui lòng nhập giá đặt!' }]}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <InputNumber
                                        placeholder="Nhập giá đặt"
                                        className="form-control"
                                        style={{ width: '200px', height: '35px', fontSize: '15px' }}
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                                    />
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        style={{
                                            background: 'linear-gradient(90deg, rgb(255, 0, 242), rgb(0, 106, 255))',
                                            border: 'none',
                                            color: 'white',
                                            padding: '0 16px',
                                            height: '35px',
                                            borderRadius: '15px',
                                        }}
                                    >
                                        Đặt giá ngay
                                    </Button>
                                </div>
                            </Form.Item>
                        </Form>
                    </div>
                    <div className="shipping-section">
                        <h3>SHIPPING & AFTER - SALES SERVICE</h3>
                        {/* Add shipping details here */}
                    </div>
                </div>
            </div>
            <Content
                title='CÁC PHIÊN ĐẤU GIÁ KHÁC'
                btnContent='Xem thêm'
                linkURL='/sessions'
            />
            <AuctionSlider auctions={auctions} />
        </div>
    );
};

export default DetailSession;
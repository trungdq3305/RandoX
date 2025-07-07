import React from 'react';
import { Button, message, Spin } from 'antd';
import { useClearCartMutation, useGetCartQuery, useGetTotalAmountQuery } from '../../features/cart/cartAPI';
import './cart.css';
import type { Cart } from '../../types/cart';
import { LoadingOutlined } from '@ant-design/icons';

interface CartResponse {
    data: {
        data: Cart;
    };
    isLoading: boolean;
}

const CartPage: React.FC = () => {
    const { data: cartData, isLoading } = useGetCartQuery<CartResponse>({
        pageNumber: 1,
        pageSize: 10,
    });
    const { data: totalAmount } = useGetTotalAmountQuery({});
    const [clearCart] = useClearCartMutation();

    // Xử lý loading và error
    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
            </div>
        );
    }
    const cartItems = cartData.data.cartProducts || [];
    const total = totalAmount?.data || 0;

    // Hàm xóa giỏ hàng
    const handleClearCart = async () => {
        try {
            await clearCart({}).unwrap();
            message.success('Giỏ hàng đã được xóa thành công!');
        } catch (error) {
            message.error('Có lỗi xảy ra khi xóa giỏ hàng!');
            console.error('Lỗi khi xóa giỏ hàng:', error);
        }
    };

    return (
        <div
            style={{
                width: '100%',
                maxWidth: '80%',
                padding: '24px',
                margin: '0 auto',
            }}
        >
            <div
                className="item-container"
                style={{
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    display: 'flex',
                }}
            >
                <div>
                    {cartItems.length === 0 ? (<div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                        Cart is empty
                    </div>) : (
                        cartItems.map((item) => (
                            <div
                                key={item.id} // Thêm key để React tối ưu hóa render
                                className="item-detail-container"
                                style={{
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                }}
                            >
                                <div className="item-main">
                                    <img
                                        src={
                                            item?.imageUrl || 'https://prod-eurasian-res.popmart.com/default/20250226_144937_405917____1_____1200x1200.jpg'
                                        }
                                        alt={item?.productName || item?.productSetName}
                                        className="item-main-image"
                                    />
                                </div>
                                <div className="item-info">
                                    <h3>{item?.productName || item?.productSetName}</h3>
                                    <p className="price-item">
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <p style={{ textDecoration: 'line-through', color: 'gray' }}>
                                                {item?.price.toLocaleString('vi-VN')}đ
                                            </p>
                                            <p style={{ color: 'black' }}>
                                                {(item?.price - item?.price * item?.discountValue).toLocaleString('vi-VN')}đ
                                            </p>
                                        </div>
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="cart-detail-container" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ color: 'black', fontSize: '24px', fontWeight: 'lighter' }}>
                        Total Price: {total.toLocaleString('vi-VN')}đ
                    </h3>
                    <div className="actions">
                        <Button
                            type="primary"
                            onClick={handleClearCart}
                            style={{ background: '#ff4d4f', borderColor: '#ff4d4f' }}
                            className="clear-cart-button"
                        >
                            Clear Cart
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
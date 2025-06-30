import React from 'react';


import { useGetCartQuery, useGetTotalAmountQuery } from '../../features/cart/cartAPI';
import './cart.css'
import type { Cart } from '../../types/cart';
import { useGetProductDetailQuery } from '../../features/product/productAPI';
interface Product {
    id: string;
    productName: string;
    description: string;
    price: number;
    image?: string[];
    isDeleted: boolean;
    manufacturerId: string;
    categoryId: string;
    quantity: number;
}
interface CartResponse {
    data: {
        data: Cart;
    }

    isLoading: boolean;
}

interface ProductResponse {
    data: {
        data: Product;
    };
    isLoading: boolean;
    error?: unknown;
}

const CartPage: React.FC = () => {
    const { data: cartData, isLoading } = useGetCartQuery<CartResponse>({
        pageNumber: 1,
        pageSize: 10, // Adjust based on your needs
    });
    const { data: totalAmount } = useGetTotalAmountQuery({});
    // Handle loading state
    if (isLoading) {
        return <div>Loading...</div>;
    }

    const cartItems = cartData?.data || [];
    const total = totalAmount?.data || 0;
    console.log(total)
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
                    {
                        cartItems.cartProducts.map((item) => {
                            const { data: productDetailData, isLoading: isProductLoading } = useGetProductDetailQuery<ProductResponse>(item.productId);
                            const product = productDetailData?.data;
                            if (isProductLoading) {
                                return <div key={item.productId}>Loading product details...</div>;
                            }

                            return (
                                // <div key={item.productId} className="cart-item">
                                //     <img src={product.image?.[0] || 'https://prod-eurasian-res.popmart.com/default/20250226_144937_405917____1_____1200x1200.jpg'} alt={product.productName} />
                                //     <h2>{product.productName}</h2>
                                //     <p>Price: {product.price.toLocaleString('vi-VN')} đ</p>
                                //     <p>Quantity: {item.amount}</p>
                                // </div>

                                <div
                                    className="item-detail-container"
                                    style={{
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    }}
                                >
                                    <div className="item-main">
                                        <img
                                            src={
                                                product.image?.[0] ||
                                                'https://prod-eurasian-res.popmart.com/default/20250226_144937_405917____1_____1200x1200.jpg'
                                            }
                                            alt={product?.productName}
                                            className="item-main-image"
                                        />
                                    </div>
                                    <div className="item-info">
                                        <h3>{product?.productName}</h3>
                                        <p className="price-item">{product?.price.toLocaleString('vi-VN')}đ</p>


                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
                <div className="cart-detail-container"
                    style={{
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}>
                    <h3 style={{ color: 'black', fontSize: '24px', fontWeight: 'lighter' }}>Total Price :{total.toLocaleString('vi-VN')}đ</h3>
                    <p style={{ color: 'black', fontSize: '20px', fontWeight: '600' }}>

                    </p>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
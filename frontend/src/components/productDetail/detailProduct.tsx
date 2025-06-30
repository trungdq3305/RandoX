import React, { useState } from 'react';
import { Button, InputNumber, Spin, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import './productDetail.css';
import ProductsCardSlider from '../productSlider/productSlider';
import Content from '../Content/content';
import type { Products } from '../../types/product';
import { useGetProductDetailQuery, useGetProductListQuery, useAddProductToCartMutation } from '../../features/product/productAPI';
import { LoadingOutlined } from '@ant-design/icons';

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

interface ProductListResponse {
    data: {
        data: {
            items: Products[];
        };
    };
    isLoading: boolean;
}

interface ProductResponse {
    data: {
        data: Product;
    };
    isLoading: boolean;
    error?: unknown;
}

const DetailProduct: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [stock, setStock] = useState(1);
    const [addToCart] = useAddProductToCartMutation();


    // Fetch product details
    const { data: productDetailData, isLoading: isProductLoading, error: productError } = useGetProductDetailQuery<ProductResponse>(id!);
    const product = productDetailData?.data;

    // Fetch product list for the slider
    const { data, isLoading: isProductListLoading } = useGetProductListQuery<ProductListResponse>({
        currentPage: 1,
        pageSize: 5,
    });
    const productList = data?.data?.items || [];

    // Handle loading state
    if (isProductLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
            </div>
        );
    }

    // Handle error or no product
    if (productError || !product) {
        return (
            <div style={{ textAlign: 'center', padding: '24px' }}>
                Product not found
            </div>
        );
    }

    const handleAddToCart = async () => {
        if (!product.isDeleted && product.quantity >= stock) {
            try {
                await addToCart({ productId: product.id, amount: stock }).unwrap();
                message.success(`Added ${stock} of ${product.productName} to cart`);
            } catch (error: any) {
                message.error('Failed to add to cart. Please check the product ID and quantity.');
                console.error('Full error details:', error);
                if (error.status === 400) {
                    console.log('Bad Request Details:', error.data || 'No additional data');
                }
            }
        } else {
            message.warning('Product is out of stock or deleted');
        }
    };

    const handleBuyNow = () => {
        if (!product.isDeleted) {
            console.log(`Buying ${stock} of ${product.productName}`);
            navigate('/checkout');
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
                className="product-detail-container"
                style={{
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
            >
                <div className="product-images">
                    {[1, 2, 3, 4].map((img) => (
                        <img
                            key={img}
                            src={
                                product.image?.[0] ||
                                'https://prod-eurasian-res.popmart.com/default/20250226_144937_405917____1_____1200x1200.jpg'
                            }
                            alt={`${product.productName} thumbnail ${img}`}
                            className="thumbnail"
                        />
                    ))}
                </div>
                <div className="product-main">
                    <img
                        src={
                            product.image?.[0] ||
                            'https://prod-eurasian-res.popmart.com/default/20250226_144937_405917____1_____1200x1200.jpg'
                        }
                        alt={product.productName}
                        className="main-image"
                    />
                </div>
                <div className="product-info">
                    <div className="new-tag">NEW</div>
                    <h1>{product.productName}</h1>
                    <p className="price">{product.price.toLocaleString('vi-VN')} đ</p>
                    <div className="quantity-selector">
                        <span>Quantity</span>
                        <InputNumber
                            min={1}
                            max={product.quantity}
                            value={stock}
                            onChange={(value) => setStock(value || 1)}
                            disabled={product.isDeleted}
                        />
                    </div>
                    <div className="actions">
                        <Button
                            type="primary"
                            onClick={handleAddToCart}
                            style={{ background: '#000', borderColor: '#000' }}
                            disabled={product.isDeleted}
                            className="add-to-cart-button"
                        >
                            ADD TO CART
                        </Button>
                        <Button
                            type="primary"
                            onClick={handleBuyNow}
                            style={{ background: '#f5222d', borderColor: '#f5222d' }}
                            disabled={product.isDeleted}
                            className="buy-now-button"
                        >
                            BUY NOW
                        </Button>
                    </div>
                    <div className="details-section">
                        <h3>Details</h3>
                        <p><strong>Brand:</strong> {product.categoryId}</p>
                        <a href="#product-details">View Product Details</a> |{' '}
                        <a href="#blind-box">What's a blind box</a>
                    </div>
                    <div className="shipping-section">
                        <h3>SHIPPING & AFTER - SALES SERVICE</h3>
                        {/* Add shipping details here */}
                    </div>
                    <Button
                        type="default"
                        onClick={() => navigate('/cart')}
                        style={{ marginTop: '16px' }}
                    >
                        View Cart
                    </Button>
                </div>
            </div>
            <Content title="CÁC SẢN PHẨM" btnContent="Xem thêm" linkURL="/sessions" />
            {isProductListLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '30vh' }}>
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />} />
                </div>
            ) : (
                <ProductsCardSlider products={productList} />
            )}
        </div>
    );
};

export default DetailProduct;
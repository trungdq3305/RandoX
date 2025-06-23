import React, { useState, useEffect } from 'react';
import { Button, InputNumber } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import './productDetail.css';
import products from '../../data/products.json';
import ProductsCardSlider from '../productSlider/productSlider';
import Content from '../Content/content';

interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    description: string;
    available: boolean;
    brand: string;
    size: string;
    material: string;
    filling: string;
    setNumber: number;
    stock: number;
}

const DetailProduct: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState<Product | null>(null);

    useEffect(() => {
        const selectedProduct = products.find((p) => p.id === Number(id));
        setProduct(selectedProduct || null);
    }, [id]);

    if (!product) return <div>Product not found</div>;

    const handleAddToCart = () => {
        if (product.available) {
            console.log(`Added ${quantity} of ${product.name} to cart`);
        }
    };

    const handleBuyNow = () => {
        if (product.available) {
            console.log(`Buying ${quantity} of ${product.name}`);
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
            }}>
            <div className="product-detail-container"
                style={{
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}>
                <div className="product-images">
                    {/* Thumbnail images using the same product image */}
                    {[1, 2, 3, 4].map((img) => (
                        <img
                            key={img}
                            src={product.image}
                            alt={`${product.name} thumbnail ${img}`}
                            className="thumbnail"
                        />
                    ))}
                </div>
                <div className="product-main">
                    <img src={product.image} alt={product.name} className="main-image" />
                </div>
                <div className="product-info">
                    <div className="new-tag">NEW</div>
                    <h1>{product.name}</h1>
                    <p className="price">{product.price.toLocaleString('vi-VN')} đ</p>
                    <div className="quantity-selector">
                        <span>Quantity</span>
                        <InputNumber
                            min={1}
                            max={product.stock}
                            value={quantity}
                            onChange={(value) => setQuantity(value || 1)}
                            disabled={!product.available}
                        />
                    </div>
                    <div className="actions">
                        <Button
                            type="primary"
                            onClick={handleAddToCart}
                            style={{ background: '#000', borderColor: '#000' }}
                            disabled={!product.available}
                            className='add-to-cart-button'
                        >
                            ADD TO CART
                        </Button>
                        <Button
                            type="primary"
                            onClick={handleBuyNow}
                            style={{ background: '#f5222d', borderColor: '#f5222d' }}
                            disabled={!product.available}
                            className='buy-now-button'
                        >
                            BUY NOW
                        </Button>
                    </div>
                    <div className="details-section">
                        <h3>Details</h3>
                        <p><strong>Brand:</strong> {product.brand}</p>
                        <p><strong>PRODUCT SIZE:</strong> Height about {product.size}</p>
                        <p><strong>Material:</strong> {product.material}</p>
                        <p><strong>Filling:</strong> {product.filling}</p>
                        <p><strong>Set Number:</strong> {product.setNumber}</p>
                        <a href="#product-details">View Product Details</a> | <a href="#blind-box">What's a blind box</a>
                    </div>
                    <div className="shipping-section">
                        <h3>SHIPPING & AFTER - SALES SERVICE</h3>
                        {/* Add shipping details here */}
                    </div>
                </div>

            </div>
            <Content
                title='CÁC SẢN PHẨM'
                btnContent='Xem thêm'
                linkURL='/sessions'
            />
            <ProductsCardSlider products={products} />
        </div>

    );
};

export default DetailProduct;
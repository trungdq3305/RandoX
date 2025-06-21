import React from 'react'
import './productSlider.css'
import { Card, Carousel } from 'antd'
import type { Products } from '../../types/product'

interface ProductCardSliderProps {
  products: Products[]
}

const ProductsCardSlider: React.FC<ProductCardSliderProps> = ({ products }) => {
  const truncateName = (name: string, maxLength: number) => {
    return name.length > maxLength ? name.substring(0, maxLength) + '...' : name;
  };

  return (
    <Carousel
      autoplay
      dots
      style={{ padding: '16px 0' }}
      slidesToShow={Math.min(products.length, 3)}
      responsive={[
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
          },
        },
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 2,
          },
        },
      ]}
    >
      {products.map((product) => (
        <div key={product.id}>
          <Card
            hoverable
            style={{
              margin: '0 8px',
              marginTop: '5px',
              marginBottom: '5px',
              borderRadius: '20px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              position: 'relative',
            }}
          >
            {product.stock === 0 && (
              <div style={{
                position: 'absolute',
                top: '8px',
                left: '8px',
                background: '#d9d9d9',
                color: '#000',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
              }}>
                OUT OF STOCK
              </div>
            )}
            <Card.Meta
              title={
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <img src={product.image} alt={product.name} style={{ maxWidth: '100%', height: 'auto' }} />
                </div>
              }
              description={
                <div style={{ textAlign: 'center' }}>
                  <p style={{ color: '#000', margin: '8px 0', fontWeight: 'bold' }}>
                    {truncateName(product.name, 20)}
                  </p>
                  <p>
                    <span style={{ color: '#f5222d', fontWeight: 'bold', fontSize: '16px' }}>
                      {product.price.toLocaleString('vi-VN')} đ
                    </span>
                  </p>
                  {product.brand && <p style={{ color: '#d4a017', margin: '4px 0' }}>{product.brand}</p>}
                </div>
              }
            />
          </Card>
        </div>
      ))}
    </Carousel>
  )
}

export default ProductsCardSlider
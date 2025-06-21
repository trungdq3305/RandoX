import React from 'react';
import Content from '../Content/content';
import { LoadingOutlined } from '@ant-design/icons';
import products from '../../data/products.json'; // Assuming you have a products.json file with product data
import ProductsCardSlider from '../productSlider/productSlider';
import auctions from '../../data/auction.json'
import AuctionSlider from '../auctionSlider/auctionSlider';
const Homepage: React.FC = () => {

  return (
    <div
      style={{
        background: '#f0f2f5',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '80%',
          padding: '24px',
          margin: '0 auto',
        }}
      >
        <div style={{ marginBottom: '48px' }}>
          <Content
            title='CÁC SẢN PHẨM'
            btnContent='Xem thêm'
            linkURL='/sessions'
          />
          {
            products.length < 0 ? (

              <LoadingOutlined
                style={{
                  fontSize: '50px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '30vh',
                }}
              />
            ) : (
              <ProductsCardSlider products={products || []} />
            )
          }
        </div>
        <div style={{ marginBottom: '48px' }}>
          <Content
            title='CÁC PHIÊN ĐẤU GIÁ'
            btnContent='Xem thêm'
            linkURL='/sessions'
          />
          {
            auctions.length < 0 ? (

              <LoadingOutlined
                style={{
                  fontSize: '50px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '30vh',
                }}
              />
            ) : (
              <AuctionSlider auctions={auctions || []} />
            )
          }
        </div>
      </div>
    </div>
  );
};

export default Homepage;
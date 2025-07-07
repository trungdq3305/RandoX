import React from 'react';
import Content from '../Content/content';
import { LoadingOutlined } from '@ant-design/icons';
import ProductsCardSlider from '../productSlider/productSlider';
import auctions from '../../data/auction.json'
import AuctionSlider from '../auctionSlider/auctionSlider';
import { useGetProductListQuery } from '../../features/product/productAPI';
import type { Products } from '../../types/product';

interface ProductListResponse {
  data: {
    data: {
      items: Products[]
    }
  }
  isLoading: boolean
}

const Homepage: React.FC = () => {
  const { data, isLoading } = useGetProductListQuery<ProductListResponse>({
    pageNumber: 1,
    pageSize: 5,
  })
  const productList = data?.data?.items || null;

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
            isLoading ? (

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
              <ProductsCardSlider products={productList || []} />
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
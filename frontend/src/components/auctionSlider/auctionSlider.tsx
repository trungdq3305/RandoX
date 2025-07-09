import React from 'react'
import './auctionSlider.css'
import { Card, Carousel } from 'antd'
import type { Auctions } from '../../types/auction'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'

interface AuctionCardSliderProps {
  auctions: Auctions[]
}

const AuctionSlider: React.FC<AuctionCardSliderProps> = ({ auctions }) => {
  const truncateName = (name: string, maxLength: number) => {
    return name.length > maxLength ? name.substring(0, maxLength) + '...' : name
  }
  const navigate = useNavigate() // Initialize navigate hook
  const handleCardClick = (id: string | number) => {
    navigate(`/sessions/${id}`) // Navigate to product details page
  }
  return (
    <Carousel
      autoplay
      dots
      style={{ padding: '16px 0' }}
      slidesToShow={Math.min(auctions.length, 3)}
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
      {auctions.map((auction) => (
        <div key={auction.id}>
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
            onClick={() => handleCardClick(auction.id)} // Add click handler
          >
            <Card.Meta
              title={
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <img
                    src={auction.image}
                    alt={auction.name}
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                </div>
              }
              description={
                <div style={{ textAlign: 'center' }}>
                  <p
                    style={{
                      color: '#000',
                      margin: '8px 0',
                      fontWeight: 'bold',
                    }}
                  >
                    {truncateName(auction.name, 20)}
                  </p>
                  <p>
                    <span
                      style={{
                        color: '#9E9E9E',
                        fontWeight: 'bold',
                        fontSize: '16px',
                      }}
                    >
                      Initial price:{' '}
                      {auction.initialPrice.toLocaleString('vi-VN')} đ
                    </span>
                  </p>
                  {auction.auctionStartTime && (
                    <p style={{ color: '#d4a017', margin: '4px 0' }}>
                      Start time:{' '}
                      {moment(auction.auctionStartTime).format(
                        'DD/MM/YYYY HH:mm'
                      )}
                    </p>
                  )}
                </div>
              }
            />
          </Card>
        </div>
      ))}
    </Carousel>
  )
}

export default AuctionSlider

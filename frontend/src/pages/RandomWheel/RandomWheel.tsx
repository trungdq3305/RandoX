import React, { useState } from 'react';
import './RandomWheel.css';

const characters = [
  'https://cdn.shopify.com/s/files/1/0731/6514/4343/products/6941848238177-nentrang.jpg?v=1707209806&width=400', 'https://cdn.shopify.com/s/files/1/0731/6514/4343/files/mo-hinh-do-choi-skullpanda-the-sound-pop-mart-6941848290694_15.jpg?v=1719997550&width=400', 'https://cdn.shopify.com/s/files/1/0731/6514/4343/files/6941848266866_1.jpg?v=1711526236&width=400', // thay bằng đường dẫn thực tế
  'https://cdn.shopify.com/s/files/1/0731/6514/4343/files/mo-hinh-do-choi-52-toys-lotso-it-s-me-6958985023450_521f1b6da2a84e80ac793607b61d35f4_master.jpg?v=1706844607&width=400', 'https://cdn.shopify.com/s/files/1/0731/6514/4343/files/mo-hinh-skullpanda-tell-me-what-you-want-series-figures-pop-mart-6931571034481_3.jpg?v=1733971547&width=400', 'https://cdn.shopify.com/s/files/1/0731/6514/4343/files/hin-chan-classic-scenes-6958985023610_92d096cb8a6c4043b3d82c58dbbe761d_470f6e56dbc043cbb11faa584aa81e9e_master.jpg?v=1716262209&width=400',
  'https://cdn.shopify.com/s/files/1/0731/6514/4343/files/mo-hinh-butterbear-my-buttery-bakery-series-blind-box-funism-mx2088_2.jpg?v=1738628420&width=400', 'https://cdn.shopify.com/s/files/1/0731/6514/4343/files/mo-hinh-alexander-the-fat-tiger-roaring-love-blind-box-funism-mx2072.jpg?v=1738628211&width=400', 'https://cdn.shopify.com/s/files/1/0731/6514/4343/files/do-choi-khui-trai-chuoi-kham-pha-nghi-trua-bat-ngo-minions-eu356511_8.jpg?v=1719397175&width=400',
  'https://cdn.shopify.com/s/files/1/0731/6514/4343/files/mo-hinh-pop-bean-lucky-cat-series-pop-mart-6931571007287_0.jpg?v=1732681931&width=400', 'https://cdn.shopify.com/s/files/1/0731/6514/4343/files/mo-hinh-doraemon-take-a-break-52toys-6958985023474.jpg?v=1720498500&width=400', 'https://cdn.shopify.com/s/files/1/0731/6514/4343/files/mo-hinh-mega-space-molly-100-series-3-pop-mart-6941848280855_5.jpg?v=1722314939&width=400',
];

export default function RandomWheel() {
  const [activeTab, setActiveTab] = useState<'wheel' | 'history'>('wheel');

  return (
    <div className="background">
    <div className="random-wheel-container">
      <div className="tab-header">
        <span
          className={activeTab === 'wheel' ? 'active' : ''}
          onClick={() => setActiveTab('wheel')}
        >
          Vòng quay may mắn
        </span>
        <span
          className={activeTab === 'history' ? 'active' : ''}
          onClick={() => setActiveTab('history')}
        >
          Lịch sử vòng quay
        </span>
      </div>

      {activeTab === 'wheel' && (
        <div className="wheel-content">
          <div className="wheel-box">
            <button className="detail-button">Chi tiết</button>
            <div className="item-grid">
              {characters.map((img, index) => (
                <img key={index} src={img} alt={`character-${index}`} />
              ))}
            </div>
            <button className="random-button">Random giá</button>
          </div>

          <div className="wheel-box">
            <button className="detail-button">Chi tiết</button>
            <div className="item-grid">
              {characters.map((img, index) => (
                <img key={index} src={img} alt={`character-${index}`} />
              ))}
            </div>
            <button className="random-button">Random túi mù</button>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="history-content">
          <button className="history-detail-button">Chi tiết</button>
          <button className="history-list-button">Lịch sử</button>
        </div>
      )}
    </div>
    </div>
  );
}

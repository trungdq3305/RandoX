import React, { useState } from 'react'
import { Button, Collapse, Spin, message, type CollapseProps } from 'antd'
import { useParams, useNavigate } from 'react-router-dom'
import './productDetail.css'
import ProductsCardSlider from '../productSlider/productSlider'
import Content from '../Content/content'
import type { Products } from '../../types/product'
import {
  useGetProductDetailQuery,
  useGetProductListQuery,
  useAddProductToCartMutation,
} from '../../features/product/productAPI'
import { LoadingOutlined } from '@ant-design/icons'

interface Product {
  id: string
  productName: string
  description: string
  price: number
  imageUrl?: string
  isDeleted: boolean
  manufacturerName: string
  categoryName: string
  quantity: number
  discountValue: number
  productSetId: string
}

interface ProductListResponse {
  data: {
    data: {
      items: Products[]
    }
  }
  isLoading: boolean
}

interface ProductResponse {
  data: {
    data: Product
  }
  isLoading: boolean
  error?: unknown
}

const DetailProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [stock] = useState(1)
  const [addToCart] = useAddProductToCartMutation()
  // Fetch product details
  const {
    data: productDetailData,
    isLoading: isProductLoading,
    error: productError,
  } = useGetProductDetailQuery<ProductResponse>(id!)
  const product = productDetailData?.data

  // Fetch product list for the slider
  const { data, isLoading: isProductListLoading } =
    useGetProductListQuery<ProductListResponse>({
      currentPage: 1,
      pageSize: 5,
    })
  const productList = data?.data?.items || []

  // Handle loading state
  if (isProductLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
      </div>
    )
  }

  // Handle error or no product
  if (productError || !product) {
    return (
      <div style={{ textAlign: 'center', padding: '24px' }}>
        Product not found
      </div>
    )
  }

  const handleAddToCart = async () => {
    if (!product.isDeleted && product.quantity >= stock) {
      try {
        await addToCart({ productId: product.id, amount: stock }).unwrap()
        message.success(`Added ${stock} of ${product.productName} to cart`)
      } catch (error: any) {
        message.error(`${error}`)
        console.error('Full error details:', error)
        if (error.status === 400) {
          console.log(
            'Bad Request Details:',
            error.data || 'No additional data'
          )
        }
      }
    } else {
      message.warning('Product is out of stock or deleted')
    }
  }
  const children = (
    <div>
      <p style={{ fontWeight: 'lighter', fontStyle: 'oblique' }}>
        Bộ sưu tập: {product.categoryName}
      </p>
      <p style={{ fontWeight: 'lighter', fontStyle: 'oblique' }}>
        Mô tả: {product.description}
      </p>
      <p style={{ fontWeight: 'lighter', fontStyle: 'oblique' }}>
        Nhà phát hành: {product.manufacturerName}
      </p>
      <p style={{ color: '#F57F17' }}>
        Giảm giá: {product.discountValue * 100}%
      </p>
    </div>
  )
  const shipping = (
    <>
      <p style={{ color: '#333', fontSize: '16px' }}>1. Shipping:</p>
      <ul style={{ listStyleType: 'none', paddingLeft: '0', fontSize: '14px' }}>
        <li style={{ marginBottom: '10px' }}>
          <strong>Standard Shipping</strong> (15-30 working days)
        </li>
        <li style={{ marginBottom: '10px' }}>
          <strong>Expedited Shipping</strong> (3-7 working days)
        </li>
      </ul>

      <p style={{ color: '#333', fontSize: '16px' }}>2. Defects:</p>
      <ul style={{ listStyleType: 'none', paddingLeft: '0', fontSize: '14px' }}>
        <li style={{ marginBottom: '10px' }}>
          (1) Limited items don't have an exchange service. If you find a
          serious defect in the item, contact{' '}
          <a
            href='mailto:support@popmart.com'
            style={{ color: '#0066cc', textDecoration: 'none' }}
          >
            support@popmart.com
          </a>
          , with the related order number and unpacking video of the figurine
          within seven(7) days of receiving the product.
        </li>
        <li style={{ marginBottom: '10px' }}>
          (2) For information security reasons, please contact us with the email
          address you used to place the order. You will be contacted by a
          Customer Support Representative who will assist you in resolving the
          issue.
        </li>
        <li style={{ marginBottom: '10px' }}>
          (3) In order to avoid any disputes regarding refunds or exchanges,
          customers are encouraged to video record themselves opening the
          package. A video recording must be completed no later than two days
          after delivery. A video should clearly show the shipping sheet, the
          package condition, and product defects.
        </li>
      </ul>

      <p style={{ color: '#333', fontSize: '16px' }}>3. Tax Fees:</p>
      <ul style={{ listStyleType: 'none', paddingLeft: '0', fontSize: '14px' }}>
        <li style={{ marginBottom: '10px' }}>
          For international express shipments, the buyer shall bear any Customs
          Duty costs.
        </li>
      </ul>

      <p style={{ color: '#333', fontSize: '16px' }}>4. Stock Availability:</p>
      <ul style={{ listStyleType: 'none', paddingLeft: '0', fontSize: '14px' }}>
        <li style={{ marginBottom: '10px' }}>
          Due to special circumstances with the products, there might be
          occasions where items are out of stock.
        </li>
      </ul>

      <p style={{ color: '#333', fontSize: '16px' }}>5. Stock Shortages:</p>
      <ul style={{ listStyleType: 'none', paddingLeft: '0', fontSize: '14px' }}>
        <li style={{ marginBottom: '10px' }}>
          In the event of stock shortages, the unavailable items will be
          automatically refunded, and the rest of your order will be dispatched
          as usual.
        </li>
      </ul>

      <p style={{ color: '#333', fontSize: '16px' }}>6. Notice:</p>
      <ul style={{ listStyleType: 'none', paddingLeft: '0', fontSize: '14px' }}>
        <li style={{ marginBottom: '10px' }}>
          To ensure fast and safe delivery of this item, we will match the best
          logistics channel for you. Shipping fees will be automatically
          calculated at checkout page based on the weight, dimensions, and
          delivery distance of the product.
        </li>
      </ul>
    </>
  )

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: 'Chi tiêt',
      children: <>{children}</>,
    },
    {
      key: '2',
      label: 'Vận chuyển & Dịch vụ chăm sóc khách hàng',
      children: <>{shipping}</>,
    },
  ]

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
      className='main-detail'
    >
      <div
        style={{
          width: '100%',
          maxWidth: '80%',
          padding: '24px',
          margin: '0 auto',
        }}
      >
        <div
          className='product-detail-container'
          style={{
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          <div className='product-images'>
            {[1, 2, 3, 4].map((img) => (
              <img
                key={img}
                src={
                  product?.imageUrl ||
                  'https://prod-eurasian-res.popmart.com/default/20250226_144937_405917____1_____1200x1200.jpg'
                }
                alt={`${product.productName} thumbnail ${img}`}
                className='thumbnail'
              />
            ))}
          </div>
          <div className='product-main'>
            <img
              src={
                product.imageUrl ||
                'https://prod-eurasian-res.popmart.com/default/20250226_144937_405917____1_____1200x1200.jpg'
              }
              alt={product.productName}
              className='main-image'
            />
          </div>
          <div className='product-info'>
            <div className='new-tag'>
              {product.discountValue ? `-${product.discountValue * 100}%` : 'NEW'}
            </div>
            <h1>{product.productName}</h1>
            <p className='price'>
              {product.discountValue ? (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <p style={{ textDecoration: 'line-through', color: 'gray' }}>
                    {product.price.toLocaleString('vi-VN')}đ
                  </p>
                  <p>
                    {(
                      product.price -
                      product.price * product.discountValue
                    ).toLocaleString('vi-VN')}
                    đ
                  </p>
                </div>
              ) : (
                product.price.toLocaleString('vi-VN')
              )}{' '}
            </p>
            <div className='actions'>
              <Button
                type='primary'
                onClick={handleAddToCart}
                style={{ background: '#000', borderColor: '#000' }}
                disabled={product.isDeleted}
                className='add-to-cart-button'
              >
                ADD TO CART
              </Button>
              {/* Thêm các nút mới */}
              <Button
                type='default'
                onClick={() => {
                  if (!product.isDeleted) {
                    // Thêm logic xử lý cho Single Box (ví dụ: navigate hoặc gọi API)
                    navigate(`/products/${product.id}`)
                  }
                }}
                disabled={product.isDeleted}
                style={{ marginRight: '10px' }}
              >
                <img
                  src={
                    product?.imageUrl ||
                    'https://prod-eurasian-res.popmart.com/default/20250226_144937_405917____1_____1200x1200.jpg'
                  }
                  alt='Single Box'
                  style={{
                    width: '20px',
                    marginRight: '8px',
                    objectFit: 'cover',
                  }}
                />
                Single Box
              </Button>
              <Button
                type='default'
                onClick={() => {
                  if (!product.isDeleted) {
                    console.log(
                      `Selected Whole Set for productSetId: ${product.productSetId}`
                    )
                    // Thêm logic xử lý cho Whole Set (ví dụ: navigate hoặc gọi API)
                    navigate(`/productSet/${product.productSetId}`)
                  }
                }}
                disabled={product.isDeleted}
              >
                <img
                  src={
                    product?.imageUrl ||
                    'https://prod-eurasian-res.popmart.com/default/20250226_144937_405917____1_____1200x1200.jpg'
                  }
                  alt='Whole Set'
                  style={{
                    width: '20px',
                    marginRight: '8px',
                    objectFit: 'cover',
                    borderRadius: '10px',
                  }}
                />
                Whole Set
              </Button>
            </div>
            <div className='details-section'>
              <Collapse
                defaultActiveKey={['1']}
                items={items}
                expandIconPosition='end'
                bordered={true}
              />
            </div>
          </div>
        </div>
        <Content title='CÁC SẢN PHẨM' btnContent='Xem thêm' linkURL='/sessions' />
        {
          isProductListLoading ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '30vh',
              }}
            >
              <Spin indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />} />
            </div>
          ) : (
            <ProductsCardSlider products={productList} />
          )
        }
      </div >
    </div>
  )
}

export default DetailProduct

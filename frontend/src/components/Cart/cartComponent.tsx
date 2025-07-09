import React, { useState } from 'react'
import { Button, message, Spin } from 'antd'
import {
  useClearCartMutation,
  useGetCartQuery,
  useGetTotalAmountQuery,
} from '../../features/cart/cartAPI'
import './cart.css'
import type { Cart } from '../../types/cart'
import { LoadingOutlined } from '@ant-design/icons'
import type { Vouchers } from '../../types/voucher'
import { useGetVoucherListQuery } from '../../features/cart/voucherAPI'
import { useCreateOrderMutation } from '../../features/cart/orderAPI'
import { useCreatePaymentMutation } from '../../features/payment/paymentAPI'

interface CartResponse {
  data: {
    data: Cart
  }
  isLoading: boolean
}

interface VoucherListResponse {
  data: {
    data: {
      items: Vouchers[]
    }
  }
  isLoading: boolean
}

const CartPage: React.FC = () => {
  const { data: cartData, isLoading } = useGetCartQuery<CartResponse>({
    pageNumber: 1,
    pageSize: 10,
  })
  const { data: voucherList, isLoading: isVoucherLoading } =
    useGetVoucherListQuery<VoucherListResponse>({
      pageNumber: 1,
      pageSize: 10,
    })
  const voucherListData = voucherList?.data?.items || []

  const { data: totalAmount } = useGetTotalAmountQuery({})
  const [clearCart] = useClearCartMutation()
  const [paymentUrl] = useCreatePaymentMutation()
  const [createOrder] = useCreateOrderMutation()

  const [voucherId, setVoucherId] = useState<string>()
  // Xử lý loading và error
  if (isLoading || isVoucherLoading) {
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
  const cartItems = cartData?.data?.cartProducts || []
  const total = totalAmount?.data || 0

  // Hàm xóa giỏ hàng
  const handleClearCart = async () => {
    try {
      await clearCart({}).unwrap()
      message.success('Giỏ hàng đã được xóa thành công!')
    } catch (error) {
      message.error('Có lỗi xảy ra khi xóa giỏ hàng!')
      console.error('Lỗi khi xóa giỏ hàng:', error)
    }
  }

  // Hàm xử lý chọn voucher (có thể mở rộng)
  const handleSelectVoucher = (voucher: Vouchers) => {
    message.success(`Đã chọn voucher: ${voucher.voucherName}`)
    setVoucherId(voucher.id)
    // Thêm logic xử lý voucher tại đây (ví dụ: gọi API để áp dụng voucher)
  }

  const handlePurchase = async () => {
    try {
      const orderResponse = await createOrder({
        shippingCost: 10000,
        voucherId: voucherId || '',
      }).unwrap()
      console.log(orderResponse.data.id)
      const orderId = orderResponse.data.id
      const paymentResponse = await paymentUrl({ orderId }).unwrap()
      const redirectUrl = paymentResponse.paymentUrl
      window.open(redirectUrl, '_blank')
      message.success('Đặt hàng thành công!')
    } catch (error) {
      message.error('Có lỗi xảy ra khi đặt hàng!')
      console.error('Lỗi khi đặt hàng:', error)
    }
  }

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
        className='item-container'
        style={{
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          display: 'flex',
        }}
      >
        <div>
          <div className='actions'>
            <Button
              type='primary'
              onClick={handleClearCart}
              style={{
                background: '#ff4d4f',
                borderColor: '#ff4d4f',
                alignSelf: 'center',
              }}
              className='clear-cart-button'
            >
              Clear Cart
            </Button>
          </div>
          {cartItems.length === 0 ? (
            <div
              style={{ textAlign: 'center', padding: '40px', color: '#888' }}
            >
              Cart is empty
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className='item-detail-container'
                style={{
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              >
                <div className='item-main'>
                  <img
                    src={
                      item?.imageUrl ||
                      'https://prod-eurasian-res.popmart.com/default/20250226_144937_405917____1_____1200x1200.jpg'
                    }
                    alt={item?.productName || item?.productSetName}
                    className='item-main-image'
                  />
                </div>
                <div className='item-info'>
                  <h3>{item?.productName || item?.productSetName}</h3>
                  <p className='price-item'>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <p
                        style={{
                          textDecoration: 'line-through',
                          color: 'gray',
                        }}
                      >
                        {item?.price.toLocaleString('vi-VN')}đ
                      </p>
                      <p style={{ color: 'black' }}>
                        {(
                          item?.price -
                          item?.price * item?.discountValue
                        ).toLocaleString('vi-VN')}
                        đ
                      </p>
                    </div>
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        <div
          className='cart-detail-container'
          style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        >
          <h3
            style={{ color: 'black', fontSize: '24px', fontWeight: 'lighter' }}
          >
            Total Price: {total.toLocaleString('vi-VN')}đ
          </h3>
          <div style={{ margin: '10px 0' }}>
            <h4 style={{ marginBottom: '10px' }}>Select Voucher:</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {voucherListData.length === 0 ? (
                <div style={{ color: '#888' }}>No vouchers available</div>
              ) : (
                voucherListData.map((voucher) => (
                  <div
                    key={voucher.id}
                    className='voucher-card'
                    onClick={() => handleSelectVoucher(voucher)}
                    style={{
                      backgroundColor: '#fff5e6',
                      borderRadius: '10px',
                      padding: '10px 15px',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      transition: 'transform 0.2s',
                    }}
                  >
                    <span>{voucher.voucherName}</span>
                  </div>
                ))
              )}
            </div>
            <div className='actions'>
              <Button
                type='primary'
                onClick={handlePurchase}
                className='order-cart-button'
              >
                Purchase
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage

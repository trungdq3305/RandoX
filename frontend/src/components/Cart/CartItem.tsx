// src/components/CartItem/CartItem.tsx (hoặc vị trí bạn muốn)
import React from 'react'
import { useGetProductDetailQuery } from '../../features/product/productAPI'

// Định nghĩa lại các kiểu dữ liệu cần thiết nếu chúng chưa được export
interface Product {
  id: string
  productName: string
  description: string
  price: number
  image?: string[]
  isDeleted: boolean
  manufacturerId: string
  categoryId: string
  quantity: number
}
interface ProductResponse {
  data: {
    data: Product
  }
  isLoading: boolean
  // ... các thuộc tính khác
}

interface CartItemProps {
  item: any // Sử dụng type chính xác cho item trong giỏ hàng
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  // ✅ Hook được gọi ở cấp cao nhất của component CartItem
  const { data: productDetailData, isLoading: isProductLoading } =
    useGetProductDetailQuery<ProductResponse>(item.productId)

  if (isProductLoading) {
    // Có thể thêm một skeleton loader ở đây cho đẹp hơn
    return <div>Loading product...</div>
  }

  // Nếu không có dữ liệu sản phẩm thì không hiển thị gì cả
  if (!productDetailData?.data) {
    return null
  }

  const product = productDetailData.data

  return (
    <div
      className='item-detail-container'
      style={{
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        marginBottom: '16px', // Thêm khoảng cách giữa các item
      }}
    >
      <div className='item-main'>
        <img
          src={
            product.image?.[0] ||
            'https://prod-eurasian-res.popmart.com/default/20250226_144937_405917____1_____1200x1200.jpg'
          }
          alt={product.productName}
          className='item-main-image'
        />
      </div>
      <div className='item-info'>
        <h3>{product.productName}</h3>
        <p className='price-item'>{product.price.toLocaleString('vi-VN')}đ</p>
        {/* Bạn có thể muốn hiển thị số lượng ở đây */}
        <p>Số lượng: {item.amount}</p>
      </div>
      {/* Thêm các nút tăng/giảm số lượng hoặc xóa sản phẩm ở đây */}
    </div>
  )
}

export default CartItem

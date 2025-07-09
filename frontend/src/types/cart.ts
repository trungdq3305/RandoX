export interface Cart {
  id: string
  cartProducts: CartItem[]
}
export interface CartItem {
  id: string
  productName: string
  productSetName: string
  amount: number
  price: number
  imageUrl: string
  discountValue: number
}

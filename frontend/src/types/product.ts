export interface Products {
  id: string
  productName: string
  description: string
  price: number
  image?: string[]
  isDeleted: boolean
  manufacturerId: string
  categoryName: string
  quantity: number
  imageUrl: string
}

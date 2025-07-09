export interface Vouchers {
  id: string
  voucherName: string
  voucherDiscountAmount: number
  isDiscountPercentage: boolean
  startDate: string
  endDate: string
  amount: number
  minOrderValue: number
  maxDiscountValue: number
  isActive: boolean
  isDeleted: boolean
  amountForSpin: number
}

export interface Auctions {
  id: string
  startTime: Date
  endTime: Date
  finalPrice: number
  isEnded: boolean
  auctionBids: string[]
  auctionItem: AuctionItems
}
export interface AuctionItems {
  id: string;
  userId: string;
  name: string;
  description: string;
  imageUrl?: string;
  condition: string;
  startPrice: number,
  stepPrice: number,
  reservePrice: number,
  status: number,
  staffNote?: string,
}
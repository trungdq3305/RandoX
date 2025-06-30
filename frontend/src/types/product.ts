export interface Products {
  id: string;
  productName: string;
  description: string;
  price: number;
  image?: string[];
  isDeleted: boolean;
  manufacturerId: string;
  categoryId: string;
  quantity: number;
}

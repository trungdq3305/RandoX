// export interface Products {
//   id: number;
//   name: string;
//   description: string;
//   price: number;
//   image: string;
//   available: boolean;
//   brand: string;
//   size: string;
//   material: string;
//   filling: string;
//   setNumber: number;
//   stock: number;
// }

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

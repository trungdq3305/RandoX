export interface Cart {
    id: string;
    cartProducts: CartItem[];
}
export interface CartItem {

    id: string;
    productId: string;
    cartId: string;
    amount: number;
}
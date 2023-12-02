export interface Basket {
    id: number
    buyerId: string
    items: BasketItem[]
  }
  
  export interface BasketItem {
    productId: number
    name: string
    price: number
    pictureURL: string
    type: string
    category: string
    quantity: number
  }
  
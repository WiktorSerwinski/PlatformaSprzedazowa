interface Address {
    name: string;
    lastName: string;
    adress: string;
    city: string;
    zipCode: string;
  }
  interface OrderedProduct {
    productId: number;
    name: string;
    pictureUrl: string;
    price: number;
    quantity: number;
  }
  interface Order {
    id: number;
    buyerId: string;
    address: Address;
    orderedProducts: OrderedProduct[];
    orderDate: string;
    subtotal: number;
    deliveryFee: number;
    status: string;
    total: number;
  }
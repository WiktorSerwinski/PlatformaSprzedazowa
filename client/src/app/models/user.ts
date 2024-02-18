import { Basket } from "./basket";

export interface User {
    email: string,
    token: string,
    accountStatus: number,
    basket?: Basket,
    roles?: string[]
  }
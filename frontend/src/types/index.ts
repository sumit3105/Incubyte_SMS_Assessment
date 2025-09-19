export type Role = "admin" | "customer";

export interface User {
  name?: string;
  email?: string;
  role?: Role;
}

export interface Sweet {
  _id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

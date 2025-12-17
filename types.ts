export interface Product {
  id: string;
  name: string;
  farm: string;
  price: number;
  unit: string;
  image: string;
  rating: number;
  reviews: number;
  tags: string[];
  description?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Review {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  comment: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'Confirmed' | 'Preparing' | 'Shipping' | 'Delivered';
  total: number;
}

export enum UserRole {
  BUYER = 'BUYER',
  SELLER = 'SELLER'
}

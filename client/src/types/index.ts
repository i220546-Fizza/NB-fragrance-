export type Gender = 'Men' | 'Women' | 'Unisex';
export type CollectionName = 'Eclipse' | 'Signature' | 'Midnight' | 'Essence';
export type Category = 'Men' | 'Women' | 'Unisex' | 'Premium' | 'Gift Sets';
export type FragranceFamily =
  | 'Fresh'
  | 'Floral'
  | 'Woody'
  | 'Oud'
  | 'Musky'
  | 'Sweet'
  | 'Citrus'
  | 'Oriental';

export interface Review {
  user: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  gender: Gender;
  collectionName: CollectionName;
  category: Category;
  fragranceFamily: FragranceFamily;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  longevity: string;
  sillage: string;
  occasion: string[];
  season: string[];
  size: string;
  stock: number;
  featured: boolean;
  bestseller: boolean;
  isNewArrival: boolean;
  reviews: Review[];
  rating: number;
  numReviews: number;
  createdAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  phone?: string;
  address?: {
    address?: string;
    city?: string;
    postalCode?: string;
  };
  wishlist?: string[];
}

export interface OrderItem {
  product: string;
  name: string;
  image: string;
  price: number;
  qty: number;
  size: string;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export interface Order {
  _id: string;
  orderItems: OrderItem[];
  customerInfo: {
    fullName: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
  };
  notes?: string;
  paymentMethod: string;
  itemsPrice: number;
  /** Flat delivery fee, always Rs. 200 — never free, never conditional. */
  deliveryCharge: number;
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
  user?: string;
}

export interface PaginatedProducts {
  products: Product[];
  page: number;
  pages: number;
  total: number;
}

export interface AdminStats {
  totalOrders: number;
  totalSales: number;
  totalProducts: number;
  lowStockCount: number;
  pendingOrders: number;
  recentOrders: Order[];
  salesTrend: { date: string; total: number }[];
  statusBreakdown: Record<string, number>;
}

export interface CartItem {
  product: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  qty: number;
  size: string;
  stock: number;
}

export interface ApiError {
  message: string;
}

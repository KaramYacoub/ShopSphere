export interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
}

export interface OrderItem {
  productId: Product | string;
  quantity: number;
  price: number;
  name: string;
  image: string;
  _id: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  _id: string;
}

export interface ShippingMethod {
  name: string;
  price: number;
  delivery: string;
}

export interface Order {
  _id: string;
  userId: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  shippingAddress: ShippingAddress;
  shippingMethod: ShippingMethod;
  paymentMethod: string;
  paymentStatus: "pending" | "completed" | "failed" | "refunded";
  estimatedDelivery: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
}

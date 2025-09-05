// ============================================================================
// PRODUCT & CATEGORY TYPES
// ============================================================================

export interface Product {
  _id: string;
  image: string;
  name: string;
  description?: string;
  onSale: boolean;
  rating: number;
  numReviews: number;
  discountPrice?: number;
  price: number;
  stock: number;
  category: string;
  categoryName: string;
  createdAt: string;
}

export interface Category {
  _id: string;
  name: string;
  description: string;
  displayOrder: number;
}

export interface ProductCardProps {
  product: Product;
  onWishlistUpdate?: () => void;
  isAuthenticated?: boolean;
}

// ============================================================================
// CART TYPES
// ============================================================================

export interface CartProduct {
  _id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
}

export interface CartItem {
  _id: string;
  productId: CartProduct;
  quantity: number;
  price: number;
  name: string;
  image: string;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  total: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// ============================================================================
// ORDER TYPES
// ============================================================================

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
  _id?: string;
}

export interface ShippingMethod {
  id: string;
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

// ============================================================================
// FORM TYPES
// ============================================================================

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ProfileData {
  name: string;
  email: string;
}

export interface SecurityData {
  currentPassword: string;
  newPassword: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ForgotPasswordForm {
  email: string;
}

export interface ResetPasswordForm {
  email: string;
  otp: string;
  newPassword: string;
}

export interface ShippingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentFormData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  nameOnCard: string;
  orderNotes?: string;
}

export interface CreateOrderData {
  shippingAddress: ShippingAddress;
  shippingMethod: {
    name: string;
    price: number;
    delivery: string;
  };
  paymentMethod: string;
  orderNotes: string;
}

// ============================================================================
// COMPONENT PROP TYPES
// ============================================================================

export type FiltersSidebarProps = {
  initialSearchTerm?: string;
  initialSelectedCategory?: string;
  initialPriceRange?: { min: number | string; max: number | string };
  onFiltersChange: (filters: {
    searchTerm: string;
    selectedCategory: string;
    priceRange: { min: number | string; max: number | string };
  }) => void;
  onClearFilters: () => void;
  categories: Category[];
};

export interface CheckoutStepsProps {
  step: number;
}

export interface ShippingFormProps {
  form: UseFormReturn<ShippingFormData>;
}

export interface ShippingMethodProps {
  shippingMethod: string;
  setShippingMethod: (method: string) => void;
  shippingMethods: ShippingMethod[];
}

export interface PaymentMethodProps {
  form: UseFormReturn<PaymentFormData>;
}

export interface OrderSummaryProps {
  cart: Cart;
  shippingCost: number;
}

export interface EstimatedDeliveryProps {
  delivery?: string;
}

export interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// ============================================================================
// THEME TYPES
// ============================================================================

export type Theme = "dark" | "light" | "system";

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface AuthResponse {
  user: {
    _id: string;
    name: string;
    email: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
  message: string;
}

export interface CartResponse {
  cart: Cart;
}

export interface WishlistResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CategoriesResponse {
  categories: Category[];
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
}

export interface OrderResponse {
  order: Order;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type SortOrder = "asc" | "desc";
export type SortField = "name" | "price" | "rating" | "createdAt";

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}

export interface ProductFilters {
  // Common filters used across pages
  search?: string;
  category?: string;
  minPrice?: number | string;
  maxPrice?: number | string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
}

// ============================================================================
// REACT HOOK FORM TYPES
// ============================================================================

import type { UseFormReturn } from "react-hook-form";

// Re-export for convenience
export type { UseFormReturn };

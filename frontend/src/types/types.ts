export interface ProductCardProps {
  product: {
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
  };
  onWishlistUpdate?: () => void;
  isAuthenticated?: boolean;
}

export interface Category {
  _id: string;
  name: string;
  description: string;
  displayOrder: number;
}

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

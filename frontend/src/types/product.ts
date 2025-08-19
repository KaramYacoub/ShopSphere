export interface ProductCardProps {
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
  createdAt: string;
  isAuthenticated?: boolean;
}

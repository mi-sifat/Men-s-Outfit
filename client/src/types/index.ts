export interface ProductVariant {
  id: string;
  size: 'S' | 'M' | 'L' | 'XL' | 'XXL';
  color: string;
  colorCode: string;
  sku: string;
  stock: number;
  price?: number;
}

export interface Product {
  id: string;
  title: string;
  titleBn?: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  collection?: string;
  images: string[];
  variants: ProductVariant[];
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  tags: string[];
  rating: number;
  reviewCount: number;
}

export interface CartItem {
  productId: string;
  variantId: string;
  title: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
  maxStock: number;
}

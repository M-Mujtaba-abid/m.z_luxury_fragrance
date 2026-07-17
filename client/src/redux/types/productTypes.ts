export interface ProductImage {
  id: number;
  imageUrl: string;
  sortOrder: number;
  isCover: boolean;
}

export interface ProductVariant {
  id?: number;
  size: string;
  price: number;
  stock: number;
  sku?: string;
}

// Product interface based on the model
export interface Product {
  id: number;
  title: string;
  description: string;
  status: 'available' | 'not available';
  price: number;
  stock: number;
  productImage: string;
  category: 'Men' | 'Women' | 'Children';
  Quantity: '15ML' | '50ML' | '100ML';
  isFeatured: boolean;
  isNewArrival: boolean;
  isOnSale: boolean;
  discountPrice?: number;
  brand?: string;
  gender?: 'Men' | 'Women' | 'Unisex';
  topNotes?: string[];
  heartNotes?: string[];
  baseNotes?: string[];
  metaTitle?: string;
  metaDescription?: string;
  slug?: string;
  publishStatus?: 'draft' | 'published';
  ProductImages?: ProductImage[];
  ProductVariants?: ProductVariant[];
  createdAt?: string;
  updatedAt?: string;
}

// Initial state
export interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  totalProductsCount: number;
  loading: boolean;
  error: string | null;
  featuredProducts?: Product[];
  newArrivals?: Product[];
  onSaleProducts?: Product[];
  searchResults: Product[];
}

// Product data for creation
export interface ProductData {
  title: string;
  description: string;
  status: 'available' | 'not available';
  price: number;
  stock: number;
  category: 'Men' | 'Women' | 'Children';
  Quantity: '15ML' | '50ML' | '100ML';
  images: File[];
  coverIndex?: number;
  isFeatured: boolean;
  isNewArrival: boolean;
  isOnSale: boolean;
  discountPrice?: number;
  brand?: string;
  gender?: 'Men' | 'Women' | 'Unisex';
  topNotes?: string[];
  heartNotes?: string[];
  baseNotes?: string[];
  metaTitle?: string;
  metaDescription?: string;
  slug?: string;
  publishStatus?: 'draft' | 'published';
  variants?: ProductVariant[];
}

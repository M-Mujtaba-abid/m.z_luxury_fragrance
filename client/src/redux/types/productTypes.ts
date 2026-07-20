export interface ProductImage {
  id: number;
  imageUrl: string;
  sortOrder: number;
  isCover: boolean;
}

// A single purchasable size for a product, with its own price/stock. Free
// text rather than a fixed ENUM — bottle sizes vary per product.
export interface ProductVariant {
  id?: number;
  productId?: number;
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
  category: 'Men' | 'Women';
  Quantity: '15ML' | '50ML';
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
  // Computed live from Reviews, not stored on the product row itself.
  averageRating?: number;
  reviewCount?: number;
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
  relatedProducts: Product[];
  // Separate from `loading` on purpose — ProductDetailPage's full-screen
  // "Loading product details..." gate reads the shared `loading` flag, so
  // this section fetching in the background must not re-trigger it.
  relatedProductsLoading: boolean;
}

// Product data for creation
export interface ProductData {
  title: string;
  description: string;
  status: 'available' | 'not available';
  price: number;
  stock: number;
  category: 'Men' | 'Women';
  Quantity: '15ML' | '50ML';
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

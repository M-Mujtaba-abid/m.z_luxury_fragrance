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
  productImage: File;
  isFeatured: boolean;
  isNewArrival: boolean;
  isOnSale: boolean;
  discountPrice?: number;
}
